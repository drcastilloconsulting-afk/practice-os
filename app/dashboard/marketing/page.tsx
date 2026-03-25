'use client';
import { motion } from 'framer-motion';
import { Target, TrendingUp, FileText, Zap, Calendar, RefreshCw, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const CONTENT_CALENDAR = [
  { day: 'Mon', platform: 'Instagram', type: 'Educational Reel', topic: 'NAD+ for Energy — What the Science Says', status: 'published' },
  { day: 'Tue', platform: 'Email',     type: 'Newsletter',       topic: 'March Patient Success Story — Stem Cells', status: 'scheduled' },
  { day: 'Wed', platform: 'Facebook',  type: 'Before/After',     topic: 'Joint Restoration — 6 Month Outcome', status: 'pending' },
  { day: 'Thu', platform: 'Instagram', type: 'Story Poll',        topic: "What's Your #1 Energy Drain?", status: 'scheduled' },
  { day: 'Fri', platform: 'Email',     type: 'Promo Blast',       topic: 'Weekend Flash: Hormone Panel + Consult $299', status: 'draft' },
  { day: 'Sat', platform: 'Google',    type: 'Ad Copy',           topic: 'PRP Hair Restoration — Limited Spots', status: 'draft' },
];

const CAMPAIGNS = [
  { name: 'Spring Hormone Reset', channel: 'Email + SMS', reach: '1,240', opened: '34%', converted: '8.2%', revenue: '$14,800', status: 'active' },
  { name: 'NAD+ Awareness Month', channel: 'Instagram',   reach: '8,400', opened: '—', converted: '1.8%', revenue: '$6,200',  status: 'active' },
  { name: 'Q1 Stem Cell Webinar', channel: 'Email',       reach: '620',   opened: '41%', converted: '12%', revenue: '$22,000', status: 'complete' },
];

const GENERATE_TYPES = ['Instagram Caption', 'Email Newsletter', 'Google Ad Copy', 'SMS Promo Blast', 'Blog Post Intro', 'Patient Testimonial Ask'];

export default function MarketingPage() {
  const [topic, setTopic]     = useState('');
  const [type, setType]       = useState('Instagram Caption');
  const [output, setOutput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState<number[]>([]);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setOutput('');
    await new Promise(r => setTimeout(r, 1800));
    setOutput(`📱 **${type}**\n\nYour patients are asking: "Why am I always tired, even after 8 hours of sleep?"\n\nThe answer might be in your cells — specifically, your NAD+ levels. 🔬\n\nNAD+ is the molecule your mitochondria use to produce energy. By your 40s, levels can drop 50%+. That's not aging — that's a fixable problem.\n\nAt our practice, we offer IV NAD+ infusions that restore cellular energy directly. Most patients notice a difference within 24–48 hours.\n\n📞 DM us or click the link in bio to schedule a complimentary discovery call with Dr. Castillo.\n\n#RegenerativeMedicine #NADPlus #CellularHealth #FunctionalMedicine #EnergyOptimization #DrCastillo #HormoneHealth`);
    setLoading(false);
  };

  const statusColor = (s: string) =>
    s === 'published' ? 'badge-green' : s === 'scheduled' ? 'badge-os' : s === 'active' ? 'badge-green' : s === 'complete' ? 'badge-gray' : 'badge-amber';

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(244,63,94,0.3)' }}>
            <Target className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Marketing Engine</h1>
            <p className="text-[#64748B] text-sm">AI-generated content · Your voice, your compliance guardrails · Human approves before publish</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Content Pieces This Month', value: '28', icon: FileText, color: 'text-rose-400' },
            { label: 'Total Reach', value: '18.4K', icon: TrendingUp, color: 'text-pink-400' },
            { label: 'Lead Conversions', value: '47', icon: Zap, color: 'text-indigo-400' },
            { label: 'Revenue Attributed', value: '$43K', icon: Calendar, color: 'text-violet-400' },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="kpi-card">
              <k.icon className={`w-5 h-5 ${k.color} mb-3`} />
              <div className="kpi-value text-3xl mb-0.5">{k.value}</div>
              <div className="kpi-label text-xs">{k.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Content Generator */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <h2 className="font-display font-semibold">AI Content Generator</h2>
            </div>
            <div>
              <label className="text-xs text-[#64748B] mb-1.5 block">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {GENERATE_TYPES.map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${type === t ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25' : 'bg-white/5 text-[#64748B] hover:text-[#94A3B8]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-[#64748B] mb-1.5 block">Topic / Service</label>
              <input value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g. NAD+ IV therapy for energy, stem cell for joints..."
                className="input-field text-sm" />
            </div>
            <button onClick={generate} disabled={loading || !topic.trim()} className="btn-primary w-full justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)' }}>
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Content</>}
            </button>
            {output && (
              <div className="surface-card p-4 mt-2">
                <pre className="text-sm text-[#94A3B8] whitespace-pre-wrap leading-relaxed font-sans">{output}</pre>
                <div className="flex gap-2 mt-3">
                  <button className="btn-primary text-xs py-1.5 flex-1 justify-center"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                    <Check className="w-3.5 h-3.5" />Approve & Schedule
                  </button>
                  <button className="btn-secondary text-xs py-1.5 flex-1 justify-center" onClick={generate}>
                    <RefreshCw className="w-3.5 h-3.5" />Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Calendar */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display font-semibold">This Week's Calendar</h2>
              <button className="btn-ghost text-xs gap-1"><Calendar className="w-3.5 h-3.5" />View All</button>
            </div>
            <div className="divide-y divide-white/5">
              {CONTENT_CALENDAR.map((item, i) => (
                <div key={i} className="px-6 py-3 flex items-center gap-3">
                  <span className="text-xs text-[#64748B] w-8 flex-shrink-0">{item.day}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#F1F5F9] truncate">{item.topic}</p>
                    <p className="text-[11px] text-[#64748B]">{item.platform} · {item.type}</p>
                  </div>
                  <span className={`badge ${statusColor(item.status)} text-[10px]`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-display font-semibold">Campaign Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Campaign', 'Channel', 'Reach', 'Open Rate', 'Converted', 'Revenue', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#64748B] px-6 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {CAMPAIGNS.map((c, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium">{c.name}</td>
                    <td className="px-6 py-3 text-sm text-[#64748B]">{c.channel}</td>
                    <td className="px-6 py-3 text-sm">{c.reach}</td>
                    <td className="px-6 py-3 text-sm">{c.opened}</td>
                    <td className="px-6 py-3 text-sm text-emerald-400 font-medium">{c.converted}</td>
                    <td className="px-6 py-3 text-sm font-bold gradient-text">{c.revenue}</td>
                    <td className="px-6 py-3"><span className={`badge ${statusColor(c.status)}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
