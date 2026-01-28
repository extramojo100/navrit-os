// SIMULATED BACKEND (The "Digital Twin")
// This mimics a real server + database running in the browser.

const DELAY = 400; // Simulate network latency

// 1. THE DATA SCHEMA (Mapped from your CSVs)
export interface Lead {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    location: string;
    probability: number;
    lastActiveDays: number;

    // COMMISSION ENGINE
    commission: {
        amount: number;
        multiplier: number; // 1.5x for Loan + Trade-in
        breakdown: { base: number; spiff: number; finance: number };
    };

    // MULTI-JOURNEY (The "Tabs")
    journeys: Journey[];
}

export interface Journey {
    id: string;
    model: string;
    status: string; // 'NEW' | 'QUOTE' | 'LTO_PROCESS' | 'DELIVERY'
    stock: {
        status: 'YARD' | 'TRANSIT' | 'ORDER';
        age: number; // Days in stock (Red flag if > 60)
        vin?: string;
    };
    financials: {
        exShowroom: number;
        discount: number;
        insurance: number;
        accessories: number;
        net: number;
    };
    // THE PROCESS ENGINE (From your CSVs)
    workflow?: {
        currentStep: number;
        steps: { label: string; tat: string; status: 'PENDING' | 'DONE' | 'LATE' }[];
    };
    logs: Log[];
}

