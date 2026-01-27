// client/src/components/StoryRail.tsx
// SOCIAL NATIVE - Instagram/Snapchat Stories Rail

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    confidence: number;
}

export const StoryRail = ({ leads }: { leads: Lead[] }) => {
    // Filter only Hot/Warm leads for Stories
    const storyLeads = leads.filter(l => l.confidence > 0.5).slice(0, 6);

    return (
        <div className="flex gap-4 overflow-x-auto pb-3 px-4 no-scrollbar">
            {/* 1. "ADD LEAD" Story */}
            <div className="flex flex-col items-center gap-2 min-w-[70px]">
                <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-white/20 flex items-center justify-center relative">
                    <div className="w-[60px] h-[60px] rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={24} className="text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#FF6B35] rounded-full p-1 border-2 border-black">
                        <Plus size={10} className="text-black font-bold" />
                    </div>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">New Lead</span>
            </div>

            {/* 2. HOT LEADS (Stories) */}
            {storyLeads.map((lead, i) => {
                const isSuperHot = lead.confidence > 0.85;
                const ringColor = isSuperHot
                    ? 'bg-gradient-to-tr from-emerald-500 to-emerald-400'
                    : 'bg-gradient-to-tr from-amber-500 to-yellow-400';

                return (
                    <motion.div
                        key={lead.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                        className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group"
                    >
                        <div className={`w-[72px] h-[72px] rounded-full p-[2.5px] ${ringColor} relative`}>
                            <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden relative">
                                {/* Avatar */}
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-lg font-bold text-white">
                                    {lead.name.charAt(0)}
                                </div>
                                {/* Confidence Badge */}
                                <div className="absolute bottom-0 w-full text-[8px] text-center font-bold bg-black/70 backdrop-blur-md text-white py-0.5">
                                    {(lead.confidence * 100).toFixed(0)}%
                                </div>
                            </div>
                            {/* Live Indicator */}
                            {isSuperHot && (
                                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse" />
                            )}
                        </div>
                        <span className="text-[11px] text-white font-medium truncate max-w-[70px] group-hover:text-[#FF6B35] transition-colors">
                            {lead.name.split(' ')[0]}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default StoryRail;
