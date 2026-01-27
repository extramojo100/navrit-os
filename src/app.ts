// src/app.ts
// NAVRIT SYSTEM - God Mode Backend
// Aggressive polling, self-healing, RTSROC compliant

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { env } from './config/env';
import { driveLeads, getCalibrationState } from './services/leadDriver';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH & CALIBRATION
// ═══════════════════════════════════════════════════════════════════════════

app.get('/health', (_req, res) => {
    const calibration = getCalibrationState();
    res.json({
        status: 'healthy',
        mode: 'GOD_MODE',
        timestamp: new Date().toISOString(),
        calibration: {
            greenThreshold: calibration.greenThreshold,
            yellowThreshold: calibration.yellowThreshold,
            rejectionRate24h: calibration.rejectionRate24h,
            autoAdjustments: calibration.autoAdjustments
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// LEADS API
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/leads', async (_req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            include: { corrections: true },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ success: true, data: leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.get('/api/leads/stats', async (_req, res) => {
    try {
        const leads = await prisma.lead.findMany();
        const calibration = getCalibrationState();

        // Use calibrated thresholds
        const byGate = {
            green: leads.filter(l => l.confidence >= calibration.greenThreshold).length,
            yellow: leads.filter(l => l.confidence >= calibration.yellowThreshold && l.confidence < calibration.greenThreshold).length,
            red: leads.filter(l => l.confidence < calibration.yellowThreshold).length
        };

        res.json({
            success: true,
            data: {
                totalLeads: leads.length,
                byGate,
                avgConfidence: leads.length > 0
                    ? leads.reduce((sum, l) => sum + l.confidence, 0) / leads.length
                    : 0,
                calibration: {
                    greenThreshold: calibration.greenThreshold,
                    yellowThreshold: calibration.yellowThreshold
                }
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.post('/api/leads', async (req, res) => {
    try {
        const { phone, name, market, budget } = req.body;

        if (!phone) {
            res.status(400).json({ success: false, error: 'Phone is required' });
            return;
        }

        // Check for duplicate (90-day window)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const existing = await prisma.lead.findFirst({
            where: { phone, createdAt: { gte: ninetyDaysAgo } }
        });

        if (existing) {
            console.log(`♻️ MERGING LEAD: ${phone} already exists`);
            const updated = await prisma.lead.update({
                where: { id: existing.id },
                data: {
                    name: name || existing.name,
                    market: market || existing.market,
                    budget: budget ?? existing.budget,
                    updatedAt: new Date()
                }
            });
            res.json({ success: true, data: updated, merged: true });
            return;
        }

        const lead = await prisma.lead.create({
            data: { phone, name, market, budget, status: 'NEW', confidence: 0.5 }
        });
        res.json({ success: true, data: lead });
    } catch (error: unknown) {
        console.error('Error creating lead:', error);
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            res.status(409).json({ success: false, error: 'Phone number already exists' });
            return;
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.post('/api/leads/:id/escalate', async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await prisma.lead.update({
            where: { id },
            data: { confidence: 0.3 }
        });
        res.json({ success: true, data: lead, message: 'Lead escalated to RED' });
    } catch (error) {
        console.error('Error escalating lead:', error);
        res.status(500).json({ success: false, error: 'Lead not found or database error' });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// THE HEARTBEAT - Aggressive Driver
// ═══════════════════════════════════════════════════════════════════════════

const DRIVER_INTERVAL_MS = 60000; // 60 seconds

setInterval(() => {
    driveLeads().catch(console.error);
}, DRIVER_INTERVAL_MS);

// Initial drive on startup
setTimeout(() => {
    console.log('⚡ DRIVER: Initial calibration...');
    driveLeads().catch(console.error);
}, 3000);

// ═══════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════

const PORT = parseInt(env.PORT, 10);
app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║              NAVRIT SYSTEM - GOD MODE ACTIVE                  ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  🚀 API:         http://localhost:${PORT}/api/leads                ║`);
    console.log(`║  📊 Stats:       http://localhost:${PORT}/api/leads/stats          ║`);
    console.log(`║  💗 Health:      http://localhost:${PORT}/health                   ║`);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║  ⚡ Aggressive Driver: Every 60s                              ║');
    console.log('║  🔧 Self-Healing: Active                                      ║');
    console.log('║  🎯 Calibration: Runtime                                      ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
});
