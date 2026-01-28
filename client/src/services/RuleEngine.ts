// THE BRAIN: Node-Level Logic Resolver
// Logic flows: Brand > Group > Dealer > Manager > User

export interface Rule {
    level: 'BRAND' | 'GROUP' | 'DEALER' | 'MANAGER';
    type: 'CONSTRAINT' | 'INCENTIVE' | 'PROCESS';
    action: string;
    payload: Record<string, unknown>;
}

export const RULES_DB: Rule[] = [
    { level: 'BRAND', type: 'PROCESS', action: 'ENFORCE_STEPS', payload: { steps: 13, name: 'Honda Way' } },
    { level: 'BRAND', type: 'CONSTRAINT', action: 'MAX_DISCOUNT', payload: { percent: 3, model: 'City' } },
    { level: 'GROUP', type: 'INCENTIVE', action: 'UPSELL_ALLOWED', payload: { target: 'Amaze -> City' } },
    { level: 'GROUP', type: 'INCENTIVE', action: 'SPIFF_BONUS', payload: { amount: 2000, condition: 'LOAN' } },
    { level: 'DEALER', type: 'CONSTRAINT', action: 'GEO_FENCE', payload: { reject_city: 'Gurgaon' } },
    { level: 'DEALER', type: 'CONSTRAINT', action: 'STOCK_PRIORITY', payload: { age_days: 60 } },
    { level: 'MANAGER', type: 'CONSTRAINT', action: 'FINANCE_LOCK', payload: { bank: 'HDFC' } },
    { level: 'MANAGER', type: 'PROCESS', action: 'APPROVAL_REQUIRED', payload: { threshold: 50000 } },
];

export interface LeadContext {
    dealerId?: string;
    managerId?: string;
    model?: string;
    hasLoan?: boolean;
    discountPercent?: number;
}

export const resolveRules = (_context: LeadContext): Rule[] => {
    // In a real implementation, we would filter rules based on context
    // For demo, return all rules to show the hierarchy
    return RULES_DB;
};

export const getApplicableConstraints = (_context: LeadContext): Rule[] => {
    return RULES_DB.filter(r => r.type === 'CONSTRAINT');
};

export const getActiveIncentives = (_context: LeadContext): Rule[] => {
    return RULES_DB.filter(r => r.type === 'INCENTIVE');
};

export const validateDiscount = (discountPercent: number, model: string): { valid: boolean; reason?: string } => {
    const maxDiscountRule = RULES_DB.find(
        r => r.action === 'MAX_DISCOUNT' && r.payload.model === model
    );

    if (maxDiscountRule && discountPercent > (maxDiscountRule.payload.percent as number)) {
        return {
            valid: false,
            reason: `BRAND_CONSTRAINT: Max discount for ${model} is ${maxDiscountRule.payload.percent}%`
        };
    }

    return { valid: true };
};
