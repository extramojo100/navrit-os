
import { X, Search, Zap } from 'lucide-react';

export const BattleLens = ({ onClose }: any) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20">
                <X size={24} />
            </button>
            <div className="text-center font-orbitron animate-pulse mb-8">
                <h1 className="text-4xl text-cyan-500 glow-text">BATTLE MODE ACTIVE</h1>
                <p className="text-sm text-zinc-400 mt-2">ENGAGING TACTICAL OVERLAY</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-zinc-900 border border-cyan-500/30 p-4 rounded-xl text-center glow-border">
                    <Zap size={32} className="mx-auto mb-2 text-cyan-500" />
                    <div className="font-bold">POWER LEVEL</div>
                    <div className="text-2xl font-mono">9001</div>
                </div>
                <div className="bg-zinc-900 border border-purple-500/30 p-4 rounded-xl text-center glow-border">
                    <Search size={32} className="mx-auto mb-2 text-purple-500" />
                    <div className="font-bold">TARGETS</div>
                    <div className="text-2xl font-mono">LOCKED</div>
                </div>
            </div>
        </div>
    );
};
