// src/types/index.ts
// Centralized TypeScript type definitions
// Stanford Architecture: No implicit any, strict interfaces

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// LEAD TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const LeadStateEnum = z.enum([
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'INTERESTED',
    'TEST_DRIVE_SCHEDULED',
    'NEGOTIATING',
    'CLOSED_WON',
    'CLOSED_LOST',
    'ARCHIVED'
]);
export type LeadState = z.infer<typeof LeadStateEnum>;

export const GateLevelEnum = z.enum(['GREEN', 'YELLOW', 'RED']);
export type GateLevel = z.infer<typeof GateLevelEnum>;

export const MarketEnum = z.enum(['ID', 'IN', 'SG', 'AE']);
export type Market = z.infer<typeof MarketEnum>;

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST VALIDATION SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

export const CreateLeadSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number format'),
    email: z.string().email().optional(),
    market: MarketEnum.default('ID'),
    carModel: z.string().optional(),
    budget: z.string().optional(),
    source: z.string().default('API'),
});
export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

export const UpdateLeadSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    carModel: z.string().optional(),
    budget: z.string().optional(),
    state: LeadStateEnum.optional(),
    confidenceScore: z.number().min(0).max(1).optional(),
    assignedDseId: z.string().uuid().optional(),
});
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;

export const EscalateLeadSchema = z.object({
    reason: z.string().min(1, 'Escalation reason required'),
    urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
});
export type EscalateLeadInput = z.infer<typeof EscalateLeadSchema>;

export const CreateMessageSchema = z.object({
    leadId: z.string().uuid().optional(),
    phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
    content: z.string().min(1),
    channel: z.enum(['WHATSAPP', 'SMS', 'VOICE', 'EMAIL']).default('WHATSAPP'),
    direction: z.enum(['INBOUND', 'OUTBOUND']).default('INBOUND'),
});
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

export const PaginationSchema = z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('20'),
    state: LeadStateEnum.optional(),
    gateLevel: GateLevelEnum.optional(),
});
export type PaginationInput = z.infer<typeof PaginationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface LeadResponse {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    market: string;
    carModel: string | null;
    budget: string | null;
    state: LeadState;
    confidenceScore: number;
    gateLevel: GateLevel;
    assignedDseId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
    totalLeads: number;
    byGate: {
        green: number;
        yellow: number;
        red: number;
    };
    byState: Record<LeadState, number>;
    todayLeads: number;
    avgConfidence: number;
    conversionRate: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AIResponse {
    message: string;
    confidence: number;
    intent: string;
    entities: Record<string, string>;
    nextAction: 'RESPOND' | 'HUMAN_IN_THE_LOOP' | 'ESCALATE';
    appliedGuardrails: string[];
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}
