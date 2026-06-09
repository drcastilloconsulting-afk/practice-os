'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Activity, TrendingUp, Sparkles, Moon, Flame, Droplets,
  ShieldCheck, ChevronRight, Info, Send, User, Bot, Check, X,
  Mail, FileText, Calendar, Building2, TrendingDown, ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/components/ui/chat-message';

// ─── Historical Trend Mock Data ───────────────────────────
const HISTORICAL_TREND_DATA = [
  { week: 'Wk 1', you: 88.2, median: 86.5 },
  { week: 'Wk 2', you: 89.0, median: 87.0 },
  { week: 'Wk 3', you: 88.5, median: 87.2 },
  { week: 'Wk 4', you: 90.1, median: 87.5 },
  { week: 'Wk 5', you: 91.4, median: 88.0 },
  { week: 'Wk 6', you: 92.0, median: 88.2 },
  { week: 'Wk 7', you: 93.5, median: 88.5 },
  { week: 'Wk 8', you: 94.6, median: 89.0 },
];

// ─── Clinic Partner Network Mock Data ──────────────────────
const PARTNER_CLINICS = [
  { name: 'Aegis Longevity Clinic', location: 'Austin, TX', specialty: 'NAD+ & Peptide Therapy', payout: '$10,000 Payout' },
  { name: 'Castillo Regenerative Institute', location: 'Miami, FL', specialty: 'Stem Cell & Exosomes', payout: '$10,000 Payout' },
  { name: 'Apex Human Performance', location: 'Los Angeles, CA', specialty: 'Hormone Optimization', payout: '$10,000 Payout' }
];

interface Habit {
  id: string;
  habitName: string;
  description: string | null;
  targetMetric: string | null;
  mitigationStrategy: string | null;
  isSelfReported: boolean;
  complianceRate?: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string;
  delta: string;
  gender: string;
  active: boolean;
  currentWinner: boolean;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: Array<{ label: string; value: string; mitigation: string }>;
  proposedMitigation?: { choice: string; mitigation: string };
  isStreaming?: boolean;
}

export default function LongevityDashboardPage() {
  const [selectedCohort, setSelectedCohort] = useState<'cohort-30-45' | 'cohort-45-60'>('cohort-30-45');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [offsets, setOffsets] = useState<Array<{ choice: string; mitigation: string }>>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch Leaderboard for Selected Cohort
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`/api/ua-squad/leaderboard?cohortId=${selectedCohort}`);
        const data = await res.json();
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    }
    fetchLeaderboard();
  }, [selectedCohort]);

  // Fetch Subscriber Habits & Offsets on Mount
  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch('/api/ua-squad/habits?subscriberId=test');
        const data = await res.json();
        if (data.habits) {
          setHabits(data.habits);
          // Extract active offsets from habits that have mitigation strategies
          const activeOffsets = data.habits
            .filter((h: Habit) => h.mitigationStrategy)
            .map((h: Habit) => ({
              choice: h.habitName,
              mitigation: h.mitigationStrategy || '',
            }));
          setOffsets(activeOffsets);
        }
      } catch (err) {
        console.error('Failed to fetch habits:', err);
      }
    }
    fetchHabits();
  }, []);

  // Initialize Chat conversation when opened
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Hi Mark! Welcome back to the **UA Squad Onboarding Assistant**. Let's co-design your weekly health protocol.

My job is to map out offsets for your non-negotiable habits so you maintain a high CNI Score without killing your lifestyle.

