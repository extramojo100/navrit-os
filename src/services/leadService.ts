// src/services/leadService.ts
// Lead Service with Honda Duplicate Check Logic
// Evolution: Auto-merge context instead of failing on duplicate

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * HONDA RULE: Duplicate Lead Check
 * If phone exists within 90 days, merge context instead of creating new.
 * Old Way: Manual check, return error.
 * New Way: Auto-merge, bump to top of feed.
 */
export const createOrUpdateLead = async (
    phone: string,
    data: { name?: string; market?: string; budget?: number }
) => {
    // 1. DUPLICATE CHECK (90-day window)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const existingLead = await prisma.lead.findFirst({
        where: {
            phone,
            createdAt: { gte: ninetyDaysAgo }
        }
    });

    if (existingLead) {
        console.log(`♻️ MERGING LEAD: ${phone} already exists (Status: ${existingLead.status})`);
        console.log(`   Original: ${existingLead.name} | New data merging...`);

        // Merge: Keep existing data, overlay new non-empty fields
        return await prisma.lead.update({
            where: { id: existingLead.id },
            data: {
                name: data.name || existingLead.name,
                market: data.market || existingLead.market,
                budget: data.budget ?? existingLead.budget,
                updatedAt: new Date() // Bump to top of feed
            }
        });
    }

    // 2. CREATE NEW LEAD
    console.log(`➕ NEW LEAD: ${phone} - ${data.name || 'Unknown'}`);
    return await prisma.lead.create({
        data: {
            phone,
            name: data.name,
            market: data.market || 'INDIA',
            budget: data.budget,
            status: 'NEW',
            confidence: 0.5 // Start at YELLOW
        }
    });
};

/**
 * Get all leads ordered by most recent activity
 * This creates the "Feed" experience
 */
export const getAllLeads = async () => {
    return await prisma.lead.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { corrections: true }
    });
};

/**
 * Get leads by status
 */
export const getLeadsByStatus = async (status: string) => {
    return await prisma.lead.findMany({
        where: { status },
        orderBy: { updatedAt: 'desc' },
        include: { corrections: true }
    });
};

/**
 * Update lead status and confidence
 */
export const updateLeadStatus = async (
    leadId: string,
    status: string,
    confidence?: number
) => {
    return await prisma.lead.update({
        where: { id: leadId },
        data: {
            status,
            ...(confidence !== undefined && { confidence }),
            updatedAt: new Date()
        }
    });
};

/**
 * Log a correction (for AI learning)
 */
export const logCorrection = async (
    leadId: string,
    field: string,
    aiValue: string,
    humanValue: string
) => {
    console.log(`🎓 LEARNING EVENT: ${field} corrected from "${aiValue}" to "${humanValue}"`);

    return await prisma.correctionLog.create({
        data: {
            leadId,
            field,
            aiValue,
            humanValue
        }
    });
};

/**
 * Dashboard stats
 */
export const getDashboardStats = async () => {
    const leads = await prisma.lead.findMany();

    return {
        total: leads.length,
        byGate: {
            green: leads.filter(l => l.confidence >= 0.85).length,
            yellow: leads.filter(l => l.confidence >= 0.5 && l.confidence < 0.85).length,
            red: leads.filter(l => l.confidence < 0.5).length
        },
        byStatus: leads.reduce((acc, l) => {
            acc[l.status] = (acc[l.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    };
};

export default {
    createOrUpdateLead,
    getAllLeads,
    getLeadsByStatus,
    updateLeadStatus,
    logCorrection,
    getDashboardStats
};
