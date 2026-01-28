import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Zap, Loader2 } from 'lucide-react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Navigation handled by App.tsx observing session state
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* LOGO */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-2xl shadow-[#FF6B35]/20">
                        <Zap size={24} className="text-[#FF6B35]" fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-widest">NAVRIT OS</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">Access Required</p>
                </div>

                {/* AUTH BOX */}
                <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 shadow-xl">
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                                placeholder="agent@navrit.ai"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF6B35] hover:bg-[#ff8659] text-black font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {mode === 'LOGIN' ? 'ENTER SYSTEM' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                            className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            {mode === 'LOGIN' ? 'Need an account? Sign Up' : 'Have an account? Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
