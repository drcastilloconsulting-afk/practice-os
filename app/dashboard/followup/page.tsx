'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Send, CheckCircle2, Clock, AlertTriangle, TrendingUp,
  Users, MessageSquare, Mail, Smartphone, Filter, Search,
  ChevronRight, ArrowUpRight, RefreshCw, Play, Pause,
} from 'lucide-react';

const SEQUENCES = [
  {
    id: 1, patient: 'Maria G.', treatment: 'HRT Female',
    startDate: 'Mar 23', nextFireDate: 'Mar 27', nextMessage: 'Day 3 — Side effects check',
    channel: 'SMS', status: 'active', response: null, daysIn: 4,
    scores: { energy: 4, sleep: 5, mood: 6 },
  },
  {
    id: 2, patient: 'James T.', treatment: 'Stem Cell Joint',
    startDate: 'Mar 20', nextFireDate: 'Mar 27', nextMessage: 'Week 1 — Pain trend assessment',
    channel: 'IN_APP', status: 'active', response: 'Feeling much better, pain down to 4/10', daysIn: 7,
    scores: { pain: 4, mobility: 6 },
  },
  {
    id: 3, patient: 'David L.', treatment: 'Peptide — CJC-1295',
    startDate: 'Mar 10', nextFireDate: 'Mar 31', nextMessage: 'Week 3 — Sleep & recovery changes',
    channel: 'EMAIL', status: 'active', response: null, daysIn: 17,
    scores: { energy: 7, sleep: 8 },
  },
  {
    id: 4, patient: 'Ana R.', treatment: 'IV NAD+',
    startDate: 'Mar 24', nextFireDate: 'Today', nextMessage: 'Same-day — Post-infusion check',
    channel: 'SMS', status: 'pending', response: null, daysIn: 1,
    scores: {},
  },
  {
    id: 5, patient: 'Robert K.', treatment: 'HRT Male',
    startDate: 'Feb 12', nextFireDate: 'Apr 2', nextMessage: 'Week 6 — Lab work reminder',
    channel: 'EMAIL', status: 'escalated', response: 'Chest tightness for 2 days. Should I be worried?', daysIn: 42,
    scores: { energy: 6, mood: 5 },
  },
];

const STATS = [
  { label: 'Active Sequences', value: '38', icon: Play, color: 'text-indigo-400', change: '+4 this week' },
  { label: 'Firing Today', value: '7', icon: Send, color: 'text-violet-400', change: '2 SMS, 5 in-app' },
  { label: 'Response Rate', value: '67%', icon: TrendingUp, color: 'text-emerald-400', change: '+12% vs last mo' },
  { label: 'Escalations', value: '1', icon: AlertTriangle, color: 'text-rose-400', change: 'Needs attention' },
];

export default function FollowUpPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<typeof SEQUENCES[0] | null>(null);

  const filtered = SEQUENCES.filter(s => {
    const matchSearch = s.patient.toLowerCase().includes(search.toLowerCase()) || s.treatment.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const channelIcon = (c: string) =>
    c === 'SMS' ? <Smartphone className="w-3.5 h-3.5" /> : c === 'EMAIL' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />;

  const statusBadge = (s: string) => {
    if (s === 'active')    return <span className="badge badge-os">Active</span>;
    if (s === 'pending')   return <span className="badge badge-amber">Pending</span>;
    if (s === 'escalated') return <span className="badge badge-rose">Escalated</span>;
    if (s === 'paused')    return <span className="badge badge-gray">Paused</span>;
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow-v">
            <Bell className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Follow-Up Engine</h1>
            <p className="text-[#64748B] text-sm">Automated post-treatment sequences · personalized to chart notes</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="kpi-card">
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <div className="kpi-value text-3xl mb-0.5">{s.value}</div>
              <div className="kpi-label text-xs">{s.label}</div>
              <div className="text-[11px] text-[#64748B] mt-1">{s.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Escalation alert */}
        {SEQUENCES.some(s => s.status === 'escalated') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-card p-5 border-rose-500/25 flex items-start gap-4"
            style={{ borderColor: 'rgba(244,63,94,0.25)' }}>
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-rose-300">Escalation Required — Robert K.</p>
              <p className="text-[#94A3B8] text-sm mt-1">"Chest tightness for 2 days. Should I be worried?" — HRT Male, Day 42</p>
              <p className="text-[#64748B] text-xs mt-1">AI flagged: potential cardiovascular symptom → immediate provider review needed</p>
            </div>
            <button className="btn-primary text-sm bg-gradient-to-r from-rose-500 to-rose-600">
              Review Now <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Sequences list */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search patients..." className="input-field pl-9 py-2 text-sm" />
            </div>
            <div className="flex gap-1">
              {['all', 'active', 'pending', 'escalated'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-indigo-500/15 text-indigo-300' : 'text-[#64748B] hover:text-[#94A3B8]'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button className="btn-ghost text-xs gap-1 ml-auto"><RefreshCw className="w-3.5 h-3.5" />Sync</button>
          </div>

          <div className="divide-y divide-white/5">
            {filtered.map(seq => (
              <div key={seq.id} onClick={() => setSelected(seq === selected ? null : seq)}
                className={`px-6 py-4 cursor-pointer transition-colors hover:bg-white/2 ${selected?.id === seq.id ? 'bg-indigo-500/5' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{seq.patient}</p>
                        {statusBadge(seq.status)}
                      </div>
                      <p className="text-[#64748B] text-xs mt-0.5">{seq.treatment} · Day {seq.daysIn}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] justify-end mb-1">
                      {channelIcon(seq.channel)}
                      <span>{seq.nextMessage}</span>
                    </div>
                    <p className={`text-xs font-medium ${seq.nextFireDate === 'Today' ? 'text-amber-400' : 'text-[#64748B]'}`}>
                      {seq.nextFireDate === 'Today' ? '🔥 Fires Today' : `Next: ${seq.nextFireDate}`}
                    </p>
                  </div>
                </div>

                {/* Expanded detail */}
                {selected?.id === seq.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/5 grid md:grid-cols-2 gap-4">
                    {seq.response && (
                      <div className="surface-card p-4">
                        <p className="text-xs font-semibold text-[#94A3B8] mb-2 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> Patient Response
                        </p>
                        <p className="text-sm text-[#F1F5F9]">"{seq.response}"</p>
                        <button className="btn-primary text-xs mt-3 py-2">
                          <ArrowUpRight className="w-3.5 h-3.5" />Analyze Response
                        </button>
                      </div>
                    )}
                    {Object.keys(seq.scores).length > 0 && (
                      <div className="surface-card p-4">
                        <p className="text-xs font-semibold text-[#94A3B8] mb-3">Symptom Scores</p>
                        <div className="space-y-2">
                          {Object.entries(seq.scores).map(([key, val]) => (
                            <div key={key}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#64748B] capitalize">{key}</span>
                                <span className="text-[#94A3B8] font-medium">{val}/10</span>
                              </div>
                              <div className="progress-bar">
                                <div className={`progress-fill ${val >= 7 ? 'progress-fill-green' : val >= 5 ? '' : 'progress-fill-rose'}`}
                                  style={{ width: `${(val / 10) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="surface-card p-4 flex items-center gap-2">
                      <button className="btn-secondary text-xs py-2 flex-1 justify-center gap-1">
                        <Pause className="w-3.5 h-3.5" /> Pause Sequence
                      </button>
                      <button className="btn-primary text-xs py-2 flex-1 justify-center gap-1">
                        <Send className="w-3.5 h-3.5" /> Send Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
