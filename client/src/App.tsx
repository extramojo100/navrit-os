// client/src/App.tsx
// DESIGN IQ 500 - PWA Layout
// Empathy Header + Sticky Bottom Nav + Priority Feed

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Layers, Trophy, Settings, Bell, Search, Filter, Phone, Zap } from 'lucide-react';
import { LeadCard } from './components/LeadCard';
import './index.css';

interface Lead {
  id: string;
  name: string;
  confidence: number;
  status: string;
  carModel?: string;
  carColor?: string;
  budget?: number;
  market?: string;
}

// Bottom Nav Button Component
const NavBtn = ({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-white' : 'text-gray-500'}`}
  >
    {icon}
    <span className="text-[9px] font-medium">{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/leads');
      const data = await res.json();

      // Enhance with car data if not present
      const enhancedLeads = (data.data || []).map((lead: Lead, i: number) => ({
        ...lead,
        carModel: lead.carModel || ['Honda City ZX', 'Honda Elevate', 'WR-V', 'Accord'][i % 4],
        carColor: lead.carColor || ['white', 'red', 'blue', 'black'][i % 4]
      }));

      setLeads(enhancedLeads);
    } catch (err) {
      // Fallback mock data with car details
      setLeads([
        {
          id: '1', name: 'Rahul Sharma', confidence: 0.92, status: 'APPOINTMENT_SET',
          carModel: 'Honda City ZX', carColor: 'white', budget: 1500000, market: 'India'
        },
        {
          id: '2', name: 'Siti Nurhaliza', confidence: 0.45, status: 'NEW',
          carModel: 'Honda WR-V', carColor: 'red', budget: undefined, market: 'Indonesia'
        },
        {
          id: '3', name: 'Arjun Singh', confidence: 0.78, status: 'QUALIFYING',
          carModel: 'Honda Elevate', carColor: 'blue', budget: 1800000, market: 'India'
        },
        {
          id: '4', name: 'Sarah Chen', confidence: 0.88, status: 'NEGOTIATING',
          carModel: 'Honda Accord', carColor: 'black', budget: 4500000, market: 'Singapore'
        }
      ]);
    }
    setLoading(false);
  };

  // Filter leads
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.carModel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const hotCount = leads.filter(l => l.confidence >= 0.85).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 font-sans selection:bg-emerald-500/30">

      {/* ═══════════════════════════════════════════════════════════════════════
          1. EMPATHY HEADER (Good Morning + Notification)
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-5 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Good Morning, Gaurav</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {hotCount > 0 ? (
                <>{hotCount} hot lead{hotCount > 1 ? 's' : ''} need your attention. You're on fire! 🔥</>
              ) : (
                <>No hot leads yet. Time to warm them up! ☀️</>
              )}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center relative border border-white/10"
          >
            <Bell size={16} className="text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="mt-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search by name or car..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181B] border border-white/5 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-4 rounded-lg bg-[#18181B] border border-white/5 flex items-center justify-center text-gray-400 hover:bg-white/5 transition-colors"
          >
            <Filter size={16} />
          </motion.button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. THE FEED (Priority Sorted)
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Priority Queue</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Zap size={10} /> LIVE
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#18181B] rounded-xl p-12 text-center border border-white/5"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold mb-1">No Results</h3>
              <p className="text-sm text-gray-500">Try a different search term</p>
            </motion.div>
          ) : (
            filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. STICKY BOTTOM NAV (PWA Controller)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#09090B]/95 backdrop-blur-xl border-t border-white/10 pb-6 pt-3 px-6 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <NavBtn
            icon={<Home size={20} />}
            label="Home"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavBtn
            icon={<Layers size={20} />}
            label="Leads"
            active={activeTab === 'leads'}
            onClick={() => setActiveTab('leads')}
          />

          {/* CENTER ACTION BUTTON (The CTA) */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="relative -top-5 bg-gradient-to-tr from-emerald-500 to-emerald-400 w-14 h-14 rounded-full shadow-[0_4px_25px_rgba(16,185,129,0.5)] flex items-center justify-center text-black"
          >
            <Phone size={24} strokeWidth={2.5} />
          </motion.button>

          <NavBtn
            icon={<Trophy size={20} />}
            label="Wins"
            active={activeTab === 'wins'}
            onClick={() => setActiveTab('wins')}
          />
          <NavBtn
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </div>
    </div>
  );
}
