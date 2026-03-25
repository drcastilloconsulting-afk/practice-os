'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, Calendar, AlertTriangle, Zap,
  CheckCircle2, ArrowUpRight, BarChart3, Clock, Target, RefreshCw,
} from 'lucide-react';

const SCHEDULE = [
  { day: 'Mon', slots: 8, booked: 7, revenue: 14200 },
  { day: 'Tue', slots: 8, booked: 4, revenue: 8200  },
  { day: 'Wed', slots: 8, booked: 8, revenue: 18400 },
  { day: 'Thu', slots: 8, booked: 7, revenue: 15600 },
  { day: 'Fri', slots: 8, booked: 8, revenue: 21200 },
  { day: 'Sat', slots: 4, booked: 2, revenue: 5120  },
];

const ALERTS = [
  {
    id: 1, title: 'Tuesday 10–12am — 4 slots empty',
    desc: 'AI recommends triggering a flash promo to 28 warm leads in your pipeline. Estimated recovery: $2,400.',
    action: 'Send Promo', urgency: 'high', icon: AlertTriangle,
  },
  {
    id: 2, title: 'Saturday PM underutilized (50%)',
    desc: 'Consider a Weekend Wellness package at $150 off to drive Saturday volume. Historical conversion: 34%.',
    action: 'Create Package', urgency: 'medium', icon: Target,
  },
  {
    id: 3, title: 'Hormone consults trending up',
    desc: 'Demand up 22% this month. Consider premium pricing on initial HRT consultations (+$50/visit).',
    action: 'Adjust Pricing', urgency: 'low', icon: TrendingUp,
  },
];

const PROVIDERS = [
  { name: 'Dr. Castillo', utilization: 94, revenue: 42800, rpm: 1350, trend: '+8%' },
  { name: 'NP Williams',  utilization: 71, revenue: 28400, rpm: 980,  trend: '-3%' },
  { name: 'RN Chen',      utilization: 85, revenue: 13120, rpm: 720,  trend: '+5%' },
];

const maxRev = Math.max(...SCHEDULE.map(d => d.revenue));

export default function PricingPage() {
  const [actionTaken, setActionTaken] = useState<number[]>([]);

  const handleAction = (id: number) => {
    setActionTaken(prev => [...prev, id]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            <DollarSign className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Revenue Optimizer</h1>
            <p className="text-[#64748B] text-sm">Yield management for your schedule · AI-driven pricing & promo triggers</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Revenue',     value: '$82,720', change: '+12%', icon: DollarSign, color: 'text-emerald-400' },
            { label: 'Avg Utilization',    value: '73%',     change: '+8%',  icon: Calendar,   color: 'text-indigo-400' },
            { label: 'Revenue Recovered',  value: '$4,800',  change: 'this week', icon: Zap, color: 'text-violet-400' },
            { label: 'Optimization Alerts', value: '3',      change: '2 urgent', icon: AlertTriangle, color: 'text-amber-400' },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="kpi-card">
              <k.icon className={`w-5 h-5 ${k.color} mb-3`} />
              <div className="kpi-value text-3xl mb-0.5">{k.value}</div>
              <div className="kpi-label text-xs">{k.label}</div>
              <div className="text-[11px] text-[#64748B] mt-1">{k.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Schedule utilization chart */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-base">Schedule Utilization</h2>
                <p className="text-[#64748B] text-sm">This week · slots booked vs. capacity</p>
              </div>
              <button className="btn-ghost text-xs gap-1"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
            </div>
            <div className="space-y-3">
              {SCHEDULE.map(d => {
                const utilPct = (d.booked / d.slots) * 100;
                const revPct  = (d.revenue / maxRev) * 100;
                const low     = utilPct < 70;
                return (
                  <div key={d.day} className="flex items-center gap-4">
                    <span className="text-sm text-[#64748B] w-8">{d.day}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#94A3B8]">{d.booked}/{d.slots} slots</span>
                        <span className={`font-semibold ${low ? 'text-amber-400' : 'text-emerald-400'}`}>{Math.round(utilPct)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${low ? 'progress-fill-amber' : 'progress-fill-green'}`}
                          style={{ width: `${utilPct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-[#64748B] w-14 text-right">${(d.revenue / 1000).toFixed(0)}k</span>
                    {low && <span className="badge badge-amber text-[10px]">Low</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider revenue per module */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-base mb-4">Provider Revenue</h2>
            <div className="space-y-4">
              {PROVIDERS.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-[#F1F5F9]">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${p.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{p.trend}</span>
                      <span className="text-xs text-[#64748B]">${(p.revenue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill progress-fill-green"
                      style={{ width: `${p.utilization}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B] mt-1">
                    <span>{p.utilization}% utilization</span>
                    <span>${p.rpm}/patient</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Revenue Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">AI Revenue Alerts</h2>
            <span className="text-xs text-[#64748B]">Actions that maximize this week's yield</span>
          </div>
          <div className="space-y-3">
            {ALERTS.map(alert => {
              const done = actionTaken.includes(alert.id);
              return (
                <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-5 flex items-start gap-4 transition-all ${done ? 'opacity-50' : ''}`}
                  style={{ borderColor: alert.urgency === 'high' ? 'rgba(245,158,11,0.25)' : 'rgba(99,102,241,0.15)' }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    alert.urgency === 'high' ? 'bg-amber-500/10' : 'bg-indigo-500/10'}`}>
                    <alert.icon className={`w-4.5 h-4.5 ${alert.urgency === 'high' ? 'text-amber-400' : 'text-indigo-400'}`}
                      style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#F1F5F9] mb-1">{alert.title}</p>
                    <p className="text-[#64748B] text-sm leading-relaxed">{alert.desc}</p>
                  </div>
                  <button onClick={() => handleAction(alert.id)} disabled={done}
                    className={`flex-shrink-0 text-sm ${done ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}>
                    {done
                      ? <><CheckCircle2 className="w-4 h-4" />Done</>
                      : <>{alert.action}<ArrowUpRight className="w-4 h-4" /></>}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
