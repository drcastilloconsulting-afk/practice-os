'use client';
import { useState } from 'react';
import { Building2, MapPin, Phone, Globe, Check, Save } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    practiceName: 'Castillo Regenerative Medicine', provider: 'Dr. Guillermo Castillo',
    email: 'drcastilloconsulting@gmail.com', phone: '(310) 555-0100',
    address: '1234 Wellness Blvd, Los Angeles, CA 90210', website: 'https://drcastillo.com',
    state: 'CA', timezone: 'America/Los_Angeles', currency: 'USD',
    emrSystem: 'Jane App', npi: '1234567890', taxId: '12-3456789',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const field = (label: string, key: keyof typeof form, placeholder?: string, type = 'text') => (
    <div>
      <label className="text-xs text-[#64748B] mb-1.5 block font-medium">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder} className="input-field text-sm" />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Building2 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">Practice Settings</h1>
              <p className="text-[#64748B] text-sm">Configure your practice profile and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-400" />Practice Info</h2>
            <div className="grid grid-cols-2 gap-4">
              {field('Practice Name',    'practiceName')}
              {field('Primary Provider', 'provider')}
              {field('Email',            'email', '', 'email')}
              {field('Phone',            'phone')}
              {field('Website',          'website', 'https://')}
              {field('State',            'state')}
            </div>
            <div>{field('Address', 'address')}</div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display font-semibold flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" />System & Billing</h2>
            <div className="grid grid-cols-2 gap-4">
              {field('EMR / Booking System', 'emrSystem', 'e.g. Jane App, Mindbody...')}
              {field('Timezone',             'timezone')}
              {field('NPI Number',           'npi')}
              {field('Tax ID',               'taxId')}
            </div>
          </div>

          <button type="submit" className="btn-primary gap-2">
            {saved ? <><Check className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Settings</>}
          </button>
        </form>
      </div>
    </div>
  );
}
