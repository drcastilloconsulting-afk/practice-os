'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, MessageSquare, AlertTriangle, CheckCircle2, RefreshCw, ChevronRight, ArrowUpRight, Search } from 'lucide-react';

const REVIEWS = [
  { id: 1, platform: 'Google', patient: 'Sarah M.', rating: 5, text: 'Dr. Castillo and his team are absolutely incredible. The stem cell treatment for my knee has given me my life back. I went from barely walking to hiking again in 3 months!', date: 'Mar 24', status: 'needs_response', sentiment: 'positive' },
  { id: 2, platform: 'Google', patient: 'James T.', rating: 5, text: 'Life-changing experience. The NAD+ IV drips have transformed my energy and mental clarity. Staff is professional and the facility is spotless.', date: 'Mar 22', status: 'responded', sentiment: 'positive' },
  { id: 3, platform: 'Yelp',   patient: 'Anonymous', rating: 3, text: 'Results were decent but the wait time was too long. Had to wait 45 minutes past my appointment. Would like to see better scheduling.', date: 'Mar 20', status: 'needs_response', sentiment: 'neutral' },
  { id: 4, platform: 'RealSelf', patient: 'Maria C.', rating: 5, text: 'Best regenerative medicine practice in LA. Dr. Castillo explains everything clearly and genuinely cares about outcomes, not just selling treatments.', date: 'Mar 19', status: 'responded', sentiment: 'positive' },
  { id: 5, platform: 'Google', patient: 'David R.', rating: 2, text: 'Felt rushed during my consultation. Seemed like they were trying to sell me a $10k package. Will not return.', date: 'Mar 15', status: 'escalated', sentiment: 'negative' },
];

const PLATFORM_STATS = [
  { name: 'Google',   rating: 4.9, count: 187, change: '+3 this week' },
  { name: 'Yelp',     rating: 4.7, count: 94,  change: '+1 this week' },
  { name: 'RealSelf', rating: 4.8, count: 52,  change: '+2 this week' },
  { name: 'Healthgrades', rating: 4.6, count: 41, change: 'No change' },
];

export default function ReputationPage() {
  const [selectedReview, setSelectedReview] = useState<typeof REVIEWS[0] | null>(null);
  const [draftResponse, setDraftResponse] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateDraft = async (review: typeof REVIEWS[0]) => {
    setSelectedReview(review); setDraftResponse(''); setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    if (review.sentiment === 'positive') {
      setDraftResponse(`Thank you so much for your kind words, ${review.patient.split(' ')[0]}! It truly means the world to our entire team to hear about the impact your treatment has had on your life. This is exactly why we do what we do — helping patients reclaim their health and vitality. We're honored to be part of your journey and look forward to continuing to support you. — Dr. Castillo & Team`);
    } else if (review.sentiment === 'neutral') {
      setDraftResponse(`Thank you for taking the time to share your experience. We apologize for the wait and want to assure you this is not our standard. We've recently implemented new scheduling protocols to eliminate delays. We value your feedback greatly and would love the opportunity to make this right. Please reach out to our office directly at your convenience. — Dr. Castillo`);
    } else {
      setDraftResponse(`We appreciate you sharing your concerns and are sorry your consultation experience didn't meet expectations. We take this feedback seriously and would very much like to speak with you personally to understand what happened and make it right. Please contact our patient experience team at your earliest convenience. Your trust is important to us. — Dr. Castillo`);
    }
    setGenerating(false);
  };

  const platformIcon = (p: string) => ({ Google: '🌐', Yelp: '⭐', RealSelf: '💉', Healthgrades: '🏥' }[p] || '📱');
  const sentimentColor = (s: string) => s === 'positive' ? 'badge-green' : s === 'negative' ? 'badge-rose' : 'badge-amber';

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
            <Star className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Reputation Intelligence</h1>
            <p className="text-[#64748B] text-sm">Google · Yelp · RealSelf · Healthgrades — monitored & managed in one place</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Platform ratings */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_STATS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="kpi-card text-center">
              <div className="text-2xl mb-1">{platformIcon(p.name)}</div>
              <div className="font-display font-black text-2xl text-amber-400">{p.rating}</div>
              <div className="text-xs text-[#64748B] mb-1">{p.name} · {p.count} reviews</div>
              <div className="text-[11px] text-emerald-400">{p.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Reviews list */}
          <div className="lg:col-span-3 glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display font-semibold">Recent Reviews</h2>
              <span className="badge badge-amber flex items-center gap-1"><AlertTriangle className="w-3 h-3" />2 need response</span>
            </div>
            <div className="divide-y divide-white/5">
              {REVIEWS.map(r => (
                <div key={r.id} className={`px-6 py-4 cursor-pointer transition-colors hover:bg-white/2 ${selectedReview?.id === r.id ? 'bg-amber-500/5' : ''}`}
                  onClick={() => generateDraft(r)}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{platformIcon(r.platform)}</span>
                      <span className="text-sm font-medium">{r.patient}</span>
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                        {Array.from({ length: 5 - r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-[#64748B]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge ${sentimentColor(r.sentiment)} text-[10px]`}>{r.sentiment}</span>
                      {r.status === 'responded' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {r.status === 'needs_response' && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                      {r.status === 'escalated' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                  </div>
                  <p className="text-[#64748B] text-xs leading-relaxed line-clamp-2">{r.text}</p>
                  <p className="text-[11px] text-[#64748B]/60 mt-1">{r.date} · {r.platform}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Response panel */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-semibold text-base">AI Response Drafter</h2>
            </div>
            {!selectedReview && !generating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B]">
                <Star className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Click any review to generate an AI-drafted response</p>
                <p className="text-xs mt-1 opacity-70">In your brand voice · HIPAA compliant</p>
              </div>
            )}
            {generating && (
              <div className="flex-1 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            )}
            {selectedReview && draftResponse && (
              <div className="flex-1 flex flex-col">
                <div className={`p-3 rounded-lg mb-3 ${selectedReview.sentiment === 'positive' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                  <p className="text-xs text-[#94A3B8] font-medium">{selectedReview.patient} · {selectedReview.platform} · {selectedReview.rating}★</p>
                </div>
                <textarea value={draftResponse} onChange={e => setDraftResponse(e.target.value)}
                  className="input-field flex-1 min-h-[140px] text-sm leading-relaxed resize-none mb-3" />
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 justify-center text-sm py-2"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" />Post Response
                  </button>
                  <button className="btn-ghost text-xs" onClick={() => generateDraft(selectedReview)}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
