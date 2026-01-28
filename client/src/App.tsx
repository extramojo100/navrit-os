import { useState } from 'react';
import { ProRow } from './components/ProRow';
import { VerticalReceipt } from './components/VerticalReceipt';
import { ActionDock } from './components/ActionDock';
import { SocialBooster } from './components/SocialBooster';
import { Menu, Fingerprint, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// LEAD TYPE
interface Journey {
  model: string;
  stage: string;
  type: string;
  price: number;
  discount: number;
  insurance: number;
  accessories: number;
  netPrice: number;
  stockStatus: 'YARD' | 'TRANSIT' | 'ORDER';
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  temperature: 'HOT' | 'COLD' | 'WARM';
  commissionEst: number;
  journeys: Journey[];
}

// DEMO DATA (Includes DELIVERED case for SocialBooster)
const MOCK_LEADS: Lead[] = [
  {
    id: '1', name: 'Rahul Sharma', phone: '+91 98765 00001', temperature: 'HOT', commissionEst: 14500,
    journeys: [{
      model: 'Honda City ZX', stage: 'NEGOTIATION', type: 'NEW_SALE',
      price: 1680000, discount: 45000, insurance: 42000, accessories: 12000, netPrice: 1689000,
      stockStatus: 'YARD'
    }]
  },
  {
    id: '2', name: 'Priya Patel', phone: '+91 99012 34567', temperature: 'WARM', commissionEst: 11000,
    journeys: [{
      model: 'City VX CVT', stage: 'FINANCE_APPROVED', type: 'NEW_SALE',
      price: 1520000, discount: 35000, insurance: 38000, accessories: 18000, netPrice: 1541000,
      stockStatus: 'TRANSIT'
    }]
  },
  {
    id: '3', name: 'Vikram Malhotra', phone: '+91 88776 65544', temperature: 'WARM', commissionEst: 7500,
    journeys: [{
      model: 'Amaze VX MT', stage: 'BOOKING_DONE', type: 'NEW_SALE',
      price: 980000, discount: 25000, insurance: 28000, accessories: 8000, netPrice: 991000,
      stockStatus: 'ORDER'
    }]
  },
  {
    id: '4', name: 'Arjun Singh', phone: '+91 99887 77665', temperature: 'COLD', commissionEst: 4000,
    journeys: [{
      model: 'Amaze Elite', stage: 'DELIVERED', type: 'TITLE_TRANSFER',
      price: 950000, discount: 0, insurance: 0, accessories: 0, netPrice: 960000,
      stockStatus: 'YARD'
    }]
  }
];

export default function App() {
  const [selected, setSelected] = useState<Lead | null>(null);

  const totalSales = MOCK_LEADS.reduce((acc, l) => acc + l.journeys[0].netPrice, 0);
  const activeCount = MOCK_LEADS.filter(l => l.journeys[0].stage !== 'DELIVERED').length;

  const handleCall = () => {
    if (selected) {
      console.log(`📞 Calling: ${selected.name} at ${selected.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (selected) {
      console.log(`💬 WhatsApp: ${selected.name}`);
    }
  };

  const handleQuote = () => {
    if (selected) {
      console.log(`📄 Generating Quote for: ${selected.name}`);
    }
  };

  const handleCloseDeal = () => {
    if (selected) {
      console.log(`⚡ Close Deal: ${selected.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B35]/30">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/5 px-4 h-14 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <Fingerprint size={16} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">Total Sales</div>
            <div className="text-sm font-bold text-white">₹ {(totalSales / 10000000).toFixed(2)} Cr</div>
          </div>
        </div>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <Menu size={16} className="text-zinc-400" />
        </button>
      </header>

      {/* FEED */}
      <main>
        <div className="px-4 py-2 bg-[#09090B] border-b border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Priority Queue</span>
          <span className="text-[10px] text-[#FF6B35] font-bold">{activeCount} Active</span>
        </div>
        {MOCK_LEADS.map(lead => (
          <ProRow key={lead.id} lead={lead} onClick={() => setSelected(lead)} />
        ))}
      </main>

      {/* DETAIL OVERLAY */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* HEADER */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#09090B]">
              <div>
                <h2 className="text-sm font-bold text-white">{selected.name}</h2>
                <p className="text-[10px] text-zinc-500">{selected.phone} • {selected.journeys[0].stage.replace('_', ' ')}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 bg-white/5 rounded-full text-zinc-400 hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8">

              {/* 1. FINANCIALS (Vertical Receipt) */}
              <section>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Deal Structure</div>
                <VerticalReceipt
                  data={selected.journeys[0]}
                  commission={selected.commissionEst}
                />
              </section>

              {/* 2. VICTORY LAP (Only if DELIVERED) */}
              {selected.journeys[0].stage === 'DELIVERED' && (
                <SocialBooster
                  model={selected.journeys[0].model}
                  customerName={selected.name.split(' ')[0]}
                />
              )}
            </div>

            {/* 3. ACTION DOCK (Persistent) */}
            <ActionDock
              onCall={handleCall}
              onWhatsApp={handleWhatsApp}
              onQuote={handleQuote}
              onClose={handleCloseDeal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[#09090B] border-t border-white/10 flex justify-around items-center text-[10px] font-bold">
        <button className="text-white flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[#FF6B35]" />
          QUEUE
        </button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">TASKS</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">PERF</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">SETTINGS</button>
      </nav>
    </div>
  );
}
