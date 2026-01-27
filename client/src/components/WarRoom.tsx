// client/src/components/WarRoom.tsx
// NAVRIT KILLER OS - AI War Room
// Agentic plays and battle intelligence

import { motion, AnimatePresence } from 'framer-motion';
import { Bot, FileText, Share2, Calculator, X, MessageSquare } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    carModel: string;
    probability: number;
}

interface PlayButtonProps {
    icon: React.ReactNode;
    title: string;
    sub: string;
    onClick?: () => void;
}

const PlayButton = ({ icon, title, sub, onClick }: PlayButtonProps) => (
    <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full bg-zinc-800 hover:bg-zinc-700 border border-white/5 p-3 rounded-xl flex items-center gap-4 transition-colors text-left"
    >
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-zinc-400">
            {icon}
        </div>
        <div className="flex-1">
            <div className="text-sm font-bold text-white">{title}</div>
            <div className="text-xs text-emerald-400">{sub}</div>
        </div>
    </motion.button>
);

export const WarRoom = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-50 bg-black flex flex-col"
            >
                {/* ═══════════════════════════════════════════════════════════════════════
            HEADER
            ═══════════════════════════════════════════════════════════════════════ */}
                <div className="p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white">AI War Room</span>
                            <div className="text-[10px] text-zinc-500">{lead.name} • {lead.carModel}</div>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10"
                    >
                        <X size={20} className="text-zinc-500" />
                    </motion.button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════════
            AI INTELLIGENCE
            ═══════════════════════════════════════════════════════════════════════ */}
                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                    {/* Situation Report */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 p-4 rounded-xl border-l-4 border-[#FF6B35]"
                    >
                        <h4 className="text-[#FF6B35] text-xs font-bold uppercase mb-1">
                            Situation Report
                        </h4>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Customer agrees on car, but is{' '}
                            <strong className="text-white">hesitant on Interest Rate (9.5%)</strong>.
                            Competitor (Hyundai) offered 8.9%. High urgency — deal expires today.
                        </p>
                    </motion.div>

                    {/* Win Probability */}
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <span className="text-sm text-emerald-400 font-medium">Win Probability</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono">
                            {(lead.probability * 100).toFixed(0)}%
                        </span>
                    </div>

                    {/* Recommended Plays */}
                    <div className="space-y-2">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            Recommended Plays
                        </div>

                        <PlayButton
                            icon={<Calculator size={18} />}
                            title="Match Rate @ 9.0%"
                            sub="Reduces commission by ₹500"
                        />
                        <PlayButton
                            icon={<FileText size={18} />}
                            title="Send 'Verna vs City' PDF"
                            sub="Highlight Resale Value (+15%)"
                        />
                        <PlayButton
                            icon={<Share2 size={18} />}
                            title="Offer 3-Year Service Pack"
                            sub="Value add: ₹18,000"
                        />
                        <PlayButton
                            icon={<MessageSquare size={18} />}
                            title="Send WhatsApp Voice Note"
                            sub="Personal touch — 2x conversion"
                        />
                    </div>

                    {/* History Stream */}
                    <div className="mt-6">
                        <div className="text-xs font-bold text-zinc-500 uppercase mb-3">
                            Live Stream
                        </div>
                        {[
                            { time: '10:12 AM', action: 'Sent brochure via WhatsApp' },
                            { time: '10:08 AM', action: 'Customer viewed pricing page (2 min)' },
                            { time: '09:45 AM', action: 'AI qualified as HIGH INTENT' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-3 mb-3"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-zinc-600" />
                                    <div className="h-full w-px bg-zinc-800" />
                                </div>
                                <div className="pb-2">
                                    <div className="text-[10px] text-zinc-500 font-mono">{item.time}</div>
                                    <div className="text-sm text-white">{item.action}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════════
            BOTTOM ACTION
            ═══════════════════════════════════════════════════════════════════════ */}
                <div className="p-4 border-t border-white/10 bg-zinc-950">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#FF6B35] text-black font-bold py-4 rounded-xl text-sm uppercase tracking-wider"
                    >
                        Execute Best Play
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WarRoom;
