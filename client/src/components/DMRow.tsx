// client/src/components/DMRow.tsx
// NAVRIT SOCIAL OS - DM Row with click handler

import { motion } from 'framer-motion';

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

interface DMRowProps {
    lead: Lead;
    onClick: () => void;
}

export const DMRow = ({ lead, onClick }: DMRowProps) => {
    const isHot = lead.confidence >= 0.85;
    const isWarm = lead.confidence >= 0.5;

    // Generate message based on status
    const getMessage = () => {
        if (isHot) return '🔥 Ready to book test drive';
        if (lead.status === 'NEGOTIATING') return '💰 Discussing final price...';
        if (lead.status === 'QUALIFYING') return `📋 Qualifying for ${lead.carModel}`;
        return `Interested in ${lead.carModel || 'cars'}`;
    };

    return (
        <motion.div
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3.5 p-3 rounded-2xl active:bg-zinc-900 transition-colors cursor-pointer"
        >
            {/* AVATAR */}
            <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                    {lead.name.charAt(0)}
                </div>
                {/* Car Color Dot */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black flex items-center justify-center border-2 border-black">
                    <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: lead.carColor || '#555' }}
                    />
                </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="flex-1 min-w-0 flex flex-col justify-center border-b border-zinc-900 pb-3">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[16px] font-semibold text-white truncate">{lead.name}</h3>
                    <span className="text-[12px] text-zinc-500 font-medium">2m</span>
                </div>

                <div className={`text-[14px] truncate ${isHot ? 'text-white font-medium' : 'text-zinc-400'}`}>
                    {getMessage()}
                </div>

                {/* Micro Tags */}
                <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${isHot ? 'text-emerald-400 bg-emerald-500/10' :
                            isWarm ? 'text-amber-400 bg-amber-500/10' :
                                'text-red-400 bg-red-500/10'
                        }`}>
                        {lead.budget ? `₹${(lead.budget / 100000).toFixed(1)}L` : 'Budget?'}
                    </span>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                        {lead.market}
                    </span>
                </div>
            </div>

            {/* UNREAD INDICATOR */}
            <div className="flex flex-col items-end justify-center pb-3">
                {isHot && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] shadow-[0_0_10px_#FF6B35]" />
                )}
            </div>
        </motion.div>
    );
};

export default DMRow;
