// src/services/stateMachine.ts
// Traffic Light State Machine - THE BRAIN
// Stanford Architecture: Full implementation, no placeholders

import { PrismaClient, Lead } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type GateLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface StateTransitionResult {
    previousState: string;
    newState: string;
    gate: GateLevel;
    action: 'AUTO_PROCEED' | 'CONFIRM_DETAILS' | 'ESCALATE_TO_DSE';
    recommendation: string;
    appliedGuardrails: string[];
}

export interface ProcessingContext {
    leadId: string;
    aiConfidence: number;
    aiIntent: string;
    entities: Record<string, string>;
    message: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE MACHINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Process lead state transition based on AI confidence
 * Implements the Traffic Light Gate system from MASTER_BUILD_CONTEXT
 */
export async function processLeadState(context: ProcessingContext): Promise<StateTransitionResult> {
    const { leadId, aiConfidence, aiIntent, entities } = context;

    // Fetch current lead
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
        throw new Error(`Lead not found: ${leadId}`);
    }

    const previousState = lead.state;
    const appliedGuardrails: string[] = [];

    // ─────────────────────────────────────────────────────────────────────────
    // GATE DETERMINATION
    // ─────────────────────────────────────────────────────────────────────────

    let gate: GateLevel;
    let action: StateTransitionResult['action'];
    let recommendation: string;

    // 🔴 RED GATE: Low Confidence (<60%) - Escalate to human
    if (aiConfidence < 0.60) {
        gate = 'RED';
        action = 'ESCALATE_TO_DSE';
        recommendation = 'Escalate to DSE for human review. AI confidence too low.';
        appliedGuardrails.push('G3: Confidence < 60%');

        // Log escalation
        await logAudit('ESCALATION_TRIGGERED', 'Lead', leadId,
            `Low confidence (${Math.round(aiConfidence * 100)}%). Intent: ${aiIntent}`);
    }
    // 🟡 YELLOW GATE: Medium Confidence (60-85%) - Confirm details
    else if (aiConfidence < 0.85) {
        gate = 'YELLOW';
        action = 'CONFIRM_DETAILS';
        recommendation = generateClarifyingQuestion(aiIntent, entities);
        appliedGuardrails.push('G2: Human-in-the-loop required');
    }
    // 🟢 GREEN GATE: High Confidence (>85%) - Auto-proceed
    else {
        gate = 'GREEN';
        action = 'AUTO_PROCEED';
        recommendation = generateAutoResponse(aiIntent, entities, lead);
        appliedGuardrails.push('G1: Auto-proceed enabled');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STATE TRANSITIONS
    // ─────────────────────────────────────────────────────────────────────────

    let newState = lead.state;

    // Only auto-advance state on GREEN gate
    if (gate === 'GREEN') {
        newState = determineNextState(lead.state, aiIntent);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // APPLY GUARDRAILS
    // ─────────────────────────────────────────────────────────────────────────

    // G4: No pricing commitment without manager approval
    if (aiIntent === 'negotiate_price' || aiIntent === 'request_discount') {
        if (gate === 'GREEN') {
            gate = 'YELLOW';
            action = 'CONFIRM_DETAILS';
            recommendation = 'Price discussions require DSE/Manager review before committing.';
            appliedGuardrails.push('G4: Price guardrail applied');
        }
    }

    // G5: No commitment on finance terms
    if (aiIntent === 'finance_inquiry' && entities['commitment'] === 'true') {
        gate = 'YELLOW';
        action = 'CONFIRM_DETAILS';
        recommendation = 'Finance commitments require manual verification.';
        appliedGuardrails.push('G5: Finance guardrail applied');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE DATABASE
    // ─────────────────────────────────────────────────────────────────────────

    await prisma.lead.update({
        where: { id: leadId },
        data: {
            state: newState,
            confidenceScore: aiConfidence,
            updatedAt: new Date()
        }
    });

    // Log state change
    if (newState !== previousState) {
        await logAudit('STATE_CHANGED', 'Lead', leadId,
            `${previousState} → ${newState} (${gate} gate, ${Math.round(aiConfidence * 100)}%)`);
    }

    return {
        previousState,
        newState,
        gate,
        action,
        recommendation,
        appliedGuardrails
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine next state based on current state and intent
 */
function determineNextState(currentState: string, intent: string): string {
    const transitions: Record<string, Record<string, string>> = {
        'NEW': {
            'general_inquiry': 'CONTACTED',
            'product_inquiry': 'CONTACTED',
            'book_test_drive': 'TEST_DRIVE_SCHEDULED',
            'show_interest': 'INTERESTED'
        },
        'CONTACTED': {
            'show_interest': 'INTERESTED',
            'request_info': 'QUALIFIED',
            'book_test_drive': 'TEST_DRIVE_SCHEDULED'
        },
        'QUALIFIED': {
            'show_interest': 'INTERESTED',
            'book_test_drive': 'TEST_DRIVE_SCHEDULED'
        },
        'INTERESTED': {
            'book_test_drive': 'TEST_DRIVE_SCHEDULED',
            'negotiate_price': 'NEGOTIATING'
        },
        'TEST_DRIVE_SCHEDULED': {
            'negotiate_price': 'NEGOTIATING',
            'confirm_purchase': 'NEGOTIATING'
        },
        'NEGOTIATING': {
            'confirm_purchase': 'CLOSED_WON',
            'decline': 'CLOSED_LOST'
        }
    };

    return transitions[currentState]?.[intent] || currentState;
}

/**
 * Generate clarifying question for YELLOW gate
 */
function generateClarifyingQuestion(intent: string, entities: Record<string, string>): string {
    const questions: Record<string, string> = {
        'book_test_drive': `To confirm: you'd like a test drive${entities['date'] ? ` on ${entities['date']}` : ''}. What location works best for you?`,
        'product_inquiry': `I'd be happy to help! Could you specify which model you're interested in?`,
        'negotiate_price': `I understand you'd like to discuss pricing. May I know your budget range?`,
        'general_inquiry': `Thank you for reaching out! Could you tell me more about what you're looking for?`
    };

    return questions[intent] || 'Could you please provide more details so I can assist you better?';
}

/**
 * Generate auto-response for GREEN gate
 */
function generateAutoResponse(intent: string, entities: Record<string, string>, lead: Lead): string {
    const responses: Record<string, string> = {
        'book_test_drive': `Great news, ${lead.name}! Your test drive${entities['date'] ? ` for ${entities['date']}` : ''} has been scheduled. Our team will confirm the exact time shortly.`,
        'show_interest': `Wonderful, ${lead.name}! I can see you're interested in ${lead.carModel || 'our vehicles'}. Let me send you the complete specifications.`,
        'product_inquiry': `Here's the information about ${entities['model'] || lead.carModel}. Would you like to schedule a test drive?`,
        'confirm_appointment': `Your appointment has been confirmed. Looking forward to seeing you!`
    };

    return responses[intent] || `Thank you for your message, ${lead.name}. I'll process this right away.`;
}

/**
 * Calculate gate level from confidence score
 */
export function calculateGateLevel(confidenceScore: number): GateLevel {
    if (confidenceScore >= 0.85) return 'GREEN';
    if (confidenceScore >= 0.60) return 'YELLOW';
    return 'RED';
}

/**
 * Log to audit table
 */
async function logAudit(action: string, entityType: string, entityId: string, details: string): Promise<void> {
    await prisma.auditLog.create({
        data: { action, entityType, entityId, details }
    });
}

export default { processLeadState, calculateGateLevel };
