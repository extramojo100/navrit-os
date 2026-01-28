import type { Rule } from '../services/RuleEngine';

interface ReceiptData {
    exShowroom: number;
    discount: number;
    insurance: number;
    accessories: number;
    net: number;
}

interface ReceiptProps {
    data: ReceiptData;
    appliedRule?: Rule;
}

export const Receipt = ({ data, appliedRule }: ReceiptProps) => {
    return (
        <div className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-muted">
            {/* Line Items */}
            <div className="space-y-1.5">
                <div className="flex justify-between">
                    <span>Ex-Showroom</span>
                    <span className="text-text">₹ {data.exShowroom.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-danger">
                    <span>Less: Discount</span>
                    <span>- ₹ {data.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Add: Insurance</span>
                    <span>+ ₹ {data.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Add: Accessories</span>
                    <span>+ ₹ {data.accessories.toLocaleString()}</span>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border my-3" />

            {/* Net Total */}
            <div className="flex justify-between text-sm font-bold text-text">
                <span>NET PAYABLE</span>
                <span>₹ {data.net.toLocaleString()}</span>
            </div>

            {/* Lakh Conversion */}
            <div className="text-right text-xxs text-muted mt-1">
                ≈ ₹ {(data.net / 100000).toFixed(2)} Lakh
            </div>

            {/* Logic Trace */}
            {appliedRule && (
                <div className="mt-3 pt-2 border-t border-dashed border-border text-xxs flex justify-between items-center">
                    <span className="text-muted">Logic Applied:</span>
                    <span className={`font-bold ${appliedRule.level === 'BRAND' ? 'text-primary' :
                            appliedRule.level === 'MANAGER' ? 'text-warning' :
                                'text-muted'
                        }`}>
                        {appliedRule.level}: {appliedRule.action}
                    </span>
                </div>
            )}
        </div>
    );
};
