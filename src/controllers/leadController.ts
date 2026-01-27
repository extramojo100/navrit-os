// src/controllers/leadController.ts
// HTTP Layer - Request/Response handling only
// Stanford Architecture: Controller Pattern - Thin controllers, fat services

import { Request, Response } from 'express';
import leadService from '../services/leadService';
import { asyncHandler } from '../middlewares/error';
import {
    CreateLeadSchema,
    UpdateLeadSchema,
    EscalateLeadSchema,
    PaginationSchema
} from '../types';

/**
 * Lead Controller - HTTP handlers for lead endpoints
 * All business logic is delegated to leadService
 */
export const leadController = {
    /**
     * GET /api/leads
     * List leads with pagination and filtering
     */
    list: asyncHandler(async (req: Request, res: Response) => {
        const params = PaginationSchema.parse(req.query);
        const result = await leadService.getLeads(params);

        res.json({
            success: true,
            ...result
        });
    }),

    /**
     * GET /api/leads/stats
     * Get dashboard statistics
     */
    stats: asyncHandler(async (_req: Request, res: Response) => {
        const stats = await leadService.getDashboardStats();

        res.json({
            success: true,
            data: stats
        });
    }),

    /**
     * GET /api/leads/:id
     * Get a single lead by ID
     */
    getById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const lead = await leadService.getLeadById(id);

        res.json({
            success: true,
            data: lead
        });
    }),

    /**
     * POST /api/leads
     * Create a new lead
     */
    create: asyncHandler(async (req: Request, res: Response) => {
        const input = CreateLeadSchema.parse(req.body);
        const lead = await leadService.createLead(input);

        res.status(201).json({
            success: true,
            data: lead
        });
    }),

    /**
     * PATCH /api/leads/:id
     * Update an existing lead
     */
    update: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const input = UpdateLeadSchema.parse(req.body);
        const lead = await leadService.updateLead(id, input);

        res.json({
            success: true,
            data: lead
        });
    }),

    /**
     * POST /api/leads/:id/escalate
     * Escalate a lead to manager
     */
    escalate: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const input = EscalateLeadSchema.parse(req.body);
        const lead = await leadService.escalateLead(id, input);

        res.json({
            success: true,
            data: lead,
            message: 'Lead escalated to manager'
        });
    })
};

export default leadController;
