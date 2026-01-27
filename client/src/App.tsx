// client/src/App.tsx
// SOCIAL NATIVE - Gen Z / Instagram-style layout

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, MessageSquare, User, Home } from 'lucide-react';
import { StoryRail } from './components/StoryRail';
import { DMRow } from './components/DMRow';
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

// iOS Glass Nav Icon
const NavIcon = ({ icon, active, onClick, badge }: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) => (
  <button onClick={onClick} className="relative p-2 transition-transform active:scale-90">
    <div className={active ? 'text-white' : 'text-zinc-600'}>{icon}</div>
    {badge && badge > 0 && (
      <div className="absolute top-0.5 right-0 bg-[#FF6B35] text-black text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-black px-1">
        {badge}
      </div>
    )}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('chats');
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

      // Enhance with car data
      const enhancedLeads = (data.data || []).map((lead: Lead, i: number) => ({
        ...lead,
        carModel: lead.carModel || ['Honda City', 'Honda Elevate', 'WR-V', 'Accord'][i % 4],
        carColor: lead.carColor || ['#F3F4F6', '#EF4444', '#3B82F6', '#000000'][i % 4]
      }));

      setLeads(enhancedLeads);
    } catch (err) {
      // Fallback mock data
      setLeads([
        { id: '1', name: 'Rahul Sharma', confidence: 0.92, status: 'APPOINTMENT_SET', carModel: 'Honda City', carColor: '#F3F4F6', budget: 1500000, market: 'India' },
        { id: '2', name: 'Siti Nurhaliza', confidence: 0.45, status: 'NEW', carModel: 'Honda WR-V', carColor: '#EF4444', budget: undefined, market: 'Indonesia' },
        { id: '3', name: 'Arjun Singh', confidence: 0.88, status: 'QUALIFYING', carModel: 'Honda Elevate', carColor: '#3B82F6', budget: 1800000, market: 'India' },
        { id: '4', name: 'Priya Patel', confidence: 0.20, status: 'NEW', carModel: 'Amaze', carColor: '#000', budget: 900000, market: 'India' },
        { id: '5', name: 'Sarah Chen', confidence: 0.78, status: 'NEGOTIATING', carModel: 'Accord', carColor: '#6366F1', budget: 4500000, market: 'Singapore' }
      ]);
    }
    setLoading(false);
  };

  // Filter leads
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.carModel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count hot leads for badge
  const hotCount = leads.filter(l => l.confidence >= 0.85).length;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HEADER (Instagram Style)
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-xl px-4 py-3 flex justify-between items-center border-b border-white/5">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-black tracking-tighter cursor-pointer"
        >
          N<span className="text-[#FF6B35]">.</span>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Zap size={24} className="text-white cursor-pointer" />
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 cursor-pointer"
          />
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. SEARCH BAR (Native iOS Feel)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 py-2">
        <div className="bg-[#1C1C1E] rounded-xl px-3 py-2.5 flex items-center gap-2">
          <Search size={16} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm w-full focus:outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. STORIES RAIL
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="mt-2 mb-2 border-b border-white/5 pb-3">
        <StoryRail leads={leads} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. DM FEED
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="px-2">
        <div className="px-2 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
          <span>Active Conversations</span>
          <span className="text-emerald-400">{filteredLeads.length} leads</span>
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-zinc-500 text-sm">No matches found</p>
            </motion.div>
          ) : (
            filteredLeads.map((lead) => <DMRow key={lead.id} lead={lead} />)
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. iOS GLASS TAB BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 pb-8 pt-3 px-8 z-50">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <NavIcon
            icon={<Home size={24} />}
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavIcon
            icon={<MessageSquare size={24} />}
            active={activeTab === 'chats'}
            onClick={() => setActiveTab('chats')}
            badge={hotCount}
          />
          <NavIcon
            icon={<Zap size={24} />}
            active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          />
          <NavIcon
            icon={<User size={24} />}
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </div>
    </div>
  );
}
