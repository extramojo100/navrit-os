import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { BiometricGate } from './components/BiometricGate';
import { BattleLens } from './components/BattleLens';
import { checkDevice, registerDevice } from './services/AuthService';
import { Home, List, Zap, FileText, LayoutGrid } from 'lucide-react';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showBattle, setShowBattle] = useState(false);

  // PWA AUTH CHECK
  useEffect(() => {
    // If device is known, we skip OTP and go straight to Biometric
    const isKnown = checkDevice();
    if (!isKnown) registerDevice(); // Simulate first-time registration
  }, []);

  if (!auth) return <BiometricGate onAuthenticated={() => setAuth(true)} />;
  if (showBattle) return <BattleLens onClose={() => setShowBattle(false)} />;

  return (
    <div className="cyber-grid min-h-screen text-white font-rajdhani">

      {/* DYNAMIC CONTENT */}
      <main className="pb-24">
        {activeTab === 'home' && <Dashboard onNav={setActiveTab} />}
        {activeTab === 'battle' && <div className="p-10 text-center">Compare Tools Loading...</div>}
      </main>

      {/* BOTTOM NAV (From Wireframe: Home | Activities | Compare | Broadcast) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-40 pb-2">
        <NavBtn icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={List} label="Activity" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />

        {/* CENTER BATTLE BUTTON */}
        <div className="relative -top-6">
          <button
            onClick={() => setShowBattle(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] border-4 border-[#020617]"
          >
            <Zap size={28} fill="currentColor" />
          </button>
        </div>

        <NavBtn icon={FileText} label="Brochure" active={activeTab === 'brochure'} onClick={() => setActiveTab('brochure')} />
        <NavBtn icon={LayoutGrid} label="More" active={activeTab === 'more'} onClick={() => setActiveTab('more')} />
      </nav>
    </div>
  );
}

const NavBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 ${active ? 'text-cyan-400' : 'text-zinc-600'}`}>
    <Icon size={20} />
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);
