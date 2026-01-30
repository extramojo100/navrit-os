export const calculateIncentive = (loanAmount: number, baseRate: number, topUp: number) => {
    const TAX_RATE = 0.10;
    const baseIncentive = loanAmount * baseRate;
    const topUpIncentive = loanAmount * topUp;
    const gross = baseIncentive + topUpIncentive;
    const tax = gross * TAX_RATE;
    const net = gross - tax;
    return { gross, tax, net, formula: `(${loanAmount} * ${baseRate}) + TopUp - 10% Tax` };
};
