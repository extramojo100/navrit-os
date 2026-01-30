import React, { useEffect, useState } from 'react';

export const SystemBoot = ({ onComplete }: any) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const sequence = [
            "INITIALIZING NAVRIT KERNEL...",
            "LOADING NEURAL ENGINE...",
            "CONNECTING TO SATELLITE UPLINK...",
            "BIOMETRIC HANDSHAKE ESTABLISHED.",
            "SYSTEM ONLINE."
        ];

        let delay = 0;
        sequence.forEach((line, i) => {
            delay += 500 + Math.random() * 500;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (i === sequence.length - 1) {
                    setTimeout(onComplete, 800);
                }
            }, delay);
        });
    }, []);

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center font-mono text-xs text-cyan-500 z-50 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black" />
            <div className="z-10 w-64">
                {lines.map((l, i) => (
                    <div key={i} className="mb-1 animate-pulse">
                        <span className="text-zinc-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                        {l}
                    </div>
                ))}
                <div className="h-4 w-2 bg-cyan-500 animate-bounce mt-2" />
            </div>
        </div>
    );
};
