import React from 'react';
import { Users, Calendar, Target, Zap } from 'lucide-react';

// Target Ring Component (Gamification)
const TargetRing = ({ percentage, label, subLabel }: { percentage: number; label: string; subLabel: string }) => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        stroke="#1E1E20" strokeWidth={strokeWidth} fill="transparent"
                    />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        stroke="#00f3ff" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round" fill="transparent"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{percentage}%</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Achieved</span>
                </div>
            </div>
            <div className="mt-2 text-center">
                <div className="text-sm font-bold text-white">{label}</div>
                <div className="text-[10px] text-zinc-500">{subLabel}</div>
            </div>
        </div>
    );
};

export const Dashboard = ({ onNav }: { onNav: (tab: string) => void }) => {
    return (
        <div className="p-6 space-y-6 pb-24">
            {/* WELCOME */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-orbitron font-bold text-white glow-text">Good Morning, Alex</h1>
                    <p className="text-xs text-zinc-500">Let's crush the targets.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-cyan-500/30 text-sm font-bold text-cyan-500 glow-border">
                    AS
                </div>
            </div>

            {/* GAMIFICATION RING */}
            <div className="glass-panel rounded-2xl p-6 flex items-center justify-around glow-border">
                <TargetRing percentage={75} label="4/6 Sold" subLabel="Monthly Goal" />
                <div className="space-y-3">
                    <button onClick={() => onNav('leads')} className="flex items-center gap-3 group">
                        <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg group-hover:bg-cyan-500 group-hover:text-black transition-colors"><Users size={18} /></div>
                        <div><div className="text-lg font-bold text-white">12</div><div className="text-[10px] text-zinc-500 uppercase">New Leads</div></div>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Calendar size={18} /></div>
                        <div><div className="text-lg font-bold text-white">3</div><div className="text-[10px] text-zinc-500 uppercase">Test Drives</div></div>
                    </div>
                </div>
            </div>

            {/* BATTLE MODE TRIGGER */}
            <button
                onClick={() => onNav('battle')}
                className="w-full glass-panel glow-border rounded-xl p-4 flex items-center gap-4 group hover:border-purple-500/50 transition-colors"
            >
                <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl">
                    <Target size={24} />
                </div>
                <div className="text-left flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Enter Battle Mode</div>
                    <div className="text-[10px] text-zinc-500">AR Competitor Analysis</div>
                </div>
                <Zap size={20} className="text-purple-500 animate-pulse" />
            </button>

            {/* HOT LIST */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Priority Action</h3>
                <div className="space-y-2">
                    <div className="glass-panel glow-border p-4 rounded-xl flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold border border-cyan-500/30">R</div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>
                        </div>
                        <div>
                            <div className="font-bold text-white">Rahul Sharma</div>
                            <div className="text-xs text-zinc-400">Honda City ZX • Negotiation</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
