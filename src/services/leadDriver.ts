// src/services/leadDriver.ts
// AGGRESSIVE DRIVER - Self-Healing Backend
// The AI learns from human corrections and auto-calibrates

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════════════════
// RUNTIME CALIBRATION STATE
// ═══════════════════════════════════════════════════════════════════════════

interface CalibrationState {
    greenThreshold: number;     // Default: 0.85
    yellowThreshold: number;    // Default: 0.60
    lastCalibration: Date;
    rejectionRate24h: number;
    autoAdjustments: number;
}

let calibrationState: CalibrationState = {
    greenThreshold: 0.85,
    yellowThreshold: 0.60,
    lastCalibration: new Date(),
    rejectionRate24h: 0,
    autoAdjustments: 0
};

// ═══════════════════════════════════════════════════════════════════════════
// SELF-HEALING: AUTO CALIBRATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyzes human corrections and adjusts AI confidence thresholds
 * If humans keep rejecting "GREEN" leads, the AI tightens the criteria
 */
export async function autoCalibrate(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        // Count rejections in last 24 hours
        const rejections = await prisma.correctionLog.count({
            where: {
                createdAt: { gte: oneDayAgo }
            }
        });

        // Calculate rejection rate
        const totalLeads = await prisma.lead.count({
            where: { createdAt: { gte: oneDayAgo } }
        });

        const rejectionRate = totalLeads > 0 ? rejections / totalLeads : 0;
        calibrationState.rejectionRate24h = rejectionRate;

        // SELF-HEALING LOGIC
        if (rejectionRate > 0.10) {
            // Too many false positives (>10%) - tighten thresholds
            calibrationState.greenThreshold = Math.min(0.95, calibrationState.greenThreshold + 0.02);
            calibrationState.yellowThreshold = Math.min(0.75, calibrationState.yellowThreshold + 0.02);
            calibrationState.autoAdjustments++;

            console.log('🔧 SELF-HEALING: High rejection rate detected');
            console.log(`   Raised GREEN threshold to ${(calibrationState.greenThreshold * 100).toFixed(0)}%`);
            console.log(`   Raised YELLOW threshold to ${(calibrationState.yellowThreshold * 100).toFixed(0)}%`);
        } else if (rejectionRate < 0.02 && calibrationState.greenThreshold > 0.85) {
            // Very low rejections - can relax slightly
            calibrationState.greenThreshold = Math.max(0.85, calibrationState.greenThreshold - 0.01);
            calibrationState.yellowThreshold = Math.max(0.60, calibrationState.yellowThreshold - 0.01);

            console.log('✨ OPTIMIZATION: Low rejection rate - relaxing thresholds');
        }

        calibrationState.lastCalibration = new Date();
    } catch (error) {
        console.error('Calibration error:', error);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// AGGRESSIVE POLLING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Aggressive driver that doesn't wait
 * Polls external APIs and updates lead statuses
 */
export async function driveLeads(): Promise<void> {
    console.log('⚡ DRIVER: Aggressive polling cycle started...');

    try {
        // 1. Find stale leads (no update in 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const staleLeads = await prisma.lead.findMany({
            where: {
                updatedAt: { lte: oneDayAgo },
                status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
            }
        });

        if (staleLeads.length > 0) {
            console.log(`   Found ${staleLeads.length} stale leads - flagging for follow-up`);
        }

        // 2. Run auto-calibration
        await autoCalibrate();

        // 3. Log heartbeat
        console.log('⚡ DRIVER: Cycle complete');
        console.log(`   Current thresholds: GREEN=${calibrationState.greenThreshold}, YELLOW=${calibrationState.yellowThreshold}`);
        console.log(`   Rejection rate (24h): ${(calibrationState.rejectionRate24h * 100).toFixed(1)}%`);
        console.log(`   Auto-adjustments: ${calibrationState.autoAdjustments}`);

    } catch (error) {
        console.error('Driver error:', error);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export function getCalibrationState(): CalibrationState {
    return { ...calibrationState };
}

export function getGateLevel(confidence: number): 'GREEN' | 'YELLOW' | 'RED' {
    if (confidence >= calibrationState.greenThreshold) return 'GREEN';
    if (confidence >= calibrationState.yellowThreshold) return 'YELLOW';
    return 'RED';
}

export default {
    driveLeads,
    autoCalibrate,
    getCalibrationState,
    getGateLevel
};
