import { checkDuplicate } from './HondaRules';
import { checkTatBreach } from './TitleTransferEngine';
import { calculateIncentive } from './UCRFCalculator';

export const DealArchitect = {

    // 1. VALIDATE INCOMING LEAD (Honda FSD)
    auditLead: (lead: any, allLeads: any[]) => {
        const dupCheck = checkDuplicate(allLeads, lead.phone, lead.journeys[0].model);
        if (dupCheck.status === 'BLOCK') {
            return { status: 'BLOCKED', reason: dupCheck.msg };
        }
        return { status: 'APPROVED' };
    },

    // 2. CALCULATE DEAL STRUCTURE (UCRF Logic)
    structureDeal: (journey: any) => {
        if (journey.type === 'UCRF') {
            const math = calculateIncentive(journey.loanAmount, 0.04, 0.01); // 4% base, 1% topup
            return {
                ...journey,
                commissionEst: math.net,
                financials: math
            };
        }
        return journey;
    },

    // 3. MONITOR HEALTH (TAT Breach)
    healthCheck: (journey: any) => {
        if (journey.type === 'TITLE_TRANSFER') {
            const isBreached = checkTatBreach(journey.workflowStep, journey.daysInStage);
            return { healthy: !isBreached, alert: isBreached ? 'TAT Breach' : null };
        }
        return { healthy: true };
    }
};
