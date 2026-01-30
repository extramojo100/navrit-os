

interface TargetRingProps {
    percentage: number;
    label: string;
    subLabel: string;
}

export const TargetRing = ({ percentage, label, subLabel }: TargetRingProps) => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        stroke="#1E1E20" strokeWidth={strokeWidth} fill="transparent"
                    />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        stroke="#00f3ff" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round" fill="transparent"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{percentage}%</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Achieved</span>
                </div>
            </div>
            {(label || subLabel) && (
                <div className="mt-2 text-center">
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-[10px] text-zinc-500">{subLabel}</div>
                </div>
            )}
        </div>
    );
};
