import React from 'react';
import { Home, Users, Settings, Wallet, Wand2 } from 'lucide-react';

export const Layout = ({ children, activeTab, setTab }: any) => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-64 border-r border-zinc-800 flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-black">N</div>
                    <span className="font-bold text-xl tracking-widest text-zinc-300">NAVRIT</span>
                </div>
                <nav className="space-y-2 flex-1">
                    <NavBtn icon={Home} label="Dashboard" active={activeTab === 'home'} onClick={() => setTab('home')} />
                    <NavBtn icon={Users} label="Pipeline" active={activeTab === 'leads'} onClick={() => setTab('leads')} />
                    <NavBtn icon={Wand2} label="AI Studio" active={activeTab === 'tools'} onClick={() => setTab('tools')} />
                    <NavBtn icon={Wallet} label="Wallet" active={activeTab === 'wallet'} onClick={() => setTab('wallet')} />
                </nav>
                <div className="pt-6 border-t border-zinc-800">
                    <NavBtn icon={Settings} label="Settings" />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto relative no-scrollbar bg-black">
                {children}
            </main>

            {/* MOBILE BOTTOM BAR */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/95 backdrop-blur border-t border-zinc-800 flex justify-around items-center z-50">
                <MobileBtn icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setTab('home')} />
                <MobileBtn icon={Users} label="Leads" active={activeTab === 'leads'} onClick={() => setTab('leads')} />
                <MobileBtn icon={Wand2} label="Studio" active={activeTab === 'tools'} onClick={() => setTab('tools')} />
                <MobileBtn icon={Wallet} label="Wallet" active={activeTab === 'wallet'} onClick={() => setTab('wallet')} />
            </nav>
        </div>
    );
};

const NavBtn = ({ icon: Icon, label, active, onClick, className }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-zinc-900 text-blue-500 border border-zinc-800' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'} ${className || ''}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

const MobileBtn = ({ icon: Icon, label, active, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
        <Icon size={20} className={active ? 'text-blue-500' : 'text-zinc-600'} />
        <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
    </button>
);
