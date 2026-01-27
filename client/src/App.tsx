// client/src/App.tsx
// Navrit Dashboard - High Density Feed

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, Users, AlertTriangle, Zap } from 'lucide-react';
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

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalLeads: number; byGate: { green: number; yellow: number; red: number } } | null>(null);

  useEffect(() => {
    fetchData();
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
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#E85A24] flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
              <span className="text-xl font-bold">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Navrit<span className="text-[#FF6B35]">.ai</span>
              </h1>
              <p className="text-xs text-white/40">Lead Intelligence Feed</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{stats?.totalLeads ?? leads.length}</div>
            <div className="text-xs text-white/50">Total Leads</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-400">{stats?.byGate.green ?? 0}</div>
            <div className="text-xs text-white/50">🟢 Auto-Apply</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-400">{stats?.byGate.yellow ?? 0}</div>
            <div className="text-xs text-white/50">🟡 Review</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-red-400">{stats?.byGate.red ?? 0}</div>
            <div className="text-xs text-white/50">🔴 Escalate</div>
          </div>
        </div>

        {/* Lead Feed */}
        <div className="space-y-0">
          {leads.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">No Leads Yet</h3>
              <p className="text-white/50">Waiting for incoming messages...</p>
            </div>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-white/30">
          NAVRIT MVP v1.0 • High Density Feed • {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  );
}
