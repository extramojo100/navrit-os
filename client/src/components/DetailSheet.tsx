import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, X, Phone, MessageSquare, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { Lead } from '../services/MockEngine';

interface DetailSheetProps {
    lead: Lead;
    onClose: () => void;
}

export const DetailSheet = ({ lead, onClose }: DetailSheetProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const journey = lead.journeys[activeTab];

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-[#000] flex flex-col"
        >
            {/* HEADER */}
            <div className="p-4 flex justify-between items-center bg-[#09090B] border-b border-white/5">
                <div>
                    <h2 className="text-lg font-bold text-white leading-none">{lead.name}</h2>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">{lead.phone} • {lead.location}</div>
                </div>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:bg-zinc-700 transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* TABS (Multi-Journey) */}
            <div className="px-4 py-3 bg-[#09090B] flex gap-2 overflow-x-auto border-b border-white/5">
                {lead.journeys.map((j, i) => (
                    <button
                        key={j.id}
                        onClick={() => setActiveTab(i)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${activeTab === i ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-transparent'
                            }`}
                    >
                        {j.model}
                    </button>
                ))}
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* DEAL SUMMARY */}
                <div className="bg-[#121212] rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Current Status</div>
                            <div className="text-sm font-bold text-white mt-1">{journey.status.replace(/_/g, ' ')}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${journey.stock.status === 'YARD' ? 'bg-emerald-500/20 text-emerald-400' :
                            journey.stock.status === 'TRANSIT' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-amber-500/20 text-amber-400'
                            }`}>
                            {journey.stock.status === 'YARD' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {journey.stock.status}
                            {journey.stock.age > 0 && ` (${journey.stock.age}d)`}
                        </div>
                    </div>
                    {journey.stock.vin && (
                        <div className="text-[10px] text-zinc-600 font-mono">VIN: {journey.stock.vin}</div>
                    )}
                </div>

                {/* VERTICAL MATH (Receipt) */}
                <div className="bg-[#121212] rounded-xl p-4 font-mono text-xs border border-white/5">
                    <div className="space-y-1">
                        <div className="flex justify-between text-zinc-400">
                            <span>Ex-Showroom</span>
                            <span>₹{journey.financials.exShowroom.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-400">
                            <span>Less: Discount</span>
                            <span>- ₹{journey.financials.discount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                            <span>Add: Insurance</span>
                            <span>+ ₹{journey.financials.insurance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                            <span>Add: Accessories</span>
                            <span>+ ₹{journey.financials.accessories.toLocaleString()}</span>
                        </div>
                        <div className="my-2 border-t border-dashed border-zinc-700"></div>
                        <div className="flex justify-between text-sm font-bold text-white">
                            <span>NET OFFER</span>
                            <span>₹ {(journey.financials.net / 100000).toFixed(2)}L</span>
                        </div>
                    </div>

                    {/* Commission */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-600">Your Commission</span>
                            <span className="ml-2 text-[10px] text-emerald-400 font-bold">{lead.commission.multiplier}x</span>
                        </div>
                        <span className="text-emerald-400 font-bold">₹ {lead.commission.amount.toLocaleString()}</span>
                    </div>
                </div>

                {/* WORKFLOW TRACKER */}
                {journey.workflow && (
                    <div className="bg-[#121212] rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Process Status</span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                                Step {journey.workflow.currentStep + 1}/{journey.workflow.steps.length}
                            </span>
                        </div>

                        <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 right-0 top-3 h-0.5 bg-zinc-800 -z-10" />
                            <div
                                className="absolute left-0 top-3 h-0.5 bg-emerald-500 -z-10 transition-all duration-500"
                                style={{ width: `${(journey.workflow.currentStep / (journey.workflow.steps.length - 1)) * 100}%` }}
                            />

                            {journey.workflow.steps.map((step, i) => {
                                const isDone = step.status === 'DONE';
                                const isLate = step.status === 'LATE';
                                const isCurrent = i === journey.workflow!.currentStep;

                                return (
                                    <div key={i} className="flex flex-col items-center relative">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-black' :
                                            isLate ? 'bg-red-500 border-red-500 animate-pulse text-white' :
                                                isCurrent ? 'bg-black border-white text-white' :
                                                    'bg-zinc-900 border-zinc-700 text-zinc-600'
                                            }`}>
                                            {isDone ? <CheckCircle2 size={12} /> : isLate ? <AlertTriangle size={10} /> : <span className="text-[9px] font-bold">{i + 1}</span>}
                                        </div>
                                        <div className={`absolute top-8 text-center w-14 ${isCurrent || isLate ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`text-[8px] font-bold leading-tight ${isLate ? 'text-red-400' : 'text-white'}`}>{step.label}</div>
                                            <div className={`text-[7px] ${isLate ? 'text-red-400' : 'text-zinc-500'}`}>{step.tat}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-8" />
                    </div>
                )}

                {/* EXECUTION LOG */}
                {journey.logs.length > 0 && (
                    <div className="space-y-3">
                        <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Activity Log</div>
                        {journey.logs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    {log.actor === 'AI' ? <Bot size={14} className="text-zinc-600" /> :
                                        log.actor === 'CUSTOMER' ? <User size={14} className="text-blue-400" /> :
                                            log.actor === 'SYSTEM' ? <AlertTriangle size={14} className="text-amber-400" /> :
                                                <User size={14} className="text-[#FF6B35]" />}
                                    <div className="h-full w-px bg-zinc-800 my-1" />
                                </div>
                                <div className="pb-2 flex-1">
                                    <div className={`text-xs ${log.actor === 'HUMAN' ? 'text-white font-bold' :
                                        log.sentiment === 'NEGATIVE' ? 'text-red-400' :
                                            'text-zinc-400'
                                        }`}>
                                        {log.msg}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 font-mono">{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ACTION DOCK */}
            <div className="p-4 bg-[#09090B] border-t border-white/10 grid grid-cols-2 gap-3">
                <button className="bg-[#FF6B35] text-black h-12 rounded-xl font-bold flex items-center justify-center gap-2 uppercase text-xs hover:bg-[#FF8555] transition-colors">
                    <Phone size={18} /> Call Now
                </button>
                <button className="bg-zinc-800 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 uppercase text-xs border border-white/5 hover:bg-zinc-700 transition-colors">
                    <MessageSquare size={18} /> WhatsApp
                </button>
            </div>
        </motion.div>
    );
};
