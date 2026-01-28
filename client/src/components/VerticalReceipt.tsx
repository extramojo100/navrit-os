import React from 'react';

interface Discount {
    label: string;
    amount: number;
}

interface Journey {
    ex_showroom?: number;
    insurance?: number;
    accessories?: number;
    net_price?: number;
    discounts?: Discount[];
}

interface VerticalReceiptProps {
    journey: Journey;
}

export const VerticalReceipt: React.FC<VerticalReceiptProps> = ({ journey }) => {
    // Safe Access for Discounts
    const discounts = journey.discounts || [];

    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl p-5 font-mono text-sm shadow-sm">
            <div className="space-y-2">
                <div className="flex justify-between items-center text-zinc-400">
                    <span>Ex-Showroom</span>
                    <span className="text-white">₹ {journey.ex_showroom?.toLocaleString() || 0}</span>
                </div>

                {/* LINE ITEM DISCOUNTS */}
                {discounts.map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-red-400 text-xs">
                        <span>↳ Less: {d.label}</span>
                        <span>- {d.amount.toLocaleString()}</span>
                    </div>
                ))}

                <div className="flex justify-between items-center text-zinc-400">
                    <span>Add: Insurance</span>
                    <span>+ {journey.insurance?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                    <span>Add: Accessories</span>
                    <span>+ {journey.accessories?.toLocaleString() || 0}</span>
                </div>

                {/* THE LINE */}
                <div className="h-px bg-zinc-800 my-3" />

                {/* THE BOTTOM LINE */}
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 pb-1">Net Payable</span>
                    <span className="text-xl font-bold text-white">₹ {journey.net_price?.toLocaleString() || 0}</span>
                </div>
            </div>
        </div>
    );
};
