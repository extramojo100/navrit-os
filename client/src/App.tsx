// client/src/App.tsx
// NAVRIT SOCIAL OS - Main Controller
// Instagram x WhatsApp for Sales

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, MessageSquare, Home, Menu } from 'lucide-react';
import { StoryRail } from './components/StoryRail';
import { DMRow } from './components/DMRow';
import { StoryViewer } from './components/StoryViewer';
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

// Nav Icon Component
const NavIcon = ({ icon, active, onClick, badge }: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) => (
  <button onClick={onClick} className="relative p-2 active:scale-90 transition-transform">
    <div className={active ? 'text-white' : 'text-zinc-600'}>{icon}</div>
    {badge && badge > 0 && (
      <div className="absolute -top-0 -right-0 bg-[#FF6B35] text-black text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-black">
        {badge}
      </div>
    )}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedStory, setSelectedStory] = useState<Lead | null>(null);
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
        carModel: lead.carModel || ['Honda City', 'Honda Elevate', 'WR-V', 'Civic RS', 'Accord'][i % 5],
        carColor: lead.carColor || ['#F3F4F6', '#EF4444', '#3B82F6', '#000000', '#6366F1'][i % 5]
      }));

      setLeads(enhancedLeads);
    } catch (err) {
      // Fallback mock data
      setLeads([
        { id: '1', name: 'Rahul Sharma', confidence: 0.92, status: 'APPOINTMENT_SET', carModel: 'Honda City', carColor: '#F3F4F6', budget: 1500000, market: 'India' },
        { id: '2', name: 'Siti Nurhaliza', confidence: 0.45, status: 'NEW', carModel: 'Honda WR-V', carColor: '#EF4444', budget: undefined, market: 'Indonesia' },
        { id: '3', name: 'Arjun Singh', confidence: 0.88, status: 'QUALIFYING', carModel: 'Honda Elevate', carColor: '#3B82F6', budget: 1800000, market: 'India' },
        { id: '4', name: 'Priya Patel', confidence: 0.20, status: 'NEW', carModel: 'Amaze', carColor: '#000', budget: 900000, market: 'India' },
        { id: '5', name: 'Budi Santoso', confidence: 0.95, status: 'ENGAGED', carModel: 'Civic RS', carColor: '#fff', budget: 500000000, market: 'Indonesia' }
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
    <div className="min-h-screen bg-black text-white font-sans pb-24 selection:bg-[#FF6B35]/30">

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HEADER
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl px-4 py-3 flex justify-between items-center border-b border-white/5">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-black tracking-tighter cursor-pointer"
        >
          N<span className="text-[#FF6B35]">.</span>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-black cursor-pointer"
        />
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          2. SEARCH
          ═════════════════════════════════════════════════════════════════════ */}
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

      {/* ═════════════════════════════════════════════════════════════════════
          3. STORIES RAIL
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="mt-3 mb-2">
        <StoryRail leads={leads} onOpenStory={setSelectedStory} />
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          4. DM FEED
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="bg-black min-h-[60vh] rounded-t-3xl border-t border-white/5 pt-4">
        <div className="px-5 pb-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between items-center">
          <span>Priority Inbox</span>
          <span className="text-[#FF6B35]">{filteredLeads.length} Active</span>
        </div>

        <div className="px-2">
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
              filteredLeads.map((lead) => (
                <DMRow key={lead.id} lead={lead} onClick={() => setSelectedStory(lead)} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          5. STORY VIEWER MODAL
          ═════════════════════════════════════════════════════════════════════ */}
      {selectedStory && (
        <StoryViewer lead={selectedStory} onClose={() => setSelectedStory(null)} />
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          6. BOTTOM NAV
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 pb-8 pt-3 px-8 z-50">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <NavIcon
            icon={<Home size={26} />}
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavIcon
            icon={<MessageSquare size={26} />}
            active={activeTab === 'chats'}
            onClick={() => setActiveTab('chats')}
            badge={hotCount}
          />
          <NavIcon
            icon={<Zap size={26} />}
            active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          />
          <NavIcon
            icon={<Menu size={26} />}
            active={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
          />
        </div>
      </div>
    </div>
  );
}
