'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, User, Bot, Sparkles, ChevronDown,
  ClipboardList, AlertTriangle, CheckCircle2, Clock, Download,
  RefreshCw, Zap,
} from 'lucide-react';

const CATEGORIES = [
  { value: '',                    label: 'General Inquiry' },
  { value: 'HORMONE_OPTIMIZATION', label: 'Hormone Optimization' },
  { value: 'PEPTIDE_THERAPY',      label: 'Peptide Therapy' },
  { value: 'STEM_CELL',            label: 'Stem Cell Therapy' },
  { value: 'EXOSOME_THERAPY',      label: 'Exosome Therapy' },
  { value: 'AESTHETICS',           label: 'Aesthetics' },
  { value: 'WEIGHT_MANAGEMENT',    label: 'Weight Management' },
  { value: 'REGENERATIVE_ORTHO',   label: 'Regenerative Orthopaedics' },
];

const QUEUE_MOCK = [
  { id: 1, name: 'Maria G.',    category: 'HORMONE_OPTIMIZATION', status: 'in_progress', time: '9:14 AM',  score: 78 },
  { id: 2, name: 'James T.',    category: 'STEM_CELL',            status: 'complete',    time: '8:55 AM',  score: 91 },
  { id: 3, name: 'Ana R.',      category: 'WEIGHT_MANAGEMENT',    time: '8:30 AM',       status: 'complete', score: 85 },
  { id: 4, name: 'David L.',    category: 'PEPTIDE_THERAPY',      time: 'Scheduled 11am',status: 'pending', score: null },
  { id: 5, name: 'Sarah K.',    category: 'AESTHETICS',           time: 'Scheduled 2pm', status: 'pending', score: null },
];

type Message = { role: 'user' | 'assistant'; content: string };

const GREETING = `Hi there! 👋 Welcome — I'm Dr. Castillo's AI care concierge.

Before your appointment, I'd like to gather some information so your provider can make the most of your time together. This should take about 5–10 minutes, and everything you share is confidential.

Let's start easy — **what's bringing you in today?** What's the main concern you'd like to address?`;

export default function IntakePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING }
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [category, setCategory] = useState('');
  const [patientName, setPatientName] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'queue'>('queue');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          category,
          patientName,
        }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiText = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: aiText };
          return updated;
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: string) =>
    s === 'complete' ? 'badge-green' : s === 'in_progress' ? 'badge-os' : 'badge-gray';
  const statusLabel = (s: string) =>
    s === 'complete' ? 'Complete' : s === 'in_progress' ? 'In Progress' : 'Pending';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
            <MessageSquare className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">AI Intake Concierge</h1>
            <p className="text-[#64748B] text-sm">24/7 patient qualification · HIPAA-compliant · Replaces 45-min phone calls</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {(['queue', 'chat'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25' : 'text-[#64748B] hover:text-[#94A3B8]'}`}>
              {tab === 'queue' ? '📋 Today\'s Queue' : '💬 Live Intake'}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Intakes Today', value: '12', icon: ClipboardList, color: 'text-indigo-400' },
              { label: 'Avg Complete Time', value: '7.2 min', icon: Clock, color: 'text-violet-400' },
              { label: 'Completion Rate', value: '94%', icon: CheckCircle2, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="glass-card p-5">
                <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                <div className="font-display font-bold text-2xl mb-0.5">{s.value}</div>
                <div className="text-[#64748B] text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Queue list */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display font-semibold">Patient Queue</h2>
              <button className="btn-ghost text-xs gap-1"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
            </div>
            <div className="divide-y divide-white/5">
              {QUEUE_MOCK.map(p => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/15 flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-[#64748B] text-xs">{p.category.replace(/_/g, ' ')} · {p.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.score && (
                      <div className="text-right">
                        <div className="font-display font-bold text-sm gradient-text">{p.score}</div>
                        <div className="text-[10px] text-[#64748B]">readiness score</div>
                      </div>
                    )}
                    <span className={`badge ${statusColor(p.status)}`}>{statusLabel(p.status)}</span>
                    {p.status === 'complete' && (
                      <button className="btn-ghost text-xs gap-1 py-1.5">
                        <Download className="w-3 h-3" />Summary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start new intake */}
          <button onClick={() => setActiveTab('chat')} className="btn-primary mt-4 w-full justify-center">
            <Zap className="w-4 h-4" />
            Start New Intake Session
          </button>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Config bar */}
          <div className="px-8 py-3 border-b border-white/5 flex items-center gap-4 bg-[#0F1221]/50">
            <input value={patientName} onChange={e => setPatientName(e.target.value)}
              placeholder="Patient name (optional)" className="input-field max-w-[200px] py-2 text-sm" />
            <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="input-field pr-8 py-2 text-sm appearance-none cursor-pointer max-w-[220px]">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
            <span className="text-xs text-[#64748B] ml-auto">Session will auto-generate pre-visit summary on completion</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-500/15 border border-indigo-500/20 text-[#F1F5F9] rounded-tr-sm'
                      : 'bg-[#1E2235] border border-white/6 text-[#94A3B8] rounded-tl-sm'
                  }`}>
                    {msg.content}
                    {msg.role === 'assistant' && i === messages.length - 1 && loading && (
                      <span className="inline-block w-1.5 h-4 bg-indigo-400 animate-pulse ml-1 rounded-sm" />
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#1E2235] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-[#94A3B8]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-8 py-4 border-t border-white/5">
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type patient response or your message..."
                className="input-field flex-1" disabled={loading} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary px-4">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#64748B] mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI conducts intake · HIPAA compliant · Pre-visit summary auto-generated at completion
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