export interface Log {
    actor: 'AI' | 'HUMAN' | 'CUSTOMER' | 'SYSTEM';
    msg: string;
    time: string;
    sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

// 2. THE DUMMY DATA SET (Your "Approval" Set)
const INITIAL_DATA: Lead[] = [
    {
        id: '1', name: 'Rahul Sharma', phone: '+91 98765 00001', avatar: 'R',
        location: 'West Delhi Showroom', probability: 0.92, lastActiveDays: 0,
        commission: { amount: 14500, multiplier: 1.5, breakdown: { base: 8000, spiff: 2000, finance: 4500 } },
        journeys: [
            {
                id: 'j1', model: 'Honda City ZX CVT', status: 'NEGOTIATION',
                stock: { status: 'YARD', age: 12, vin: 'MAK...892' },
                financials: { exShowroom: 1680000, discount: 45000, insurance: 42000, accessories: 12000, net: 1689000 },
                workflow: {
                    currentStep: 2,
                    steps: [
                        { label: 'Booking', tat: '1d', status: 'DONE' },
                        { label: 'Finance', tat: '2d', status: 'DONE' },
                        { label: 'Invoice', tat: '1d', status: 'PENDING' },
                        { label: 'PDI', tat: '1d', status: 'PENDING' },
                        { label: 'Delivery', tat: '1d', status: 'PENDING' }
                    ]
                },
                logs: [
                    { actor: 'AI', msg: 'Analyzed Competitor: Verna SX (O). Generated Battle Card.', time: '10:00 AM' },
                    { actor: 'HUMAN', msg: 'Sent Final Quote (PDF) via WhatsApp', time: '10:05 AM' },
                    { actor: 'CUSTOMER', msg: 'Can you match the insurance quote from Acko?', time: '10:12 AM', sentiment: 'NEGATIVE' }
                ]
            },
            {
                id: 'j2', model: 'Elevate Apex', status: 'TEST_DRIVE',
                stock: { status: 'TRANSIT', age: 0 },
                financials: { exShowroom: 1550000, discount: 0, insurance: 38000, accessories: 5000, net: 1593000 },
                logs: []
            }
        ]
    },
    {
        id: '2', name: 'Arjun Singh', phone: '+91 99887 77665', avatar: 'A',
        location: 'Online Inquiry', probability: 0.45, lastActiveDays: 5,
        commission: { amount: 4000, multiplier: 1.0, breakdown: { base: 4000, spiff: 0, finance: 0 } },
        journeys: [
            {
                id: 'j3', model: 'Amaze Elite', status: 'LTO_PROCESS',
                stock: { status: 'ORDER', age: 0 },
                financials: { exShowroom: 950000, discount: 15000, insurance: 22000, accessories: 5000, net: 962000 },
                workflow: {
                    currentStep: 1,
                    steps: [
                        { label: 'Doc Verification', tat: '1d', status: 'DONE' },
                        { label: 'LTO Submission', tat: '3d', status: 'LATE' },
                        { label: 'HPG Clearance', tat: '2d', status: 'PENDING' },
                        { label: 'Registry', tat: '2d', status: 'PENDING' }
                    ]
                },
                logs: [
                    { actor: 'SYSTEM', msg: '⚠️ ALERT: LTO Stage exceeded TAT by 24hrs', time: 'Yesterday' },
                    { actor: 'AI', msg: 'Ghost Protocol: Sent Nurture Video #3', time: 'Today 9:00 AM' }
                ]
            }
        ]
    },
    {
        id: '3', name: 'Priya Patel', phone: '+91 99012 34567', avatar: 'P',
        location: 'Gurgaon Showroom', probability: 0.78, lastActiveDays: 1,
        commission: { amount: 11000, multiplier: 2.0, breakdown: { base: 5000, spiff: 3000, finance: 3000 } },
        journeys: [
            {
                id: 'j4', model: 'City VX CVT', status: 'FINANCE_APPROVED',
                stock: { status: 'YARD', age: 45, vin: 'MAK...456' },
                financials: { exShowroom: 1520000, discount: 35000, insurance: 38000, accessories: 18000, net: 1541000 },
                workflow: {
                    currentStep: 3,
                    steps: [
                        { label: 'Booking', tat: '1d', status: 'DONE' },
                        { label: 'Finance', tat: '2d', status: 'DONE' },
                        { label: 'Invoice', tat: '1d', status: 'DONE' },
                        { label: 'PDI', tat: '1d', status: 'PENDING' },
                        { label: 'Delivery', tat: '1d', status: 'PENDING' }
                    ]
                },
                logs: [
                    { actor: 'HUMAN', msg: 'Finance approved by HDFC', time: 'Yesterday' },
                    { actor: 'AI', msg: 'Sent PDI checklist to customer', time: 'Today 8:30 AM' }
                ]
            }
        ]
    },
    {
        id: '4', name: 'Vikram Malhotra', phone: '+91 88776 65544', avatar: 'V',
        location: 'Noida Showroom', probability: 0.65, lastActiveDays: 0,
        commission: { amount: 7500, multiplier: 1.2, breakdown: { base: 5500, spiff: 1000, finance: 1000 } },
        journeys: [
            {
                id: 'j5', model: 'Amaze VX MT', status: 'BOOKING_DONE',
                stock: { status: 'TRANSIT', age: 3 },
                financials: { exShowroom: 980000, discount: 25000, insurance: 28000, accessories: 8000, net: 991000 },
                workflow: {
                    currentStep: 1,
                    steps: [
                        { label: 'Booking', tat: '1d', status: 'DONE' },
                        { label: 'Insurance', tat: '1d', status: 'PENDING' },
                        { label: 'LTO', tat: '3d', status: 'PENDING' },
                        { label: 'Delivery', tat: '1d', status: 'PENDING' }
                    ]
                },
                logs: [
                    { actor: 'HUMAN', msg: 'Token amount received ₹10,000', time: '2 hrs ago' }
                ]
            },
            {
                id: 'j6', model: 'City V MT', status: 'QUOTE_REQUESTED',
                stock: { status: 'ORDER', age: 0 },
                financials: { exShowroom: 1280000, discount: 15000, insurance: 32000, accessories: 10000, net: 1307000 },
                logs: []
            }
        ]
    }
];

// 3. THE API SIMULATION
export const MockEngine = {
    getLeads: async (): Promise<Lead[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem('navrit_leads');
                if (stored) {
                    resolve(JSON.parse(stored));
                } else {
                    localStorage.setItem('navrit_leads', JSON.stringify(INITIAL_DATA));
                    resolve(INITIAL_DATA);
                }
            }, DELAY);
        });
    },

    resetData: async (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('navrit_leads', JSON.stringify(INITIAL_DATA));
                resolve();
            }, DELAY);
        });
    },

    updateStatus: async (leadId: string, journeyId: string, newStatus: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const leads: Lead[] = JSON.parse(localStorage.getItem('navrit_leads') || '[]');
                const updated = leads.map((l) => {
                    if (l.id === leadId) {
                        l.journeys = l.journeys.map((j) => {
                            if (j.id === journeyId) {
                                j.status = newStatus;
                                j.logs.unshift({
                                    actor: 'HUMAN',
                                    msg: `Updated status to ${newStatus}`,
                                    time: 'Just Now'
                                });
                            }
                            return j;
                        });
                    }
                    return l;
                });
                localStorage.setItem('navrit_leads', JSON.stringify(updated));
                resolve(true);
            }, DELAY);
        });
    },

    advanceWorkflow: async (leadId: string, journeyId: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const leads: Lead[] = JSON.parse(localStorage.getItem('navrit_leads') || '[]');
                const updated = leads.map((l) => {
                    if (l.id === leadId) {
                        l.journeys = l.journeys.map((j) => {
                            if (j.id === journeyId && j.workflow) {
                                const currentStep = j.workflow.currentStep;
                                if (currentStep < j.workflow.steps.length - 1) {
                                    j.workflow.steps[currentStep].status = 'DONE';
                                    j.workflow.currentStep = currentStep + 1;
                                    j.logs.unshift({
                                        actor: 'HUMAN',
                                        msg: `Completed: ${j.workflow.steps[currentStep].label}`,
                                        time: 'Just Now'
                                    });
                                }
                            }
                            return j;
                        });
                    }
                    return l;
                });
                localStorage.setItem('navrit_leads', JSON.stringify(updated));
                resolve(true);
            }, DELAY);
        });
    },

    nukeLead: async (leadId: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const leads: Lead[] = JSON.parse(localStorage.getItem('navrit_leads') || '[]');
                const updated = leads.filter((l) => l.id !== leadId);
                localStorage.setItem('navrit_leads', JSON.stringify(updated));
                console.log(`👻 LEAD ${leadId} NUKED: Moved to AI Drip Campaign`);
                resolve(true);
            }, DELAY);
        });
    },

    addLog: async (leadId: string, journeyId: string, log: Omit<Log, 'time'>): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const leads: Lead[] = JSON.parse(localStorage.getItem('navrit_leads') || '[]');
                const updated = leads.map((l) => {
                    if (l.id === leadId) {
                        l.journeys = l.journeys.map((j) => {
                            if (j.id === journeyId) {
                                j.logs.unshift({ ...log, time: 'Just Now' });
                            }
                            return j;
                        });
                    }
                    return l;
                });
                localStorage.setItem('navrit_leads', JSON.stringify(updated));
                resolve(true);
            }, DELAY);
        });
    }
};
