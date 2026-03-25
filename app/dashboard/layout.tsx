'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Sparkles, LayoutDashboard, MessageSquare, Mic, Bell, DollarSign,
  Target, Star, BarChart3, Brain, Settings, LogOut, ChevronRight,
  Menu, X, Building2, Users,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    href: '/dashboard' },
      { icon: BarChart3,       label: 'Analytics',    href: '/dashboard/analytics' },
    ],
  },
  {
    label: 'TIER 1 — OPERATIONS',
    items: [
      { icon: MessageSquare, label: 'Intake Concierge',   href: '/dashboard/intake' },
      { icon: Bell,          label: 'Follow-Up Engine',   href: '/dashboard/followup' },
      { icon: Mic,           label: 'Documentation',      href: '/dashboard/documentation' },
      { icon: DollarSign,    label: 'Revenue Optimizer',  href: '/dashboard/pricing' },
    ],
  },
  {
    label: 'TIER 2 — GROWTH',
    items: [
      { icon: Target,  label: 'Marketing Engine',     href: '/dashboard/marketing' },
      { icon: Star,    label: 'Reputation Intel',     href: '/dashboard/reputation' },
      { icon: Users,   label: 'Provider Analytics',   href: '/dashboard/providers' },
      { icon: Brain,   label: 'Staff Training',       href: '/dashboard/training' },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { icon: Building2, label: 'Practice Settings', href: '/dashboard/settings' },
      { icon: Settings,  label: 'Integrations',      href: '/dashboard/integrations' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`px-4 py-5 border-b border-white/5 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-display font-bold text-sm block leading-tight">PracticeOS</span>
            <span className="text-[10px] text-[#64748B]">AI Operating System</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-[#64748B] tracking-widest px-3 mb-2">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }} />
                    {!collapsed && <span>{item.label}</span>}
                    {active && !collapsed && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <button className={`nav-item w-full ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080B15] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-white/5 bg-[#0F1221]/80 backdrop-blur-sm transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-[#1E2235] border border-white/10 flex items-center justify-center z-10 hover:border-indigo-500/50 transition-colors"
          style={{ position: 'relative', alignSelf: collapsed ? 'center' : 'flex-end', margin: '4px 4px 0 auto' }}
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-[#64748B]" />
            : <X className="w-3 h-3 text-[#64748B]" />
          }
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[240px] bg-[#0F1221] border-r border-white/5 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0F1221]/80">
          <button className="btn-ghost p-2" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-sm">PracticeOS</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
