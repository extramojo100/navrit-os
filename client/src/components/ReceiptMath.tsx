interface Journey {
    exShowroom: number;
    discount: number;
    insurance: number;
    accessories: number;
    commission: number;
}

export const ReceiptMath = ({ journey }: { journey: Journey }) => {
    const net = journey.exShowroom - journey.discount + journey.insurance + journey.accessories;

    return (
        <div className="bg-[#121212] rounded-lg p-4 font-mono text-xs border border-white/5 relative overflow-hidden group">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
            </div>

            {/* The Stack */}
            <div className="space-y-1 relative z-10">
                <div className="flex justify-between text-zinc-400">
                    <span>Ex-Showroom</span>
                    <span>{journey.exShowroom.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-400">
                    <span>Less: Disc</span>
                    <span>- {journey.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                    <span>Add: Insurance</span>
                    <span>+ {journey.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                    <span>Add: Access.</span>
                    <span>+ {journey.accessories.toLocaleString()}</span>
                </div>

                {/* The Bottom Line */}
                <div className="my-2 border-t border-dashed border-zinc-700"></div>
                <div className="flex justify-between text-sm font-bold text-white">
                    <span>NET OFFER</span>
                    <span>₹ {(net / 100000).toFixed(2)}L</span>
                </div>
            </div>

            {/* The Incentive (Hidden Layer) */}
            <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-zinc-600">Your Cut</span>
                <span className="text-emerald-400 font-bold">₹ {journey.commission.toLocaleString()}</span>
            </div>
        </div>
    );
};
