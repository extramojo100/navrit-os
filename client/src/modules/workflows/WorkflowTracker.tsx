import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface Step {
    label: string;
    tat: string;
    isOverdue?: boolean;
}

interface WorkflowTrackerProps {
    steps: Step[];
    currentStepIndex: number;
}

export const WorkflowTracker = ({ steps, currentStepIndex }: WorkflowTrackerProps) => {
    return (
        <div className="py-3">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Process Status</span>
                <span className="text-[10px] text-zinc-400 font-mono">Step {currentStepIndex + 1}/{steps.length}</span>
            </div>

            {/* THE DOMINO TRACKER */}
            <div className="relative flex items-center justify-between px-1">
                {/* Progress Line */}
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-zinc-800 -z-10" />
                <div
                    className="absolute left-0 top-3 h-0.5 bg-emerald-500 -z-10 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, i) => {
                    const isDone = i < currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const isLate = isCurrent && step.isOverdue;

                    return (
                        <div key={i} className="flex flex-col items-center relative">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-black' :
                                    isCurrent ? (isLate ? 'bg-red-500 border-red-500 animate-pulse' : 'bg-black border-white text-white') :
                                        'bg-zinc-900 border-zinc-700 text-zinc-600'
                                }`}>
                                {isDone ? <CheckCircle2 size={12} /> : isLate ? <AlertTriangle size={10} /> : <span className="text-[9px] font-bold">{i + 1}</span>}
                            </div>

                            {/* Step Label */}
                            <div className={`absolute top-8 text-center w-16 ${isCurrent ? 'opacity-100' : 'opacity-50'}`}>
                                <div className={`text-[9px] font-bold leading-tight ${isLate ? 'text-red-400' : 'text-white'}`}>{step.label}</div>
                                <div className={`text-[8px] ${isLate ? 'text-red-400' : 'text-zinc-500'}`}>{step.tat}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Spacer for labels */}
            <div className="h-8" />
        </div>
    );
};
