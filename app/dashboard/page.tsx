'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Calendar, Bell,
  Mic, MessageSquare, Target, Star, BarChart3, Brain,
  ArrowUpRight, Clock, AlertTriangle, CheckCircle2, Activity,
  ChevronRight, Zap,
} from 'lucide-react';
import Link from 'next/link';

// ── Mock KPI data (replace with real DB queries) ─────────────────────────────
const KPIs = [
  {
    label: 'Monthly Revenue',
    value: '$84,320',
    change: '+12.4%',
    positive: true,
    icon: DollarSign,
    sub: 'vs last month',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    label: 'Schedule Utilization',
    value: '73%',
    change: '+8%',
    positive: true,
    icon: Calendar,
    sub: 'this week',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    label: 'Follow-Up Rate',
    value: '24%',
    change: '+6%',
    positive: true,
    icon: Bell,
    sub: 'patients rebooked',
    color: 'from-violet-500 to-purple-600',
  },
  {
    label: 'Avg Revenue/Patient',
    value: '$1,240',
    change: '-3%',
    positive: false,
    icon: Users,
    sub: 'this month',
    color: 'from-amber-500 to-orange-600',
  },
];

// ── Module status cards ───────────────────────────────────────────────────────
const MODULES_STATUS = [
  { icon: MessageSquare, name: 'Intake Concierge',  href: '/dashboard/intake',        status: 'active',   stat: '12 intakes today',    color: 'text-indigo-400' },
  { icon: Bell,          name: 'Follow-Up Engine',  href: '/dashboard/followup',      status: 'active',   stat: '3 sequences firing',  color: 'text-violet-400' },
  { icon: Mic,           name: 'Documentation',     href: '/dashboard/documentation', status: 'active',   stat: '7 notes generated',   color: 'text-sky-400' },
  { icon: DollarSign,    name: 'Revenue Optimizer', href: '/dashboard/pricing',       status: 'alert',    stat: 'Tues AM slot empty',  color: 'text-amber-400' },
  { icon: Target,        name: 'Marketing Engine',  href: '/dashboard/marketing',     status: 'active',   stat: '4 posts scheduled',   color: 'text-rose-400' },
  { icon: Star,          name: 'Reputation Intel',  href: '/dashboard/reputation',    status: 'pending',  stat: '2 reviews to approve',color: 'text-amber-400' },
  { icon: BarChart3,     name: 'Provider Analytics',href: '/dashboard/providers',     status: 'active',   stat: 'All providers on track',color: 'text-cyan-400' },
  { icon: Brain,         name: 'Staff Training',    href: '/dashboard/training',      status: 'pending',  stat: '1 module incomplete', color: 'text-fuchsia-400' },
];

// ── Recent activity feed ──────────────────────────────────────────────────────
const ACTIVITY = [
  { time: '9:14 AM', text: 'AI Intake completed for Maria G. — Hormone Optimization interest flagged', type: 'success' },
  { time: '9:02 AM', text: 'Follow-up SMS sent to 4 Day-14 patients from last week\'s stem cell cohort', type: 'info' },
  { time: '8:55 AM', text: 'Revenue alert: Tuesday 10–12am has 0 bookings — promo offer triggered', type: 'warning' },
  { time: '8:30 AM', text: 'Voice note: Dr. Castillo dictated SOAP for James T. — pending e-sign', type: 'info' },
  { time: 'Yesterday', text: 'New 5-star Google review received — AI response drafted and waiting approval', type: 'success' },
  { time: 'Yesterday', text: 'Provider report: Dr. Ramirez conversion rate dropped 8% this week', type: 'warning' },
];

// ── Revenue chart data (mock) ─────────────────────────────────────────────────
const WEEKLY_REVENUE = [
  { day: 'Mon', rev: 14200, target: 16000 },
  { day: 'Tue', rev: 9800,  target: 16000 },
  { day: 'Wed', rev: 18400, target: 16000 },
  { day: 'Thu', rev: 15600, target: 16000 },
  { day: 'Fri', rev: 21200, target: 16000 },
  { day: 'Sat', rev: 5120,  target: 8000 },
];

