// prisma/seed.ts
// Seed demo data for investor presentation

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.correctionLog.deleteMany();
    await prisma.lead.deleteMany();

    // Create demo leads
    await prisma.lead.create({
        data: {
            phone: '+919876543210',
            name: 'Rahul Sharma',
            status: 'QUALIFYING',
            market: 'INDIA',
            confidence: 0.92,
            budget: 1500000,
            corrections: {
                create: {
                    field: 'budget',
                    aiValue: '15000',
                    humanValue: '1500000'
                }
            }
        }
    });

    await prisma.lead.create({
        data: {
            phone: '+62812345678',
            name: 'Budi Santoso',
            status: 'NEW',
            market: 'INDONESIA',
            confidence: 0.72,
            budget: 450000000
        }
    });

    await prisma.lead.create({
        data: {
            phone: '+6591234567',
            name: 'Sarah Chen',
            status: 'NEGOTIATING',
            market: 'SINGAPORE',
            confidence: 0.88,
            budget: 85000
        }
    });

    await prisma.lead.create({
        data: {
            phone: '+971501234567',
            name: 'Ahmad Al-Rashid',
            status: 'CONTACTED',
            market: 'UAE',
            confidence: 0.45,
            budget: 180000
        }
    });

    console.log('✅ Database seeded with 4 demo leads');
    console.log('   - 2 GREEN (>85% confidence)');
    console.log('   - 1 YELLOW (72%)');
    console.log('   - 1 RED (45%)');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
