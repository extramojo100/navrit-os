// client/src/components/LeadCard.tsx
// IRON MAN HUD - Operationally Dense Lead Card
// 3-Column Layout: Product/Stock | Deal | Action Relay

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot, User, CheckCircle2, MapPin,
    Calendar, Shield, PenTool, Truck
} from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    status: string;
    carModel: string;
    carColor: string;
    stockLocation?: string;
    exShowroom?: number;
    discount?: number;
    accessories?: number;
    insurance?: number;
    servicePkg?: number;
    netPrice?: number;
}

// Deal Breakdown Cell
const DealBit = ({ label, val, icon }: { label: string; val?: number; icon?: React.ReactNode }) => (
    <div className="bg-[#09090B] p-2 flex flex-col items-center justify-center">
        <div className="text-[9px] text-zinc-500 mb-0.5 flex items-center gap-1">
            {icon} {label}
        </div>
        <div className="text-[11px] font-mono font-medium text-zinc-200">
            {val ? `₹${(val / 1000).toFixed(0)}k` : '-'}
        </div>
    </div>
);

export const LeadCard = ({ lead }: { lead: Lead }) => {
    const [expanded, setExpanded] = useState(false);

    // TURN LOGIC: 
    // APPOINTMENT_SET, ENGAGED, NEGOTIATING = Human's turn
    // NEW, QUALIFYING = AI working
    const isHumanTurn = ['APPOINTMENT_SET', 'ENGAGED', 'NEGOTIATING'].includes(lead.status);
    const statusColor = isHumanTurn ? 'border-l-[#FF6B35]' : 'border-l-emerald-500';

    // Stock status
    const isInStock = !lead.stockLocation?.includes('Transit');

    // Calculate net price if not provided
    const netPrice = lead.netPrice || (
        (lead.exShowroom || 0) -
        (lead.discount || 0) +
        (lead.accessories || 0) +
        (lead.insurance || 0) +
        (lead.servicePkg || 0)
    );

    return (
        <motion.div
            layout
            className={`bg-[#09090B] border-t border-r border-b border-white/10 border-l-[4px] ${statusColor} rounded-r-xl mb-2 overflow-hidden shadow-sm`}
        >
            {/* ═══════════════════════════════════════════════════════════════════════
          TOP ROW: THE "HEADS UP" SUMMARY (3 Columns)
          ═══════════════════════════════════════════════════════════════════════ */}
            <div
                className="flex items-stretch min-h-[80px] cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >

                {/* COL 1: PRODUCT & STOCK */}
                <div className="flex-1 p-3 border-r border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-white leading-none">{lead.carModel}</span>
                            <div
                                className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: lead.carColor }}
                            />
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-1">
                            {lead.name} • VIN: ...8X92
                        </div>
                    </div>

                    {/* STOCK STATUS */}
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${isInStock
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            }`}>
                            {isInStock ? <CheckCircle2 size={8} /> : <Truck size={8} />}
                            {isInStock ? 'In Stock' : 'Transit'}
                        </div>
                        <span className="text-[9px] text-zinc-400 flex items-center gap-0.5">
                            <MapPin size={8} /> {lead.stockLocation || 'Yard B'}
                        </span>
                    </div>
                </div>

                {/* COL 2: THE DEAL STACK */}
                <div className="w-[100px] p-2 border-r border-white/5 bg-white/[0.02] flex flex-col justify-center items-end">
                    <div className="text-[9px] text-zinc-500 uppercase font-medium">Net Offer</div>
                    <div className="text-[14px] font-mono font-bold text-[#FF6B35]">
                        ₹{(netPrice / 100000).toFixed(2)}L
                    </div>
                    {lead.discount && lead.discount > 0 && (
                        <div className="text-[8px] text-emerald-400 mt-0.5 text-right">
                            -₹{(lead.discount / 1000).toFixed(0)}k Disc
                        </div>
                    )}
                </div>

                {/* COL 3: THE RELAY (AI vs Human Turn) */}
                <div className="w-[90px] p-2 flex flex-col justify-center items-center relative">
                    {isHumanTurn ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-black mb-1 shadow-[0_0_12px_rgba(255,107,53,0.4)] animate-pulse">
                                <User size={16} fill="currentColor" />
                            </div>
                            <span className="text-[9px] font-bold text-[#FF6B35] uppercase">Your Turn</span>
                        </>
                    ) : (
                        <>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
                                <Bot size={16} />
                            </div>
                            <span className="text-[9px] font-bold text-emerald-500 uppercase">N Working</span>
                        </>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
          EXPANDED: THE DEEP DIVE
          ═══════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/10 bg-black"
                    >
                        {/* DEAL CALCULATOR */}
                        <div className="grid grid-cols-4 gap-px bg-white/10 border-b border-white/10">
                            <DealBit label="Ex-Showroom" val={lead.exShowroom} />
                            <DealBit label="Insurance" val={lead.insurance} icon={<Shield size={8} />} />
                            <DealBit label="Accessories" val={lead.accessories} icon={<PenTool size={8} />} />
                            <DealBit label="3yr Service" val={lead.servicePkg} icon={<Calendar size={8} />} />
                        </div>

                        {/* EXECUTION LOG */}
                        <div className="p-3 space-y-3">
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                                Execution Log
                            </div>

                            {/* AI ACTION: Auto-Done */}
                            <div className="flex gap-3 opacity-60">
                                <div className="flex flex-col items-center">
                                    <Bot size={12} className="text-emerald-500" />
                                    <div className="h-full w-px bg-white/10 my-1" />
                                </div>
                                <div>
                                    <div className="text-[11px] text-zinc-300">Auto-Sent Brochure & Stock Update</div>
                                    <div className="text-[9px] text-zinc-600 font-mono">10:00 AM • WhatsApp API</div>
                                </div>
                            </div>

                            {/* AI ACTION: Auto-Done */}
                            <div className="flex gap-3 opacity-80">
                                <div className="flex flex-col items-center">
                                    <Bot size={12} className="text-emerald-500" />
                                    <div className="h-full w-px bg-white/10 my-1" />
                                </div>
                                <div>
                                    <div className="text-[11px] text-zinc-300">Answered: "Yes, White is in Transit"</div>
                                    <div className="text-[9px] text-zinc-600 font-mono">10:02 AM • Inventory DB</div>
                                </div>
                            </div>

                            {/* HUMAN ACTION: Required */}
                            {isHumanTurn && (
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full border-2 border-[#FF6B35] bg-black animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[12px] font-bold text-white">Approve Final Quote & Call</div>
                                        <div className="text-[10px] text-[#FF6B35] mt-1">Customer is online now.</div>

                                        {/* QUICK ACTIONS */}
                                        <div className="flex gap-2 mt-3">
                                            <button className="flex-1 bg-[#FF6B35] text-black text-[11px] font-bold py-2.5 rounded uppercase hover:bg-[#E85A24] transition-colors">
                                                Call Now
                                            </button>
                                            <button className="flex-1 bg-white/10 text-white text-[11px] font-bold py-2.5 rounded uppercase border border-white/10 hover:bg-white/20 transition-colors">
                                                Send Quote
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LeadCard;
