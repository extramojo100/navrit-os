import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Phone, Ghost, Zap, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { Lead } from '../services/MockEngine';

interface ProRowProps {
    lead: Lead & { lastLog: string; signal: 'HOT' | 'WARM' };
    onOpen: (lead: ProRowProps['lead']) => void;
}

export const ProRow = ({ lead, onOpen }: ProRowProps) => {
    const x = useMotionValue(0);
    const bg = useTransform(x, [-100, 0, 100], ['#E54D2E', '#080808', '#2EB88A']);
    const actionOpacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 0.5, 0, 0.5, 1]);

    const bind = useDrag(({ movement: [mx], active }) => {
        x.set(active ? mx : 0);
    }, { axis: 'x', filterTaps: true });

    const activeJourney = lead.journeys[0];
    const { onDrag, onDragStart, onDragEnd, ...gestureHandlers } = bind() as Record<string, unknown>;

    return (
        <div className="relative border-b border-border h-[88px] overflow-hidden group">
            {/* BACKGROUND ACTIONS */}
            <motion.div style={{ backgroundColor: bg }} className="absolute inset-0 flex justify-between items-center px-6">
                <motion.div style={{ opacity: actionOpacity }} className="text-xxs font-bold uppercase text-white flex items-center gap-1">
                    <Ghost size={12} /> Ghost Protocol
                </motion.div>
                <motion.div style={{ opacity: actionOpacity }} className="text-xxs font-bold uppercase text-black flex items-center gap-1">
                    <Phone size={12} /> Call Now
                </motion.div>
            </motion.div>

            {/* FOREGROUND CARD (Fixed Grid) */}
            <motion.div
                {...gestureHandlers}
                style={{ x, touchAction: 'none' }}
                onClick={() => onOpen(lead)}
                className="relative h-full bg-bg hover:bg-surface transition-colors flex items-center px-4 gap-4 cursor-pointer"
            >
                {/* COL 1: IDENTITY (Fixed 48px) */}
                <div className="w-12 flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-sm font-bold text-text">
                        {lead.avatar}
                    </div>
                    {/* Signal Dot */}
                    <div className={`w-1.5 h-1.5 rounded-full ${lead.signal === 'HOT' ? 'bg-danger' : 'bg-warning'}`} />
                </div>

                {/* COL 2: CONTEXT (Fluid) */}
                <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-2">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold text-text truncate">{lead.name}</h3>
                        {/* COMMISSION BADGE */}
                        <div className="flex items-center gap-1.5 text-success">
                            <span className="text-xxs font-mono text-muted uppercase">Comm</span>
                            <span className="text-xs font-mono font-bold">₹{(lead.commission.amount / 1000).toFixed(1)}k</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted mb-1.5">
                        <span className="text-text font-medium">{activeJourney.model}</span>
                        <span className="text-border">•</span>
                        <span className="flex items-center gap-1">
                            {activeJourney.stock.status === 'YARD' ? (
                                <CheckCircle2 size={10} className="text-success" />
                            ) : activeJourney.stock.status === 'TRANSIT' ? (
                                <Clock size={10} className="text-primary" />
                            ) : (
                                <AlertTriangle size={10} className="text-warning" />
                            )}
                            <span className="text-xxs uppercase tracking-wide">{activeJourney.stock.status}</span>
                            {activeJourney.stock.age > 0 && (
                                <span className={`text-xxs ${activeJourney.stock.age > 60 ? 'text-danger' : 'text-muted'}`}>
                                    ({activeJourney.stock.age}d)
                                </span>
                            )}
                        </span>
                    </div>

                    {/* DYNAMIC LOG */}
                    <div className="text-xxs text-muted truncate flex items-center gap-1.5">
                        <Zap size={10} className="text-primary" />
                        {lead.lastLog}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
