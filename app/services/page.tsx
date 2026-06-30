'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { INDIAN_STATES } from '@/lib/constants';
import { CheckCircle, Shield, FileText, Phone, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ServiceType = 'Service/AMC' | 'AERB';

const AMC_FEATURES = [
  'Preventive Maintenance (PM) visits quarterly or biannual',
  'Emergency breakdown support with 4-hour response SLA',
  'OEM-grade spare parts sourcing and management',
  'Calibration and performance qualification reports',
  'Operator refresher training sessions',
  'Online remote diagnostics where applicable',
];

const AERB_FEATURES = [
  'AERB license application for new installations',
  'Annual renewal of existing AERB licenses',
  'Site shielding design and compliance review',
  'AERB inspection scheduling and escort',
  'Radiation safety officer documentation support',
  'Corrective action response drafting',
];

export default function ServicesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState<ServiceType>('Service/AMC');
  const [form, setForm] = useState({ name:'', phone:'', email:'', institution_name:'', city:'', region_state:'', message:'' });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('leads').insert({
      ...form, email: form.email || null, institution_name: form.institution_name || null,
      city: form.city || null, region_state: form.region_state || null,
      requirement_type: tab, status: 'New',
    });
    setLoading(false);
    if (error) toast({ title: 'Error', description: 'Could not submit.', variant: 'destructive' });
    else setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1a0f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#4ade80] font-semibold text-sm uppercase tracking-widest mb-3">After-Sales Support</p>
            <h1 className="text-4xl font-bold mb-4">AMC and AERB Services</h1>
            <p className="text-slate-300 leading-relaxed">Keep your imaging systems at peak performance with our Annual Maintenance Contracts and navigate AERB compliance with expert guidance.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[['4 hrs','Emergency Response SLA'],['300+','Active AMC Contracts'],['98%','Uptime Guarantee'],['50+','Certified Engineers']].map(([v,l]) => (
              <div key={v} className="text-center">
                <div className="text-2xl font-bold text-[#1a6b3c]">{v}</div>
                <div className="text-sm text-slate-600 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div id="amc" className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center"><Wrench className="w-5 h-5 text-teal-700" /></div>
                <div><h2 className="text-lg font-bold text-slate-900">Annual Maintenance Contract</h2><p className="text-sm text-slate-500">Comprehensive equipment care plans</p></div>
              </div>
              <ul className="space-y-2.5">
                {AMC_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">AMC Coverage Tiers</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{t:'Basic',d:'PM visits only',c:'bg-slate-50 border-slate-200'},{t:'Standard',d:'PM + emergency calls',c:'bg-green-50 border-green-200'},{t:'Comprehensive',d:'Full coverage incl. parts',c:'bg-teal-50 border-teal-200'}].map(({t,d,c}) => (
                    <div key={t} className={`${c} border rounded-xl p-3 text-center`}>
                      <p className="font-bold text-slate-900 text-sm">{t}</p>
                      <p className="text-xs text-slate-600 mt-1">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="aerb" className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-[#1a6b3c]" /></div>
                <div><h2 className="text-lg font-bold text-slate-900">AERB Compliance Assistance</h2><p className="text-sm text-slate-500">End-to-end regulatory support</p></div>
              </div>
              <ul className="space-y-2.5">
                {AERB_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <FileText className="w-4 h-4 text-[#1a6b3c] flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-800 mb-1">Penalty Avoidance</p>
                <p className="text-xs text-amber-700">Operating without valid AERB license can result in fines up to Rs. 5 Lakhs and equipment seizure. Let our experts keep you compliant.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900 mb-1">Request Submitted!</h3>
                  <p className="text-sm text-slate-500 mb-4">Our service team will contact you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-sm text-[#1a6b3c] hover:underline">Submit another</button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-slate-900 mb-4 text-sm">Apply for Service</h3>
                  <div className="flex gap-2 mb-5">
                    {(['Service/AMC','AERB'] as ServiceType[]).map(t => (
                      <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === t ? 'bg-[#1a6b3c] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {t === 'Service/AMC' ? 'AMC' : 'AERB'}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label><input name="name" value={form.name} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="Your name" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label><input name="phone" value={form.phone} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="+91 xxxxx xxxxx" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Institution</label><input name="institution_name" value={form.institution_name} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="Hospital / Clinic" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                      <select name="region_state" value={form.region_state} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Details</label>
                      <textarea name="message" value={form.message} onChange={set} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] resize-none" placeholder={tab === 'Service/AMC' ? 'Equipment type, brand, current issues...' : 'License type, current status...'} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#1a6b3c] hover:bg-[#155730] disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors">
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </form>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5" /><span>Or call: <a href="tel:+919555414998" className="text-[#1a6b3c] font-medium">+91 95554 14998</a></span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
