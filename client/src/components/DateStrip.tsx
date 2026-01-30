

const DATES = [
    { day: 'Mon', date: 17, active: false },
    { day: 'Tue', date: 18, active: true }, // Today
    { day: 'Wed', date: 19, active: false },
    { day: 'Thu', date: 20, active: false },
    { day: 'Fri', date: 21, active: false },
];

export const DateStrip = () => {
    return (
        <div className="flex justify-between items-center py-4 overflow-x-auto no-scrollbar">
            {DATES.map((d, i) => (
                <div
                    key={i}
                    className={`flex flex-col items-center justify-center w-14 h-20 rounded-2xl border transition-all ${d.active ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-surface border-transparent text-zinc-500'}`}
                >
                    <span className="text-xs font-medium uppercase">{d.day}</span>
                    <span className="text-2xl font-bold font-orbitron">{d.date}</span>
                    {d.active && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1 animate-pulse" />}
                </div>
            ))}
        </div>
    );
};
