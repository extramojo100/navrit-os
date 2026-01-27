// client/src/App.tsx
// NAVRIT - God Mode Dashboard
// Bloomberg Density + Cosmic Theme

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, TrendingUp, Users, AlertTriangle, Zap, Settings, Activity } from 'lucide-react';
import { LeadCard } from './components/LeadCard';
import './index.css';

interface Lead {
  id: string;
  name: string | null;
  phone: string;
  status: string;
  market: string;
  confidence: number;
  budget: number | null;
  corrections: { field: string; aiValue: string; humanValue: string }[];
}

interface Stats {
  totalLeads: number;
  byGate: { green: number; yellow: number; red: number };
  calibration?: { greenThreshold: number; yellowThreshold: number };
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [theme, setTheme] = useState<'cosmic' | 'audi'>('cosmic');

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch('http://localhost:3000/api/leads'),
        fetch('http://localhost:3000/api/leads/stats')
      ]);
      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();
      setLeads(leadsData.data || []);
      setStats(statsData.data || null);
    } catch (err) {
      console.error('API Error:', err);
      // Demo data fallback
      setLeads([
        { id: '1', name: 'Rahul Sharma', phone: '+919876543210', status: 'QUALIFYING', market: 'Honda City', confidence: 0.92, budget: 1500000, corrections: [{ field: 'budget', aiValue: '15000', humanValue: '1500000' }] },
        { id: '2', name: 'Budi Santoso', phone: '+62812345678', status: 'NEW', market: 'Toyota Fortuner', confidence: 0.72, budget: 450000000, corrections: [] },
        { id: '3', name: 'Ahmad Al-Rashid', phone: '+971501234567', status: 'CONTACTED', market: 'Innova Zenix', confidence: 0.45, budget: 180000, corrections: [] },
        { id: '4', name: 'Sarah Chen', phone: '+6591234567', status: 'NEGOTIATING', market: 'Toyota Vios', confidence: 0.88, budget: 85000, corrections: [] }
      ]);
      setStats({ totalLeads: 4, byGate: { green: 2, yellow: 1, red: 1 } });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen" data-theme={theme}>
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER - Flight Control
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-orange-700 flex items-center justify-center shadow-lg neon-glow"
              >
                <span className="text-lg font-black text-white">N</span>
              </motion.div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Navrit<span className="text-[rgb(var(--primary))]">.ai</span>
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">God Mode</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={loading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'cosmic' ? 'audi' : 'cosmic')}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {/* ═══════════════════════════════════════════════════════════════════════
            STATS BAR - Bloomberg Style
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-3 text-center"
          >
            <Users className="w-5 h-5 text-[rgb(var(--primary))] mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold">{stats?.totalLeads ?? leads.length}</div>
            <div className="text-[9px] text-gray-500 uppercase">Total</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-3 text-center"
          >
            <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold text-emerald-400">{stats?.byGate.green ?? 0}</div>
            <div className="text-[9px] text-gray-500 uppercase">Green</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-3 text-center"
          >
            <Activity className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold text-amber-400">{stats?.byGate.yellow ?? 0}</div>
            <div className="text-[9px] text-gray-500 uppercase">Yellow</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-xl p-3 text-center"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold text-red-400">{stats?.byGate.red ?? 0}</div>
            <div className="text-[9px] text-gray-500 uppercase">Red</div>
          </motion.div>
        </div>

        {/* Calibration Status */}
        {stats?.calibration && (
          <div className="glass-panel rounded-lg p-2 mb-4 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-[rgb(var(--primary))]" />
              <span className="text-gray-400">SELF-HEALING</span>
            </div>
            <div className="font-mono text-gray-300">
              GREEN ≥{(stats.calibration.greenThreshold * 100).toFixed(0)}% |
              YELLOW ≥{(stats.calibration.yellowThreshold * 100).toFixed(0)}%
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            LEAD FEED
            ═══════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="popLayout">
          {leads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-xl p-12 text-center"
            >
              <div className="text-4xl mb-3">📭</div>
              <h3 className="font-bold mb-1">No Leads</h3>
              <p className="text-sm text-gray-500">Waiting for incoming messages...</p>
            </motion.div>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8">
        <div className="max-w-3xl mx-auto px-4 py-3 text-center text-[10px] text-gray-500 font-mono">
          NAVRIT v1.0 • GOD MODE • {theme.toUpperCase()} THEME
        </div>
      </footer>
    </div>
  );
}
