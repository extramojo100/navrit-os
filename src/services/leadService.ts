// src/services/leadService.ts
// Business Logic Layer - Contains all lead-related business rules
// Stanford Architecture: Service Pattern

import { Lead } from '@prisma/client';
import leadRepository from '../repositories/leadRepository';
import { NotFoundError, ValidationError, AppError } from '../middlewares/error';
import {
    CreateLeadInput,
    UpdateLeadInput,
    EscalateLeadInput,
    PaginationInput,
    LeadResponse,
    GateLevel,
    DashboardStats
} from '../types';

/**
 * Lead Service - Business logic for lead management
 */
export const leadService = {
    /**
     * Get paginated leads with filtering
     */
    async getLeads(params: PaginationInput): Promise<{
        data: LeadResponse[];
        pagination: { page: number; limit: number; total: number; pages: number };
    }> {
        const { leads, total } = await leadRepository.findMany(params);

        return {
            data: leads.map(enrichLeadWithGate),
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                pages: Math.ceil(total / params.limit)
            }
        };
    },

    /**
     * Get a single lead by ID
     */
    async getLeadById(id: string): Promise<LeadResponse> {
        const lead = await leadRepository.findById(id);

        if (!lead) {
            throw new NotFoundError('Lead');
        }

        return enrichLeadWithGate(lead);
    },

    /**
     * Create a new lead with business validations
     */
    async createLead(input: CreateLeadInput): Promise<LeadResponse> {
        // Check for duplicate phone
        const existing = await leadRepository.findByPhone(input.phone);

        if (existing) {
            throw new AppError('A lead with this phone number already exists', 409, 'DUPLICATE_PHONE');
        }

        // Calculate initial confidence score based on available data
        const initialConfidence = calculateInitialConfidence(input);

        const lead = await leadRepository.create({
            name: input.name,
            phone: input.phone,
            email: input.email,
            market: input.market,
            carModel: input.carModel,
            budget: input.budget,
            source: input.source,
            state: 'NEW',
            confidenceScore: initialConfidence
        });

        // Log the creation
        await leadRepository.logAudit('LEAD_CREATED', 'Lead', lead.id, `Lead created from ${input.source}`);

        return enrichLeadWithGate(lead);
    },

    /**
     * Update a lead with state transition validations
     */
    async updateLead(id: string, input: UpdateLeadInput): Promise<LeadResponse> {
        const existing = await leadRepository.findById(id);

        if (!existing) {
            throw new NotFoundError('Lead');
        }

        // Validate state transitions
        if (input.state && !isValidStateTransition(existing.state, input.state)) {
            throw new ValidationError({
                state: [`Cannot transition from ${existing.state} to ${input.state}`]
            });
        }

        const lead = await leadRepository.update(id, input);

        // Log state change
        if (input.state && input.state !== existing.state) {
            await leadRepository.logAudit(
                'STATE_CHANGED',
                'Lead',
                lead.id,
                `State changed from ${existing.state} to ${input.state}`
            );
        }

        return enrichLeadWithGate(lead);
    },

    /**
     * Escalate a lead to a manager
     */
    async escalateLead(id: string, input: EscalateLeadInput): Promise<LeadResponse> {
        const existing = await leadRepository.findById(id);

        if (!existing) {
            throw new NotFoundError('Lead');
        }

        // Set confidence to trigger RED gate
        const lead = await leadRepository.update(id, {
            confidenceScore: 0.4, // Force RED gate
            state: existing.state === 'NEW' ? 'CONTACTED' : existing.state
        });

        // Log escalation
        await leadRepository.logAudit(
            'LEAD_ESCALATED',
            'Lead',
            lead.id,
            `Escalated: ${input.reason} (Urgency: ${input.urgency})`
        );

        return enrichLeadWithGate(lead);
    },

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const stats = await leadRepository.getStats();

        // Calculate conversion rate (CLOSED_WON / total non-archived)
        const closedWon = stats.byState['CLOSED_WON'] || 0;
        const conversionRate = stats.total > 0 ? closedWon / stats.total : 0;

        return {
            totalLeads: stats.total,
            byGate: stats.byGate,
            byState: stats.byState as Record<string, number>,
            todayLeads: stats.todayCount,
            avgConfidence: stats.avgConfidence,
            conversionRate
        };
    }
};

/**
 * Calculate initial confidence based on data completeness
 */
function calculateInitialConfidence(input: CreateLeadInput): number {
    let score = 0.5; // Base score

    if (input.carModel) score += 0.15;
    if (input.budget) score += 0.15;
    if (input.email) score += 0.05;

    return Math.min(score, 1);
}

/**
 * Validate state machine transitions
 */
function isValidStateTransition(from: string, to: string): boolean {
    const validTransitions: Record<string, string[]> = {
        'NEW': ['CONTACTED', 'ARCHIVED'],
        'CONTACTED': ['QUALIFIED', 'ARCHIVED'],
        'QUALIFIED': ['INTERESTED', 'CLOSED_LOST', 'ARCHIVED'],
        'INTERESTED': ['TEST_DRIVE_SCHEDULED', 'CLOSED_LOST', 'ARCHIVED'],
        'TEST_DRIVE_SCHEDULED': ['NEGOTIATING', 'CLOSED_LOST', 'ARCHIVED'],
        'NEGOTIATING': ['CLOSED_WON', 'CLOSED_LOST', 'ARCHIVED'],
        'CLOSED_WON': [],
        'CLOSED_LOST': ['NEW'], // Allow re-engagement
        'ARCHIVED': ['NEW'] // Allow un-archive
    };

    return validTransitions[from]?.includes(to) ?? false;
}

/**
 * Enrich lead with calculated gate level
 */
function enrichLeadWithGate(lead: Lead): LeadResponse {
    return {
        ...lead,
        gateLevel: calculateGateLevel(lead.confidenceScore)
    };
}

/**
 * Calculate gate level from confidence score
 */
function calculateGateLevel(confidenceScore: number): GateLevel {
    if (confidenceScore >= 0.85) return 'GREEN';
    if (confidenceScore >= 0.60) return 'YELLOW';
    return 'RED';
}

export default leadService;
