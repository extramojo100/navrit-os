import { useState } from 'react';
import { ProCard } from './components/ProCard';
import { WorkflowTracker } from './modules/workflows/WorkflowTracker';
import { initiateBookingPayment } from './modules/payments/PaymentGateway';
import { Fingerprint, History, X, Phone, MessageSquare } from 'lucide-react';

interface WorkflowStep {
  label: string;
  tat: string;
  isOverdue?: boolean;
}

interface Journey {
  model: string;
  status: string;
  price: number;
  workflow?: {
    current: number;
    steps: WorkflowStep[];
  };
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  location?: string;
  daysLastActive: number;
  multiplier: number;
  journeys: Journey[];
}

export default function App() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // MOCK DATA: Simulating the "Title Transfer" Complexity
  const leads: Lead[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      location: 'West Delhi',
      daysLastActive: 0,
      multiplier: 1.5,
      journeys: [
        {
          model: 'Honda City ZX CVT',
          status: 'Quote Sent',
          price: 1680000,
          workflow: {
            current: 2,
            steps: [
              { label: 'Booking', tat: '1d' },
              { label: 'Finance', tat: '2d' },
              { label: 'Invoice', tat: '1d' },
              { label: 'PDI', tat: '1d' },
              { label: 'Delivery', tat: '1d' }
            ]
          }
        },
        {
          model: 'Elevate Apex',
          status: 'Test Drive',
          price: 1550000
        }
      ]
    },
    {
      id: '2',
      name: 'Arjun Singh',
      phone: '+91 99887 76655',
      location: 'South Mumbai',
      daysLastActive: 5,
      multiplier: 1.0, // Stagnant!
      journeys: [
        {
          model: 'Amaze Elite',
          status: 'LTO Process',
          price: 950000,
          workflow: {
            current: 1,
            steps: [
              { label: 'Docs', tat: '1d', isOverdue: true },
              { label: 'LTO', tat: '3d' },
              { label: 'HPG', tat: '2d' },
              { label: 'Reg', tat: '2d' }
            ]
          }
        }
      ]
    },
    {
      id: '3',
      name: 'Priya Patel',
      phone: '+91 99012 34567',
      location: 'Gurgaon',
      daysLastActive: 1,
      multiplier: 2.0,
      journeys: [
        {
          model: 'City VX CVT',
          status: 'Finance Approved',
          price: 1520000,
          workflow: {
            current: 3,
            steps: [
              { label: 'Booking', tat: '1d' },
              { label: 'Finance', tat: '2d' },
              { label: 'Invoice', tat: '1d' },
              { label: 'PDI', tat: '1d' },
              { label: 'Delivery', tat: '1d' }
            ]
          }
        }
      ]
    },
    {
      id: '4',
      name: 'Vikram Malhotra',
      phone: '+91 88776 65544',
      location: 'Noida',
      daysLastActive: 0,
      multiplier: 1.2,
      journeys: [
        {
          model: 'Amaze VX MT',
          status: 'Booking Done',
          price: 980000,
          workflow: {
            current: 1,
            steps: [
              { label: 'Booking', tat: '1d' },
              { label: 'Insurance', tat: '1d' },
              { label: 'LTO', tat: '3d' },
              { label: 'Delivery', tat: '1d' }
            ]
          }
        },
        {
          model: 'City V MT',
          status: 'Quote Requested',
          price: 1280000
        }
      ]
    }
  ];

  // Calculate totals
  const totalSales = leads.reduce((acc, lead) => acc + lead.journeys[0].price, 0);
  const activeLeads = leads.filter(l => l.daysLastActive <= 2).length;

  const handlePayment = async () => {
    await initiateBookingPayment(5000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 pb-20">

      {/* HEADER: METRICS (Not Targets) */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-white/10">
            <Fingerprint size={18} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Pipeline Value</div>
            <div className="text-lg font-bold text-white">₹ {(totalSales / 10000000).toFixed(2)} Cr</div>
          </div>
        </div>
        <button className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 hover:bg-zinc-800 transition-colors">
          <History size={16} className="text-zinc-500" />
        </button>
      </header>

      {/* FEED: UNIFORM PRO CARDS */}
      <main>
        <div className="px-4 py-3 bg-[#0A0A0A] flex justify-between items-center border-b border-white/5">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Action Queue</span>
          <span className="text-[10px] text-emerald-400 font-bold">{activeLeads} Active</span>
        </div>

        {leads.map(lead => (
          <ProCard key={lead.id} lead={lead} onOpen={setSelectedLead} />
        ))}
      </main>

      {/* BOTTOM DOCK */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#09090B] border-t border-white/10 p-4 flex justify-around items-center z-40 text-[10px] font-bold tracking-widest">
        <button className="text-white flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
          QUEUE
        </button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">WORKFLOWS</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">REPORTS</button>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors">SETTINGS</button>
      </nav>

      {/* DETAIL OVERLAY (With Workflow Engine) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute inset-x-0 bottom-0 top-12 bg-[#09090B] rounded-t-3xl overflow-hidden flex flex-col border-t border-white/10">
            {/* Header */}
            <div className="p-4 flex justify-between items-start border-b border-white/5">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                <div className="text-xs text-zinc-500 font-mono mt-1">{selectedLead.phone}</div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
              >
                <X size={16} className="text-zinc-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Current Deal */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">{selectedLead.journeys[0].model}</span>
                  <span className="text-sm font-mono text-emerald-400">₹{(selectedLead.journeys[0].price / 100000).toFixed(2)}L</span>
                </div>
                <div className="text-xs text-zinc-500">{selectedLead.journeys[0].status}</div>
              </div>

              {/* The "Deep Process" Engine */}
              {selectedLead.journeys[0].workflow && (
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  <WorkflowTracker
                    steps={selectedLead.journeys[0].workflow.steps}
                    currentStepIndex={selectedLead.journeys[0].workflow.current}
                  />
                </div>
              )}

              {/* Location & Details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] text-zinc-600 uppercase tracking-widest">Location</div>
                  <div className="text-xs text-white font-medium mt-1">{selectedLead.location}</div>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] text-zinc-600 uppercase tracking-widest">Bonus Multiplier</div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">{selectedLead.multiplier}x</div>
                </div>
              </div>
            </div>

            {/* Action Dock */}
            <div className="p-4 bg-[#0A0A0A] border-t border-white/10 space-y-3">
              <button
                onClick={handlePayment}
                className="w-full py-4 bg-white text-black font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
              >
                Initiate Booking (₹5,000)
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-[#FF6B35] text-black font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase">
                  <Phone size={16} /> Call
                </button>
                <button className="py-3 bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase border border-white/5">
                  <MessageSquare size={16} /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
