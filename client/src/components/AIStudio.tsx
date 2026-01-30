import React from 'react';
import { Video, FileText, Wand2, Play, Share2 } from 'lucide-react';

export const AIStudio = () => {
    return (
        <div className="p-6 pb-24 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">AI Studio</h1>
                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30 flex items-center gap-1">
                    <Wand2 size={12} /> 2400 Credits
                </div>
            </div>

            {/* GENERATORS */}
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500 p-4 rounded-xl text-left transition-all group">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Video size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-white">Video Gen</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Personalized walkarounds</p>
                </button>
                <button className="bg-zinc-900 border border-zinc-800 hover:border-pink-500 p-4 rounded-xl text-left transition-all group">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-white">Smart Brochure</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Feature-focused PDFs</p>
                </button>
            </div>

            {/* RECENT ASSETS */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Generated Assets</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 bg-[#121212] p-3 rounded-xl border border-white/5">
                            <div className="w-20 h-14 bg-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Play size={16} className="text-white fill-current" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-white">Rahul_CityZX_Walkaround.mp4</h4>
                                <p className="text-[10px] text-zinc-500 mt-1">Generated 2m ago • 150 Credits</p>
                            </div>
                            <button className="p-2 text-zinc-400 hover:text-white"><Share2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
