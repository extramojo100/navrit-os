// src/repositories/leadRepository.ts
// Data Access Layer - Only database operations, no business logic
// Stanford Architecture: Repository Pattern

import { PrismaClient, Lead, Prisma } from '@prisma/client';
import { GateLevel, LeadState, PaginationInput } from '../types';

const prisma = new PrismaClient();

/**
 * Lead Repository - Handles all database operations for leads
 */
export const leadRepository = {
    /**
     * Find all leads with pagination and filtering
     */
    async findMany(params: PaginationInput): Promise<{ leads: Lead[]; total: number }> {
        const { page, limit, state, gateLevel } = params;
        const skip = (page - 1) * limit;

        const where: Prisma.LeadWhereInput = {};
        if (state) where.state = state;

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    assignedDse: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }),
            prisma.lead.count({ where })
        ]);

        // Filter by gate level in memory (calculated field)
        const filteredLeads = gateLevel
            ? leads.filter(lead => calculateGateLevel(lead.confidenceScore) === gateLevel)
            : leads;

        return { leads: filteredLeads, total };
    },

    /**
     * Find a lead by ID with full relations
     */
    async findById(id: string): Promise<Lead | null> {
        return prisma.lead.findUnique({
            where: { id },
            include: {
                assignedDse: {
                    select: { id: true, name: true, email: true }
                },
                interactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 20
                }
            }
        });
    },

    /**
     * Find a lead by phone number
     */
    async findByPhone(phone: string): Promise<Lead | null> {
        return prisma.lead.findUnique({
            where: { phone }
        });
    },

    /**
     * Create a new lead
     */
    async create(data: Prisma.LeadCreateInput): Promise<Lead> {
        return prisma.lead.create({
            data,
            include: {
                assignedDse: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    },

    /**
     * Update a lead
     */
    async update(id: string, data: Prisma.LeadUpdateInput): Promise<Lead> {
        return prisma.lead.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            },
            include: {
                assignedDse: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    },

    /**
     * Delete a lead (soft delete via ARCHIVED state)
     */
    async archive(id: string): Promise<Lead> {
        return prisma.lead.update({
            where: { id },
            data: { state: 'ARCHIVED', updatedAt: new Date() }
        });
    },

    /**
     * Get dashboard statistics
     */
    async getStats(): Promise<{
        total: number;
        byState: Record<string, number>;
        byGate: { green: number; yellow: number; red: number };
        todayCount: number;
        avgConfidence: number;
    }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [allLeads, todayLeads, stateGroups] = await Promise.all([
            prisma.lead.findMany({
                where: { state: { not: 'ARCHIVED' } },
                select: { confidenceScore: true }
            }),
            prisma.lead.count({
                where: { createdAt: { gte: today } }
            }),
            prisma.lead.groupBy({
                by: ['state'],
                _count: true,
                where: { state: { not: 'ARCHIVED' } }
            })
        ]);

        const byGate = { green: 0, yellow: 0, red: 0 };
        let totalConfidence = 0;

        allLeads.forEach(lead => {
            totalConfidence += lead.confidenceScore;
            const gate = calculateGateLevel(lead.confidenceScore);
            if (gate === 'GREEN') byGate.green++;
            else if (gate === 'YELLOW') byGate.yellow++;
            else byGate.red++;
        });

        const byState: Record<string, number> = {};
        stateGroups.forEach(group => {
            byState[group.state] = group._count;
        });

        return {
            total: allLeads.length,
            byState,
            byGate,
            todayCount: todayLeads,
            avgConfidence: allLeads.length > 0 ? totalConfidence / allLeads.length : 0
        };
    },

    /**
     * Log an escalation
     */
    async logAudit(action: string, entityType: string, entityId: string, details: string): Promise<void> {
        await prisma.auditLog.create({
            data: {
                action,
                entityType,
                entityId,
                details
            }
        });
    }
};

/**
 * Calculate gate level from confidence score
 * GREEN: >85% - AI acts autonomously
 * YELLOW: 60-85% - Human in the loop
 * RED: <60% - Escalate to manager
 */
function calculateGateLevel(confidenceScore: number): GateLevel {
    if (confidenceScore >= 0.85) return 'GREEN';
    if (confidenceScore >= 0.60) return 'YELLOW';
    return 'RED';
}

export default leadRepository;
