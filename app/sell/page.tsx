'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MODALITIES, BRANDS, INDIAN_STATES } from '@/lib/constants';
import { CheckCircle, IndianRupee, Clock, Truck, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { icon: Star, label: 'Submit Details', desc: 'Fill the form with equipment info' },
  { icon: Clock, label: 'Free Valuation', desc: 'Our expert calls within 24 hours' },
  { icon: IndianRupee, label: 'Get Best Offer', desc: 'Transparent, competitive pricing' },
  { icon: Truck, label: 'We Pick Up', desc: 'We handle logistics and payment' },
];

export default function SellPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', institution_name:'', city:'', region_state:'', modality:'', brand:'', model:'', year:'', message:'' });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const message = `Equipment: ${form.modality} | Brand: ${form.brand} | Model: ${form.model} | Year: ${form.year}\n\n${form.message}`;
    const { error } = await supabase.from('leads').insert({
      name: form.name, phone: form.phone, email: form.email || null,
      institution_name: form.institution_name || null, city: form.city || null,
      region_state: form.region_state || null, message,
      requirement_type: 'Sell/Buyback', status: 'New',
    });
    setLoading(false);
    if (error) toast({ title: 'Error', description: 'Could not submit. Please try again.', variant: 'destructive' });
    else setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1a0f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#4ade80] font-semibold text-sm uppercase tracking-widest mb-3">Sell or Buyback</p>
            <h1 className="text-4xl font-bold mb-4">Turn Your Idle Equipment Into Cash</h1>
            <p className="text-slate-300 leading-relaxed">Fair market buyback prices for all major imaging brands. Free valuation by our Delhi team, no hidden charges, instant payment on pickup.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-[#1a6b3c]" /></div>
                <div>
                  <div className="text-xs text-[#1a6b3c] font-bold mb-0.5">Step {i + 1}</div>
                  <div className="font-semibold text-slate-900 text-sm">{label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h2>
                <p className="text-slate-600 text-sm mb-6">Our buyback specialist will call you within 24 hours with a valuation.</p>
                <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 bg-[#1a6b3c] text-white font-semibold rounded-xl text-sm hover:bg-[#155730] transition-colors">Submit Another</button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Equipment Details</h2>
                <p className="text-sm text-slate-500 mb-6">Tell us about the equipment you want to sell</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label><input name="name" value={form.name} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="Full name" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label><input name="phone" value={form.phone} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="+91 xxxxx xxxxx" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Email</label><input name="email" type="email" value={form.email} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="Email" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Institution</label><input name="institution_name" value={form.institution_name} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="Hospital / Clinic" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">City</label><input name="city" value={form.city} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="City" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                      <select name="region_state" value={form.region_state} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Equipment Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold text-slate-700 mb-1">Modality *</label>
                        <select name="modality" value={form.modality} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
                          <option value="">Select type</option>
                          {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div><label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
                        <select name="brand" value={form.brand} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
                          <option value="">Select brand</option>
                          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div><label className="block text-xs font-semibold text-slate-700 mb-1">Model</label><input name="model" value={form.model} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="e.g. Optima 660" /></div>
                      <div><label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturing Year</label><input name="year" value={form.year} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="e.g. 2018" /></div>
                    </div>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes</label>
                    <textarea name="message" value={form.message} onChange={set} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] resize-none" placeholder="Condition, issues, reason for selling..." />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3 bg-[#1a6b3c] hover:bg-[#155730] disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors">
                    {loading ? 'Submitting...' : 'Get Free Valuation'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">We Buy All Major Brands</h3>
              <div className="flex flex-wrap gap-2">
                {BRANDS.slice(0,7).map(b => <span key={b} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">{b}</span>)}
              </div>
            </div>
            <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
              <h3 className="font-bold text-green-900 mb-3 text-sm">Why Sell to Us?</h3>
              <ul className="space-y-2.5">
                {['Highest buyback prices in the market','Free technical valuation within 24 hours','We handle deinstallation and transport','Immediate payment on pickup','Trusted by 200+ institutions'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 text-[#1a6b3c] flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-1 text-sm">Need urgent assistance?</h3>
              <p className="text-xs text-slate-500 mb-3">Call our buyback helpline directly</p>
              <a href="tel:+919555414998" className="block w-full py-2.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors">
                +91 95554 14998
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
