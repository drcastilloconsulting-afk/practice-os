'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Target, Sparkles, Check, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

interface Habit {
  id: string;
  subscriberId: string;
  habitName: string;
  description: string | null;
  targetMetric: string | null;
  mitigationStrategy: string | null;
  isSelfReported: boolean;
  createdAt: string;
}

export default function SquadProtocol() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Habits on Mount
  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch('/api/ua-squad/habits?subscriberId=test');
        const data = await res.json();
        if (data.habits) {
          setHabits(data.habits);
          
          // Seed initial completion status locally (some items done for realism)
          const initialCompletions: Record<string, boolean> = {};
          data.habits.forEach((h: Habit, idx: number) => {
            initialCompletions[h.id] = idx === 0; // mark first habit complete as default
          });
          setCompletedHabits(initialCompletions);
        }
      } catch (err) {
        console.error('Failed to fetch protocol habits:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHabits();
  }, []);

  const toggleHabit = (id: string) => {
    setCompletedHabits((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculations for compliance rings
  const totalHabits = habits.length;
  const completedCount = Object.values(completedHabits).filter(Boolean).length;
  const compliancePercentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Progress Ring SVG Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (compliancePercentage / 100) * circumference;

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 relative overflow-hidden noise">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Daily Protocol Checklist</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Check off your negotiated offsets to log today's compliance.</p>
        </div>
        <Badge variant="os" dot={true}>
          Today's Log
        </Badge>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Radial Progress Ring Card */}
        <GlassCard variant="glass" className="p-6 col-span-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-white/5"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Foreground Circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-indigo-500 transition-all duration-500 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))'
                }}
              />
            </svg>
            
            {/* Overlay Text */}
            <div className="absolute text-center">
              <span className="text-3xl font-black font-display text-white">{compliancePercentage}%</span>
              <p className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider block">Completed</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {completedCount} of {totalHabits} offsets logged
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Maintain &gt;90% average for cohort standing.
            </p>
          </div>
        </GlassCard>

        {/* Informational Guidelines Card */}
        <GlassCard variant="surface" className="p-6 col-span-1 md:col-span-2 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" />
              Protocol Guidelines
            </h3>
            <ul className="text-xs text-[#94A3B8] space-y-2 list-disc list-inside">
              <li>Wearable devices sync automatically in the background (check **Devices** tab).</li>
              <li>Self-reported habits must be manually checked off daily before 11:59 PM.</li>
              <li>Negotiating new offsets replaces or supplements your current active protocols.</li>
            </ul>
          </div>

          <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <p className="text-[10px] text-indigo-300 leading-relaxed">
              Have a scheduling conflict (e.g. client dinner or flights)? 
              Go to **AI Coach** to negotiate a biological offset instantly.
            </p>
          </div>
        </GlassCard>

      </div>

      {/* Checklist Grid */}
      <GlassCard variant="glass" className="p-4 md:p-6 space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <ClipboardList className="w-4 h-4 text-indigo-400" />
          Active Check-Ins
        </h3>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : habits.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm text-[#64748B]">No active protocols found.</p>
              <p className="text-xs text-[#64748B]">Go to the AI Coach tab to design your first habit offset!</p>
            </div>
          ) : (
            habits.map((habit) => {
              const isChecked = !!completedHabits[habit.id];

              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-4 rounded-2xl border flex items-start gap-4 transition-all duration-300 cursor-pointer ${
                    isChecked
                      ? 'bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border-indigo-500/30'
                      : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                      isChecked
                        ? 'bg-indigo-500 border-indigo-400 text-white shadow-glow'
                        : 'border-white/20 bg-black/20 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>

                  {/* Habit Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${isChecked ? 'text-white/90 line-through' : 'text-white'}`}>
                        {habit.habitName}
                      </span>
                      {habit.isSelfReported ? (
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded">
                          Self-Reported
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                          Sensor Verified
                        </span>
                      )}
                    </div>

                    {habit.description && (
                      <p className="text-xs text-[#94A3B8]">{habit.description}</p>
                    )}

                    {habit.mitigationStrategy && (
                      <p className="text-xs text-indigo-300 bg-indigo-500/5 px-2.5 py-1.5 rounded-lg border border-indigo-500/10 mt-1 inline-block">
                        <strong>Offset Protocol:</strong> {habit.mitigationStrategy}
                      </p>
                    )}

                    {habit.targetMetric && (
                      <div className="flex items-center gap-1 text-[10px] text-[#64748B] font-bold uppercase tracking-wide pt-1">
                        <Target className="w-3.5 h-3.5 text-indigo-400" />
                        Target: {habit.targetMetric}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

    </div>
  );
}
