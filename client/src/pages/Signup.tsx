import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Zap, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleValidation = () => {
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
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
            setMessage('Account created! checking your email to confirm...');

            // Delay to show message before redirect
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
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
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">New User Registration</p>
                    </div>
                </div>

                {/* SIGNUP CARD */}
                <div className="bg-[#09090B] border border-white/10 rounded-2xl p-1 shadow-2xl">
                    <div className="p-6 space-y-4">

                        <form onSubmit={handleSignUp} className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/5 rounded-lg p-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 focus:bg-black transition-all"
                                    placeholder="name@navrit.ai"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/5 rounded-lg p-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 focus:bg-black transition-all"
                                    placeholder="Create password"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/5 rounded-lg p-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 focus:bg-black transition-all"
                                    placeholder="Confirm password"
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FF6B35] hover:bg-[#ff8659] text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : (
                                    <>
                                        <span>CREATE ACCOUNT</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="border-t border-white/5 pt-4">
                            <a
                                href="/login"
                                className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors uppercase font-medium tracking-wide"
                            >
                                <ArrowLeft size={12} />
                                Back to Login
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
