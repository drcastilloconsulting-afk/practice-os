'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Zap, Shield, TrendingUp, MessageSquare, FileText,
  Users, BarChart3, Clock, ChevronRight, Check, Star,
  ArrowRight, Sparkles, Activity, DollarSign, Calendar,
  Mic, Bell, Target, Menu, X
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

const MODULES = [
  {
    icon: MessageSquare,
    name: 'AI Intake Concierge',
    tagline: 'Replaces your 45-min phone consultation',
    description: 'Trained on your treatment menu, contraindications, and pricing. Qualifies leads, pre-populates intake forms, and books appointments 24/7.',
    stat: '15–20 hrs/week recovered',
    color: 'from-indigo-500 to-violet-600',
    glow: 'rgba(99,102,241,0.3)',
    tier: 'TIER 1',
  },
  {
    icon: Bell,
    name: 'Follow-Up Engine',
    tagline: 'Revenue that would have walked out the door',
    description: 'Personalized SMS/email sequences at Day 3, Day 14, and Day 45 — based on their actual chart and treatment. Not generic blasts.',
    stat: '20–30% rebooking rate',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
    tier: 'TIER 1',
  },
  {
    icon: Mic,
    name: 'Voice Documentation',
    tagline: 'Dictate. Review. Sign. Done.',
    description: 'You speak, AI formats a compliant SOAP note. Provider reviews and e-signs in under 60 seconds. Pushed directly to your EMR.',
    stat: '60–70% less chart time',
    color: 'from-sky-500 to-indigo-600',
    glow: 'rgba(14,165,233,0.3)',
    tier: 'TIER 1',
  },
  {
    icon: DollarSign,
    name: 'Revenue Optimization',
    tagline: 'Airline pricing for your injector\'s schedule',
    description: 'Monitors booking density in real time. Auto-triggers promos to your warm list during low-utilization windows. Adjusts pricing and scheduling weekly.',
    stat: '8–15% revenue lift',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
    tier: 'TIER 1',
  },
  {
    icon: Target,
    name: 'Marketing Engine',
    tagline: 'Replaces a $60K marketing coordinator',
    description: 'Trained on your brand voice and compliance guardrails. Generates social calendars, ad copy, email campaigns, and SEO content. Human approves before publish.',
    stat: '$60K/yr saved',
    color: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.3)',
    tier: 'TIER 2',
  },
  {
    icon: Star,
    name: 'Reputation Intelligence',
    tagline: 'Google, Yelp, RealSelf — monitored & managed',
    description: 'Monitors every review in real time. Drafts responses in your brand voice. Flags negative sentiment for immediate escalation. Weekly competitor reports.',
    stat: '< 10 min/day to manage',
    color: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.3)',
    tier: 'TIER 2',
  },
  {
    icon: BarChart3,
    name: 'Provider Analytics',
    tagline: 'Know before you feel it',
    description: 'Surfaces consultation-to-package conversion, avg revenue per patient, rebooking rates, and retail attachment — per provider, per week.',
    stat: '30-day early warning system',
    color: 'from-cyan-500 to-sky-600',
    glow: 'rgba(6,182,212,0.3)',
    tier: 'TIER 2',
  },
  {
    icon: Brain,
    name: 'AI Staff Training',
    tagline: 'Onboard faster. Certify automatically.',
    description: 'Interactive AI scenarios where staff practice upsells and safety protocols. Quizzes, pass thresholds, and compliance-ready completion logs.',
    stat: '50% faster onboarding',
    color: 'from-fuchsia-500 to-violet-600',
    glow: 'rgba(217,70,239,0.3)',
    tier: 'TIER 2',
  },
];

