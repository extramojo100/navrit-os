// client/src/components/StoryViewer.tsx
// NAVRIT SOCIAL OS - Full-Screen Story Viewer
// Instagram Stories x WhatsApp Status style

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare, ChevronUp, Car } from 'lucide-react';

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

export const StoryViewer = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => {
    const [progress, setProgress] = useState(0);

    // Auto-advance (5 seconds total)
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    onClose();
                    return 100;
                }
                return prev + 2; // 2% every 100ms = 5 seconds total
            });
        }, 100);
        return () => clearInterval(timer);
    }, [onClose]);

    // Format budget
    const formatBudget = (budget?: number) => {
        if (!budget) return 'TBD';
        if (budget >= 10000000) return `₹${(budget / 10000000).toFixed(1)}Cr`;
        if (budget >= 100000) return `₹${(budget / 100000).toFixed(1)}L`;
        return `₹${budget.toLocaleString()}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col"
            >
                {/* PROGRESS BAR */}
                <div className="absolute top-2 left-3 right-3 flex gap-1 z-20">
                    <div className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                </div>

                {/* HEADER */}
                <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B35] to-purple-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm">
                                {lead.name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold drop-shadow-lg">{lead.name}</span>
                            <span className="text-[11px] opacity-80 drop-shadow-md">
                                2m ago • {lead.market}
                            </span>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-full bg-black/30 backdrop-blur"
                    >
                        <X size={22} />
                    </motion.button>
                </div>

                {/* HERO CONTENT */}
                <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black relative flex items-center justify-center overflow-hidden">
                    {/* Background Car Icon */}
                    <Car size={180} className="text-white/3 absolute" />

                    {/* OVERLAY DATA */}
                    <div className="absolute bottom-36 left-6 right-6 z-10">
                        {/* Car Model */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl font-black text-white mb-3 tracking-tight leading-none"
                        >
                            {lead.carModel || 'Model TBD'}
                        </motion.div>

                        {/* Tags */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-2 mb-6 flex-wrap"
                        >
                            <div
                                className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs font-bold text-white flex items-center gap-2"
                            >
                                <div
                                    className="w-3 h-3 rounded-full border border-white/30"
                                    style={{ backgroundColor: lead.carColor || '#666' }}
                                />
                                {lead.carColor || 'Color TBD'}
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-500/30 text-xs font-bold text-emerald-400">
                                {(lead.confidence * 100).toFixed(0)}% Match
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-[#FF6B35]/20 backdrop-blur border border-[#FF6B35]/30 text-xs font-bold text-[#FF6B35]">
                                {formatBudget(lead.budget)}
                            </div>
                        </motion.div>

                        {/* AI INSIGHT BUBBLE */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-800/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                    <span className="text-[8px] font-bold">AI</span>
                                </div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Navrit Insight</span>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                "They just asked about the downpayment for the {lead.carModel}.
                                <span className="text-emerald-400 font-semibold"> High buying intent.</span> Recommend calling now."
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="h-28 bg-black px-5 flex items-center gap-3 pb-6 pt-3">
                    <div className="flex-1 h-12 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center px-4 text-zinc-500 text-sm">
                        Reply to {lead.name.split(' ')[0]}...
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-black shadow-lg shadow-[#FF6B35]/30"
                    >
                        <Phone size={20} fill="currentColor" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-black"
                    >
                        <MessageSquare size={20} />
                    </motion.button>
                </div>

                {/* SWIPE HINT */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
                    <ChevronUp size={20} className="text-white/30 animate-bounce" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StoryViewer;
