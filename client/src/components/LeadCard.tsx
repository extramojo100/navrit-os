// client/src/components/LeadCard.tsx
// HIGH DENSITY CARD - All info visible on face
// No "View Details" button - evolved from 10-year LMS

import { Phone, Clock, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

interface Lead {
    id: string;
    name: string | null;
    phone: string;
    status: string;
    market: string;
    confidence: number;
    budget: number | null;
    corrections: { field: string; aiValue: string; humanValue: string }[];
}

export const LeadCard = ({ lead }: { lead: Lead }) => {
    // 🟢🟡🔴 Traffic Light Logic
    const signalColor = lead.confidence > 0.85
        ? 'bg-green-500/20 text-green-400 border-green-500/50'
        : lead.confidence > 0.5
            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
            : 'bg-red-500/20 text-red-400 border-red-500/50';

    const signalDot = lead.confidence > 0.85
        ? 'bg-green-500'
        : lead.confidence > 0.5
            ? 'bg-yellow-500'
            : 'bg-red-500';

    // Format budget for display
    const formatBudget = (budget: number | null) => {
        if (!budget) return 'Pending';
        if (budget >= 10000000) return `₹${(budget / 10000000).toFixed(1)}Cr`;
        if (budget >= 100000) return `₹${(budget / 100000).toFixed(1)}L`;
        return `₹${budget.toLocaleString()}`;
    };

    // Determine next action based on status
    const getNextAction = (status: string) => {
        const actions: Record<string, string> = {
            'NEW': 'Initial Contact',
            'CONTACTED': 'Qualify Intent',
            'QUALIFYING': 'Confirm Budget',
            'QUALIFIED': 'Schedule Test Drive',
            'APPOINTMENT_SET': 'Confirm Attendance',
            'NEGOTIATING': 'Send Final Quote',
        };
        return actions[status] || 'Follow Up';
    };

    return (
        <div className="group relative bg-[#1E1E2E]/80 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:border-[#FF6B35] transition-all duration-300 mb-4 shadow-xl">

            {/* AI LEARNING INDICATOR */}
            {lead.corrections.length > 0 && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" title="AI Learning Active" />
            )}

            {/* HEADER: Name & Signal */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar with Gate Color */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                            {(lead.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${signalDot} rounded-full border-2 border-[#1E1E2E]`} />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{lead.name || 'Unknown'}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Clock size={12} />
                            <span>Active 2m ago</span>
                            <span className="text-gray-600">•</span>
                            <span>{lead.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Confidence Badge */}
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${signalColor} flex items-center gap-2`}>
                    {lead.confidence > 0.85 ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    {(lead.confidence * 100).toFixed(0)}% MATCH
                </div>
            </div>

            {/* BODY: High Density Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Interested Model</p>
                    <p className="text-sm font-medium text-gray-200">{lead.market || 'Pending'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Budget Detected</p>
                    <p className="text-sm font-semibold text-[#FF6B35]">{formatBudget(lead.budget)}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
                    <p className="text-sm font-medium text-gray-200">{lead.status.replace(/_/g, ' ')}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Next Action</p>
                    <p className="text-sm font-medium text-yellow-400">{getNextAction(lead.status)}</p>
                </div>
            </div>

            {/* LEARNING EVENT (if exists) */}
            {lead.corrections.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">✨ AI Learning Event</p>
                    <p className="text-xs text-gray-300">
                        Corrected <span className="text-red-400 line-through">{lead.corrections[0].aiValue}</span>
                        {' → '}
                        <span className="text-green-400 font-medium">{lead.corrections[0].humanValue}</span>
                    </p>
                </div>
            )}

            {/* FOOTER: Instant Actions (No "View Details" button!) */}
            <div className="flex gap-2 pt-3 border-t border-white/5">
                <button className="flex-1 bg-[#FF6B35] hover:bg-[#E85A24] text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FF6B35]/20">
                    <Phone size={14} /> Call
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                    <MessageSquare size={14} /> WhatsApp
                </button>
            </div>
        </div>
    );
};

export default LeadCard;
