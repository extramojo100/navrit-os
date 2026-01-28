interface ReceiptData {
    price: number;
    discount: number;
    insurance: number;
    accessories: number;
    netPrice: number;
}

interface VerticalReceiptProps {
    data: ReceiptData;
    commission?: number;
}

export const VerticalReceipt = ({ data, commission = 14500 }: VerticalReceiptProps) => {
    return (
        <div className="bg-[#121212] border border-white/5 rounded-xl p-5 font-mono text-sm">
            <div className="space-y-3">
                {/* LINE ITEMS */}
                <div className="flex justify-between items-center text-zinc-400">
                    <span>Ex-Showroom</span>
                    <span className="text-white">₹ {data.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-red-400">
                    <span>Less: Discount</span>
                    <span>- {data.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                    <span>Add: Insurance</span>
                    <span>+ {data.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                    <span>Add: Accessories</span>
                    <span>+ {data.accessories.toLocaleString()}</span>
                </div>

                {/* THE LINE */}
                <div className="h-px bg-zinc-800 my-4" />

                {/* THE BOTTOM LINE */}
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 pb-1">Net Payable</span>
                    <span className="text-xl font-bold text-white">₹ {data.netPrice.toLocaleString()}</span>
                </div>
            </div>

            {/* THE INCENTIVE (Subtle Footer) */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 uppercase">Your Commission</span>
                <span className="text-emerald-400 font-bold">₹ {commission.toLocaleString()}</span>
            </div>
        </div>
    );
};