What is a schedule constraint or habit you absolutely don't want to compromise right now?`,
          options: [
            { label: '🍷 Weekend Wine (Friday/Saturday)', value: 'wine', mitigation: 'Extend weekend sleep target by 1 hour (8.5h) to clear load, and drink 1L electrolyte water buffer by 6:00 PM.' },
            { label: '⏰ No 5:00 AM Workouts', value: 'sleep', mitigation: 'Shift target workouts to 2x 10-minute Post-meal "walking snacks" immediately following lunch and dinner.' },
            { label: '🪑 Sitting for 9+ Hours Daily', value: 'sitting', mitigation: 'Integrate hourly 1-minute standing/stretching habits + Oura compliance checks.' },
            { label: '🥩 Late Client Dinners (Twice weekly)', value: 'dinner', mitigation: 'Pre-load dinner with trace mineral packet, and lock a 2-hour sleep buffer window post-dinner.' }
          ]
        }
      ]);
    }
  }, [isChatOpen, messages.length]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiResponding]);

  // Handle suggested options selection
  const selectOption = async (opt: { label: string; value: string; mitigation?: string }) => {
    // 1. Add User response
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: `I can't compromise on: ${opt.label}`
    };

    setMessages((prev) => [...prev, userMsg]);

    // 2. Propose offset block in chat
    const aiMsg: Message = {
      id: Math.random().toString(),
      sender: 'ai',
      text: `Understood. I've accepted that constraint. We don't need a perfect monastic lifestyle to make massive longevity gains. We just need to manage the biological offsets.

Here is the proposed **UA Squad physiological offset**:`,
      proposedMitigation: {
        choice: opt.label,
        mitigation: opt.mitigation || ''
      }
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  // Accept a proposed mitigation and save it to db
  const acceptMitigation = async (proposed: { choice: string; mitigation: string }) => {
    try {
      const response = await fetch('/api/ua-squad/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: 'test',
          habitName: proposed.choice,
          description: `Mitigation strategy for ${proposed.choice}`,
          targetMetric: 'CNI Score optimization',
          mitigationStrategy: proposed.mitigation,
          isSelfReported: true
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local offsets state
        setOffsets((prev) => {
          if (prev.some((o) => o.choice === proposed.choice)) return prev;
          return [...prev, proposed];
        });

        // Add habit to habits list
        setHabits((prev) => [
          ...prev,
          {
            id: result.habit.id,
            subscriberId: 'test',
            habitName: proposed.choice,
            description: `Mitigation strategy for ${proposed.choice}`,
            targetMetric: 'CNI Score optimization',
            mitigationStrategy: proposed.mitigation,
            isSelfReported: true,
            complianceRate: 100 // Set baseline compliance for demo
          }
        ]);

        const confirmationMsg: Message = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `✅ **Offset Accepted & Applied.** I have updated your daily check-lists and active leaderboard tracking protocol.

Is there any other constraint we should negotiate?`,
          options: [
            { label: '🍷 Weekend Wine (Friday/Saturday)', value: 'wine', mitigation: 'Extend weekend sleep target by 1 hour (8.5h) to clear load, and drink 1L electrolyte water buffer by 6:00 PM.' },
            { label: '⏰ No 5:00 AM Workouts', value: 'sleep', mitigation: 'Shift target workouts to 2x 10-minute Post-meal "walking snacks" immediately following lunch and dinner.' },
            { label: '🪑 Sitting for 9+ Hours Daily', value: 'sitting', mitigation: 'Integrate hourly 1-minute standing/stretching habits + Oura compliance checks.' },
            { label: '🥩 Late Client Dinners (Twice weekly)', value: 'dinner', mitigation: 'Pre-load dinner with trace mineral packet, and lock a 2-hour sleep buffer window post-dinner.' }
          ]
        };
        setMessages((prev) => [...prev, confirmationMsg]);
      }
    } catch (err) {
      console.error('Failed to accept mitigation:', err);
    }
  };

  // Handle custom constraint chat inputs with real Anthropic streaming
  const handleCustomSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal('');

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    // Prepare message history for API
    const history = messages.map((m) => ({
      role: m.sender === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.text,
    }));
    history.push({ role: 'user', content: userText });

    try {
      const response = await fetch('/api/ua-squad/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          subscriberContext: {
            habits: habits.map((h) => h.habitName),
            cohortRank: `#5 in ${selectedCohort === 'cohort-30-45' ? 'Ages 30-45' : 'Ages 45-60'}`
          }
        })
      });

      if (!response.body) throw new Error('Response body missing');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiText = '';

      // Initialize empty AI streaming message
      const aiMsgId = Math.random().toString();
      setMessages((prev) => [...prev, { id: aiMsgId, sender: 'ai', text: '', isStreaming: true }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          aiText += chunk;

          // Update streaming message in real-time
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: aiText } : msg))
          );
        }
      }

      // Check if response contains a structured [MITIGATION] block
      const mitigationRegex = /\[MITIGATION\]([\s\S]*?)\[\/MITIGATION\]/;
      const match = aiText.match(mitigationRegex);
      
      let proposedMitigation: { choice: string; mitigation: string } | undefined;
      let cleanedText = aiText;

      if (match && match[1]) {
        try {
          proposedMitigation = JSON.parse(match[1].trim());
          // Strip the mitigation block from the main message bubbles text
          cleanedText = aiText.replace(mitigationRegex, '').trim();
        } catch (jsonErr) {
          console.error('Error parsing mitigation JSON block:', jsonErr);
        }
      }

      // Finalize message states
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: cleanedText,
                isStreaming: false,
                proposedMitigation: proposedMitigation ? {
                  choice: proposedMitigation.choice,
                  mitigation: proposedMitigation.mitigation
                } : undefined
              }
            : msg
        )
      );

    } catch (err) {
      console.error('Error during AI chat stream:', err);
      // Fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: 'I apologize, I had trouble connecting to my physiological core. Please try restating your schedule constraint.'
        }
      ]);
    } finally {
      setIsAiResponding(false);
    }
  };

  // Generate Weekly AI Report Modal Trigger
  const handleGenerateWeeklyReport = async () => {
    setIsWeeklyModalOpen(true);
    setIsGeneratingReport(true);
    setWeeklyReport('');
    setEmailStatus('idle');

    try {
      const response = await fetch('/api/ua-squad/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberName: 'Mark D.',
          habits: habits.map(h => ({
            habitName: h.habitName,
            mitigationStrategy: h.mitigationStrategy || undefined,
            complianceRate: h.complianceRate ?? 92
          })),
          wearableData: {
            weeklyAverageSleepScore: 88,
            hrvWeeklyAverageMs: 64,
            stepsDailyAverage: 11420
          },
          leaderboardData: {
            rank: 5,
            score: 94.6,
            delta: 1.4,
            cohortSize: 350
          }
        })
      });

      const data = await response.json();
      if (data.report) {
        setWeeklyReport(data.report);
      }
    } catch (err) {
      console.error('Failed to generate weekly report:', err);
      setWeeklyReport('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Send Digest email via Resend
  const handleSendDigestEmail = async () => {
    setIsSendingEmail(true);
    setEmailStatus('idle');

    try {
      const response = await fetch('/api/ua-squad/send-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mark@practiceos.com', // Demo receiver
          subscriberName: 'Mark D.',
          reportHtml: weeklyReport.replace(/\n/g, '<br />') // Simple conversion for markdown demo
        })
      });

      const data = await response.json();
      if (data.success) {
        setEmailStatus('success');
      } else {
        setEmailStatus('error');
      }
    } catch (err) {
      console.error('Failed to send email:', err);
      setEmailStatus('error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 relative overflow-hidden noise">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#F1F5F9]">UA Squad: Unfair Advantage Leaderboard</h1>
            <p className="text-[#94A3B8] text-sm">Top 2 Cohort Performers earn $5,000 wellness packages. Grades are relative to your cohort.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="green" dot={true}>
            Oura & WHOOP Live
          </Badge>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="btn-primary text-sm flex items-center gap-1.5 shadow-glow"
          >
            <Sparkles className="w-4 h-4" />
            Negotiate Habits
          </button>
        </div>
      </motion.div>

      {/* Cohort Selector and Actions Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-[#0F1221] border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-2">Cohort bracket:</span>
          <button
            onClick={() => setSelectedCohort('cohort-30-45')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCohort === 'cohort-30-45'
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-sm'
                : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
            }`}
          >
            Ages 30–45 Compete
          </button>
          <button
            onClick={() => setSelectedCohort('cohort-45-60')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCohort === 'cohort-45-60'
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-sm'
                : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
            }`}
          >
            Ages 45–60 Compete
          </button>
        </div>
        <button
          onClick={handleGenerateWeeklyReport}
          className="px-4 py-2 bg-gradient-to-br from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow-v transition-all"
        >
          <FileText className="w-4 h-4" />
          Weekly Digest Report
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="kpi" delay={0.05} style={{ boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-500 opacity-5 rounded-2xl pointer-events-none" />
          <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Tournament Standing</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold font-display text-white">#5</span>
            <span className="text-[#64748B] text-sm">in Cohort ({selectedCohort === 'cohort-30-45' ? 'Ages 30-45' : 'Ages 45-60'})</span>
          </div>
          <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            +1.4% CNI increase. Only 3.3% away from Payout Range
          </p>
        </GlassCard>

        <GlassCard variant="kpi" delay={0.1}>
          <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Weekly Compliance</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold font-display text-white">92.6%</span>
            <span className="text-[#64748B] text-sm">vs. 90% Target</span>
          </div>
          <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Voucher Payout Qualified
          </p>
        </GlassCard>

        <GlassCard variant="kpi" delay={0.15}>
          <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Active Cohort Size</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold font-display text-white">350</span>
            <span className="text-[#64748B] text-sm">Subscribers</span>
          </div>
          <p className="text-xs text-[#64748B] flex items-center gap-1 mt-2 font-medium">
            2 Winners drawn Dec 31
          </p>
        </GlassCard>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Report Card & Active Habits */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard variant="glass" className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold font-display text-[#F1F5F9]">Weekly Longevity Report Card</h2>
              <p className="text-[#94A3B8] text-sm">Verification logs compiled from connected APIs.</p>
            </div>

            <div className="space-y-4">
              {habits.map((h) => (
                <div key={h.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mt-0.5 shadow-sm">
                        {h.habitName.toLowerCase().includes('sleep') ? <Moon className="w-4 h-4" /> : h.habitName.toLowerCase().includes('activity') ? <Flame className="w-4 h-4" /> : <Droplets className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{h.habitName}</h3>
                        <p className="text-xs text-[#94A3B8]">{h.description || 'Custom physiological habit offset'}</p>
                      </div>
                    </div>
                    <Badge variant={h.isSelfReported ? 'amber' : 'green'} dot={true}>
                      {h.isSelfReported ? 'Self-Reported' : 'API Verified'}
                    </Badge>
                  </div>

                  <ProgressBar value={h.complianceRate || 92} variant={h.isSelfReported ? 'amber' : 'green'} showLabel={true} />

                  {h.mitigationStrategy && (
                    <p className="text-[11px] text-[#64748B] bg-white/[0.01] border border-white/5 rounded-lg p-2 mt-3 leading-relaxed">
                      <strong className="text-indigo-400">Biological Offset:</strong> {h.mitigationStrategy}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2 text-xs text-[#94A3B8] leading-relaxed">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-white">Note on Sweepstakes Verification:</strong> Hydration and manually logged habits are used solely for AI coaching. To ensure fairness, only passive sensor metrics (sleep duration, steps, active HR) weigh into your leaderboard rank.
              </p>
            </div>
          </GlassCard>

          {/* Recharts Historical Leaderboard Trends */}
          <GlassCard variant="glass" className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold font-display text-[#F1F5F9]">Historical Leaderboard Trends</h2>
              <p className="text-[#94A3B8] text-sm">Track your week-over-week Normalization Index score relative to the cohort median.</p>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#64748B" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                  <YAxis domain={[80, 100]} stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F1221', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }} labelStyle={{ color: '#F1F5F9' }} />
                  <Area type="monotone" dataKey="you" name="Your Score" stroke="#818CF8" strokeWidth={2} fillOpacity={1} fill="url(#colorYou)" />
                  <Area type="monotone" dataKey="median" name="Cohort Median" stroke="#64748B" strokeWidth={1} fillOpacity={1} fill="url(#colorMedian)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Leaderboard Standings */}
        <div className="space-y-6">
          <GlassCard variant="glass" className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold font-display text-[#F1F5F9]">Cohort Standings</h2>
              <p className="text-[#94A3B8] text-sm">{selectedCohort === 'cohort-30-45' ? 'Ages 30-45' : 'Ages 45-60'} Category. Delta-based standings.</p>
            </div>

            <div className="space-y-2">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3 rounded-xl flex items-center justify-between transition-all duration-300 ${
                    item.active
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/30 shadow-glow'
                      : item.currentWinner
                      ? 'bg-emerald-500/[0.03] border border-emerald-500/10'
                      : 'bg-white/[0.02] border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg font-display text-xs font-black flex items-center justify-center ${
                        item.rank <= 2
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/5 text-[#64748B]'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      {item.active ? (
                        <Link href="/dashboard/longevity/profile" className="text-sm font-semibold block text-indigo-300 font-bold hover:underline">
                          {item.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold block text-[#F1F5F9]">
                          {item.name}
                        </span>
                      )}
                      {item.currentWinner && (
                        <span className="text-[9px] font-bold text-emerald-400 block tracking-wider uppercase">
                          In Payout Range
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-display text-white block">{item.score}</span>
                    <span className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${item.delta.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.delta.startsWith('-') ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
                      {item.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Clinic Partner Network */}
          <GlassCard variant="glass" className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Clinic Partner Network
            </h3>
            
            <div className="space-y-3">
              {PARTNER_CLINICS.map((clinic, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all">
                  <div>
                    <h4 className="text-xs font-bold text-[#F1F5F9]">{clinic.name}</h4>
                    <p className="text-[10px] text-[#64748B]">{clinic.location} · {clinic.specialty}</p>
                  </div>
                  <button className="px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] font-bold transition-all border border-indigo-500/20">
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Interactive AI Onboarding Slide-Over Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#080B15] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0F1221]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">UA Onboarding Assistant</h3>
                    <p className="text-[10px] text-emerald-400 font-semibold">Active Co-Design Agent</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    sender={msg.sender}
                    text={msg.text}
                    isStreaming={msg.isStreaming}
                    options={msg.options}
                    proposedMitigation={msg.proposedMitigation}
                    onSelectOption={selectOption}
                    onAcceptMitigation={() => acceptMitigation(msg.proposedMitigation!)}
                    onRejectMitigation={() => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          sender: 'ai',
                          text: "No worries! Let's explore another physiological adaptation. What is another lifestyle limit we should account for?"
                        }
                      ]);
                    }}
                  />
                ))}
                {isAiResponding && (
                  <div className="flex items-center gap-1.5 pl-3">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleCustomSend} className="p-3 border-t border-white/10 bg-[#0F1221] flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask a custom constraint (e.g. sugar, sleep, travel)..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-[#64748B]"
                />
                <button 
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all shadow-glow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Weekly Report & Digest Modal */}
      <AnimatePresence>
        {isWeeklyModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWeeklyModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[10%] max-w-2xl mx-auto bg-[#0F1221] border border-white/10 rounded-2xl z-50 overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-display font-bold text-[#F1F5F9]">Weekly performance digest</h3>
                </div>
                <button onClick={() => setIsWeeklyModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {isGeneratingReport ? (
                  <div className="space-y-4 py-8">
                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                    <p className="text-center text-xs text-[#64748B] pt-4 animate-pulse">Designing physiological adaptations report via Claude Haiku...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none text-[#CBD5E1] whitespace-pre-line bg-white/[0.01] border border-white/5 p-4 rounded-xl leading-relaxed">
                    {weeklyReport}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div>
                  {emailStatus === 'success' && <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">✅ Email sent successfully via Resend</span>}
                  {emailStatus === 'error' && <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">❌ Email delivery failed. Check API key.</span>}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsWeeklyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white transition-all"
                  >
                    Close
                  </button>
                  {!isGeneratingReport && (
                    <button
                      onClick={handleSendDigestEmail}
                      disabled={isSendingEmail}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      {isSendingEmail ? 'Sending...' : 'Send Digest Email'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
