'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, ArrowRight, Lock, Mail, Building2, User, Check } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  { id: 'starter',    name: 'Starter',    price: '$497/mo',  desc: '3 Tier 1 modules' },
  { id: 'operations', name: 'Operations', price: '$997/mo',  desc: 'Full AI OS', popular: true },
  { id: 'enterprise', name: 'Enterprise', price: '$1,997/mo',desc: 'Multi-location' },
];

export default function SignUpPage() {
  const [step, setStep]           = useState(1);
  const [plan, setPlan]           = useState('operations');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [practice, setPractice]   = useState('');
  const [password, setPassword]   = useState('');
  const [show, setShow]           = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#080B15] flex items-center justify-center px-4 relative overflow-hidden py-12">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="font-display font-bold text-lg">PracticeOS</span>
          </Link>
          <h1 className="font-display font-black text-2xl mb-2">Start your free trial</h1>
          <p className="text-[#64748B] text-sm">14 days free · No credit card required</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' : 'bg-white/5 text-[#64748B]'}`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              {s === 1 && <div className={`h-px w-12 transition-all ${step > 1 ? 'bg-indigo-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Select Your Plan</p>
                <div className="space-y-2 mb-4">
                  {PLANS.map(p => (
                    <div key={p.id} onClick={() => setPlan(p.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${plan === p.id ? 'border-indigo-500/50 bg-indigo-500/8' : 'border-white/8 hover:border-white/15'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === p.id ? 'border-indigo-400' : 'border-[#64748B]'}`}>
                          {plan === p.id && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold">{p.name}</span>
                          {p.popular && <span className="ml-2 badge badge-os text-[10px]">Popular</span>}
                          <p className="text-[11px] text-[#64748B]">{p.desc}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold gradient-text">{p.price}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Practice Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input value={practice} onChange={e => setPractice(e.target.value)} required
                      placeholder="Your Practice Name" className="input-field pl-9 text-sm" />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Create Your Account</p>
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input value={name} onChange={e => setName(e.target.value)} required
                      placeholder="Dr. First Last" className="input-field pl-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="dr@yourpractice.com" className="input-field pl-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder="Min. 8 characters" className="input-field pl-9 pr-10 text-sm" />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm mt-2">
                  {loading
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
                    : <><span>Launch My PracticeOS</span><Sparkles className="w-4 h-4" /></>}
                </button>
                <p className="text-[10px] text-[#64748B] text-center">
                  By signing up you agree to our Terms of Service & Privacy Policy
                </p>
              </>
            )}
          </form>

          <div className="mt-5 pt-5 border-t border-white/6 text-center">
            <p className="text-[#64748B] text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
