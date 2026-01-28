import { useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { useMotionValue, useTransform, motion, AnimatePresence } from 'framer-motion';
import { ProCard } from './components/ProCard';
import { DetailSheet } from './components/DetailSheet';
import { MockEngine } from './services/MockEngine';
import type { Lead } from './services/MockEngine';
import { Zap, Loader2, Phone, Ghost, RotateCcw } from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  // INITIALIZE (The "Boot" Sequence)
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    const data = await MockEngine.getLeads();
    // Sort by Commission (The "Elon" Logic)
    const sorted = [...data].sort((a, b) => b.commission.amount - a.commission.amount);
    setLeads(sorted);
    setLoading(false);
  };

  const handleReset = async () => {
    await MockEngine.resetData();
    await loadLeads();
  };

  // ACTIONS
  const handleGhost = async (id: string) => {
    // Optimistic UI Update
    setLeads(prev => prev.filter(l => l.id !== id));
    await MockEngine.nukeLead(id);
  };

  const handleCall = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (lead) {
      console.log(`📞 Calling: ${lead.name} at ${lead.phone}`);
      // In production: window.location.href = `tel:${lead.phone}`;
    }
  };

  // Calculate totals
  const totalCommission = leads.reduce((acc, lead) => acc + lead.commission.amount, 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 pb-20">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,107,53,0.3)]">
            <Zap size={18} className="text-black fill-current" />
          </div>
          <div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">My Commission</div>
            <div className="text-base font-black text-white leading-none">₹ {totalCommission.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Reset Demo Data"
          >
            <RotateCcw size={14} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400">LIVE</span>
          </div>
        </div>
      </header>

      {/* FEED */}
      <main className="pt-2">
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs uppercase tracking-widest">Syncing Digital Twin...</span>
          </div>
        )}

        {/* DATA STATE */}
        {!loading && (
          <>
            <div className="px-4 py-2 flex justify-between items-center bg-[#09090B] border-b border-white/5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Action Queue
              </span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">
                {leads.length} LIVE
              </span>
            </div>

            {leads.map(lead => (
              <ProCardWithSwipe
                key={lead.id}
                lead={lead}
                onOpen={setSelectedLead}
                onGhost={handleGhost}
                onCall={handleCall}
              />
            ))}

            {leads.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-zinc-600 text-sm">All leads processed.</div>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-zinc-900 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Reset Demo Data
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* BOTTOM DOCK */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#09090B] border-t border-white/10 p-4 flex justify-around items-center z-40 text-[10px] font-bold tracking-widest">
        <button className="text-white flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
          QUEUE
        </button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">WORKFLOWS</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">REPORTS</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">SETTINGS</button>
      </nav>

      {/* DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedLead && (
          <DetailSheet lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// SWIPEABLE WRAPPER FOR PRO CARD
interface ProCardWithSwipeProps {
  lead: Lead;
  onOpen: (lead: Lead) => void;
  onGhost: (id: string) => void;
  onCall: (id: string) => void;
}

const ProCardWithSwipe = ({ lead, onOpen, onGhost, onCall }: ProCardWithSwipeProps) => {
  const x = useMotionValue(0);
  const bg = useTransform(x, [-100, 0, 100], ['#EF4444', '#000000', '#10B981']);
  const actionOpacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 0.5, 0, 0.5, 1]);

  const bind = useDrag(({ movement: [mx], active }) => {
    x.set(mx);
    if (!active) {
      if (mx > 100) {
        onCall(lead.id);
        x.set(0);
      } else if (mx < -100) {
        onGhost(lead.id);
        x.set(0);
      } else {
        x.set(0);
      }
    }
  }, { axis: 'x', filterTaps: true });

  // Extract gesture handlers, excluding conflicting event handlers
  const { onDrag, onDragStart, onDragEnd, ...gestureHandlers } = bind() as Record<string, unknown>;

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      <motion.div
        style={{ backgroundColor: bg }}
        className="absolute inset-0 flex justify-between items-center px-6"
      >
        <motion.div style={{ opacity: actionOpacity }} className="text-[10px] font-bold uppercase text-black flex items-center gap-1">
          <Phone size={14} fill="currentColor" /> Call
        </motion.div>
        <motion.div style={{ opacity: actionOpacity }} className="text-[10px] font-bold uppercase text-white flex items-center gap-1">
          Ghost <Ghost size={14} />
        </motion.div>
      </motion.div>

      {/* Foreground Card */}
      <motion.div
        {...gestureHandlers}
        style={{ x, touchAction: 'none' }}
        className="relative z-10"
      >
        <ProCard lead={lead} onOpen={onOpen} />
      </motion.div>
    </div>
  );
};
