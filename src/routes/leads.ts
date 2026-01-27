// src/routes/leads.ts
// Route definitions only - no logic
// Stanford Architecture: Clean routing

import { Router } from 'express';
import leadController from '../controllers/leadController';

const router = Router();

/**
 * Lead Routes
 * All business logic is in controllers and services
 */

// GET /api/leads - List leads with pagination
router.get('/', leadController.list);

// GET /api/leads/stats - Dashboard statistics
router.get('/stats', leadController.stats);

// GET /api/leads/:id - Get single lead
router.get('/:id', leadController.getById);

// POST /api/leads - Create new lead
router.post('/', leadController.create);

// PATCH /api/leads/:id - Update lead
router.patch('/:id', leadController.update);

// POST /api/leads/:id/escalate - Escalate lead
router.post('/:id/escalate', leadController.escalate);

export default router;
