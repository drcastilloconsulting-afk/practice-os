'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, User, Shield, Activity, Moon, Flame, Droplets,
  CheckCircle2, AlertCircle, Edit3, Trash2, Plus, TrendingUp, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';

// ─── Biometrics Historical Mock Data ──────────────────────
const BIOMETRIC_HISTORY = [
  { day: 'Mon', sleep: 7.2, hrv: 58, steps: 9400 },
  { day: 'Tue', sleep: 7.8, hrv: 62, steps: 11200 },
  { day: 'Wed', sleep: 6.9, hrv: 55, steps: 8900 },
  { day: 'Thu', sleep: 7.5, hrv: 64, steps: 12100 },
  { day: 'Fri', sleep: 8.1, hrv: 70, steps: 10500 },
  { day: 'Sat', sleep: 8.4, hrv: 75, steps: 13200 },
  { day: 'Sun', sleep: 8.6, hrv: 78, steps: 11400 },
];

// ─── Calendar Contribution Grid Mock Data (Last 12 weeks) ───
const CONTRIBUTION_WEEKS = Array.from({ length: 12 }, (_, wIdx) => {
  return Array.from({ length: 7 }, (_, dIdx) => {
    // Generate high compliance values generally, with occasional lower days
    const rand = Math.random();
    if (rand > 0.85) return 0; // No data/failed
    if (rand > 0.6) return 1;  // Low compliance
    if (rand > 0.3) return 2;  // Med compliance
    return 3;                  // High compliance
  });
});

interface Habit {
  id: string;
  habitName: string;
  description: string | null;
  targetMetric: string | null;
  mitigationStrategy: string | null;
  isSelfReported: boolean;
  complianceRate?: number;
}

export default function SubscriberProfilePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Habits on Mount
  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch('/api/ua-squad/habits?subscriberId=test');
        const data = await res.json();
        if (data.habits) {
          setHabits(data.habits.map((h: Habit) => ({
            ...h,
            complianceRate: h.complianceRate ?? Math.floor(Math.random() * 15) + 85 // random 85-100% compliance for demo
          })));
        }
      } catch (err) {
        console.error('Failed to fetch habits:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHabits();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 relative overflow-hidden noise">
      
      {/* Header / Back Link */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link 
          href="/dashboard/longevity"
          className="flex items-center gap-2 text-xs font-bold text-[#94A3B8] hover:text-white transition-all bg-white/5 px-3 py-1.5 rounded-xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to UA Leaderboard
        </Link>
        <Badge variant="os" dot={true}>
          UA Squad Subscriber Profile
        </Badge>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Habits Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* User Profile Card */}
          <GlassCard variant="glass" className="p-6 text-center space-y-4 relative">
            <div className="absolute top-4 right-4">
              <Badge variant="green">Active</Badge>
            </div>
            
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black font-display mx-auto shadow-glow">
              MD
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-display">Mark Castillo, MD</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Practice Owner & Lead Subscriber</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2 text-left">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Age Cohort</span>
                <p className="text-sm font-semibold text-white mt-0.5">Ages 30–45</p>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Gender</span>
                <p className="text-sm font-semibold text-white mt-0.5">Male</p>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">CNI Score</span>
                <p className="text-sm font-bold text-indigo-400 mt-0.5">94.6%</p>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Cohort Rank</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">#5 of 350</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#94A3B8] justify-center">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Joined Cohort: Oct 12, 2025</span>
            </div>
          </GlassCard>

          {/* Negotiated Habits Summary */}
          <GlassCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Active Protocols</h3>
              <Badge variant="violet">{habits.length} Active</Badge>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-2 py-4">
                  <div className="h-3 bg-white/5 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
                </div>
              ) : (
                habits.map((h) => (
                  <div key={h.id} className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{h.habitName}</span>
                      <span className="text-xs font-semibold text-emerald-400">{h.complianceRate}%</span>
                    </div>
                    {h.mitigationStrategy && (
                      <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                        <strong className="text-indigo-400">Offset: </strong>{h.mitigationStrategy}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Historical Trends & Contribution Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biometrics Detail Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sleep and HRV Chart */}
            <GlassCard variant="glass" className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Sleep & HRV Telemetry
                </h3>
                <p className="text-[11px] text-[#64748B]">Weekly sleep hours (bars) and HRV averages (line).</p>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={BIOMETRIC_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHRV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F1221', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="hrv" name="HRV (ms)" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorHRV)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Daily Steps Bar Chart */}
            <GlassCard variant="glass" className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  Daily Steps Log
                </h3>
                <p className="text-[11px] text-[#64748B]">Track daily walking compliance against targets.</p>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BIOMETRIC_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F1221', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="steps" name="Steps" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>

          {/* GitHub-style Contribution / Compliance Grid */}
          <GlassCard variant="glass" className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Compliance Consistency
              </h3>
              <p className="text-[11px] text-[#64748B]">Visualization of daily protocol compliance over the last 12 weeks.</p>
            </div>

            <div className="flex flex-col space-y-2 overflow-x-auto scrollbar-none pb-2">
              <div className="flex gap-1.5 min-w-[320px]">
                {CONTRIBUTION_WEEKS.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5">
                    {week.map((score, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-[12px] h-[12px] rounded-[3px] transition-all duration-300 ${
                          score === 0
                            ? 'bg-white/5'
                            : score === 1
                            ? 'bg-indigo-900/40 border border-indigo-900/30'
                            : score === 2
                            ? 'bg-indigo-600/50'
                            : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-glow'
                        }`}
                        title={`Compliance Level: ${score}/3`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Grid Legend */}
              <div className="flex items-center justify-end gap-2 text-[10px] text-[#64748B] pt-2">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-white/5" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-indigo-900/40" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-indigo-600/50" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-indigo-500" />
                <span>More</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
