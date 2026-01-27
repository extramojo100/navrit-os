// client/src/components/KillerCard.tsx
// NAVRIT KILLER OS - Tinder-Style Swipeable Card
// Focus on ONE deal at a time

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Car, Clock, MapPin, Zap } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    probability: number;
    carModel: string;
    variant: string;
    color: string;
    daysInStock: number;
    location: string;
    commission: number;
    offerPrice: number;
    financier: string;
    emi: string;
    tradeInValue: number | string;
    tradeInCar: string;
}

interface RowProps {
    label: string;
    value: number | string;
    sub?: string;
    highlight?: boolean;
    icon?: React.ReactNode;
}

const Row = ({ label, value, sub, highlight, icon }: RowProps) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-zinc-400">{label}</span>
        </div>
        <div className="text-right">
            <div className={`text-base font-bold font-mono ${highlight ? 'text-emerald-400' : 'text-white'}`}>
                {typeof value === 'number' ? `₹${(value / 1000).toFixed(0)}k` : value}
            </div>
            {sub && <div className="text-[10px] text-zinc-500">{sub}</div>}
        </div>
    </div>
);

export const KillerCard = ({
    lead,
    onSwipe,
    index,
    onClick
}: {
    lead: Lead;
    onSwipe: (dir: 'left' | 'right') => void;
    index: number;
    onClick: () => void;
}) => {
    // Only render top 2 cards for performance
    if (index > 1) return null;

    const isFront = index === 0;
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);

    // Stock age urgency
    const isOldStock = lead.daysInStock > 60;
    const stockColor = isOldStock ? 'text-red-500' : 'text-emerald-400';
    const bountyColor = lead.commission > 5000 ? 'bg-[#FF6B35]' : 'bg-zinc-700';

    const handleDragEnd = (_: any, { offset }: { offset: { x: number } }) => {
        if (offset.x > 100) onSwipe('right');
        else if (offset.x < -100) onSwipe('left');
    };

    return (
        <motion.div
            style={{
                x: isFront ? x : 0,
                rotate: isFront ? rotate : 0,
                zIndex: 10 - index,
                scale: 1 - index * 0.05,
                y: index * 10
            }}
            drag={isFront ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onClick={onClick}
            className="absolute top-0 left-0 w-full h-[65vh] bg-[#121212] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col cursor-pointer"
        >
            {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO HEADER (The Metal)
          ═══════════════════════════════════════════════════════════════════════ */}
            <div className="h-[40%] bg-gradient-to-br from-zinc-800 to-black relative p-4 flex flex-col justify-between">
                {/* Top Badges */}
                <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <Clock size={12} className={stockColor} />
                        <span className="text-xs font-bold text-white">{lead.daysInStock} Days</span>
                    </div>
                    <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <MapPin size={12} className="text-zinc-400" />
                        <span className="text-xs text-zinc-300">{lead.location}</span>
                    </div>
                </div>

                {/* Car Visual */}
                <div className="self-center text-center">
                    <Car size={100} className="text-white/10 mx-auto" />
                    <h2 className="text-2xl font-black text-white italic tracking-tighter mt-2">
                        {lead.carModel}
                    </h2>
                    <p className="text-sm text-zinc-400 font-mono">
                        {lead.variant} • {lead.color}
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
          2. THE DEAL STACK (Finance & Profit)
          ═══════════════════════════════════════════════════════════════════════ */}
            <div className="flex-1 p-5 bg-[#09090B]">
                {/* The Bounty */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                        <div className="text-xs text-zinc-500 font-mono">
                            Win Prob: {(lead.probability * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div className={`${bountyColor} px-4 py-2 rounded-xl flex flex-col items-center shadow-lg`}>
                        <span className="text-[10px] font-bold text-black/60 uppercase">Commission</span>
                        <span className="text-lg font-black text-white">₹{lead.commission.toLocaleString()}</span>
                    </div>
                </div>

                {/* The Math */}
                <div className="space-y-3">
                    <Row label="Offer Price" value={lead.offerPrice} />
                    <Row
                        label="Financier"
                        value={lead.financier}
                        sub={`${lead.emi}/mo`}
                        icon={<Zap size={12} className="text-yellow-400" />}
                    />
                    <Row
                        label="Trade-In"
                        value={lead.tradeInValue}
                        sub={lead.tradeInCar}
                        highlight={typeof lead.tradeInValue === 'number'}
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
          3. SWIPE HINTS
          ═══════════════════════════════════════════════════════════════════════ */}
            <div className="h-14 bg-zinc-900 border-t border-white/5 flex items-center justify-between px-8 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <span>← Snooze</span>
                <span className="text-white/40">Tap for War Room</span>
                <span>Call →</span>
            </div>
        </motion.div>
    );
};

export default KillerCard;
