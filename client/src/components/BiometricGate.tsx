import { useEffect, useState } from 'react';
import { Fingerprint, ScanFace, CheckCircle2 } from 'lucide-react';

export const BiometricGate = ({ onAuthenticated }: any) => {
    const [stage, setStage] = useState('scanning'); // scanning, success

    useEffect(() => {
        // SIMULATION: Check Device ID -> Verify Phone -> FaceID
        const t1 = setTimeout(() => setStage('recognizing'), 1000);
        const t2 = setTimeout(() => setStage('success'), 2500);
        const t3 = setTimeout(() => onAuthenticated({ name: 'Alex Sales', role: 'Elite', credits: 4500 }), 3500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onAuthenticated]);

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
            {/* Background Pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-black to-black animate-pulse" />

            <div className="z-10 flex flex-col items-center">
                {stage === 'scanning' && (
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-ping" />
                        <Fingerprint size={64} className="text-blue-500 animate-pulse" />
                    </div>
                )}

                {stage === 'recognizing' && (
                    <div className="flex flex-col items-center gap-4">
                        <ScanFace size={64} className="text-blue-500 animate-bounce" />
                        <p className="text-xs font-mono text-blue-500/80 tracking-widest">BIOMETRIC HANDSHAKE...</p>
                    </div>
                )}

                {stage === 'success' && (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 size={64} className="text-emerald-500" />
                        <p className="text-lg font-bold">Welcome back, Alex.</p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-10 text-[10px] text-zinc-600 font-mono">
                DEVICE ID: 89-AF-X1-00 • NAVRIT OS SECURE
            </div>
        </div>
    );
};
