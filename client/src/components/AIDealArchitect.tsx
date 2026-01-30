import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';

const SCENARIOS = [
    {
        id: 'balanced',
        label: 'AI RECOMMENDED',
        desc: 'Matches customer income profile',
        down: '₹ 2.50L',
        emi: '₹ 24,500',
        term: '5Y',
        probability: '92%'
    },
    {
        id: 'aggressive',
        label: 'LOW DOWN PAYMENT',
        desc: 'Good for cash-flow concerns',
        down: '₹ 1.00L',
        emi: '₹ 28,900',
        term: '7Y',
        probability: '75%'
    },
    {
        id: 'easy',
        label: 'LOW EMI',
        desc: 'Focus on monthly affordability',
        down: '₹ 4.00L',
        emi: '₹ 19,800',
        term: '5Y',
        probability: '60%'
    }
];

export const AIDealArchitect = () => {
    const [selected, setSelected] = useState('balanced');
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="card-ios p-5 space-y-5 relative overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className="text-[#0071E3] fill-current animate-pulse" />
                        <span className="text-xs font-bold text-[#0071E3] uppercase tracking-wide">Deal Intelligence</span>
                    </div>
                    <h3 className="font-bold text-xl text-[#1C1C1E]">Structuring for Amit</h3>
                </div>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold">
                    CREDIT SCORE: 780
                </div>
            </div>

            {/* AI REASONING */}
            <p className="text-xs text-gray-500 leading-relaxed">
                Based on Amit's chat history, he is sensitive to monthly outflow but has a strong down payment capacity from his trade-in.
            </p>

            {/* SCENARIO CARDS */}
            <div className="space-y-3">
                {SCENARIOS.map((s) => (
                    <div
                        key={s.id}
                        onClick={() => setSelected(s.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative ${selected === s.id ? 'bg-[#F2F7FF] border-[#0071E3] shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                        {selected === s.id && (
                            <div className="absolute top-3 right-3 text-[#0071E3]"><CheckCircle2 size={18} fill="currentColor" className="text-white" /></div>
                        )}

                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${selected === s.id ? 'bg-[#0071E3] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {s.label}
                            </span>
                            {selected !== s.id && <span className="text-[10px] text-green-600 font-bold">{s.probability} Match</span>}
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-2xl font-bold text-[#1C1C1E]">{s.emi}<span className="text-xs font-medium text-gray-400">/mo</span></div>
                                <div className="text-xs text-gray-500 mt-0.5">Down: {s.down} • {s.term}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ACTION BUTTON */}
            <button
                onClick={handleSend}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${sent ? 'bg-green-500 text-white' : 'bg-black text-white shadow-lg'}`}
            >
                {sent ? (
                    <>
                        <CheckCircle2 size={18} /> Sent to WhatsApp
                    </>
                ) : (
                    <>
                        <Send size={16} /> Send Proposal
                    </>
                )}
            </button>
        </div>
    );
};
