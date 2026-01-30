import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LeadDetail } from './components/LeadDetail';
import { ProRow } from './components/ProRow';
import { WalletView } from './components/WalletView';
import { AIStudio } from './components/AIStudio';
import { BiometricGate } from './components/BiometricGate';

// MOCK DATA
const MOCK_LEADS = [
  {
    id: '1', name: 'Rahul Sharma', temperature: 'HOT', status: 'NEGOTIATION', commission_est: 14500,
    journeys: [{ model: 'Honda City ZX', netPrice: 1689000, exShowroom: 1680000 }]
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // 1. THE GATE
  if (!isAuthenticated) {
    return <BiometricGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // 2. THE DETAIL VIEW (Overlay)
  if (selectedLead) {
    return <LeadDetail lead={selectedLead} onBack={() => setSelectedLead(null)} />;
  }

  // 3. THE OS ROUTER
  return (
    <Layout activeTab={activeTab} setTab={setActiveTab}>
      {activeTab === 'home' && <Dashboard onNav={setActiveTab} />}

      {activeTab === 'leads' && (
        <div className="p-4 md:p-10 pb-24">
          <h1 className="text-2xl font-bold text-white mb-6">Pipeline</h1>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
            {['All', 'New', 'Test Drive', 'Negotiation'].map(s => (
              <button key={s} className="px-4 py-1.5 rounded-full border border-zinc-700 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white whitespace-nowrap transition-colors">{s}</button>
            ))}
          </div>
          <div className="space-y-1">
            {MOCK_LEADS.map(l => <ProRow key={l.id} lead={l} onClick={() => setSelectedLead(l)} />)}
          </div>
        </div>
      )}

      {/* NEW ROUTES */}
      {activeTab === 'tools' && <AIStudio />}
      {activeTab === 'wallet' && <WalletView />}
    </Layout>
  );
}
