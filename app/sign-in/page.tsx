'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    window.location.href = '/dashboard/longevity';
  };

  return (
    <div className="min-h-screen bg-[#080B15] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="font-display font-bold text-lg">PracticeOS</span>
          </Link>
          <h1 className="font-display font-black text-2xl mb-2">Welcome back</h1>
          <p className="text-[#64748B] text-sm">Sign in to your practice dashboard</p>
        </div>

        <div className="glass-card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#64748B] mb-1.5 block font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="dr@yourpractice.com"
                  className="input-field pl-9 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#64748B] mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="input-field pl-9 pr-10 text-sm" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/6 text-center">
            <p className="text-[#64748B] text-sm">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Start free trial
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[#64748B] text-xs mt-5">
          HIPAA compliant · SOC 2 ready · 256-bit encryption
        </p>
      </motion.div>
    </div>
  );
}
