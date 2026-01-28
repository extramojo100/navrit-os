import { ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Journey {
    model: string;
    stage: string;
    stockStatus: 'YARD' | 'TRANSIT' | 'ORDER';
    price: number;
    netPrice: number;
}

interface Lead {
    id: string;
    name: string;
    temperature: 'HOT' | 'COLD' | 'WARM';
    commissionEst: number;
    journeys: Journey[];
}

interface ProRowProps {
    lead: Lead;
    onClick: () => void;
}

export const ProRow = ({ lead, onClick }: ProRowProps) => {
    const activeJourney = lead.journeys[0];

    return (
        <div
            onClick={onClick}
            className="h-[88px] bg-[#050505] border-b border-white/5 flex items-center px-4 gap-4 active:bg-[#111] transition-colors cursor-pointer group"
        >
            {/* 1. IDENTITY (Fixed Left) */}
            <div className="w-12 flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-white group-hover:border-[#FF6B35]/50 transition-colors">
                    {lead.name.charAt(0)}
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${lead.temperature === 'HOT' ? 'bg-[#EF4444]' :
                        lead.temperature === 'WARM' ? 'bg-[#F59E0B]' :
                            'bg-[#3B82F6]'
                    }`} />
            </div>

            {/* 2. CONTEXT (Fluid Center) */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-[15px] font-bold text-white truncate">{lead.name}</h3>
                    {/* COMMISSION BADGE */}
                    <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-500 font-mono font-bold">₹{(lead.commissionEst / 1000).toFixed(1)}k</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="text-zinc-300 font-medium">{activeJourney.model}</span>
                    <span className="w-px h-2 bg-zinc-800" />
                    <span className="uppercase text-[10px] tracking-wide">{activeJourney.stage.replace('_', ' ')}</span>
                </div>

                {/* STOCK STATUS */}
                <div className="flex items-center gap-1 text-[10px] text-zinc-600 mt-0.5">
                    {activeJourney.stockStatus === 'YARD' ? (
                        <CheckCircle2 size={10} className="text-emerald-500" />
                    ) : activeJourney.stockStatus === 'TRANSIT' ? (
                        <Clock size={10} className="text-blue-500" />
                    ) : (
                        <AlertTriangle size={10} className="text-amber-500" />
                    )}
                    <span>{activeJourney.stockStatus}</span>
                </div>
            </div>

            {/* 3. ARROW (Fixed Right) */}
            <ChevronRight size={16} className="text-zinc-700" />
        </div>
    );
};
