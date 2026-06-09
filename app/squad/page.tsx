'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Activity, TrendingUp, Calendar, ChevronRight, Award, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string;
  delta: string;
  gender: string;
  active: boolean;
  currentWinner: boolean;
}

// ─── Calendar Contribution Grid Mock Data (Last 12 weeks) ───
const CONTRIBUTION_WEEKS = Array.from({ length: 12 }, (_, wIdx) => {
  return Array.from({ length: 7 }, (_, dIdx) => {
    // Generate high compliance values generally, with occasional lower days
    const rand = Math.random();
    if (rand > 0.85) return 0; // Failed
    if (rand > 0.65) return 1;  // Low compliance
    if (rand > 0.35) return 2;  // Med compliance
    return 3;                  // High compliance
  });
});

export default function SquadDashboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [cohortLabel, setCohortLabel] = useState('Ages 30–45');
  const [cohortId, setCohortId] = useState('cohort-30-45');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active User State mapped from Leaderboard
  const [userRank, setUserRank] = useState('#5');
  const [userScore, setUserScore] = useState('94.6%');
  const [userDelta, setUserDelta] = useState('+1.4%');

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/ua-squad/leaderboard?cohortId=cohort-30-45');
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setCohortLabel(data.cohortLabel || 'Ages 30–45');
        setCohortId(data.cohortId || 'cohort-30-45');

        // Extract active user's standing
        const activeUser = data.leaderboard.find((entry: LeaderboardEntry) => entry.active);
        if (activeUser) {
          setUserRank(`#${activeUser.rank}`);
          setUserScore(activeUser.score);
          setUserDelta(activeUser.delta);
        }
      }
    } catch (err) {
      console.error('Failed to fetch squad leaderboard:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLeaderboard();
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 relative overflow-hidden noise">
      
      {/* Top Header Card */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">My Tournament Standing</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Compete week-over-week on compliance improvements.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all"
          title="Refresh Standings"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        
        {/* KPI 1: Standing */}
        <GlassCard variant="kpi" className="p-3 md:p-6 text-center space-y-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Trophy className="w-4.5 h-4.5" />
          </div>
          <span className="text-[9px] md:text-xs text-[#64748B] font-bold uppercase tracking-wider block">Rank</span>
          <span className="text-lg md:text-2xl font-black font-display text-white">{isLoading ? '...' : userRank}</span>
          <span className="text-[8px] md:text-[10px] text-[#94A3B8] block truncate">{cohortLabel}</span>
        </GlassCard>

        {/* KPI 2: CNI Index */}
        <GlassCard variant="kpi" className="p-3 md:p-6 text-center space-y-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <span className="text-[9px] md:text-xs text-[#64748B] font-bold uppercase tracking-wider block">CNI Score</span>
          <span className="text-lg md:text-2xl font-black font-display text-white">{isLoading ? '...' : userScore}</span>
          <span className="text-[8px] md:text-[10px] text-emerald-400 font-semibold block">90% compliance target</span>
        </GlassCard>

        {/* KPI 3: Delta Change */}
        <GlassCard variant="kpi" className="p-3 md:p-6 text-center space-y-1">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <span className="text-[9px] md:text-xs text-[#64748B] font-bold uppercase tracking-wider block">Weekly Delta</span>
          <span className="text-lg md:text-2xl font-black font-display text-indigo-400">{isLoading ? '...' : userDelta}</span>
          <span className="text-[8px] md:text-[10px] text-[#94A3B8] block">Improvement vs last week</span>
        </GlassCard>

      </div>

      {/* Cohort Leaderboard Section */}
      <GlassCard variant="glass" className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">Cohort Rankings</h3>
            <p className="text-[10px] text-[#64748B] mt-0.5">Top improvers are awarded the $5,000 package.</p>
          </div>
          <Badge variant="os" dot={true}>
            {cohortLabel}
          </Badge>
        </div>

        {/* Leaderboard Table List */}
        <div className="space-y-2.5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-14 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : (
            leaderboard.map((entry) => {
              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;
              const isThird = entry.rank === 3;

              return (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3 md:p-4 rounded-2xl border transition-all duration-300 ${
                    entry.active
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/40 shadow-glow relative z-10'
                      : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm">
                      {isFirst ? (
                        <span className="text-lg" title="First Place">🥇</span>
                      ) : isSecond ? (
                        <span className="text-lg" title="Second Place">🥈</span>
                      ) : isThird ? (
                        <span className="text-lg" title="Third Place">🥉</span>
                      ) : (
                        <span className="text-[#64748B]">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Subscriber Name & Cohort Status */}
                    <div>
                      <span className={`text-sm font-bold block ${entry.active ? 'text-white' : 'text-[#D1D5DB]'}`}>
                        {entry.name}
                      </span>
                      {entry.currentWinner && (
                        <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#E2E8F0] bg-[#3B82F6]/20 border border-[#3B82F6]/30 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                          Winner Bracket
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score Info */}
                  <div className="text-right">
                    <span className="text-sm font-black text-white font-display block">{entry.score}</span>
                    <span className={`text-[10px] font-bold ${
                      entry.delta.startsWith('+') ? 'text-emerald-400' : entry.delta.startsWith('-') ? 'text-rose-400' : 'text-[#64748B]'
                    }`}>
                      {entry.delta} Improvement
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      {/* Compliance Heatmap Consistency Grid */}
      <GlassCard variant="glass" className="p-4 md:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">Compliance Consistency</h3>
          <p className="text-[10px] text-[#64748B] mt-0.5">Visualization of your daily check-ins over the last 12 weeks.</p>
        </div>

        <div className="flex flex-col space-y-2 overflow-x-auto scrollbar-none pb-2">
          <div className="flex gap-1.5 min-w-[320px] justify-center py-2">
            {CONTRIBUTION_WEEKS.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((score, dIdx) => (
                  <div
                    key={dIdx}
                    className={`w-[13px] h-[13px] rounded-[3px] transition-all duration-300 ${
                      score === 0
                        ? 'bg-white/5'
                        : score === 1
                        ? 'bg-indigo-900/40 border border-indigo-900/30'
                        : score === 2
                        ? 'bg-indigo-600/50'
                        : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-glow'
                    }`}
                    title={`Day compliance: ${score}/3 completed`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Grid Legend */}
          <div className="flex items-center justify-end gap-2 text-[9px] text-[#64748B] pt-2 pr-4 border-t border-white/5">
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
  );
}
