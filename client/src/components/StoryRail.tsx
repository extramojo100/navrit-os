// client/src/components/StoryRail.tsx
// NAVRIT SOCIAL OS - Stories Rail with click handlers

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    confidence: number;
}

interface StoryRailProps {
    leads: Lead[];
    onOpenStory: (lead: Lead) => void;
}

export const StoryRail = ({ leads, onOpenStory }: StoryRailProps) => {
    // Sort by confidence, take top 6
    const storyLeads = [...leads]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 6);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 no-scrollbar">
            {/* ADD NEW CIRCLE */}
            <div className="flex flex-col items-center gap-2 min-w-[70px]">
                <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center relative opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-[60px] h-[60px] rounded-full bg-zinc-800 flex items-center justify-center">
                        <Plus size={24} className="text-white" />
                    </div>
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">New</span>
            </div>

            {/* LEAD CIRCLES */}
            {storyLeads.map((lead, i) => {
                const isHot = lead.confidence >= 0.85;
                const isWarm = lead.confidence >= 0.5;

                const ringColor = isHot
                    ? 'bg-gradient-to-tr from-emerald-400 to-emerald-600'
                    : isWarm
                        ? 'bg-gradient-to-tr from-[#FF6B35] to-amber-500'
                        : 'bg-gradient-to-tr from-red-500 to-red-600';

                return (
                    <motion.div
                        key={lead.id}
                        onClick={() => onOpenStory(lead)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                        className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group"
                    >
                        <div className={`w-[72px] h-[72px] rounded-full p-[2.5px] ${ringColor} relative group-active:scale-95 transition-transform`}>
                            <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden relative flex items-center justify-center">
                                <span className="text-lg font-bold text-white">{lead.name.charAt(0)}</span>
                                {/* Confidence Badge */}
                                <div className="absolute bottom-0 w-full text-[8px] text-center font-bold bg-black/70 text-white py-0.5">
                                    {(lead.confidence * 100).toFixed(0)}%
                                </div>
                            </div>
                            {/* Live Indicator for hot leads */}
                            {isHot && (
                                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
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
