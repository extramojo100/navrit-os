import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReceiptMath } from './ReceiptMath';
import { Bot, User, X, Phone, MessageSquare } from 'lucide-react';

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
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">ID: {lead.id} • {lead.phone}</div>
                </div>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:bg-zinc-700 transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* TABS (Multi-Journey) */}
            <div className="px-4 py-3 bg-[#09090B] flex gap-2 overflow-x-auto">
                {lead.journeys.map((j, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${activeTab === i ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-transparent'
                            }`}
                    >
                        {j.model}
                    </button>
                ))}
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* 1. VERTICAL MATH */}
                <ReceiptMath journey={journey} />

                {/* 2. DYNAMIC TAGS (Aggregator) */}
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(lead.tags).map(([k, v]) => (
                        <div key={k} className="bg-zinc-900/50 p-2 rounded border border-white/5">
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest">{k}</div>
                            <div className="text-xs text-zinc-300 font-medium truncate">{v}</div>
                        </div>
                    ))}
                </div>

                {/* 3. EXECUTION LOG */}
                <div className="space-y-3">
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Live Execution</div>
                    {journey.logs.map((log, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                {log.actor === 'AI' ? <Bot size={14} className="text-zinc-600" /> : <User size={14} className="text-[#FF6B35]" />}
                                <div className="h-full w-px bg-zinc-800 my-1" />
                            </div>
                            <div className="pb-2">
                                <div className={`text-xs ${log.actor === 'HUMAN' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                                    {log.msg}
                                </div>
                                <div className="text-[10px] text-zinc-600 font-mono">{log.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
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
