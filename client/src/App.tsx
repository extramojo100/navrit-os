import { useState, useEffect } from 'react';
import { ProRow } from './components/ProRow';
import { Receipt } from './components/Receipt';
import { SocialBooster } from './components/SocialBooster';
import { resolveRules } from './services/RuleEngine';
import type { Rule } from './services/RuleEngine';
import { MockEngine } from './services/MockEngine';
import type { Lead } from './services/MockEngine';
import { Fingerprint, X, RotateCcw, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface EnrichedLead extends Lead {
  lastLog: string;
  signal: 'HOT' | 'WARM';
  activeRules: Rule[];
}

export default function App() {
  const [leads, setLeads] = useState<EnrichedLead[]>([]);
  const [selected, setSelected] = useState<EnrichedLead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    const data = await MockEngine.getLeads();

    // Enrich with UI-specific fields
    const enriched: EnrichedLead[] = data.map((lead) => ({
      ...lead,
      lastLog: lead.journeys[0].logs[0]?.msg || 'New Lead',
      signal: lead.probability > 0.8 ? 'HOT' as const : 'WARM' as const,
      activeRules: resolveRules({ model: lead.journeys[0].model })
    }));

    // Sort by commission (highest first)
    const sorted = enriched.sort((a, b) => b.commission.amount - a.commission.amount);
    setLeads(sorted);
    setLoading(false);
  };

  const handleReset = async () => {
    await MockEngine.resetData();
    await loadLeads();
  };

  const totalCommission = leads.reduce((acc, l) => acc + l.commission.amount, 0);

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-primary/30">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border px-4 h-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-surface rounded-lg flex items-center justify-center border border-border">
            <Fingerprint size={14} className="text-muted" />
          </div>
          <div>
            <span className="text-xs font-bold text-text tracking-wide">NAVRIT</span>
            <span className="text-xxs text-muted ml-1">OS</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-surface rounded text-muted transition-colors"
            title="Reset Demo"
          >
            <RotateCcw size={12} />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-surface rounded border border-border">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xxs font-mono text-muted">LIVE</span>
          </div>
        </div>
      </header>

      {/* COMMISSION BAR */}
      <div className="px-4 py-2 bg-surface border-b border-border flex justify-between items-center">
        <span className="text-xxs text-muted uppercase tracking-widest font-bold">Today's Queue</span>
        <div className="flex items-center gap-2">
          <span className="text-xxs text-muted">Commission:</span>
          <span className="text-xs font-mono font-bold text-success">₹{totalCommission.toLocaleString()}</span>
        </div>
      </div>

      {/* FEED */}
      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="animate-spin mb-2" size={20} />
            <span className="text-xxs uppercase tracking-widest">Loading...</span>
          </div>
        ) : (
          leads.map(lead => (
            <ProRow key={lead.id} lead={lead} onOpen={() => setSelected(lead)} />
          ))
        )}

        {!loading && leads.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-muted text-sm">All leads processed.</div>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-surface border border-border rounded text-xxs text-muted hover:text-text transition-colors"
            >
              Reset Demo Data
            </button>
          </div>
        )}
      </main>

      {/* DETAIL SHEET */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-bg flex flex-col"
          >
            {/* SHEET HEADER */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-bg">
              <div>
                <h2 className="text-sm font-bold text-text">{selected.name}</h2>
                <p className="text-xxs text-muted font-mono">ID: {selected.id} • {selected.phone}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-surface rounded text-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* SHEET BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

              {/* 1. DEAL STRUCTURE */}
              <section>
                <div className="text-xxs font-bold text-muted uppercase tracking-widest mb-2">Deal Structure</div>
                <Receipt
                  data={selected.journeys[0].financials}
                  appliedRule={selected.activeRules.find(r => r.level === 'MANAGER')}
                />
              </section>

              {/* 2. COMMISSION BREAKDOWN */}
              <section>
                <div className="text-xxs font-bold text-muted uppercase tracking-widest mb-2">Commission Breakdown</div>
                <div className="bg-surface border border-border rounded-lg p-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xxs text-muted uppercase">Base</div>
                    <div className="text-sm font-mono font-bold text-text">₹{selected.commission.breakdown.base.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xxs text-muted uppercase">Spiff</div>
                    <div className="text-sm font-mono font-bold text-warning">₹{selected.commission.breakdown.spiff.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xxs text-muted uppercase">Finance</div>
                    <div className="text-sm font-mono font-bold text-primary">₹{selected.commission.breakdown.finance.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center px-1">
                  <span className="text-xxs text-muted">Multiplier: {selected.commission.multiplier}x</span>
                  <span className="text-sm font-mono font-bold text-success">Total: ₹{selected.commission.amount.toLocaleString()}</span>
                </div>
              </section>

              {/* 3. ACTIVE RULES */}
              <section>
                <div className="text-xxs font-bold text-muted uppercase tracking-widest mb-2">Active Logic Constraints</div>
                <div className="space-y-1">
                  {selected.activeRules.slice(0, 4).map((rule, i) => (
                    <div key={i} className="flex items-center gap-2 text-xxs font-mono text-muted bg-surface p-2 rounded border border-border">
                      <span className={`w-1.5 h-1.5 rounded-full ${rule.level === 'BRAND' ? 'bg-primary' :
                        rule.level === 'GROUP' ? 'bg-success' :
                          rule.level === 'DEALER' ? 'bg-warning' :
                            'bg-danger'
                        }`} />
                      <span className="font-bold text-text">{rule.level}:</span>
                      <span className="flex-1">{rule.action}</span>
                      <span className="text-muted">{rule.type}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. SOCIAL BOOSTER */}
              {selected.journeys[0].status.includes('DELIVER') && (
                <SocialBooster
                  model={selected.journeys[0].model}
                  customerName={selected.name.split(' ')[0]}
                />
              )}

              {/* Always show for demo */}
              <SocialBooster
                model={selected.journeys[0].model}
                customerName={selected.name.split(' ')[0]}
              />
            </div>

            {/* SHEET FOOTER */}
            <div className="p-4 border-t border-border bg-bg grid grid-cols-2 gap-3">
              <button className="py-3 bg-primary text-white font-bold rounded-lg text-xs uppercase tracking-wide hover:bg-primary/90 transition-colors">
                Call Now
              </button>
              <button className="py-3 bg-surface text-text font-bold rounded-lg text-xs uppercase tracking-wide border border-border hover:bg-bg transition-colors">
                WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-bg border-t border-border flex justify-around items-center text-xxs font-medium">
        <button className="text-text flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-primary" />
          Feed
        </button>
        <button className="text-muted hover:text-text transition-colors">Tasks</button>
        <button className="text-muted hover:text-text transition-colors">Perf</button>
        <button className="text-muted hover:text-text transition-colors">Settings</button>
      </nav>
    </div>
  );
}
