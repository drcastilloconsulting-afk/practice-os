'use client';

import { motion } from 'framer-motion';
import {
  PhoneCall, DollarSign, Clock, Users, TrendingUp, TrendingDown,
  CheckCircle2, AlertTriangle, Mic, CreditCard, Calendar,
  ArrowUpRight, Zap, BarChart3, PhoneIncoming, PhoneMissed,
  UserCheck, Activity, Star,
} from 'lucide-react';

// ── Simulated AI Concierge call log data ──────────────────────────────────────
const CALL_LOG = [
  { id: 'C-1041', caller: 'Maria G.',     time: 'Today 9:14 AM',    duration: '4m 32s', outcome: 'booked',   deposit: 250, service: 'Initial Consult' },
  { id: 'C-1040', caller: 'James T.',     time: 'Today 8:52 AM',    duration: '6m 18s', outcome: 'booked',   deposit: 250, service: 'Initial Consult' },
  { id: 'C-1039', caller: 'Renee P.',     time: 'Yesterday 6:31 PM',duration: '2m 04s', outcome: 'callback', deposit: 0,   service: 'IV Drip Inquiry' },
  { id: 'C-1038', caller: 'David K.',     time: 'Yesterday 4:15 PM',duration: '7m 51s', outcome: 'booked',   deposit: 250, service: 'Hormone Panel' },
  { id: 'C-1037', caller: 'Susan M.',     time: 'Yesterday 2:08 PM',duration: '3m 22s', outcome: 'booked',   deposit: 250, service: 'Initial Consult' },
  { id: 'C-1036', caller: 'Unknown',      time: 'Yesterday 11:44 AM',duration:'0m 48s', outcome: 'missed',   deposit: 0,   service: '—' },
  { id: 'C-1035', caller: 'Carlos R.',    time: 'May 18 3:00 PM',   duration: '5m 10s', outcome: 'booked',   deposit: 250, service: 'Peptide Consult' },
  { id: 'C-1034', caller: 'Tanya W.',     time: 'May 18 10:22 AM',  duration: '8m 03s', outcome: 'booked',   deposit: 250, service: 'EBOO + IV Drip' },
];

// ── Monthly trend data ─────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: 'Dec', calls: 28, booked: 14, revenue: 3500 },
  { month: 'Jan', calls: 35, booked: 19, revenue: 4750 },
  { month: 'Feb', calls: 41, booked: 24, revenue: 6000 },
  { month: 'Mar', calls: 58, booked: 34, revenue: 8500 },
  { month: 'Apr', calls: 72, booked: 48, revenue: 12000 },
  { month: 'May', calls: 89, booked: 63, revenue: 15750 },
];

const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue));

// ── Funnel stages ──────────────────────────────────────────────────────────────
const FUNNEL = [
  { stage: 'Total Inbound Calls',   count: 89,  pct: 100, color: 'from-indigo-500 to-violet-500' },
  { stage: 'AI Answered',           count: 89,  pct: 100, color: 'from-violet-500 to-purple-500' },
  { stage: 'Completed Intake',      count: 74,  pct: 83,  color: 'from-purple-500 to-fuchsia-500' },
  { stage: 'Reached Booking Step',  count: 68,  pct: 76,  color: 'from-fuchsia-500 to-rose-500' },
  { stage: 'Deposit Collected',     count: 63,  pct: 71,  color: 'from-rose-500 to-pink-500' },
];

// ── Top metrics ────────────────────────────────────────────────────────────────
const METRICS = [
  {
    label: 'AI-Generated Revenue (MTD)',
    value: '$15,750',
    sub: '63 deposits collected this month',
    change: '+31%',
    positive: true,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    label: 'Staff Hours Saved (MTD)',
    value: '74 hrs',
    sub: 'Equivalent to $2,220 in labor costs',
    change: '+18%',
    positive: true,
    icon: Clock,
    color: 'from-indigo-500 to-violet-600',
    glow: 'rgba(79,70,229,0.15)',
  },
  {
    label: 'Consultation Conversion Rate',
    value: '71%',
    sub: 'Industry average is ~32%',
    change: '+12%',
    positive: true,
    icon: UserCheck,
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    label: 'Avg Call → Deposit Time',
    value: '5m 22s',
    sub: 'Full intake + booking in one call',
    change: '-44s',
    positive: true,
    icon: PhoneCall,
    color: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.15)',
  },
];

const outcomeStyle: Record<string, string> = {
  booked:   'badge badge-green',
  callback: 'badge badge-amber',
  missed:   'badge badge-rose',
};
const outcomeLabel: Record<string, string> = {
  booked: 'Booked',
  callback: 'Callback',
  missed: 'Missed',
};

