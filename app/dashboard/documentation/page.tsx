'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, FileText, CheckCircle2, Download,
  ChevronDown, Sparkles, RefreshCw, Pen, AlertCircle, Copy, Shield,
} from 'lucide-react';

const DOC_TYPES = [
  { value: 'SOAP_NOTE',            label: 'SOAP Note' },
  { value: 'PROCEDURE_NOTE',       label: 'Procedure Note' },
  { value: 'INITIAL_CONSULTATION', label: 'Initial Consultation' },
  { value: 'TREATMENT_PLAN_DOC',   label: 'Treatment Plan' },
  { value: 'GOOD_FAITH_EXAM',      label: 'Good Faith Exam' },
  { value: 'MD_OVERSIGHT_NOTE',    label: 'MD Oversight Note' },
];

const PROVIDER_ROLES = [
  { value: 'PHYSICIAN',            label: 'Physician (MD/DO)' },
  { value: 'NURSE_PRACTITIONER',   label: 'Nurse Practitioner (NP)' },
  { value: 'PHYSICIAN_ASSISTANT',  label: 'Physician Assistant (PA)' },
  { value: 'REGISTERED_NURSE',     label: 'Registered Nurse (RN)' },
];

const RECENT_DOCS = [
  { id: 1, patient: 'James T.', type: 'SOAP Note',              provider: 'Dr. Castillo', time: '8:55 AM',   status: 'pending_signature' },
  { id: 2, patient: 'Maria G.', type: 'Initial Consultation',   provider: 'Dr. Castillo', time: 'Yesterday', status: 'signed' },
  { id: 3, patient: 'Ana R.',   type: 'Procedure Note — NAD+',  provider: 'Dr. Castillo', time: 'Yesterday', status: 'signed' },
  { id: 4, patient: 'David L.', type: 'Treatment Plan',         provider: 'NP Williams',  time: 'Mar 22',    status: 'signed' },
];

export default function DocumentationPage() {
  const [docType, setDocType]           = useState('SOAP_NOTE');
  const [providerRole, setProviderRole] = useState('PHYSICIAN');
  const [providerName, setProviderName] = useState('Dr. Guillermo Castillo');
  const [patientName, setPatientName]   = useState('');
  const [visitData, setVisitData]       = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [loading, setLoading]           = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [activeTab, setActiveTab]       = useState<'generate' | 'recent'>('generate');

  const generateDoc = async () => {
    if (!visitData.trim()) return;
    setLoading(true); setGeneratedDoc('');
    try {
      const res = await fetch('/api/documentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: docType, providerRole, providerName, patientName, visitData, state: 'CA' }),
      });
      const data = await res.json();
      setGeneratedDoc(data.document || data.error || 'Error generating document.');
    } catch { setGeneratedDoc('Failed to generate. Check API configuration.'); }
    finally   { setLoading(false); }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}>
            <Mic className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Voice Documentation</h1>
            <p className="text-[#64748B] text-sm">Dictate → AI formats → Review → E-Sign · 60–70% less chart time</p>
          </div>
        </div>
        <div className="flex gap-1">
          {(['generate', 'recent'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? 'bg-sky-500/15 text-sky-300 border border-sky-500/25' : 'text-[#64748B] hover:text-[#94A3B8]'}`}>
              {t === 'generate' ? '✍️ Generate Note' : '📁 Recent Docs'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'recent' && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display font-semibold">Recent Documents</h2>
              <span className="badge badge-amber flex items-center gap-1"><AlertCircle className="w-3 h-3" />1 needs signature</span>
            </div>
            <div className="divide-y divide-white/5">
              {RECENT_DOCS.map(doc => (
                <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.patient} — {doc.type}</p>
                      <p className="text-[#64748B] text-xs">{doc.provider} · {doc.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.status === 'pending_signature'
                      ? <span className="badge badge-amber flex items-center gap-1"><Pen className="w-2.5 h-2.5" />Needs Signature</span>
                      : <span className="badge badge-green flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Signed</span>}
                    {doc.status === 'pending_signature' && (
                      <button className="btn-primary text-xs py-1.5 gap-1"><Pen className="w-3.5 h-3.5" />Sign Now</button>
                    )}
                    <button className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display font-semibold">Document Settings</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#64748B] mb-1.5 block">Document Type</label>
                    <div className="relative">
                      <select value={docType} onChange={e => setDocType(e.target.value)} className="input-field pr-8 appearance-none cursor-pointer text-sm">
                        {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] mb-1.5 block">Provider Role</label>
                    <div className="relative">
                      <select value={providerRole} onChange={e => setProviderRole(e.target.value)} className="input-field pr-8 appearance-none cursor-pointer text-sm">
                        {PROVIDER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#64748B] mb-1.5 block">Provider Name</label>
                    <input value={providerName} onChange={e => setProviderName(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] mb-1.5 block">Patient Name</label>
                    <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Patient name" className="input-field text-sm" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold">Visit Notes / Dictation</h2>
                  <button onClick={() => setIsRecording(!isRecording)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isRecording ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25' : 'bg-sky-500/15 text-sky-300 border border-sky-500/25'}`}>
                    {isRecording ? <><MicOff className="w-3.5 h-3.5" />Stop</> : <><Mic className="w-3.5 h-3.5" />Dictate</>}
                  </button>
                </div>
                {isRecording && (
                  <div className="flex items-center gap-2 text-xs text-rose-400 animate-pulse">
                    <span className="alert-dot" />Recording... speak your visit notes
                  </div>
                )}
                <textarea value={visitData} onChange={e => setVisitData(e.target.value)}
                  placeholder="Paste or type visit notes, or use the Dictate button. Include: chief complaint, exam findings, diagnosis, plan, medications, follow-up..."
                  className="input-field min-h-[200px] resize-none text-sm leading-relaxed" />
                <button onClick={generateDoc} disabled={loading || !visitData.trim()} className="btn-primary w-full justify-center">
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Clinical Note</>}
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold">Generated Document</h2>
                {generatedDoc && (
                  <div className="flex gap-2">
                    <button className="btn-ghost text-xs gap-1"><Copy className="w-3.5 h-3.5" />Copy</button>
                    <button className="btn-ghost text-xs gap-1"><Download className="w-3.5 h-3.5" />Export</button>
                    <button className="btn-primary text-xs gap-1 py-1.5"><Pen className="w-3.5 h-3.5" />Sign & Save</button>
                  </div>
                )}
              </div>
              {!generatedDoc && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B]">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">Your formatted clinical note will appear here</p>
                  <p className="text-xs mt-1 opacity-70">AI formats to your role scope with ICD-10 & CPT codes</p>
                </div>
              )}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
                  <p className="text-[#64748B] text-sm">Generating compliant clinical documentation...</p>
                </div>
              )}
              {generatedDoc && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-emerald-300">Document generated. Review before signing.</p>
                    <Shield className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                  </div>
                  <pre className="text-sm text-[#94A3B8] whitespace-pre-wrap leading-relaxed font-sans">{generatedDoc}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
