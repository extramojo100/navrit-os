import { useState } from 'react';
import { LeadRow } from './components/LeadRow';
import { DetailSheet } from './components/DetailSheet';
import { Flame, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface Journey {
  model: string;
  stock: 'YARD' | 'TRANSIT' | 'ORDER';
  color: string;
  exShowroom: number;
  discount: number;
  insurance: number;
  accessories: number;
  commission: number;
  logs: Array<{ actor: string; msg: string; time: string }>;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  tags: Record<string, string>;
  journeys: Journey[];
}

export default function App() {
  const [selected, setSelected] = useState<Lead | null>(null);

  // MOCK DATA: New Car Sales Reality
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210',
      tags: { source: 'Facebook', comp: 'Verna', finance: 'Pre-Approved' },
      journeys: [
        {
          model: 'City ZX CVT', stock: 'YARD', color: 'White',
          exShowroom: 1680000, discount: 45000, insurance: 42000, accessories: 12000, commission: 12500,
          logs: [
            { actor: 'HUMAN', msg: 'Sent Final Quote PDF', time: '10:05 AM' },
            { actor: 'CUSTOMER', msg: 'Is the insurance negotiable?', time: '10:08 AM' },
            { actor: 'AI', msg: 'Auto-Replied: "Yes, we can adjust IDV"', time: '10:08 AM' }
          ]
        },
        {
          model: 'Elevate Apex', stock: 'TRANSIT', color: 'Orange',
          exShowroom: 1550000, discount: 0, insurance: 38000, accessories: 5000, commission: 8000,
          logs: []
        }
      ]
    },
    {
      id: '2', name: 'Arjun Singh', phone: '+91 99887 76655',
      tags: { source: 'Walk-In', pref: 'Sunroof', trade: 'Swift 2018' },
      journeys: [
        {
          model: 'Elevate V MT', stock: 'ORDER', color: 'Grey',
          exShowroom: 1250000, discount: 10000, insurance: 32000, accessories: 8000, commission: 5000,
          logs: [{ actor: 'AI', msg: 'Nurture: Sent Brochure', time: 'Yesterday' }]
        }
      ]
    },
    {
      id: '3', name: 'Priya Patel', phone: '+91 99012 34567',
      tags: { source: 'Google Ads', budget: '15-18L', finance: 'Cash Deal' },
      journeys: [
        {
          model: 'City VX CVT', stock: 'YARD', color: 'Meteoroid Grey',
          exShowroom: 1520000, discount: 35000, insurance: 38000, accessories: 18000, commission: 11000,
          logs: [
            { actor: 'HUMAN', msg: 'Follow-up call scheduled', time: '2:00 PM' },
            { actor: 'AI', msg: 'Sent comparison sheet vs Verna', time: 'Yesterday' }
          ]
        }
      ]
    },
    {
      id: '4', name: 'Vikram Malhotra', phone: '+91 88776 65544',
      tags: { source: 'Referral', trade: 'i20 2020', finance: 'HDFC Pre-App' },
      journeys: [
        {
          model: 'Amaze VX MT', stock: 'TRANSIT', color: 'Radiant Red',
          exShowroom: 980000, discount: 25000, insurance: 28000, accessories: 8000, commission: 7500,
          logs: [
            { actor: 'AI', msg: 'Auto-nurture: Sent testimonial video', time: '3 hrs ago' }
          ]
        },
        {
          model: 'City V MT', stock: 'ORDER', color: 'White',
          exShowroom: 1280000, discount: 15000, insurance: 32000, accessories: 10000, commission: 6000,
          logs: []
        }
      ]
    }
  ]);

  // Calculate total potential earnings
  const totalEarnings = leads.reduce((acc, lead) => {
    return acc + lead.journeys[0].commission;
  }, 0);

  const handleGhost = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    console.log("👻 AI Nurture Sequence Initiated for:", id);
  };

  const handleCall = (id: string) => {
    console.log("📞 Initiating call for:", id);
    // In production: window.location.href = `tel:${lead.phone}`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 selection:bg-[#FF6B35]/30">

      {/* HUD HEADER */}
      <header className="sticky top-0 z-40 bg-[#000]/90 backdrop-blur border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B35] to-red-600 flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,107,53,0.4)]">
            <Flame size={18} fill="currentColor" />
          </div>
          <div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Earnings</div>
            <div className="text-sm font-black text-white leading-none">₹ {totalEarnings.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors">
            <Search size={16} />
          </button>
        </div>
      </header>

      {/* FEED */}
      <main className="pt-2">
        <div className="px-4 pb-2 flex justify-between items-center">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Priority Queue</span>
          <span className="text-[10px] text-[#FF6B35] font-mono font-bold">SORT: COMM × PROB</span>
        </div>

        {leads.map(l => (
          <LeadRow
            key={l.id}
            lead={l}
            onGhost={handleGhost}
            onCall={handleCall}
            onOpen={setSelected}
          />
        ))}

        {leads.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-zinc-600 text-sm">All leads processed.</div>
            <div className="text-zinc-700 text-xs mt-1">Check back for new opportunities.</div>
          </div>
        )}
      </main>

      {/* BOTTOM DOCK */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#09090B] border-t border-white/10 p-4 flex justify-around items-center z-40 text-[10px] font-bold tracking-widest">
        <button className="text-white flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[#FF6B35]"></div>
          FEED
        </button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">TASKS</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">PERF</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">MORE</button>
      </nav>

      {/* DETAIL SHEET */}
      <AnimatePresence>
        {selected && <DetailSheet lead={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
