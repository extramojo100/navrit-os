// client/src/components/LeadCard.tsx
// Premium Lead Card with Framer Motion animations
// World-class UI component

import { motion } from 'framer-motion';
import { Phone, Mail, Car, DollarSign, Clock, ChevronRight, Send, Edit, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    carModel?: string | null;
    budget?: string | null;
    state: string;
    confidenceScore: number;
    gateLevel: 'GREEN' | 'YELLOW' | 'RED';
    createdAt: string;
    lastMessage?: string;
    aiSuggestion?: string;
}

interface LeadCardProps {
    lead: Lead;
    index: number;
    onSend: (id: string) => void;
    onEdit: (id: string) => void;
    onEscalate: (id: string) => void;
}

const gateConfig = {
    GREEN: {
        label: 'Auto-Apply',
        dotClass: 'gate-dot-green',
        badgeClass: 'gate-green',
        icon: '🟢'
    },
    YELLOW: {
        label: 'Review',
        dotClass: 'gate-dot-yellow',
        badgeClass: 'gate-yellow',
        icon: '🟡'
    },
    RED: {
        label: 'Escalate',
        dotClass: 'gate-dot-red',
        badgeClass: 'gate-red',
        icon: '🔴'
    }
};

const stateColors: Record<string, string> = {
    NEW: 'text-blue-400',
    CONTACTED: 'text-purple-400',
    QUALIFIED: 'text-indigo-400',
    INTERESTED: 'text-cyan-400',
    TEST_DRIVE_SCHEDULED: 'text-green-400',
    NEGOTIATING: 'text-yellow-400',
    CLOSED_WON: 'text-emerald-400',
    CLOSED_LOST: 'text-red-400'
};

export function LeadCard({ lead, index, onSend, onEdit, onEscalate }: LeadCardProps) {
    const gate = gateConfig[lead.gateLevel];
    const confidence = Math.round(lead.confidenceScore * 100);
    const timeAgo = getTimeAgo(lead.createdAt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="lead-card group"
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Pulsing Gate Indicator */}
                    <div className={clsx('gate-dot', gate.dotClass)} />

                    {/* Name and Meta */}
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-cosmic-400 transition-colors">
                            {lead.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {timeAgo}
                            </span>
                            <span className={clsx('font-medium', stateColors[lead.state] || 'text-white/50')}>
                                {lead.state.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Confidence Badge */}
                <div className={clsx('gate-badge', gate.badgeClass)}>
                    <span>{confidence}%</span>
                    <span>{gate.label}</span>
                </div>
            </div>

            {/* Details Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                    <Phone className="w-4 h-4 text-white/40" />
                    <span>{lead.phone}</span>
                </div>
                {lead.carModel && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <Car className="w-4 h-4 text-white/40" />
                        <span>{lead.carModel}</span>
                    </div>
                )}
                {lead.email && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <Mail className="w-4 h-4 text-white/40" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                )}
                {lead.budget && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <DollarSign className="w-4 h-4 text-white/40" />
                        <span>{lead.budget}</span>
                    </div>
                )}
            </div>

            {/* Last Message */}
            {lead.lastMessage && (
                <div className="message-bubble mb-4">
                    <p className="text-sm text-white/80 italic">"{lead.lastMessage}"</p>
                </div>
            )}

            {/* AI Suggestion */}
            {lead.aiSuggestion && (
                <div className="ai-suggestion mb-4">
                    <span className="text-xl">🤖</span>
                    <div>
                        <p className="text-xs text-cosmic-400 font-medium mb-1">AI SUGGESTION</p>
                        <p className="text-sm text-white">{lead.aiSuggestion}</p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSend(lead.id)}
                    className="btn-cosmic flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    Send
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(lead.id)}
                    className="btn-ghost flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    Edit
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEscalate(lead.id)}
                    className="btn-outline flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate
                </motion.button>
            </div>

            {/* Quick View Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-cosmic-400" />
            </div>
        </motion.div>
    );
}

function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default LeadCard;
