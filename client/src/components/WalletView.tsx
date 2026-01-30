import React from 'react';
import { CreditCard, Zap, Plus } from 'lucide-react';

export const WalletView = () => {
    return (
        <div className="p-6 pb-24 space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Economic Engine</h1>

            {/* MAIN CARD */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
                <div className="relative z-10">
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Available Commission</span>
                    <div className="text-4xl font-black text-white mt-1">₹ 45,200</div>
                    <div className="flex gap-2 mt-6">
                        <button className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-xs uppercase hover:bg-zinc-200 transition-colors">Withdraw</button>
                        <button className="flex-1 bg-white/10 text-white border border-white/10 font-bold py-3 rounded-xl text-xs uppercase hover:bg-white/20 transition-colors">History</button>
                    </div>
                </div>
            </div>

            {/* AI CREDITS (The "Fuel") */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Fuel Tank</h3>
                <div className="bg-[#121212] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white">2,400 <span className="text-xs text-zinc-500 font-normal">Credits</span></div>
                            <div className="text-[10px] text-zinc-400">Enough for ~24 Video Gens</div>
                        </div>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Plus size={14} /> Top Up
                    </button>
                </div>
            </div>

            {/* SUBSCRIPTION PLAN */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Your Plan</h3>
                <div className="bg-[#121212] border border-emerald-500/30 rounded-xl p-4 relative">
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[9px] font-bold rounded uppercase">Active</div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white"><CreditCard size={16} /></div>
                        <span className="text-sm font-bold text-white">Navrit Pro</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">Next billing: 01 Feb 2026</p>
                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[75%]" />
                    </div>
                    <p className="text-[9px] text-zinc-500 mt-1 text-right">21 days remaining</p>
                </div>
            </div>
        </div>
    );
};
