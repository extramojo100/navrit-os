import { useState } from 'react';
import { ChevronRight, Zap, Car, MapPin, Clock } from 'lucide-react';

interface Journey {
    model: string;
    status: string;
    price: number;
    workflow?: {
        current: number;
        steps: Array<{ label: string; tat: string; isOverdue?: boolean }>;
    };
}

interface Lead {
    id: string;
    name: string;
    phone: string;
    location?: string;
    daysLastActive: number;
    multiplier: number;
    journeys: Journey[];
}

interface ProCardProps {
    lead: Lead;
    onOpen: (lead: Lead) => void;
}

export const ProCard = ({ lead, onOpen }: ProCardProps) => {
    const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
    const activeJourney = lead.journeys[activeJourneyIndex];

    // "Business Empathy": Manager Alert for stagnant leads
    const isStagnant = lead.daysLastActive > 2;

    const handleSwipe = () => {
        // Simple swipe to cycle through journeys
        setActiveJourneyIndex((prev) => (prev + 1) % lead.journeys.length);
    };

    return (
        <div
            onClick={() => onOpen(lead)}
            className="bg-[#09090B] border-b border-white/5 active:bg-[#121212] transition-colors relative group cursor-pointer"
        >
            {/* UNIFORM LAYOUT CONTAINER - FIXED HEIGHT */}
            <div className="p-4 flex gap-4 h-[110px]">

                {/* LEFT: STATUS & AVATAR */}
                <div className="flex flex-col items-center justify-between w-12 flex-shrink-0">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                            {lead.name.charAt(0)}
                        </div>
                        {/* Stagnant Warning for Manager */}
                        {isStagnant && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                                <Clock size={8} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* Multi-Journey Indicators */}
                    {lead.journeys.length > 1 && (
                        <div className="flex gap-1">
                            {lead.journeys.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeJourneyIndex ? 'bg-white' : 'bg-zinc-700'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CENTER: CAROUSEL CONTENT */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-bold text-white leading-none">{lead.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
                                <MapPin size={10} /> {lead.location || 'Showroom Walk-in'}
                            </div>
                        </div>
                        {/* THE INCENTIVE BADGE */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Zap size={10} fill="currentColor" /> {lead.multiplier}x
                        </div>
                    </div>

                    {/* The Active Deal (Swipeable Area) */}
                    <div
                        className="flex items-center gap-3 mt-1"
                        onTouchEnd={handleSwipe}
                    >
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-zinc-700 to-black flex items-center justify-center">
                            <Car size={14} className="text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white truncate">{activeJourney.model}</div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-2">
                                <span>{activeJourney.status}</span>
                                <span className="w-px h-2 bg-zinc-700" />
                                <span>₹{(activeJourney.price / 100000).toFixed(2)}L</span>
                            </div>
                        </div>
                        {lead.journeys.length > 1 && <ChevronRight size={14} className="text-zinc-600" />}
                    </div>
                </div>
            </div>
        </div>
    );
};
