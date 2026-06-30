'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { INDIAN_STATES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface CallbackFormProps {
  productId?: string;
  productTitle?: string;
  requirementType?: 'Buy' | 'Sell/Buyback' | 'Service/AMC' | 'AERB';
  onSuccess?: () => void;
}

export default function CallbackForm({ productId, productTitle, requirementType = 'Buy', onSuccess }: CallbackFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', institution_name: '', city: '', region_state: '',
    message: productTitle ? `I am interested in: ${productTitle}` : '',
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('leads').insert({
      ...form, product_id: productId || null,
      email: form.email || null, institution_name: form.institution_name || null,
      city: form.city || null, region_state: form.region_state || null,
      requirement_type: requirementType, status: 'New',
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: 'Could not submit. Please try again.', variant: 'destructive' });
    } else {
      toast({ title: 'Request Submitted!', description: 'Our team will contact you within 2 hours.' });
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input name="name" value={form.name} onChange={set} required placeholder="Dr. John Smith" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
          <input name="phone" value={form.phone} onChange={set} required placeholder="+91 98765 43210" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={set} placeholder="you@hospital.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Institution</label>
          <input name="institution_name" value={form.institution_name} onChange={set} placeholder="Hospital name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
          <input name="city" value={form.city} onChange={set} placeholder="Mumbai" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
          <select name="region_state" value={form.region_state} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
        <textarea name="message" value={form.message} onChange={set} rows={3} placeholder="Describe your requirement..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] resize-none" />
      </div>
      <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#1a6b3c] hover:bg-[#155730] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>
      <p className="text-xs text-slate-500 text-center">We respond within 2 business hours</p>
    </form>
  );
}
