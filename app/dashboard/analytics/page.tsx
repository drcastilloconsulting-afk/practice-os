'use client';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar, ArrowUpRight } from 'lucide-react';

const MONTHLY = [
  { month: 'Oct', revenue: 68000, patients: 58, rpm: 1172 },
  { month: 'Nov', revenue: 72000, patients: 63, rpm: 1143 },
  { month: 'Dec', revenue: 65000, patients: 54, rpm: 1204 },
  { month: 'Jan', revenue: 74000, patients: 64, rpm: 1156 },
  { month: 'Feb', revenue: 79000, patients: 68, rpm: 1162 },
  { month: 'Mar', revenue: 84320, patients: 73, rpm: 1155 },
];

const TREATMENT_MIX = [
  { name: 'Hormone Optimization', revenue: 32800, pct: 39, color: 'from-indigo-500 to-indigo-600' },
  { name: 'Stem Cell / Exosomes',  revenue: 22000, pct: 26, color: 'from-violet-500 to-violet-600' },
  { name: 'Peptide Therapy',       revenue: 13400, pct: 16, color: 'from-sky-500 to-sky-600' },
  { name: 'IV Therapy / NAD+',     revenue: 10200, pct: 12, color: 'from-cyan-500 to-cyan-600' },
  { name: 'Aesthetics / Other',    revenue: 5920,  pct: 7,  color: 'from-rose-500 to-rose-600' },
];

const maxRevenue = Math.max(...MONTHLY.map(m => m.revenue));

export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
            <BarChart3 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Practice Analytics</h1>
            <p className="text-[#64748B] text-sm">Revenue · Patients · Treatment mix · 6-month trends</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'MTD Revenue',        value: '$84,320',  change: '+12%', up: true,  icon: DollarSign },
            { label: 'Active Patients',    value: '312',      change: '+18',  up: true,  icon: Users },
            { label: 'Avg Revenue/Patient',value: '$1,155',   change: '-2%',  up: false, icon: Activity },
            { label: 'Appts This Month',   value: '73',       change: '+8%',  up: true,  icon: Calendar },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
              <k.icon className="w-5 h-5 text-indigo-400 mb-3" />
              <div className="kpi-value text-3xl mb-0.5">{k.value}</div>
              <div className="kpi-label text-xs">{k.label}</div>
              <div className={`text-[11px] mt-1 flex items-center gap-1 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{k.change} vs last month
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue trend chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-base">Revenue Trend</h2>
                <p className="text-[#64748B] text-sm">6-month view</p>
              </div>
              <span className="badge badge-green flex items-center gap-1"><TrendingUp className="w-3 h-3" />+24% 6-month growth</span>
            </div>
            <div className="flex items-end gap-4 h-44">
              {MONTHLY.map((m, i) => {
                const pct = (m.revenue / maxRevenue) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full group">
                    <div className="flex-1 flex items-end w-full">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${pct}%` }} transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                        className="w-full rounded-t bg-gradient-to-t from-indigo-600 to-indigo-400 relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-indigo-300 whitespace-nowrap">
                          ${(m.revenue / 1000).toFixed(0)}k
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[11px] text-[#64748B]">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Treatment mix */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-6">
            <h2 className="font-display font-bold text-base mb-5">Treatment Mix</h2>
            <div className="space-y-4">
              {TREATMENT_MIX.map(t => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#94A3B8]">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">${(t.revenue / 1000).toFixed(0)}k</span>
                      <span className="font-semibold text-[#F1F5F9]">{t.pct}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ delay: 0.4, duration: 0.6 }}
                      className={`progress-fill rounded-full bg-gradient-to-r ${t.color}`} style={{ height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Month-by-month table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-display font-semibold">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Month', 'Revenue', 'Patients Treated', 'Avg Revenue/Patient', 'vs Prior Month'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#64748B] px-6 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...MONTHLY].reverse().map((m, i) => {
                  const prev = MONTHLY[MONTHLY.length - i - 2];
                  const change = prev ? ((m.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) : null;
                  const up = change ? parseFloat(change) > 0 : null;
                  return (
                    <tr key={m.month} className={`hover:bg-white/2 transition-colors ${i === 0 ? 'bg-indigo-500/4' : ''}`}>
                      <td className="px-6 py-3 text-sm font-medium">{m.month} {i === 0 ? <span className="badge badge-os ml-2 text-[10px]">Current</span> : ''}</td>
                      <td className="px-6 py-3 text-sm font-bold gradient-text">${m.revenue.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm">{m.patients}</td>
                      <td className="px-6 py-3 text-sm">${m.rpm.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm">
                        {change !== null && (
                          <span className={`flex items-center gap-1 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {up ? '+' : ''}{change}%
                          </span>
                        )}
                        {change === null && <span className="text-[#64748B]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
