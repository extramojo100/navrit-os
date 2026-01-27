// client/src/App.tsx
// Navrit Dashboard - Investor Ready UI

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, Users, AlertTriangle, Zap, Phone, DollarSign } from 'lucide-react';
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
        { id: '1', name: 'Rahul Sharma', phone: '+919876543210', status: 'QUALIFYING', market: 'INDIA', confidence: 0.92, budget: 1500000, corrections: [{ field: 'budget', aiValue: '15000', humanValue: '1500000' }] },
        { id: '2', name: 'Budi Santoso', phone: '+62812345678', status: 'NEW', market: 'INDONESIA', confidence: 0.72, budget: 450000000, corrections: [] },
        { id: '3', name: 'Ahmad Al-Rashid', phone: '+971501234567', status: 'CONTACTED', market: 'UAE', confidence: 0.45, budget: 180000, corrections: [] }
      ]);
      setStats({ totalLeads: 3, byGate: { green: 1, yellow: 1, red: 1 } });
    }
    setLoading(false);
  };

  const getGateColor = (confidence: number) => {
    if (confidence >= 0.85) return { bg: 'bg-green-500', text: 'text-green-400', label: '🟢 GREEN' };
    if (confidence >= 0.5) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: '🟡 YELLOW' };
    return { bg: 'bg-red-500', text: 'text-red-400', label: '🔴 RED' };
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#E85A24] flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
              <span className="text-xl font-bold">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Navrit<span className="text-[#FF6B35]">.ai</span>
              </h1>
              <p className="text-xs text-white/40">Lead Intelligence Platform</p>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFB088] bg-clip-text text-transparent">
              {stats?.totalLeads ?? leads.length}
            </div>
            <div className="text-sm text-white/50 mt-1">Total Leads</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-4xl font-bold text-green-400">{stats?.byGate.green ?? 0}</div>
            <div className="text-sm text-white/50 mt-1">🟢 Auto-Apply</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-4xl font-bold text-yellow-400">{stats?.byGate.yellow ?? 0}</div>
            <div className="text-sm text-white/50 mt-1">🟡 Review</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-4xl font-bold text-red-400">{stats?.byGate.red ?? 0}</div>
            <div className="text-sm text-white/50 mt-1">🔴 Escalate</div>
          </div>
        </div>

        {/* Lead Cards */}
        <div className="space-y-4">
          {leads.map((lead) => {
            const gate = getGateColor(lead.confidence);
            return (
              <div
                key={lead.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#FF6B35]/50 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Gate Indicator */}
                    <div className={`w-3 h-3 rounded-full ${gate.bg} shadow-lg`} style={{ boxShadow: `0 0 12px currentColor` }} />

                    <div>
                      <h3 className="text-xl font-bold">{lead.name || 'Unknown'}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{lead.market}</span>
                        <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{lead.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${gate.bg}/20 ${gate.text} border border-current/30`}>
                      {Math.round(lead.confidence * 100)}% • {gate.label}
                    </div>
                    {lead.budget && (
                      <div className="flex items-center justify-end gap-1 mt-2 text-sm text-white/50">
                        <DollarSign className="w-3 h-3" />
                        {lead.budget.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Event Badge */}
                {lead.corrections.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#FF6B35]">✨</span>
                      <span className="text-[#FF6B35] font-medium">Learning Event Captured</span>
                      <span className="text-white/40">
                        — AI said "{lead.corrections[0].aiValue}", human corrected to "{lead.corrections[0].humanValue}"
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#E85A24] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all">
                    ✓ Send AI Response
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl font-medium transition-all">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-white/30">
          NAVRIT MVP v1.0 • Investor Ready • {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  );
}
