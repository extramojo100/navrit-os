import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Journey {
    model?: string;
}

interface Lead {
    id: string;
    name: string;
    status: string;
    temperature: string;
    commission_est: number;
    journeys?: Journey[];
}

interface ProRowProps {
    lead: Lead;
    onClick: () => void;
}

export const ProRow: React.FC<ProRowProps> = ({ lead, onClick }) => {
    // Fallback if data is missing (Safety)
    const journey = lead.journeys?.[0] || {};

    return (
        <div
            onClick={onClick}
            className="h-[88px] w-full bg-[#050505] border-b border-white/5 flex items-center px-4 gap-4 active:bg-[#111] transition-colors cursor-pointer"
        >
            {/* 1. IDENTITY (Fixed) */}
            <div className="w-12 flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                    {lead.name.charAt(0)}
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${lead.temperature === 'HOT' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`} />
            </div>

            {/* 2. CONTEXT (Fluid) */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-[15px] font-bold text-white truncate">{lead.name}</h3>

                    {/* COMMISSION BADGE */}
                    <div className="bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <span className="text-[11px] text-emerald-500 font-mono font-bold">₹{(lead.commission_est / 1000).toFixed(1)}k</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="text-zinc-300 font-medium">{journey.model || 'Unknown Model'}</span>
                    <span className="w-px h-2 bg-zinc-800" />
                    <span className="uppercase text-[10px] tracking-wide bg-white/5 px-1 rounded text-zinc-400">
                        {lead.status}
                    </span>
                </div>
            </div>

            <ChevronRight size={16} className="text-zinc-700" />
        </div>
    );
};