export default function ROIDashboardPage() {
  const totalDeposits = CALL_LOG.filter(c => c.outcome === 'booked').reduce((s, c) => s + c.deposit, 0);

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl">AI Concierge ROI Dashboard</h1>
              <p className="text-[#64748B] text-sm">Live performance metrics for your Voice AI receptionist</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-green flex items-center gap-1.5">
            <span className="status-dot-green" style={{ width: 6, height: 6 }} />
            AI Concierge Online
          </span>
          <button className="btn-secondary text-sm">Export Report</button>
        </div>
      </motion.div>

      {/* ── Top KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="kpi-card group"
            style={{ boxShadow: `0 4px 24px ${m.glow}` }}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.color} opacity-5 rounded-2xl pointer-events-none`} />
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                <m.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${m.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change}
              </span>
            </div>
            <div className="kpi-value mb-1">{m.value}</div>
            <div className="kpi-label mb-1">{m.label}</div>
            <div className="text-[11px] text-[#64748B]">{m.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Revenue Trend + Conversion Funnel ──────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Revenue trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-lg">AI-Generated Revenue Trend</h2>
              <p className="text-[#64748B] text-sm">Monthly deposits collected by the AI Concierge</p>
            </div>
            <span className="badge badge-green flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +350% since Dec
            </span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3 h-44">
            {MONTHLY_DATA.map((d, i) => {
              const pct = (d.revenue / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full group">
                  <div className="flex-1 flex items-end w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                      className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-teal-400 transition-all relative"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${(d.revenue / 1000).toFixed(1)}k
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[11px] text-[#64748B]">{d.month}</span>
                  <span className="text-[10px] text-[#94A3B8] font-medium">{d.booked} bkd</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
            {[
              { label: 'Total Calls (6mo)', value: MONTHLY_DATA.reduce((s, d) => s + d.calls, 0) },
              { label: 'Total Booked',      value: MONTHLY_DATA.reduce((s, d) => s + d.booked, 0) },
              { label: 'Total Revenue',     value: `$${MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0).toLocaleString()}` },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-xl text-[#F1F5F9]">{stat.value}</div>
                <div className="text-[11px] text-[#64748B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion funnel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="glass-card p-6"
        >
          <div className="mb-5">
            <h2 className="font-display font-bold text-base">Conversion Funnel</h2>
            <p className="text-[#64748B] text-xs mt-0.5">This month · 89 inbound calls</p>
          </div>
          <div className="space-y-3">
            {FUNNEL.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#94A3B8]">{stage.stage}</span>
                  <span className="text-xs font-bold text-[#F1F5F9]">{stage.count}</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${stage.color}`}
                  />
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">{stage.pct}% of calls</div>
              </div>
            ))}
          </div>

          {/* Cost comparison */}
          <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">vs. Human Receptionist</p>
            <div className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">Human (monthly cost)</span>
              <span className="text-rose-400 font-semibold">$4,500</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">AI Concierge (monthly)</span>
              <span className="text-emerald-400 font-semibold">~$480</span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/5 pt-2 mt-2">
              <span className="text-[#F1F5F9] font-semibold">Monthly Net Savings</span>
              <span className="font-display font-bold text-emerald-400">$4,020</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Competitor vs PracticeOS banner ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 grid sm:grid-cols-3 gap-4"
        style={{ borderColor: 'rgba(16,185,129,0.2)' }}
      >
        <div className="sm:col-span-1">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Business Impact Summary</p>
          <p className="font-display font-black text-3xl text-emerald-400">$19,770</p>
          <p className="text-xs text-[#64748B] mt-0.5">Total value delivered this month</p>
          <p className="text-[10px] text-[#64748B] mt-1">(Revenue + Labor savings)</p>
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: 'After-hours calls answered', value: '31', icon: PhoneIncoming, color: 'text-indigo-400' },
            { label: 'Deposits collected 24/7',    value: '63', icon: CreditCard, color: 'text-emerald-400' },
            { label: 'Avg patient rating (AI)',    value: '4.9★', icon: Star, color: 'text-amber-400' },
            { label: 'Calls handled w/o staff',    value: '100%', icon: Zap, color: 'text-violet-400' },
          ].map(stat => (
            <div key={stat.label} className="surface-card p-3 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 flex-shrink-0 ${stat.color}`} />
              <div>
                <p className="font-display font-bold text-lg">{stat.value}</p>
                <p className="text-[10px] text-[#64748B] leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Recent Call Log ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="font-display font-bold text-lg">Recent AI Call Log</h2>
            <p className="text-[#64748B] text-sm">Every inbound call handled by your AI Concierge</p>
          </div>
          <span className="badge badge-os">{totalDeposits > 0 ? `$${totalDeposits.toLocaleString()} collected` : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Call ID', 'Caller', 'Time', 'Duration', 'Service Discussed', 'Outcome', 'Deposit'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CALL_LOG.map((call, i) => (
                <tr
                  key={call.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-[#64748B]">{call.id}</td>
                  <td className="px-6 py-4 font-medium text-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold">
                        {call.caller === 'Unknown' ? '?' : call.caller.split(' ').map(n => n[0]).join('')}
                      </div>
                      {call.caller}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#64748B] text-xs">{call.time}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{call.duration}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{call.service}</td>
                  <td className="px-6 py-4">
                    <span className={outcomeStyle[call.outcome]}>
                      {call.outcome === 'booked' && <CheckCircle2 className="w-3 h-3" />}
                      {call.outcome === 'missed' && <PhoneMissed className="w-3 h-3" />}
                      {call.outcome === 'callback' && <Activity className="w-3 h-3" />}
                      {outcomeLabel[call.outcome]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {call.deposit > 0
                      ? <span className="font-semibold text-emerald-400">${call.deposit}</span>
                      : <span className="text-[#64748B]">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Upgrade prompt ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass-card p-6 flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: 'rgba(139,92,246,0.25)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow-v flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold">Connect Real Stripe & Calendar</p>
            <p className="text-[#64748B] text-sm">Wire the AI to your actual scheduling system to close the full revenue loop automatically.</p>
          </div>
        </div>
        <button className="btn-primary flex-shrink-0 text-sm">
          Activate Integrations
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

    </div>
  );
}