const maxRev = Math.max(...WEEKLY_REVENUE.map(d => d.rev));

export default function DashboardPage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-3xl"
          >
            {greeting}, Dr. Castillo 👋
          </motion.h1>
          <p className="text-[#64748B] mt-1 text-sm">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Your practice AI is running
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot-green" />
          <span className="text-xs text-[#64748B]">All systems operational</span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIs.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="kpi-card"
          >
            {/* Glow accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${kpi.color} opacity-5 rounded-2xl pointer-events-none`} />

            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${kpi.color} bg-opacity-10 flex items-center justify-center`}
                style={{ background: 'rgba(79,70,229,0.1)' }}>
                <kpi.icon className="w-4.5 h-4.5 text-indigo-400" style={{ width: '18px', height: '18px' }} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <div className="kpi-value mb-0.5">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Main grid: chart + activity ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-lg">Revenue This Week</h2>
              <p className="text-[#64748B] text-sm">Daily vs. target</p>
            </div>
            <span className="badge badge-green flex items-center gap-1">
              <Activity className="w-3 h-3" />
              $84,320 MTD
            </span>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-40">
            {WEEKLY_REVENUE.map((d, i) => {
              const pct = (d.rev / maxRev) * 100;
              const targetPct = (d.target / maxRev) * 100;
              const over = d.rev >= d.target;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <div className="flex-1 flex items-end w-full gap-1">
                    {/* Target line bar (ghost) */}
                    <div className="w-1/2 rounded-t flex items-end h-full">
                      <div
                        className="w-full rounded-t bg-white/5 border-t border-dashed border-white/10"
                        style={{ height: `${targetPct}%` }}
                      />
                    </div>
                    {/* Actual bar */}
                    <div className="w-1/2 rounded-t flex items-end h-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                        className={`w-full rounded-t ${over ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-gradient-to-t from-amber-600 to-amber-400'}`}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-[#64748B]">{d.day}</span>
                  <span className="text-[10px] font-medium text-[#94A3B8]">${(d.rev / 1000).toFixed(0)}k</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <div className="w-3 h-2 rounded-sm bg-indigo-500" /> Actual revenue
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <div className="w-3 h-2 rounded-sm bg-white/10 border border-dashed border-white/20" /> Daily target
            </div>
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-base">Live Activity</h2>
            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="status-dot-green" style={{ width: 6, height: 6 }} />
              Real-time
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="flex-shrink-0 mt-0.5">
                  {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {item.type === 'info' && <Activity className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{item.text}</p>
                  <p className="text-[#64748B] text-[10px] mt-0.5 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />{item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Module Status Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">AI Module Status</h2>
          <span className="text-xs text-[#64748B]">8 modules · 6 active, 2 need attention</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MODULES_STATUS.map((mod, i) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="surface-card p-4 group flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                <mod.icon className={`w-4.5 h-4.5 ${mod.color}`} style={{ width: '18px', height: '18px' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F1F5F9] truncate">{mod.name}</p>
                <p className="text-[11px] text-[#64748B] truncate">{mod.stat}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {mod.status === 'active' && <span className="status-dot-green" />}
                {mod.status === 'alert' && <span className="alert-dot" />}
                {mod.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#94A3B8] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Quick action banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 flex items-center justify-between gap-4 border-indigo-500/20"
        style={{ borderColor: 'rgba(99,102,241,0.2)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold">Revenue Alert: Tuesday AM is empty</p>
            <p className="text-[#64748B] text-sm">AI recommends triggering a promo offer to your warm lead list. Estimated recovery: $2,400</p>
          </div>
        </div>
        <button className="btn-primary flex-shrink-0 text-sm">
          Activate Offer
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

    </div>
  );
}
