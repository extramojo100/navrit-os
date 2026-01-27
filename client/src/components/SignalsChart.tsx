// client/src/components/SignalsChart.tsx
// Premium Chart Component using Recharts
// Displays Gate distribution with glassmorphic styling

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface SignalsChartProps {
    green: number;
    yellow: number;
    red: number;
}

const COLORS = {
    green: '#22C55E',
    yellow: '#F59E0B',
    red: '#EF4444'
};

export function SignalsChart({ green, yellow, red }: SignalsChartProps) {
    const data = [
        { name: 'Auto-Apply', value: green, color: COLORS.green },
        { name: 'Review', value: yellow, color: COLORS.yellow },
        { name: 'Escalate', value: red, color: COLORS.red }
    ].filter(item => item.value > 0);

    const total = green + yellow + red;

    if (total === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="chart-container flex flex-col items-center justify-center h-64"
            >
                <Activity className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/40">No leads to display</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="chart-container"
        >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cosmic-400" />
                Traffic Light Gates
            </h3>

            <div className="flex items-center justify-between">
                {/* Chart */}
                <div className="w-1/2 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={4}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        style={{
                                            filter: 'drop-shadow(0 0 8px ' + entry.color + '40)'
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="glass px-4 py-2 rounded-lg">
                                                <p className="text-white font-medium">{data.name}</p>
                                                <p className="text-white/70 text-sm">{data.value} leads</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="w-1/2 space-y-4">
                    {[
                        { label: 'Auto-Apply', value: green, color: COLORS.green, desc: '>85% confidence' },
                        { label: 'Review', value: yellow, color: COLORS.yellow, desc: '60-85% confidence' },
                        { label: 'Escalate', value: red, color: COLORS.red, desc: '<60% confidence' }
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: item.color,
                                    boxShadow: `0 0 10px ${item.color}60`
                                }}
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">{item.label}</span>
                                    <span className="text-white font-bold">{item.value}</span>
                                </div>
                                <p className="text-white/40 text-xs">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-white/50 text-sm">Total Active Leads</span>
                <span className="text-2xl font-bold text-cosmic-gradient">{total}</span>
            </div>
        </motion.div>
    );
}

export default SignalsChart;
