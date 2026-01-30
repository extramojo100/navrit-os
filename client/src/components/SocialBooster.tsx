import { Instagram, Share2 } from 'lucide-react';

interface SocialBoosterProps {
    model: string;
}

export const SocialBooster: React.FC<SocialBoosterProps> = ({ model }) => {
    return (
        <div className="mt-6 border border-white/10 rounded-xl overflow-hidden bg-[#121212]">
            <div className="bg-[#1A1A1A] p-3 flex justify-between items-center border-b border-white/10">
                <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-widest">Deal Closed • Share Now</span>
            </div>

            {/* THE ASSET */}
            <div className="aspect-video bg-zinc-900 relative flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

                {/* THE WATERMARK */}
                <div className="absolute bottom-2 right-3 z-20 flex flex-col items-end">
                    <span className="text-[8px] text-white/60 font-mono">POWERED BY</span>
                    <span className="text-[10px] text-white font-bold tracking-wider">NAVRIT OS</span>
                </div>

                {/* MOCK IMAGE */}
                <div className="text-center z-0">
                    <div className="text-4xl">🚗 💨</div>
                    <div className="text-[10px] text-zinc-500 mt-2">Generating Delivery Asset for {model}...</div>
                </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-white/10">
                <button className="p-3 hover:bg-white/5 text-xs font-bold text-white flex items-center justify-center gap-2">
                    <Instagram size={14} /> Story
                </button>
                <button className="p-3 hover:bg-white/5 text-xs font-bold text-white flex items-center justify-center gap-2">
                    <Share2 size={14} /> Status
                </button>
            </div>
        </div>
    );
};
