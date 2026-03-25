'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Check, ExternalLink, AlertCircle, Zap } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'ghl',   name: 'GoHighLevel',    logo: '⚡', category: 'CRM / Patient Pipeline',
    desc: 'Sync leads, patient contacts, and pipeline stages. Enables automated follow-up via GHL workflows.',
    status: 'disconnected', fields: ['GHL API Key', 'Location ID'],
  },
  {
    id: 'anthropic', name: 'Anthropic Claude', logo: '🤖', category: 'AI Engine',
    desc: 'Powers all 8 AI modules — intake, documentation, follow-up analysis, and content generation.',
    status: 'connected', fields: [],
  },
  {
    id: 'twilio', name: 'Twilio (SMS)', logo: '📱', category: 'Patient Messaging',
    desc: 'Send SMS follow-ups, appointment reminders, and promotional offers directly from PracticeOS.',
    status: 'disconnected', fields: ['Account SID', 'Auth Token', 'Phone Number'],
  },
  {
    id: 'stripe', name: 'Stripe',        logo: '💳', category: 'Billing & Subscriptions',
    desc: 'Process patient payments, manage subscription billing, and track revenue.',
    status: 'disconnected', fields: ['Publishable Key', 'Secret Key', 'Webhook Secret'],
  },
  {
    id: 'jane',   name: 'Jane App',      logo: '📅', category: 'EMR / Scheduling',
    desc: 'Sync appointments, patient charts, and treatment records bi-directionally.',
    status: 'coming_soon', fields: [],
  },
  {
    id: 'drchrono', name: 'DrChrono',    logo: '🏥', category: 'EMR / Scheduling',
    desc: 'Full EHR integration for clinical documentation sync and patient record management.',
    status: 'coming_soon', fields: [],
  },
];

export default function IntegrationsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [apiValues, setApiValues] = useState<Record<string, string>>({});
  const [connected, setConnected] = useState<string[]>(['anthropic']);

  const statusBadge = (s: string) => {
    if (s === 'connected') return <span className="badge badge-green flex items-center gap-1"><Check className="w-3 h-3" />Connected</span>;
    if (s === 'coming_soon') return <span className="badge badge-gray">Coming Soon</span>;
    return <span className="badge badge-amber flex items-center gap-1"><AlertCircle className="w-3 h-3" />Not Connected</span>;
  };

  const handleConnect = (id: string) => {
    setConnected(prev => [...prev, id]);
    setExpanded(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
            <Settings className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Integrations</h1>
            <p className="text-[#64748B] text-sm">Connect your practice stack · CRM · EMR · SMS · Billing</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-4 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20 flex items-center gap-3">
          <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <p className="text-sm text-[#94A3B8]">
            <strong className="text-[#F1F5F9]">Priority:</strong> Connect GoHighLevel first — it's the data spine that powers patient intake, follow-up, and marketing automation.
          </p>
        </div>

        <div className="space-y-3">
          {INTEGRATIONS.map((intg, i) => {
            const isConnected = connected.includes(intg.id);
            const isExpanded  = expanded === intg.id;
            return (
              <motion.div key={intg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="glass-card overflow-hidden">
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                      {intg.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display font-semibold text-sm">{intg.name}</h3>
                        <span className="badge badge-gray text-[10px]">{intg.category}</span>
                      </div>
                      <p className="text-[#64748B] text-xs">{intg.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {statusBadge(isConnected ? 'connected' : intg.status)}
                    {intg.status !== 'coming_soon' && !isConnected && (
                      <button onClick={() => setExpanded(isExpanded ? null : intg.id)}
                        className="btn-primary text-xs py-1.5">Connect</button>
                    )}
                    {isConnected && intg.id !== 'anthropic' && (
                      <button className="btn-ghost text-xs"><Settings className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </div>

                {isExpanded && intg.fields.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-white/5 p-5 bg-[#0F1221]/60">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {intg.fields.map(f => (
                        <div key={f}>
                          <label className="text-xs text-[#64748B] mb-1.5 block">{f}</label>
                          <input type={f.toLowerCase().includes('secret') || f.toLowerCase().includes('token') || f.toLowerCase().includes('key') ? 'password' : 'text'}
                            value={apiValues[`${intg.id}_${f}`] || ''}
                            onChange={e => setApiValues({ ...apiValues, [`${intg.id}_${f}`]: e.target.value })}
                            placeholder={`Enter ${f}`} className="input-field text-sm" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleConnect(intg.id)} className="btn-primary text-sm gap-1">
                        <Check className="w-4 h-4" />Connect {intg.name}
                      </button>
                      <a href="#" className="btn-ghost text-sm gap-1"><ExternalLink className="w-4 h-4" />View Docs</a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
