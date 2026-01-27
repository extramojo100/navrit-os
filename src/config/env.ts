// src/config/env.ts
// Type-Safe Environment Config - Investor Ready

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().default('file:./dev.db'),
    ANTHROPIC_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
