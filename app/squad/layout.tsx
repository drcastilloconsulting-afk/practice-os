'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, MessageSquare, ClipboardList, Cpu, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Trophy, label: 'Leaderboard', href: '/squad' },
  { icon: MessageSquare, label: 'AI Coach', href: '/squad/chat' },
  { icon: ClipboardList, label: 'Protocol', href: '/squad/protocol' },
  { icon: Cpu, label: 'Devices', href: '/squad/devices' },
];

export default function SquadLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#080B15] text-white overflow-hidden relative">
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-[240px] bg-[#0F1221]/80 backdrop-blur-md border-r border-white/5 flex-shrink-0">
        {/* Branding Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-wider block">UA SQUAD</span>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">PracticeOS Client</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            // Check active state
            // For leaderboard/dashboard, it's exactly /squad
            const active = item.href === '/squad' 
              ? pathname === '/squad' 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-400 font-bold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-indigo-400' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer Widget */}
        <div className="p-4 border-t border-white/5 flex items-center gap-3 bg-black/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-glow">
            MD
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold truncate text-white">Mark Castillo</p>
            <p className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Ages 30-45 • Male</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
        
        {/* Mobile Sticky Header */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-[#0F1221]/60 backdrop-blur-md border-b border-white/5 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-black text-sm tracking-wider">UA SQUAD</span>
          </div>

          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400">
            MD
          </div>
        </header>

        {/* Scrollable Main Children View */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* 3. Mobile Fixed Bottom Navigation Bar (Hidden on Desktop) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0F1221]/90 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-2 z-40">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/squad' 
              ? pathname === '/squad' 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center w-16 h-full relative"
              >
                {/* Active Underline Pill */}
                {active && (
                  <div className="absolute top-0 w-8 h-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" />
                )}

                <item.icon className={`w-5 h-5 mb-1 transition-colors duration-300 ${
                  active ? 'text-indigo-400' : 'text-[#64748B]'
                }`} />

                <span className={`text-[9px] font-bold tracking-wide uppercase transition-colors duration-300 ${
                  active ? 'text-indigo-400' : 'text-[#64748B]'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
