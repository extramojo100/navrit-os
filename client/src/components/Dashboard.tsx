
import { DateStrip } from './DateStrip';
import { TaskCard } from './TaskCard';
import { TargetRing } from './TargetRing';
import { TASKS } from '../types';
import { Search, Bell } from 'lucide-react';

export const Dashboard = ({ onNav }: any) => {
    return (
        <div className="p-6 space-y-6 pb-32">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white">TODAY</h1>
                    <p className="text-xs text-cyan-500 font-mono tracking-widest">TUESDAY, 18 OCT</p>
                </div>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white">
                        <Search size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white relative">
                        <Bell size={20} />
                        <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </button>
                </div>
            </div>

            {/* DATE STRIP (Wireframe Match) */}
            <DateStrip />

            {/* GAMIFICATION (Small Bot) */}
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
                <div className="scale-75 -ml-2"><TargetRing percentage={65} label="" subLabel="" /></div>
                <div>
                    <div className="text-sm font-bold text-white">Daily Target</div>
                    <div className="text-xs text-zinc-400">You need <span className="text-cyan-400 font-bold">2 more Test Drives</span> to hit the bonus zone.</div>
                </div>
            </div>

            {/* TASKS LIST */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Priority Actions</h3>
                <div className="space-y-3">
                    {TASKS.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => onNav('detail')} />
                    ))}
                </div>
            </div>
        </div>
    );
};
