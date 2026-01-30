
import { Phone, Car, FileSignature, ChevronRight } from 'lucide-react';

const ICONS: any = {
    CALL: Phone,
    DRIVE: Car,
    MEET: FileSignature
};

export const TaskCard = ({ task, onClick }: any) => {
    const Icon = ICONS[task.type] || Phone;

    return (
        <div onClick={onClick} className="glass-panel p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden group active:scale-95 transition-transform">
            {/* Priority Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'HOT A' ? 'bg-red-500' : task.priority === 'HOT B' ? 'bg-orange-500' : 'bg-yellow-500'}`} />

            {/* Time & Icon */}
            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                <span className="text-xs font-mono text-zinc-400">{task.time}</span>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-cyan-400">
                    <Icon size={18} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-lg">{task.name}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${task.priority === 'HOT A' ? 'border-red-500 text-red-500' : 'border-yellow-500 text-yellow-500'}`}>
                        {task.priority}
                    </span>
                </div>
                <p className="text-sm text-zinc-400">{task.desc}</p>
            </div>

            <ChevronRight className="text-zinc-600" size={20} />
        </div>
    );
};
