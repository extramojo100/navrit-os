// client/src/components/LeadCard.tsx
// BLOOMBERG DENSITY - Foldable Ticker Pattern
// God Mode: Tap to reveal live activity log

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, ChevronDown, Clock, MapPin, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

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

interface LogEntry {
    time: string;
    action: string;
    detail: string;
    type: 'success' | 'warning' | 'info';
}

export const LeadCard = ({ lead }: { lead: Lead }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isHot = lead.confidence >= 0.85;
    const isWarm = lead.confidence >= 0.5;

    const signalColor = isHot
        ? 'text-emerald-400'
        : isWarm
            ? 'text-amber-400'
            : 'text-red-400';

    const borderClass = isHot
        ? 'border-emerald-500/40'
        : isWarm
            ? 'border-amber-500/30'
            : 'border-red-500/30';

    // Generate mock activity log
    const activityLog: LogEntry[] = [
        { time: '10:42', action: isHot ? 'Auto-Qualified' : 'Needs Review', detail: `Confidence at ${(lead.confidence * 100).toFixed(0)}%`, type: isHot ? 'success' : 'warning' },
        { time: '10:38', action: 'Message Received', detail: '"Is the test drive available?"', type: 'info' },
        { time: '10:35', action: 'Lead Created', detail: `Source: ${lead.market}`, type: 'info' }
    ];

    // Format budget
    const formatBudget = (budget: number | null) => {
        if (!budget) return '--';
        if (budget >= 10000000) return `₹${(budget / 10000000).toFixed(1)}Cr`;
        if (budget >= 100000) return `₹${(budget / 100000).toFixed(1)}L`;
        return `₹${budget.toLocaleString()}`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`ticker-face ${isHot ? 'hot' : ''} mb-3`}
        >
            {/* ═══════════════════════════════════════════════════════════════════════
          THE TICKER FACE (Always Visible)
          ═══════════════════════════════════════════════════════════════════════ */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 cursor-pointer active:bg-white/5 transition-colors"
            >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                            {lead.name || 'Unknown Lead'}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-1">
                            <span className="flex items-center gap-1">
                                <MapPin size={10} /> {lead.market}
                            </span>
                            <span className="text-gray-600">|</span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} /> 2m ago
                            </span>
                        </div>
                    </div>

                    {/* CONFIDENCE SCORE (Financial Style) */}
                    <div className="text-right">
                        <div className={`text-xl font-mono font-bold tracking-tighter ${signalColor}`}>
                            {(lead.confidence * 100).toFixed(0)}<span className="text-xs">%</span>
                        </div>
                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                            {isHot ? '🟢 GREEN' : isWarm ? '🟡 YELLOW' : '🔴 RED'}
                        </div>
                    </div>
                </div>

                {/* HIGH DENSITY DATA GRID */}
                <div className="grid grid-cols-4 gap-2 bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="text-center border-r border-white/5">
                        <div className="data-label">Budget</div>
                        <div className="text-xs font-mono font-semibold text-[rgb(var(--primary))]">
                            {formatBudget(lead.budget)}
                        </div>
                    </div>
                    <div className="text-center border-r border-white/5">
                        <div className="data-label">Status</div>
                        <div className="text-xs font-medium text-white truncate px-1">
                            {lead.status.replace(/_/g, ' ')}
                        </div>
                    </div>
                    <div className="text-center border-r border-white/5">
                        <div className="data-label">Phone</div>
                        <div className="text-[10px] font-mono text-gray-300 truncate">
                            {lead.phone.slice(-8)}
                        </div>
                    </div>
                    <div className="text-center flex flex-col items-center justify-center">
                        <div className="data-label">Expand</div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={14} className="text-gray-400" />
                        </motion.div>
                    </div>
                </div>

                {/* AI Learning Badge */}
                {lead.corrections.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-blue-400 font-medium">AI Learning Active</span>
                        <span className="text-gray-500">
                            — Corrected: {lead.corrections[0].aiValue} → {lead.corrections[0].humanValue}
                        </span>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
          THE FOLDABLE LEDGER (God Mode Activity Log)
          ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/10 bg-black/40 overflow-hidden"
                    >
                        {/* Activity Log */}
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Live Activity Log
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                                    <Zap size={10} />
                                    <span>Real-time</span>
                                </div>
                            </div>

                            {activityLog.map((entry, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="log-entry"
                                >
                                    <div className="log-time">{entry.time}</div>
                                    <div className={`log-content ${entry.type}`}>
                                        <div className={`font-medium ${entry.type === 'success' ? 'text-emerald-400' :
                                                entry.type === 'warning' ? 'text-amber-400' : 'text-gray-300'
                                            }`}>
                                            {entry.action}
                                        </div>
                                        <div className="text-gray-500">{entry.detail}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* ACTION BAR */}
                        <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
                            <button className="py-3 bg-white/5 text-emerald-400 font-bold text-xs uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <Phone size={14} /> Call Now
                            </button>
                            <button className="py-3 bg-white/5 text-white font-bold text-xs uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <MessageSquare size={14} /> WhatsApp
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LeadCard;
