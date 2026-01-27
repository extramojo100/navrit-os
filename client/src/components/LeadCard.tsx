// client/src/components/LeadCard.tsx
// DESIGN IQ 500 - Car-Centric Super Card
// Apple/Porsche design language

import { motion } from 'framer-motion';
import { Phone, Car, FileText, CheckCircle2, Clock, ChevronRight, Calendar } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    confidence: number;
    status: string;
    carModel?: string;
    carColor?: string;
    budget?: number;
    market?: string;
}

// Activity Icon Mapper
const ActivityIcon = ({ type, status }: { type: string; status: 'DONE' | 'PENDING' }) => {
    const color = status === 'DONE' ? 'text-emerald-400' : 'text-gray-500';
    const bg = status === 'DONE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10';

    const icons: Record<string, React.ReactNode> = {
        'CALL': <Phone size={12} />,
        'TD': <Car size={12} />,
        'QUOTE': <FileText size={12} />,
        'BOOK': <span className="text-[8px] font-bold">₹</span>
    };

    return (
        <div className={`w-7 h-7 rounded-full ${bg} border flex items-center justify-center ${color}`}>
            {icons[type] || <CheckCircle2 size={12} />}
        </div>
    );
};

export const LeadCard = ({ lead }: { lead: Lead }) => {
    const isHot = lead.confidence >= 0.85;
    const isWarm = lead.confidence >= 0.5;

    const borderColor = isHot
        ? 'border-l-emerald-500'
        : isWarm
            ? 'border-l-amber-500'
            : 'border-l-red-500';

    const signalGlow = isHot ? 'shadow-[0_0_20px_rgba(16,185,129,0.12)]' : '';

    // Determine timeline status
    const getStepStatus = (step: string): 'DONE' | 'PENDING' => {
        const statusOrder = ['NEW', 'CONTACTED', 'QUALIFYING', 'APPOINTMENT_SET', 'NEGOTIATING', 'CLOSED_WON'];
        const currentIndex = statusOrder.indexOf(lead.status);
        const stepMap: Record<string, number> = { 'CALL': 1, 'TD': 3, 'QUOTE': 4, 'BOOK': 5 };
        return currentIndex >= stepMap[step] ? 'DONE' : 'PENDING';
    };

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-[#18181B] rounded-xl p-4 mb-3 border-l-[3px] ${borderColor} ${signalGlow} shadow-lg overflow-hidden`}
        >
            {/* ═══════════════════════════════════════════════════════════════════════
          1. TOP ROW: NAME + CONFIDENCE + TIME
          ═══════════════════════════════════════════════════════════════════════ */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar with Status Dot */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                            {lead.name.charAt(0)}
                        </div>
                        {isHot && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#18181B] rounded-full animate-pulse" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-white leading-none">{lead.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isHot ? 'text-emerald-400 bg-emerald-500/10' :
                                    isWarm ? 'text-amber-400 bg-amber-500/10' :
                                        'text-red-400 bg-red-500/10'
                                }`}>
                                {(lead.confidence * 100).toFixed(0)}% MATCH
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                <Clock size={10} /> 2m ago
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
          2. MIDDLE ROW: THE PRODUCT (The Car)
          ═══════════════════════════════════════════════════════════════════════ */}
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 mb-3 border border-white/5">
                <div className="flex items-center gap-3">
                    {/* Car Icon */}
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                        <Car size={18} className="text-white/80" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">{lead.carModel || 'Model Pending'}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            {/* Color Dot */}
                            <div className="flex items-center gap-1.5">
                                <div
                                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                                    style={{ backgroundColor: lead.carColor || '#666' }}
                                />
                                <span className="text-[10px] text-gray-400 capitalize">{lead.carColor || 'TBD'}</span>
                            </div>
                            <span className="text-[10px] text-gray-600">|</span>
                            {/* Budget */}
                            <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                                {lead.budget ? `₹${(lead.budget / 100000).toFixed(1)}L` : 'Budget?'}
                            </span>
                        </div>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-600" />
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
          3. BOTTOM ROW: INTERACTION BUNCHING (Timeline)
          ═══════════════════════════════════════════════════════════════════════ */}
            <div className="relative pt-2">
                {/* Connector Line */}
                <div className="absolute top-[19px] left-4 right-4 h-[1px] bg-gradient-to-r from-emerald-500/30 via-white/10 to-white/5 z-0" />

                <div className="flex justify-between relative z-10 px-1">
                    {/* Step 1: Call */}
                    <div className="flex flex-col items-center gap-1">
                        <ActivityIcon type="CALL" status={getStepStatus('CALL')} />
                        <span className="text-[9px] text-gray-500 font-medium">Verified</span>
                    </div>

                    {/* Step 2: Test Drive */}
                    <div className="flex flex-col items-center gap-1">
                        <ActivityIcon type="TD" status={getStepStatus('TD')} />
                        <span className="text-[9px] text-gray-500 font-medium">Test Drive</span>
                    </div>

                    {/* Step 3: Quote */}
                    <div className="flex flex-col items-center gap-1">
                        <ActivityIcon type="QUOTE" status={getStepStatus('QUOTE')} />
                        <span className="text-[9px] text-gray-500 font-medium">Quote</span>
                    </div>

                    {/* Step 4: Book */}
                    <div className="flex flex-col items-center gap-1">
                        <ActivityIcon type="BOOK" status={getStepStatus('BOOK')} />
                        <span className="text-[9px] text-gray-600 font-medium">Book</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LeadCard;
