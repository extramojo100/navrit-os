import React from 'react';
import { Phone, MessageSquare, FileText, Zap } from 'lucide-react';

interface ActionBtnProps {
    icon: React.ReactNode;
    label: string;
    color: string;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, color }) => (
    <button className={`flex flex-col items-center gap-1 p-3 bg-zinc-900 rounded-xl active:scale-95 transition-transform ${color}`}>
        {icon}
        <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
);

export const ActionDock: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090B]/95 backdrop-blur border-t border-white/10 z-50">
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                <ActionBtn icon={<Phone size={20} />} label="Call" color="text-white" />
                <ActionBtn icon={<MessageSquare size={20} />} label="WA" color="text-emerald-400" />
                <ActionBtn icon={<FileText size={20} />} label="Quote" color="text-blue-400" />
                <button className="flex flex-col items-center gap-1 p-3 bg-[#FF6B35] rounded-xl active:scale-95 transition-transform text-black font-bold shadow-lg shadow-orange-900/20">
                    <Zap size={20} fill="currentColor" />
                    <span className="text-[10px] uppercase">Close</span>
                </button>
            </div>
        </div>
    );
};
