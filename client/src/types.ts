export type Priority = 'HOT A' | 'HOT B' | 'HOT C' | 'WARM' | 'COLD';

export interface Lead {
    id: string;
    name: string;
    phone: string;
    model: string;
    variant: string;
    status: string; // "Test Drive Scheduled", "Call Verification"
    priority: Priority;
    nextActionTime: string; // "2:00 PM"
    journeyStage: number; // 1-10
}

export const TASKS = [
    { id: 1, type: 'CALL', name: 'Gaurav Jain', time: '10:00 AM', desc: 'Call for verification', priority: 'HOT C' },
    { id: 2, type: 'DRIVE', name: 'Amit Rai', time: '2:00 PM', desc: 'Test Drive: City ZX', priority: 'HOT A' },
    { id: 3, type: 'MEET', name: 'Sohan Kadwa', time: '4:30 PM', desc: 'Sign Contract', priority: 'HOT A' },
];
