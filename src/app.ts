// src/app.ts
// Navrit MVP - Investor Ready Backend

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { env } from './config/env';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all leads with corrections (shows the "moat")
app.get('/api/leads', async (_req, res) => {
    const leads = await prisma.lead.findMany({
        include: { corrections: true },
        orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, data: leads });
});

// Get stats for dashboard
app.get('/api/leads/stats', async (_req, res) => {
    const leads = await prisma.lead.findMany();

    const byGate = {
        green: leads.filter(l => l.confidence >= 0.85).length,
        yellow: leads.filter(l => l.confidence >= 0.5 && l.confidence < 0.85).length,
        red: leads.filter(l => l.confidence < 0.5).length
    };

    res.json({
        success: true,
        data: {
            totalLeads: leads.length,
            byGate,
            avgConfidence: leads.length > 0
                ? leads.reduce((sum, l) => sum + l.confidence, 0) / leads.length
                : 0
        }
    });
});

// Create new lead
app.post('/api/leads', async (req, res) => {
    const { phone, name, market, budget } = req.body;
    const lead = await prisma.lead.create({
        data: { phone, name, market, budget }
    });
    res.json({ success: true, data: lead });
});

// Escalate lead (for demo)
app.post('/api/leads/:id/escalate', async (req, res) => {
    const { id } = req.params;
    const lead = await prisma.lead.update({
        where: { id },
        data: { confidence: 0.3 } // Force RED gate
    });
    res.json({ success: true, data: lead, message: 'Lead escalated' });
});

const PORT = parseInt(env.PORT, 10);
app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║          NAVRIT MVP - INVESTOR READY              ║');
    console.log('╠═══════════════════════════════════════════════════╣');
    console.log(`║  🚀 API:    http://localhost:${PORT}/api/leads         ║`);
    console.log(`║  📊 Stats:  http://localhost:${PORT}/api/leads/stats   ║`);
    console.log('╚═══════════════════════════════════════════════════╝');
    console.log('');
});