const STATS = [
  { value: '$200K+', label: 'Avg revenue impact per practice, Year 1' },
  { value: '35+', label: 'Hours of staff time recovered per week' },
  { value: '8', label: 'AI modules covering every margin killer' },
  { value: '20+', label: 'Years of clinical expertise embedded in the AI' },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$497',
    period: '/mo',
    description: 'Perfect for launching and early-stage practices',
    features: [
      'AI Intake Concierge',
      'Automated Follow-Up Engine',
      'Voice Documentation Assistant',
      'Basic revenue dashboard',
      'Twilio SMS integration',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Operations',
    price: '$997',
    period: '/mo',
    description: 'Full AI OS for running practices',
    features: [
      'Everything in Starter',
      'Dynamic Pricing Engine',
      'Marketing Content Engine',
      'Reputation Intelligence',
      'Provider Performance Analytics',
      'GoHighLevel integration',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$1,997',
    period: '/mo',
    description: 'Multi-location with full automation stack',
    features: [
      'Everything in Operations',
      'AI Staff Training Platform',
      'Multi-location dashboard',
      'Custom EMR integrations',
      'White-glove onboarding',
      'Dedicated success manager',
      'Custom AI model fine-tuning',
    ],
    cta: 'Book a Demo',
    highlighted: false,
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B15] text-[#F1F5F9] overflow-x-hidden">

      {/* ── NAV ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080B15]/90 backdrop-blur-lg border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">PracticeOS</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="btn-ghost text-sm">{l.label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="/sign-in" className="btn-ghost text-sm">Sign In</a>
            <a href="/sign-up" className="btn-primary text-sm">Start Free Trial</a>
          </div>

          <button className="md:hidden btn-ghost" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0F1221] border-b border-white/5 px-6 py-4 space-y-1"
          >
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav-item block" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <div className="divider" />
            <a href="/sign-in" className="nav-item">Sign In</a>
            <a href="/sign-up" className="btn-primary w-full justify-center mt-2">Start Free Trial</a>
          </motion.div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 badge badge-os mb-6 text-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Built by Dr. Castillo · 20+ Years in Regenerative Medicine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-7xl leading-[1.05] mb-6 text-balance"
          >
            The AI Operating System{' '}
            <span className="gradient-text">Your Practice Deserves</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto text-balance"
          >
            Stop losing margin to labor inefficiency, inconsistent follow-up, and marketing waste.
            PracticeOS automates every revenue-killing bottleneck — so you can focus on patients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="/sign-up" className="btn-primary text-base px-8 py-3.5">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#features" className="btn-secondary text-base px-8 py-3.5">
              See All 8 Modules
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 text-sm text-[#64748B]"
          >
            No credit card required · 14-day free trial · Cancel anytime
          </motion.p>

          {/* Hero stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((s, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className="font-display font-black text-3xl gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-[#64748B] leading-tight">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-violet mb-4">8 AI Modules</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
              Every Margin Killer. <span className="gradient-text-violet">Automated.</span>
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              After 20+ years in this industry, Dr. Castillo identified the exact problems that kill practice margins.
              PracticeOS attacks every single one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card glass-card-hover p-6 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-lg`}
                    style={{ boxShadow: `0 0 20px ${mod.glow}` }}>
                    <mod.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="badge badge-gray text-[10px]">{mod.tier}</span>
                </div>

                <h3 className="font-display font-bold text-base mb-1">{mod.name}</h3>
                <p className="text-[#94A3B8] text-xs mb-3 font-medium italic">{mod.tagline}</p>
                <p className="text-[#64748B] text-sm leading-relaxed flex-1">{mod.description}</p>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="text-indigo-300 text-xs font-semibold">{mod.stat}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="badge badge-os mb-4">Simple Setup</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
              From Zero to <span className="gradient-text">Running in Days</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Connect Your Practice Data', desc: 'Link your EMR, booking system, and GoHighLevel. We handle the integrations — takes about 2 hours with your team.', icon: Shield },
              { step: '02', title: 'Train the AI on Your Practice', desc: 'Upload your treatment menu, brand voice, pricing, and provider bios. The AI learns your practice in 24 hours.', icon: Brain },
              { step: '03', title: 'Activate Your Modules', desc: 'Turn on Tier 1 modules first — intake, follow-up, documentation, pricing. Watch revenue and efficiency improve within week one.', icon: Zap },
              { step: '04', title: 'Expand to Full OS', desc: 'Add marketing, reputation, analytics, and training as you scale. One dashboard. Everything connected. Nothing missed.', icon: TrendingUp },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-start gap-6"
              >
                <div className="font-display font-black text-4xl text-indigo-800 leading-none w-14 flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-green mb-4">Transparent Pricing</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
              Pay for Results, <span className="gradient-text">Not Promises</span>
            </h2>
            <p className="text-[#94A3B8] text-lg">
              The average practice sees $200K+ in impact in Year 1. That's 10–20× ROI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-8 flex flex-col relative ${plan.highlighted ? 'ring-glow' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-os px-4">{plan.badge}</span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-[#94A3B8] text-sm mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="font-display font-black text-4xl">{plan.price}</span>
                    <span className="text-[#64748B] mb-1">{plan.period}</span>
                  </div>
                  <p className="text-[#64748B] text-sm">{plan.description}</p>
                </div>

                <div className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-[#94A3B8] text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <button className={plan.highlighted ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                  {plan.cta}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / CREDIBILITY ── */}
      <section id="about" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="glass-card p-10 md:p-14">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-display font-black text-3xl md:text-4xl mb-2">
                  Built by a MD Who Lived These Problems
                </h2>
                <p className="text-indigo-400 font-semibold">Dr. Guillermo Castillo · Regenerative Medicine Physician</p>
              </div>
            </div>

            <div className="space-y-4 text-[#94A3B8] text-base leading-relaxed mb-8">
              <p>
                After 20+ years in regenerative and aesthetic medicine, I know exactly where practices bleed margin:
                labor inefficiency, poor follow-up, empty appointment slots, and marketing waste.
              </p>
              <p>
                I didn't build PracticeOS by guessing. I built it from the inside — after running practices,
                serving as medical director, and watching practice owners work brutal hours for margins that
                didn't reflect their effort.
              </p>
              <p>
                <strong className="text-[#F1F5F9]">PracticeOS is my clinical judgment, scaled.</strong> Every
                AI module is trained on real regenerative medicine protocols, real patient communication
                patterns, and real revenue optimization strategies — not generic health tech templates.
              </p>
            </div>

            <a href="/sign-up" className="btn-primary text-base px-8 py-3.5">
              Start Building Your AI Practice
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
              Ready to Run Your Practice<br />
              <span className="gradient-text">on AI?</span>
            </h2>
            <p className="text-[#94A3B8] text-lg mb-10">
              Join regenerative medicine practices that have stopped losing margin to inefficiency.
              Start your 14-day free trial today — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/sign-up" className="btn-primary text-base px-10 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/sign-in" className="btn-secondary text-base px-10 py-4">
                Sign In
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold">PracticeOS</span>
          </div>
          <p className="text-[#64748B] text-sm">
            © 2025 PracticeOS by Dr. Castillo Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[#64748B]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">HIPAA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
