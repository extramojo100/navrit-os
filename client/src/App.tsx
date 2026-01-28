import React, { useState, useEffect } from 'react';
// import { supabase } from './lib/supabaseClient'; // Uncomment when keys are ready
import { ProRow } from './components/ProRow';
import { VerticalReceipt } from './components/VerticalReceipt';
import { ActionDock } from './components/ActionDock';
import { SocialBooster } from './components/SocialBooster';
import { Fingerprint, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Discount {
  label: string;
  amount: number;
}

interface Journey {
  model: string;
  ex_showroom: number;
  insurance: number;
  accessories: number;
  net_price: number;
  discounts: Discount[];
}

interface Lead {
  id: string;
  name: string;
  status: string;
  temperature: string;
  commission_est: number;
  journeys: Journey[];
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);

  // MOCK DATA (Until you paste keys)
  // This mirrors the Supabase Schema exactly
  useEffect(() => {
    setLeads([
      {
        id: '1', name: 'Rahul Sharma', status: 'NEGOTIATION', temperature: 'HOT', commission_est: 14500,
        journeys: [{
          model: 'Honda City ZX', ex_showroom: 1680000, insurance: 42000, accessories: 12000, net_price: 1689000,
          discounts: [{ label: 'Corp', amount: 5000 }, { label: 'Exchange', amount: 40000 }]
        }]
      },
      {
        id: '2', name: 'Arjun Singh', status: 'DELIVERED', temperature: 'WARM', commission_est: 4000,
        journeys: [{
          model: 'Amaze Elite', ex_showroom: 950000, insurance: 0, accessories: 0, net_price: 950000,
          discounts: []
        }]
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B35]/30 pb-24">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/5 px-4 h-14 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <Fingerprint size={16} className="text-zinc-400" />
          </div>
          <span className="text-xs font-bold text-zinc-300 tracking-widest">NAVRIT 11.0</span>
        </div>
      </header>

      {/* FEED */}
      <main>
        <div className="px-4 py-2 bg-[#09090B] border-b border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Queue</span>
          <span className="text-[10px] text-emerald-500 font-bold">{leads.length} Live</span>
        </div>
        {leads.map(l => (
          <ProRow key={l.id} lead={l} onClick={() => setSelected(l)} />
        ))}
      </main>

      {/* DETAIL OVERLAY */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col"
          >
            {/* SHEET HEADER */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#09090B]">
              <div>
                <h2 className="text-sm font-bold text-white">{selected.name}</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">ID: {selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 bg-white/5 rounded-full text-zinc-400">
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-32">

              {/* 1. FINANCIALS */}
              <section>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Deal Structure</div>
                <VerticalReceipt journey={selected.journeys[0]} />
              </section>

              {/* 2. SOCIAL BOOSTER (Conditional) */}
              {selected.status === 'DELIVERED' && (
                <SocialBooster model={selected.journeys[0].model} />
              )}

            </div>

            {/* 3. STICKY DOCK */}
            <ActionDock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
