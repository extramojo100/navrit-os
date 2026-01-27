// Navrit MVP - Messages API Routes
// Source: MASTER_BUILD_CONTEXT.md Section 3.3 (API Specification)
// Endpoints: webhooks (receive real-time events from Infobip)

import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getEmpathyAction } from '../services/stateMachine';
import { Channel, Direction, Sentiment } from '@prisma/client';

const router = Router();

/**
 * POST /api/messages
 * Receive incoming message (webhook from Infobip/WhatsApp)
 * Source: Section 2.3 Zone 1 (PUBLIC)
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { phone, message, channel = 'WHATSAPP' } = req.body;

        if (!phone || !message) {
            return res.status(400).json({
                error: 'Missing required fields: phone, message'
            });
        }

        // Find or create lead by phone
        let lead = await prisma.lead.findUnique({ where: { phone } });

        if (!lead) {
            // Auto-create lead for new inquiries
            lead = await prisma.lead.create({
                data: {
                    name: 'Unknown',
                    phone,
                    market: 'ID', // Default market, should be derived from phone prefix
                    state: 'NEW',
                    confidenceScore: 0.5
                }
            });
        }

        // Analyze sentiment (stub - would use Claude API in production)
        const sentiment = analyzeSentiment(message);
        const confidence = lead.confidenceScore;

        // Get empathy action recommendation
        const empathyDecision = getEmpathyAction(sentiment, confidence);

        // Create interaction record
        const interaction = await prisma.interaction.create({
            data: {
                leadId: lead.id,
                channel: channel as Channel,
                direction: Direction.INBOUND,
                message,
                sentiment,
                confidence,
                aiResponse: empathyDecision.requiresApproval
                    ? null // Pending DSE approval
                    : generateAIResponse(message, empathyDecision.tone)
            }
        });

        // Log to audit
        await prisma.auditLog.create({
            data: {
                action: 'MESSAGE_RECEIVED',
                resource: 'Interaction',
                resourceId: interaction.id,
                details: JSON.stringify({
                    channel,
                    sentiment,
                    empathyDecision: empathyDecision.action
                })
            }
        });

        // Return acknowledgment per Section 2.3 Zone 2 (API Gateway)
        res.status(200).json({
            success: true,
            interactionId: interaction.id,
            leadId: lead.id,
            empathyDecision,
            message: empathyDecision.requiresApproval
                ? 'Message queued for DSE review'
                : 'Auto-response sent'
        });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

/**
 * GET /api/messages/:leadId
 * Get message history for a lead
 */
router.get('/:leadId', async (req: Request, res: Response) => {
    try {
        const leadId = req.params.leadId as string;
        const limit = parseInt(req.query.limit as string) || 50;

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        const interactions = await prisma.interaction.findMany({
            where: { leadId },
            orderBy: { timestamp: 'desc' },
            take: limit
        });

        res.json({
            leadId,
            leadName: lead.name,
            interactions,
            total: interactions.length
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * POST /api/messages/:leadId/send
 * Send outbound message (DSE or AI response)
 */
router.post('/:leadId/send', async (req: Request, res: Response) => {
    try {
        const leadId = req.params.leadId as string;
        const { message, channel = 'WHATSAPP', isAIGenerated = false } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        const interaction = await prisma.interaction.create({
            data: {
                leadId,
                channel: channel as Channel,
                direction: Direction.OUTBOUND,
                message,
                sentiment: Sentiment.NEUTRAL,
                confidence: lead.confidenceScore,
                aiResponse: isAIGenerated ? message : null
            }
        });

        // Log to audit
        await prisma.auditLog.create({
            data: {
                action: 'MESSAGE_SENT',
                resource: 'Interaction',
                resourceId: interaction.id,
                details: JSON.stringify({ channel, isAIGenerated })
            }
        });

        res.status(201).json({
            success: true,
            interactionId: interaction.id,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

/**
 * Stub: Analyze sentiment from message
 * In production, this would call Claude API
 */
function analyzeSentiment(message: string): Sentiment {
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based sentiment (stub)
    if (lowerMessage.includes('angry') || lowerMessage.includes('useless') || lowerMessage.includes('terrible')) {
        return Sentiment.ANGRY;
    }
    if (lowerMessage.includes('frustrated') || lowerMessage.includes('again') || lowerMessage.includes('already told')) {
        return Sentiment.FRUSTRATED;
    }
    if (lowerMessage.includes('great') || lowerMessage.includes('thanks') || lowerMessage.includes('interested')) {
        return Sentiment.POSITIVE;
    }
    return Sentiment.NEUTRAL;
}

/**
 * Stub: Generate AI response
 * In production, this would call Claude API with MASTER_SYSTEM_PROMPT
 */
function generateAIResponse(_message: string, tone: string): string {
    // Placeholder response based on tone
    const responses: Record<string, string> = {
        friendly: 'Great to hear from you! How can I help you with your vehicle search today?',
        helpful: 'I understand. Let me help you with that right away.',
        neutral: 'Thank you for your message. A team member will assist you shortly.',
        reassuring: 'I apologize for any inconvenience. Let me connect you with a specialist who can help.'
    };
    return responses[tone] || responses.neutral;
}

export default router;
