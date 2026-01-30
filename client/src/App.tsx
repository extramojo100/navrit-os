import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SystemBoot } from './components/SystemBoot';
import { BattleLens } from './components/BattleLens';
import { ProRow } from './components/ProRow';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showBattle, setShowBattle] = useState(false);

  // 1. SHOW BOOT SEQUENCE FIRST
  if (!booted) return <SystemBoot onComplete={() => setBooted(true)} />;

  // 2. SHOW BATTLE MODE (Overlay)
  if (showBattle) return <BattleLens onClose={() => setShowBattle(false)} />;

  // 3. SHOW MAIN OS
  return (
    <>
      <div className="cyber-grid" /> {/* The 2050 Background */}
      <Layout activeTab={activeTab} setTab={setActiveTab}>
        {activeTab === 'home' && <Dashboard onNav={(t: string) => t === 'battle' ? setShowBattle(true) : setActiveTab(t)} />}

        {activeTab === 'leads' && (
          <div className="p-6 pb-24 space-y-4">
            <div className="flex justify-between items-end mb-6">
              <h1 className="text-3xl font-orbitron font-bold text-white glow-text">LIVE FEED</h1>
              <div className="text-cyan-500 font-mono text-xs animate-pulse">● REALTIME</div>
            </div>

            {/* Mock Data */}
            {[1, 2, 3].map(i => (
              <ProRow key={i} lead={{
                name: 'Rahul Sharma',
                temperature: 'HOT',
                status: 'NEGOTIATION',
                commission_est: 14500,
                journeys: [{ model: 'City ZX', stage: 'Negotiation', net_price: 1689000, ex_showroom: 1680000, insurance: 0, accessories: 0, discounts: [] }]
              }} />
            ))}
          </div>
        )}
      </Layout>
    </>
  );
}
