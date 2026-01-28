import { Phone, MessageSquare, FileText, Zap } from 'lucide-react';

interface ActionDockProps {
    onCall?: () => void;
    onWhatsApp?: () => void;
    onQuote?: () => void;
    onClose?: () => void;
}

export const ActionDock = ({ onCall, onWhatsApp, onQuote, onClose }: ActionDockProps) => {
    return (
        <div className="grid grid-cols-4 gap-2 p-4 bg-[#09090B] border-t border-white/10">
            <button
                onClick={onCall}
                className="flex flex-col items-center gap-1 p-3 bg-zinc-900 rounded-xl active:scale-95 transition-transform text-white hover:bg-zinc-800"
            >
                <Phone size={20} />
                <span className="text-[10px] font-bold uppercase">Call</span>
            </button>
            <button
                onClick={onWhatsApp}
                className="flex flex-col items-center gap-1 p-3 bg-zinc-900 rounded-xl active:scale-95 transition-transform text-emerald-400 hover:bg-zinc-800"
            >
                <MessageSquare size={20} />
                <span className="text-[10px] font-bold uppercase">WA</span>
            </button>
            <button
                onClick={onQuote}
                className="flex flex-col items-center gap-1 p-3 bg-zinc-900 rounded-xl active:scale-95 transition-transform text-blue-400 hover:bg-zinc-800"
            >
                <FileText size={20} />
                <span className="text-[10px] font-bold uppercase">Quote</span>
            </button>
            <button
                onClick={onClose}
                className="flex flex-col items-center gap-1 p-3 bg-[#FF6B35] rounded-xl active:scale-95 transition-transform text-black shadow-lg shadow-orange-900/20 hover:bg-[#FF8555]"
            >
                <Zap size={20} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase">Close</span>
            </button>
        </div>
    );
};
