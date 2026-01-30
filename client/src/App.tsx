import React, { useState } from 'react';
import {
  Home, List, Zap, FileText, LayoutGrid,
  Search, Bell, Phone, Car, ChevronRight
} from 'lucide-react';
import { AIDealArchitect } from './components/AIDealArchitect';

// --- MOCK DATA ---
const TASKS = [
  { id: 1, type: 'CALL', name: 'Gaurav Jain', time: '10:00 AM', desc: 'Call for verification', priority: 'HOT C' },
  { id: 2, type: 'DRIVE', name: 'Amit Rai', time: '2:00 PM', desc: 'Test Drive: City ZX', priority: 'HOT A' },
  { id: 3, type: 'MEET', name: 'Sohan Kadwa', time: '4:30 PM', desc: 'Sign Contract', priority: 'HOT A' },
];

const DATES = [
  { day: 'M', date: 17, active: false },
  { day: 'T', date: 18, active: true },
  { day: 'W', date: 19, active: false },
  { day: 'T', date: 20, active: false },
  { day: 'F', date: 21, active: false },
];

// --- COMPONENTS ---

const DateStrip = () => (
  <div className="flex justify-between items-center px-2 py-2">
    {DATES.map((d, i) => (
      <div key={i} className={`flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-all ${d.active ? 'bg-black text-white shadow-lg scale-105' : 'bg-white text-gray-400'}`}>
        <span className="text-[10px] font-bold uppercase">{d.day}</span>
        <span className="text-lg font-bold">{d.date}</span>
      </div>
    ))}
  </div>
);

const TaskCard = ({ task }: any) => {
  const Icon = task.type === 'CALL' ? Phone : task.type === 'DRIVE' ? Car : FileText;
  const badgeColor = task.priority === 'HOT A' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-yellow-100 text-yellow-600 border-yellow-200';

  return (
    <div className="card-ios p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer">
      <div className="flex flex-col items-center gap-1 min-w-[48px]">
        <span className="text-[10px] font-bold text-gray-400">{task.time}</span>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Icon size={18} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-[#1C1C1E]">{task.name}</h3>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>{task.priority}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{task.desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </div>
  );
};

// --- MAIN CANVAS ---

export default function App() {
  const [tab, setTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-24 font-sans text-[#1C1C1E]">

      {/* HEADER */}
      <div className="pt-12 px-6 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Today</h1>
            <p className="text-xs text-gray-500 font-medium">Tuesday, October 18</p>
          </div>
          <div className="flex gap-3">
            <button className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 border border-gray-100"><Search size={18} /></button>
            <button className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 border border-gray-100 relative">
              <Bell size={18} />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">

        {/* SECTION 1: DATE STRIP */}
        <section>
          <DateStrip />
        </section>

        {/* SECTION 2: PRIORITY TASKS */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Up Next</h3>
            <span className="text-xs text-blue-600 font-bold">See All</span>
          </div>
          <div className="space-y-3">
            {TASKS.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>

        {/* SECTION 3: AI DEAL ARCHITECT (Replaces Calculator) */}
        <section>
          <AIDealArchitect />
        </section>

      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 h-[84px] glass-ios flex justify-around items-start pt-4 z-40 pb-safe">
        <NavBtn icon={Home} label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
        <NavBtn icon={List} label="Tasks" active={tab === 'activity'} onClick={() => setTab('activity')} />

        {/* ACTION BUTTON */}
        <div className="relative -top-8">
          <button className="w-14 h-14 rounded-full bg-[#0071E3] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,113,227,0.3)] hover:scale-105 active:scale-95 transition-transform">
            <Zap size={24} fill="currentColor" />
          </button>
        </div>

        <NavBtn icon={FileText} label="Docs" active={tab === 'brochure'} onClick={() => setTab('brochure')} />
        <NavBtn icon={LayoutGrid} label="More" active={tab === 'more'} onClick={() => setTab('more')} />
      </nav>
    </div>
  );
}

const NavBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 transition-colors ${active ? 'text-[#0071E3]' : 'text-gray-400'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium tracking-tight">{label}</span>
  </button>
);
