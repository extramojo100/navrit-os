import { useState } from 'react';
import { Phone, MessageSquare, FileText, Zap, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ActionDock = () => {
    const [isListening, setIsListening] = useState(false);

    const handleTouchStart = () => {
        setIsListening(true);
        // Simulate Haptic
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleTouchEnd = () => {
        setIsListening(false);
        // Simulate Processing
        alert("🎤 AI Note Logged: 'Customer is asking for 5% more discount on the City ZX.'");
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
            {/* THE LISTENING ORB (Visual Feedback) */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-500/50 rounded-full blur-xl"
                    />
                )}
            </AnimatePresence>

            <div className="bg-[#09090B]/95 backdrop-blur border border-white/10 rounded-2xl p-2 shadow-2xl max-w-md mx-auto grid grid-cols-5 gap-1 items-end">

                {/* STANDARD ACTIONS */}
                <ActionBtn icon={<Phone size={20} />} label="Call" />
                <ActionBtn icon={<MessageSquare size={20} />} label="WA" />

                {/* THE JARVIS BUTTON (Center, Larger) */}
                <div
                    className="flex flex-col items-center justify-end -mt-6"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart} // For Desktop testing
                    onMouseUp={handleTouchEnd}
                >
                    <motion.button
                        animate={isListening ? { scale: 1.2, backgroundColor: "#EF4444" } : { scale: 1, backgroundColor: "#fff" }}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-black shadow-lg shadow-white/10 relative z-10"
                    >
                        <Mic size={24} />
                    </motion.button>
                    <span className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-widest">Hold</span>
                </div>

                {/* STANDARD ACTIONS */}
                <ActionBtn icon={<FileText size={20} />} label="Quote" />
                <button className="flex flex-col items-center gap-1 p-3 rounded-xl active:scale-95 transition-transform text-[#FF6B35]">
                    <Zap size={20} fill="currentColor" />
                    <span className="text-[10px] font-bold uppercase">Close</span>
                </button>
            </div>
        </div>
    );
};

const ActionBtn = ({ icon, label }: any) => (
    <button className="flex flex-col items-center gap-1 p-3 rounded-xl active:scale-95 transition-transform text-white hover:bg-white/5">
        {icon}
        <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
);
