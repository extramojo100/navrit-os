// client/src/pages/Dashboard.tsx
// Premium Dashboard - World-Class UI
// Glassmorphic Design with Real-Time Updates

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RefreshCw, Filter, Plus, Bell, Search,
    TrendingUp, Users, Calendar, Zap
} from 'lucide-react';
import LeadCard, { Lead } from '../components/LeadCard';
import SignalsChart from '../components/SignalsChart';

const API_BASE = 'http://localhost:3000/api';

interface DashboardStats {
    totalLeads: number;
    byGate: { green: number; yellow: number; red: number };
    todayLeads: number;
    avgConfidence: number;
    conversionRate: number;
}

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'GREEN' | 'YELLOW' | 'RED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [leadsRes, statsRes] = await Promise.all([
                fetch(`${API_BASE}/leads`),
                fetch(`${API_BASE}/leads/stats`)
            ]);

            if (leadsRes.ok) {
                const leadsData = await leadsRes.json();
                setLeads(enrichLeadsWithDemoData(leadsData.data || []));
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.data);
            }

            setError(null);
        } catch (err) {
            console.error('API Error:', err);
            setError('Backend not connected - showing demo data');
            setLeads(getDemoLeads());
            setStats(getDemoStats());
        } finally {
            setLoading(false);
        }
    };

    const handleSend = (id: string) => {
        console.log('Send clicked for:', id);
        // TODO: Implement send action
    };

    const handleEdit = (id: string) => {
        console.log('Edit clicked for:', id);
        // TODO: Implement edit modal
    };

    const handleEscalate = async (id: string) => {
        try {
            await fetch(`${API_BASE}/leads/${id}/escalate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Manual escalation', urgency: 'MEDIUM' })
            });
            fetchData();
        } catch (err) {
            console.error('Escalate error:', err);
        }
    };

    // Filter leads
    const filteredLeads = leads
        .filter(lead => filter === 'ALL' || lead.gateLevel === filter)
        .filter(lead =>
            searchQuery === '' ||
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.phone.includes(searchQuery)
        );

    return (
        <div className="min-h-screen bg-grid">
            {/* Header */}
            <header className="glass-header sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-cosmic-500 to-cosmic-600 flex items-center justify-center shadow-lg"
                                style={{ boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)' }}
                            >
                                <span className="text-white font-bold text-xl">N</span>
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-bold text-cosmic-gradient">NAVRIT</h1>
                                <p className="text-xs text-white/40">Lead Intelligence Platform</p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-dark pl-12 w-full"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={fetchData}
                                disabled={loading}
                                className="btn-ghost flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Loading...' : 'Refresh'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-cosmic flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Lead
                            </motion.button>

                            <div className="relative">
                                <Bell className="w-6 h-6 text-white/50 hover:text-white cursor-pointer transition-colors" />
                                <span className="notification-badge">3</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass bg-yellow-500/10 border-yellow-500/30 p-4 mb-6 rounded-xl flex items-center gap-3"
                        >
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-200 text-sm">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="stat-card"
                    >
                        <Users className="w-8 h-8 text-cosmic-400 mb-2" />
                        <div className="stat-value">{stats?.totalLeads ?? leads.length}</div>
                        <div className="stat-label">Total Leads</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card"
                    >
                        <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
                        <div className="text-4xl font-bold text-green-400">{stats?.byGate.green ?? 0}</div>
                        <div className="stat-label">🟢 Auto-Apply</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card"
                    >
                        <Calendar className="w-8 h-8 text-yellow-400 mb-2" />
                        <div className="text-4xl font-bold text-yellow-400">{stats?.byGate.yellow ?? 0}</div>
                        <div className="stat-label">🟡 Review</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="stat-card"
                    >
                        <Zap className="w-8 h-8 text-red-400 mb-2" />
                        <div className="text-4xl font-bold text-red-400">{stats?.byGate.red ?? 0}</div>
                        <div className="stat-label">🔴 Escalate</div>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Leads Column */}
                    <div className="col-span-2">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 mb-6">
                            <Filter className="w-4 h-4 text-white/40" />
                            {(['ALL', 'GREEN', 'YELLOW', 'RED'] as const).map((level) => (
                                <motion.button
                                    key={level}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilter(level)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === level
                                            ? level === 'ALL'
                                                ? 'bg-cosmic-500 text-white shadow-lg'
                                                : level === 'GREEN'
                                                    ? 'bg-green-500 text-white'
                                                    : level === 'YELLOW'
                                                        ? 'bg-yellow-500 text-black'
                                                        : 'bg-red-500 text-white'
                                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {level === 'ALL' ? 'All' : level.charAt(0) + level.slice(1).toLowerCase()}
                                </motion.button>
                            ))}
                        </div>

                        {/* Leads Grid */}
                        <div className="space-y-4">
                            <AnimatePresence>
                                {filteredLeads.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="glass p-12 text-center"
                                    >
                                        <div className="text-6xl mb-4">📭</div>
                                        <h3 className="text-xl font-semibold text-white mb-2">No Leads Found</h3>
                                        <p className="text-white/50">
                                            {filter !== 'ALL' ? `No ${filter.toLowerCase()} gate leads` : 'Create your first lead via API'}
                                        </p>
                                    </motion.div>
                                ) : (
                                    filteredLeads.map((lead, index) => (
                                        <LeadCard
                                            key={lead.id}
                                            lead={lead}
                                            index={index}
                                            onSend={handleSend}
                                            onEdit={handleEdit}
                                            onEscalate={handleEscalate}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Chart Column */}
                    <div>
                        <SignalsChart
                            green={stats?.byGate.green ?? leads.filter(l => l.gateLevel === 'GREEN').length}
                            yellow={stats?.byGate.yellow ?? leads.filter(l => l.gateLevel === 'YELLOW').length}
                            red={stats?.byGate.red ?? leads.filter(l => l.gateLevel === 'RED').length}
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-12">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-white/30">
                    <span>NAVRIT MVP v1.0 • Stanford Architecture</span>
                    <span>{new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
            </footer>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA
// ─────────────────────────────────────────────────────────────────────────────

function enrichLeadsWithDemoData(leads: Lead[]): Lead[] {
    const messages = [
        'I am interested in a test drive this weekend',
        'What financing options do you have?',
        'Can you match this competitor price?',
        'Confirmed for tomorrow at 2pm'
    ];
    const suggestions = [
        'Book Test Drive: Saturday 3 PM at Jakarta Showroom',
        'Share financing brochure + ask for income docs',
        'Escalate to sales manager for price negotiation',
        'Send reminder + showroom directions'
    ];

    return leads.map((lead, i) => ({
        ...lead,
        gateLevel: lead.gateLevel || (lead.confidenceScore >= 0.85 ? 'GREEN' : lead.confidenceScore >= 0.6 ? 'YELLOW' : 'RED'),
        lastMessage: messages[i % messages.length],
        aiSuggestion: suggestions[i % suggestions.length]
    }));
}

function getDemoLeads(): Lead[] {
    return [
        {
            id: 'demo-1',
            name: 'Rahul Kumar',
            phone: '+6281234567890',
            email: 'rahul@example.com',
            carModel: 'Toyota Fortuner',
            budget: '₹25 Lakhs',
            state: 'TEST_DRIVE_SCHEDULED',
            confidenceScore: 0.92,
            gateLevel: 'GREEN',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            lastMessage: 'Yes, Saturday at 3 PM works perfectly!',
            aiSuggestion: 'Send confirmation with showroom directions and parking info'
        },
        {
            id: 'demo-2',
            name: 'Priya Sharma',
            phone: '+919876543210',
            email: 'priya.s@email.com',
            carModel: 'Honda City',
            budget: '₹15 Lakhs',
            state: 'QUALIFIED',
            confidenceScore: 0.72,
            gateLevel: 'YELLOW',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            lastMessage: 'What financing options do you have?',
            aiSuggestion: 'Share financing brochure + ask for income documents'
        },
        {
            id: 'demo-3',
            name: 'Ahmad Reza',
            phone: '+62887654321',
            carModel: 'Innova Zenix',
            state: 'CONTACTED',
            confidenceScore: 0.45,
            gateLevel: 'RED',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            lastMessage: 'I already told you my requirements twice!',
            aiSuggestion: 'Escalate to senior DSE - frustrated customer detected'
        },
        {
            id: 'demo-4',
            name: 'Sarah Chen',
            phone: '+6591234567',
            email: 'sarah.c@company.sg',
            carModel: 'Toyota Vios',
            budget: 'S$85,000',
            state: 'NEGOTIATING',
            confidenceScore: 0.88,
            gateLevel: 'GREEN',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            lastMessage: 'Let me know the final price and I can decide today',
            aiSuggestion: 'High intent buyer - prepare final quotation with accessories'
        }
    ];
}

function getDemoStats(): DashboardStats {
    return {
        totalLeads: 4,
        byGate: { green: 2, yellow: 1, red: 1 },
        todayLeads: 2,
        avgConfidence: 0.74,
        conversionRate: 0.23
    };
}
