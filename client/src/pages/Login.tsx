import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Zap, Loader2, ArrowRight, UserPlus } from 'lucide-react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleValidation = () => {
        if (!email || !password) {
            setError('Please provide both email and password');
            return false;
        }
        return true;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!handleValidation()) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const _handleSignUp = async () => {
        if (!handleValidation()) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            setMessage('Account created! Please check your email.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 selection:bg-[#FF6B35]/30">
            <div className="w-full max-w-sm space-y-8">
                {/* BRANDING */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#09090B] rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shadow-[#FF6B35]/10">
                        <Zap size={32} className="text-[#FF6B35]" fill="currentColor" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white tracking-[0.2em]">NAVRIT OS</h1>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">Authorized Personnel Only</p>
                    </div>
                </div>

                {/* LOGIN CARD */}
                <div className="bg-[#09090B] border border-white/10 rounded-2xl p-1 shadow-2xl">
                    <div className="p-6 space-y-4">

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">Credentials</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/5 rounded-lg p-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 focus:bg-black transition-all"
                                    placeholder="name@navrit.ai"
                                />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#121212] border border-white/5 rounded-lg p-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 focus:bg-black transition-all"
                                placeholder="Password"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                {message}
                            </div>
                        )}

                        <div className="pt-2 space-y-3">
                            <button
                                onClick={handleSignIn}
                                disabled={loading}
                                className="w-full bg-[#FF6B35] hover:bg-[#ff8659] text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : (
                                    <>
                                        <span>SIGN IN</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="relative flex items-center py-2">
                                <div className="grow border-t border-white/5"></div>
                                <span className="shrink-0 px-2 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">or</span>
                                <div className="grow border-t border-white/5"></div>
                            </div>

                            <button
                                type="button"
                                onClick={() => window.location.href = '/signup'}
                                disabled={loading}
                                className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-white/5"
                            >
                                <UserPlus size={14} />
                                Create New Account
                            </button>
                        </div>

                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-zinc-600">
                        Protected by Navrit Identity • v11.1
                    </p>
                </div>

            </div>
        </div>
    );
}
