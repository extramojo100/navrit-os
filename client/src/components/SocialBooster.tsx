import { Instagram, Linkedin, Download, Sparkles } from 'lucide-react';

interface SocialBoosterProps {
    model: string;
    customerName?: string;
}

export const SocialBooster = ({ model, customerName }: SocialBoosterProps) => {
    const handleShare = (platform: 'instagram' | 'linkedin' | 'download') => {
        console.log(`📤 Sharing to ${platform}:`, { model, customerName });
        // In production: Open native share or platform-specific flow
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    <h4 className="text-xs font-bold text-text uppercase tracking-widest">Victory Lap</h4>
                </div>
                <span className="text-xxs text-muted">AI Generated</span>
            </div>

            {/* ASSET PREVIEW */}
            <div className="aspect-video bg-bg rounded border border-border mb-3 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                {/* Content Preview */}
                <div className="absolute bottom-3 left-3 right-3 z-20">
                    <p className="text-sm font-bold text-white leading-tight">
                        Just delivered another {model}! 🚗💨
                    </p>
                    <p className="text-xs text-zinc-300 mt-1">
                        {customerName ? `Congrats ${customerName}! ` : ''}
                        Another happy customer driving home in style.
                    </p>
                    <p className="text-xxs text-zinc-400 mt-2">
                        #Honda #NewCar #SalesWin #Delivery
                    </p>
                </div>

                {/* Placeholder Image */}
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🚗</div>
                        <div className="text-xxs text-zinc-600 font-mono">[HERO_IMAGE]</div>
                    </div>
                </div>
            </div>

            {/* ACTION GRID */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => handleShare('instagram')}
                    className="flex items-center justify-center gap-2 bg-bg border border-border py-2.5 rounded hover:bg-zinc-900 hover:border-primary/30 transition-colors text-xs text-muted font-medium group"
                >
                    <Instagram size={14} className="group-hover:text-pink-400 transition-colors" /> Story
                </button>
                <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center justify-center gap-2 bg-bg border border-border py-2.5 rounded hover:bg-zinc-900 hover:border-primary/30 transition-colors text-xs text-muted font-medium group"
                >
                    <Linkedin size={14} className="group-hover:text-blue-400 transition-colors" /> Post
                </button>
                <button
                    onClick={() => handleShare('download')}
                    className="flex items-center justify-center gap-2 bg-bg border border-border py-2.5 rounded hover:bg-zinc-900 hover:border-primary/30 transition-colors text-xs text-muted font-medium group"
                >
                    <Download size={14} className="group-hover:text-success transition-colors" /> Save
                </button>
            </div>
        </div>
    );
};
