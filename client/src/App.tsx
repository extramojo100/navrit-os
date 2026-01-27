// client/src/App.tsx
// NAVRIT KILLER OS - The HUD & Stack Controller
// Gamified commission tracking + Tinder-style focus

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Menu, RefreshCw } from 'lucide-react';
import { KillerCard } from './components/KillerCard';
import { WarRoom } from './components/WarRoom';
import './index.css';

interface Lead {
  id: string;
  name: string;
  probability: number;
  carModel: string;
  variant: string;
  color: string;
  daysInStock: number;
  location: string;
  commission: number;
  offerPrice: number;
  financier: string;
  emi: string;
  tradeInValue: number | string;
  tradeInCar: string;
}

// Nav Icon
const NavIcon = ({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className={active ? 'text-[#FF6B35]' : 'text-zinc-500'}>
    {icon}
  </button>
);

export default function App() {
  const [warRoomLead, setWarRoomLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [streak, setStreak] = useState(3);
  const [earnings, setEarnings] = useState(42500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    // In real app, fetch from API
    setTimeout(() => {
      setLeads([
        {
          id: '1', name: 'Rahul Sharma', probability: 0.85,
          carModel: 'City ZX', variant: 'CVT Petrol', color: 'Radiant Red',
          daysInStock: 62, location: 'Yard B',
          commission: 8500, offerPrice: 1650000, financier: 'HDFC', emi: '₹22,500',
          tradeInValue: 450000, tradeInCar: 'Swift 2018'
        },
        {
          id: '2', name: 'Arjun Singh', probability: 0.60,
          carModel: 'Elevate', variant: 'Apex CVT', color: 'Lunar Silver',
          daysInStock: 12, location: 'Transit',
          commission: 4200, offerPrice: 1520000, financier: 'SBI', emi: '₹20,100',
          tradeInValue: 'No Trade-In', tradeInCar: '-'
        },
        {
          id: '3', name: 'Priya Patel', probability: 0.75,
          carModel: 'WR-V Edge', variant: 'SV Diesel', color: 'Pearl White',
          daysInStock: 45, location: 'Yard A',
          commission: 5800, offerPrice: 1280000, financier: 'ICICI', emi: '₹17,200',
          tradeInValue: 320000, tradeInCar: 'i20 2019'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    const currentLead = leads[0];
    if (!currentLead) return;

    if (dir === 'right') {
      // CALL - Count as action
      setStreak(s => s + 1);
      setEarnings(e => e + currentLead.commission);
    }

    // Remove card
    setTimeout(() => {
      setLeads(prev => prev.slice(1));
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          1. THE GAMIFIED HUD
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="px-5 py-4 flex justify-between items-center bg-gradient-to-b from-black via-black/80 to-transparent relative z-20">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B35] to-red-600 flex items-center justify-center text-black shadow-[0_0_20px_#FF6B35]"
          >
            <Flame size={20} fill="currentColor" />
          </motion.div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Streak</div>
            <div className="text-lg font-black text-white leading-none">{streak} Kills</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Earnings</div>
          <div className="text-xl font-black text-emerald-400 leading-none font-mono">
            ₹{earnings.toLocaleString()}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. THE STACK (Center Stage)
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="relative w-full max-w-md mx-auto h-[70vh] px-4 mt-2">
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <RefreshCw size={32} className="text-[#FF6B35] animate-spin" />
            </motion.div>
          ) : leads.length > 0 ? (
            leads.map((lead, i) => (
              <KillerCard
                key={lead.id}
                lead={lead}
                index={i}
                onSwipe={handleSwipe}
                onClick={() => setWarRoomLead(lead)}
              />
            ))
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Trophy size={64} className="mb-4 text-emerald-500" />
              <h2 className="text-2xl font-black text-white mb-2">All Clear!</h2>
              <p className="text-zinc-500 mb-6">You crushed it, champion.</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={loadLeads}
                className="bg-[#FF6B35] text-black font-bold py-3 px-8 rounded-full text-sm uppercase"
              >
                Load More Deals
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. WAR ROOM OVERLAY
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {warRoomLead && (
          <WarRoom lead={warRoomLead} onClose={() => setWarRoomLead(null)} />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. BOTTOM NAV
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-8 bg-zinc-900/90 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10 z-30">
        <NavIcon active icon={<Flame size={22} />} />
        <NavIcon icon={<Trophy size={22} />} />
        <NavIcon icon={<Menu size={22} />} />
      </div>
    </div>
  );
}
