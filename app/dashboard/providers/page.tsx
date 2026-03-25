'use client';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Calendar, AlertTriangle, ArrowUpRight } from 'lucide-react';

const PROVIDERS = [
  {
    name: 'Dr. Guillermo Castillo', role: 'Medical Director', avatar: 'DC',
    utilization: 94, revenue: 42800, rpm: 1350, conversion: 78, rebooking: 82, retail: 34,
    trend: '+8%', status: 'excellent',
    treatments: [{ name: 'Stem Cell Therapy', count: 12, rev: 18000 }, { name: 'HRT Consults', count: 22, rev: 14200 }, { name: 'IV NAD+', count: 18, rev: 10600 }],
    alert: null,
  },
  {
    name: 'NP Sarah Williams', role: 'Nurse Practitioner', avatar: 'SW',
    utilization: 71, revenue: 28400, rpm: 980, conversion: 61, rebooking: 68, retail: 22,
    trend: '-3%', status: 'needs_attention',
    treatments: [{ name: 'HRT Female', count: 18, rev: 14000 }, { name: 'Peptide Therapy', count: 14, rev: 9400 }, { name: 'Weight Mgmt', count: 8, rev: 5000 }],
    alert: 'Conversion rate dropped 8% this week. Consider refresher on consultation close techniques.',
  },
  {
    name: 'RN James Chen', role: 'Registered Nurse', avatar: 'JC',
    utilization: 85, revenue: 13120, rpm: 720, conversion: null, rebooking: 74, retail: 28,
    trend: '+5%', status: 'good',
    treatments: [{ name: 'IV Therapy', count: 24, rev: 8400 }, { name: 'B12 Injections', count: 18, rev: 2700 }, { name: 'Ozone', count: 8, rev: 2020 }],
    alert: null,
  },
];

const statusColor = (s: string) => s === 'excellent' ? 'text-emerald-400' : s === 'good' ? 'text-indigo-400' : 'text-amber-400';
const statusBadge = (s: string) => s === 'excellent' ? 'badge-green' : s === 'good' ? 'badge-os' : 'badge-amber';

export default function ProvidersPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
            <BarChart3 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Provider Analytics</h1>
            <p className="text-[#64748B] text-sm">Per-provider performance · 30-day early warning system · Know before you feel it</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Practice-wide KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Practice Revenue', value: '$84,320', icon: DollarSign, change: '+12% MoM', up: true },
            { label: 'Total Consult-to-Sale', value: '72%', icon: Users, change: '+4% vs last mo', up: true },
            { label: 'Avg Revenue/Patient', value: '$1,118', icon: BarChart3, change: '-2% vs last mo', up: false },
            { label: 'Rebooking Rate', value: '75%', icon: Calendar, change: '+6% vs last mo', up: true },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
              <k.icon className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="kpi-value text-3xl mb-0.5">{k.value}</div>
              <div className="kpi-label text-xs">{k.label}</div>
              <div className={`text-[11px] mt-1 flex items-center gap-1 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{k.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Provider cards */}
        {PROVIDERS.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-display font-bold text-sm">
                  {p.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold">{p.name}</h3>
                    <span className={`badge ${statusBadge(p.status)}`}>{p.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[#64748B] text-sm">{p.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-display font-bold text-lg ${p.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{p.trend}</span>
                <span className="text-[#64748B] text-xs">revenue trend</span>
              </div>
            </div>

            {p.alert && (
              <div className="px-6 py-3 bg-amber-500/8 border-b border-amber-500/15 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-300">{p.alert}</p>
                <button className="btn-ghost text-xs ml-auto gap-1 flex-shrink-0">Take Action <ArrowUpRight className="w-3 h-3" /></button>
              </div>
            )}

            <div className="p-6 grid md:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Performance Metrics</h4>
                {[
                  { label: 'Schedule Utilization', value: p.utilization, suffix: '%', color: p.utilization >= 80 ? 'progress-fill-green' : 'progress-fill-amber' },
                  { label: 'Rebooking Rate', value: p.rebooking, suffix: '%', color: p.rebooking >= 75 ? 'progress-fill-green' : 'progress-fill-amber' },
                  { label: 'Retail Attachment', value: p.retail, suffix: '%', color: p.retail >= 30 ? 'progress-fill-green' : 'progress-fill-amber' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748B]">{m.label}</span>
                      <span className="text-[#94A3B8] font-medium">{m.value}{m.suffix}</span>
                    </div>
                    <div className="progress-bar"><div className={`progress-fill ${m.color}`} style={{ width: `${m.value}%` }} /></div>
                  </div>
                ))}
              </div>

              {/* Revenue */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Revenue</h4>
                <div className="kpi-value text-3xl">${(p.revenue / 1000).toFixed(0)}k</div>
                <p className="text-[#64748B] text-xs">This month</p>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-[#64748B] mb-1">Avg Revenue / Patient</p>
                  <p className="font-display font-bold text-lg gradient-text">${p.rpm.toLocaleString()}</p>
                </div>
                {p.conversion !== null && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs text-[#64748B] mb-1">Consult Conversion</p>
                    <p className={`font-display font-bold text-lg ${statusColor(p.status)}`}>{p.conversion}%</p>
                  </div>
                )}
              </div>

              {/* Top treatments */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Top Treatments</h4>
                {p.treatments.map(t => (
                  <div key={t.name} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#F1F5F9]">{t.name}</p>
                      <p className="text-xs text-[#64748B]">{t.count} patients</p>
                    </div>
                    <span className="text-sm font-semibold gradient-text">${(t.rev / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
