import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Phone, Ghost, CheckCircle2, Clock } from 'lucide-react';

interface Journey {
    model: string;
    stock: 'YARD' | 'TRANSIT' | 'ORDER';
    color: string;
    exShowroom: number;
    discount: number;
    insurance: number;
    accessories: number;
    commission: number;
    logs: Array<{ actor: string; msg: string; time: string }>;
}

interface Lead {
    id: string;
    name: string;
    phone: string;
    tags: Record<string, string>;
    journeys: Journey[];
}

interface LeadRowProps {
    lead: Lead;
    onGhost: (id: string) => void;
    onCall: (id: string) => void;
    onOpen: (lead: Lead) => void;
}

export const LeadRow = ({ lead, onGhost, onCall, onOpen }: LeadRowProps) => {
    const x = useMotionValue(0);
    const bg = useTransform(x, [-100, 0, 100], ['#EF4444', '#09090B', '#10B981']);
    const opacity = useTransform(x, [-100, 0, 100], [1, 0, 1]);

    const bind = useDrag(({ movement: [mx], active }) => {
        x.set(mx);
        if (!active) {
            if (mx > 100) { onCall(lead.id); x.set(0); }
            else if (mx < -100) { onGhost(lead.id); x.set(0); }
            else x.set(0);
        }
    }, { axis: 'x', filterTaps: true });

    const activeJourney = lead.journeys[0];
    const stockColor = activeJourney.stock === 'YARD' ? 'text-emerald-500' : 'text-blue-500';

    // Extract gesture handlers, excluding conflicting event handlers
    const { onDrag, onDragStart, onDragEnd, ...gestureHandlers } = bind() as any;

    return (
        <div className="relative mb-1 group">
            {/* BACKGROUND ACTIONS */}
            <motion.div style={{ backgroundColor: bg }} className="absolute inset-0 rounded-xl flex justify-between items-center px-6 z-0">
                <motion.div style={{ opacity }} className="flex items-center gap-2 text-black font-bold text-[10px] uppercase tracking-widest">
                    <Phone size={16} fill="currentColor" /> Call
                </motion.div>
                <motion.div style={{ opacity }} className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest">
                    Ghost Protocol <Ghost size={16} fill="currentColor" />
                </motion.div>
            </motion.div>

            {/* FOREGROUND CARD */}
            <motion.div
                {...gestureHandlers}
                style={{ x, touchAction: 'none' }}
                onClick={() => onOpen(lead)}
                className="relative z-10 bg-[#09090B] p-4 flex gap-4 border-b border-white/5 active:bg-[#121212] cursor-pointer"
            >
                {/* AVATAR & SIGNAL */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white font-bold text-lg">
                        {lead.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#09090B] flex items-center justify-center border border-[#09090B]">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeJourney.stock === 'YARD' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    </div>
                </div>

                {/* DATA BLOCK */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-[15px] font-bold text-white truncate">{lead.name}</h3>
                        <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                            <span className="text-[9px] text-zinc-600 uppercase mr-1">Comm</span>
                            ₹{(activeJourney.commission / 1000).toFixed(1)}k
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="text-white font-medium">{activeJourney.model}</span>
                        <span className="text-zinc-600">•</span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${stockColor}`}>
                            {activeJourney.stock === 'YARD' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {activeJourney.stock}
                        </span>
                    </div>

                    {/* DYNAMIC TAGS */}
                    <div className="flex gap-1 mt-2">
                        {Object.entries(lead.tags).slice(0, 3).map(([k, v]) => (
                            <span key={k} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-zinc-500 font-medium uppercase tracking-wide">
                                {v}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
