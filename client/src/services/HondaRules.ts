export const checkDuplicate = (existingLeads: any[], mobile: string, model: string) => {
    const match = existingLeads.find(l => l.phone === mobile);
    if (!match) return { status: 'ALLOWED' };
    const sameModel = match.journeys.some((j: any) => j.model === model);
    if (sameModel) return { status: 'BLOCK', msg: 'Duplicate Lead: Same Model Active' };
    return { status: 'ALLOWED', msg: 'New Journey Created' };
};

export const validateProforma = (quote: any) => {
    const missing = [];
    if (!quote.discount) missing.push('Discount');
    if (!quote.loanAmount) missing.push('Loan Amount');
    if (!quote.processingFee) missing.push('Processing Fee');
    if (missing.length > 0) return { valid: false, msg: `Missing: ${missing.join(', ')}` };
    return { valid: true };
};
