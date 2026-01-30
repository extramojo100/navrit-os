export const TT_WORKFLOW = [
    { id: 1, label: 'Docs Verification', tat: 1 },
    { id: 2, label: 'Agent Accepted', tat: 2 },
    { id: 3, label: 'HPG Clearance', tat: 1 },
    { id: 4, label: 'Registry of Deeds', tat: 2 },
    { id: 5, label: 'LTO Confirmation', tat: 3 },
    { id: 6, label: 'LTO Processing', tat: 1 },
    { id: 7, label: 'New OR/CR Release', tat: 1 },
    { id: 8, label: 'Delivered', tat: 0 }
];

export const checkTatBreach = (stepId: number, daysInStage: number) => {
    const step = TT_WORKFLOW.find(s => s.id === stepId);
    if (!step) return false;
    return daysInStage > step.tat;
};
