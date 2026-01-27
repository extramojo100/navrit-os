// client/src/App.tsx
// IRON MAN HUD - Operational Command Center
// Target tracking, Priority Queue, Deal Focus

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, Filter, RefreshCw } from 'lucide-react';
import { LeadCard } from './components/LeadCard';
import './index.css';

interface Lead {
  id: string;
  name: string;
  status: string;
  carModel: string;
  carColor: string;
  stockLocation: string;
  exShowroom: number;
  discount: number;
  accessories: number;
  insurance: number;
  servicePkg: number;
  netPrice: number;
}

// Bottom Nav Button
const NavBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`text-[10px] font-bold tracking-widest transition-colors ${active ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
  >
    {label}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('queue');
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

      // Enhance with automotive deal data
      const enhancedLeads = (data.data || []).map((lead: any, i: number) => ({
        ...lead,
        carModel: lead.carModel || ['Honda City ZX CVT', 'Elevate Apex', 'WR-V Edge', 'Civic RS Turbo'][i % 4],
        carColor: lead.carColor || ['#F0F0F0', '#D91C1C', '#1E3A8A', '#000000'][i % 4],
        stockLocation: ['Yard B (Ready)', 'Transit (2 Days)', 'Yard A (Ready)', 'Transit (5 Days)'][i % 4],
        exShowroom: [1680000, 1450000, 1120000, 2200000][i % 4],
        discount: [45000, 0, 25000, 60000][i % 4],
        accessories: [12000, 0, 8000, 35000][i % 4],
        insurance: [45000, 38000, 32000, 55000][i % 4],
        servicePkg: [18000, 0, 15000, 22000][i % 4],
        get netPrice() {
          return this.exShowroom - this.discount + this.accessories + this.insurance + this.servicePkg;
        }
      }));

      setLeads(enhancedLeads);
    } catch (err) {
      // Fallback mock data with full automotive context
      setLeads([
        {
          id: '1', name: 'Rahul Sharma', status: 'APPOINTMENT_SET',
          carModel: 'Honda City ZX CVT', carColor: '#F0F0F0', stockLocation: 'Yard B (Ready)',
          exShowroom: 1680000, discount: 45000, accessories: 12000, insurance: 45000, servicePkg: 18000,
          get netPrice() { return this.exShowroom - this.discount + this.accessories + this.insurance + this.servicePkg; }
        },
        {
          id: '2', name: 'Arjun Singh', status: 'NEW',
          carModel: 'Elevate Apex', carColor: '#D91C1C', stockLocation: 'Transit (2 Days)',
          exShowroom: 1450000, discount: 0, accessories: 0, insurance: 38000, servicePkg: 0,
          get netPrice() { return this.exShowroom - this.discount + this.accessories + this.insurance + this.servicePkg; }
        },
        {
          id: '3', name: 'Priya Patel', status: 'NEGOTIATING',
          carModel: 'WR-V Edge', carColor: '#1E3A8A', stockLocation: 'Yard A (Ready)',
          exShowroom: 1120000, discount: 25000, accessories: 8000, insurance: 32000, servicePkg: 15000,
          get netPrice() { return this.exShowroom - this.discount + this.accessories + this.insurance + this.servicePkg; }
        }
      ]);
    }
    setLoading(false);
  };

  // Filter leads
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.carModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const actionRequired = leads.filter(l => ['APPOINTMENT_SET', 'ENGAGED', 'NEGOTIATING'].includes(l.status)).length;
  const totalValue = leads.reduce((sum, l) => sum + (l.netPrice || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B35]/30 pb-20">

      {/* ═══════════════════════════════════════════════════════════════════════
          HUD HEADER
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 animate-pulse rounded-sm" />
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">SYS: ONLINE</span>
          </div>
          <div className="flex gap-4 text-[10px] font-mono">
            <span className="text-zinc-500">TARGET: <span className="text-white">₹80L</span></span>
            <span className="text-zinc-500">PIPELINE: <span className="text-[#FF6B35]">₹{(totalValue / 100000).toFixed(1)}L</span></span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          SEARCH/FILTER BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 py-3 flex gap-2">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-lg flex items-center px-3 h-10">
          <Search size={14} className="text-zinc-600" />
          <input
            type="text"
            placeholder="VIN / Phone / Model"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs w-full ml-2 focus:outline-none text-white placeholder:text-zinc-600"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={fetchLeads}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </motion.button>
        <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-white/10 transition-colors">
          <Filter size={14} />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FEED
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="px-2">
        <div className="flex justify-between px-2 mb-2">
          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Priority Queue</span>
          <span className="text-[10px] text-[#FF6B35] font-mono font-bold">
            ACTION REQ: {actionRequired}
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-zinc-500 text-sm">No matches found</p>
            </motion.div>
          ) : (
            filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM COMMAND BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#09090B]/95 backdrop-blur-md border-t border-white/10 p-4 flex justify-between items-center z-50">
        <NavBtn label="QUEUE" active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} />
        <NavBtn label="STOCK" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
        <NavBtn label="PERF" active={activeTab === 'perf'} onClick={() => setActiveTab('perf')} />
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,107,53,0.35)] cursor-pointer"
        >
          <Zap size={22} fill="currentColor" />
        </motion.div>
      </div>
    </div>
  );
}
