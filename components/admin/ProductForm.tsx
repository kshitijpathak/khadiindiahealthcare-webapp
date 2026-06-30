'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import { MODALITIES, BRANDS, CONDITIONS, INDIAN_STATES } from '@/lib/constants';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FormData = Omit<Product, 'id' | 'created_at'>;

const DEFAULT: FormData = {
  title: '', description: '', brand: '', modality_type: 'CT',
  condition: 'Imported Refurbished', specifications: {}, base_price: null,
  show_price: false, is_available: true, images: [], location_state: '',
};

const CT_SPECS = [
  { key: 'sliceCount', label: 'Slice Count', placeholder: 'e.g. 128' },
  { key: 'tubeCondition', label: 'Tube Condition', placeholder: 'e.g. New, Good' },
  { key: 'gantryBore', label: 'Gantry Bore', placeholder: 'e.g. 78cm' },
  { key: 'scanSpeed', label: 'Scan Speed', placeholder: 'e.g. 0.28s' },
];

const MRI_SPECS = [
  { key: 'teslaStrength', label: 'Field Strength (Tesla)', placeholder: 'e.g. 1.5T' },
  { key: 'boreDiameter', label: 'Bore Diameter', placeholder: 'e.g. 70cm' },
  { key: 'channels', label: 'Channels', placeholder: 'e.g. 16' },
  { key: 'gradientStrength', label: 'Gradient Strength', placeholder: 'e.g. 33mT/m' },
];

const COMMON_SPECS = [
  { key: 'manufacturingYear', label: 'Manufacturing Year', placeholder: 'e.g. 2018' },
  { key: 'warranty', label: 'Warranty', placeholder: 'e.g. 12 months' },
];

export default function ProductForm({ initialData, productId }: { initialData?: Partial<FormData>; productId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>({ ...DEFAULT, ...(initialData || {}) });
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const setSpec = (key: string, value: string) =>
    setForm(p => ({ ...p, specifications: { ...p.specifications, [key]: value } }));

  const addImg = () => { if (!imgUrl.trim()) return; setForm(p => ({ ...p, images: [...p.images, imgUrl.trim()] })); setImgUrl(''); };
  const removeImg = (i: number) => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.brand) {
      toast({ title: 'Validation Error', description: 'Title and brand are required.', variant: 'destructive' }); return;
    }
    setLoading(true);
    const payload = { ...form, base_price: form.base_price ? Number(form.base_price) : null, location_state: form.location_state || null, description: form.description || null };
    const { error } = productId
      ? await supabase.from('products').update(payload).eq('id', productId)
      : await supabase.from('products').insert(payload);
    setLoading(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: productId ? 'Product Updated' : 'Product Created' });
    router.push('/admin/inventory');
  };

  const specs = form.specifications as Record<string, string>;
  const modalitySpecs = form.modality_type === 'CT' ? CT_SPECS : form.modality_type === 'MRI' ? MRI_SPECS : [];
  const allSpecs = [...modalitySpecs, ...COMMON_SPECS];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-bold text-slate-900">Basic Information</h2>
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
          <input name="title" value={form.title} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="e.g. Siemens SOMATOM 128 Slice CT Scanner" /></div>
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea name="description" value={form.description || ''} onChange={set} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] resize-none" placeholder="Detailed description..." /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
            <select name="brand" value={form.brand} onChange={set} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
              <option value="">Select brand</option>{BRANDS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Modality *</label>
            <select name="modality_type" value={form.modality_type} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
              {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Condition *</label>
            <select name="condition" value={form.condition} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Location State</label>
            <select name="location_state" value={form.location_state || ''} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
              <option value="">Select state</option>{INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-bold text-slate-900">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Base Price (INR)</label>
            <input name="base_price" type="number" value={form.base_price ?? ''} onChange={set} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="e.g. 4500000" /></div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="show_price" type="checkbox" checked={form.show_price} onChange={set} className="w-4 h-4 rounded text-[#1a6b3c]" />
              <span className="text-sm font-medium text-slate-700">Show price publicly</span></label></div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input name="is_available" type="checkbox" checked={form.is_available} onChange={set} className="w-4 h-4 rounded text-[#1a6b3c]" />
          <span className="text-sm font-medium text-slate-700">Mark as available/active</span></label>
      </div>

      {allSpecs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div>
            <h2 className="font-bold text-slate-900">Technical Specifications</h2>
            {(form.modality_type === 'CT' || form.modality_type === 'MRI') && (
              <p className="text-xs text-slate-500 mt-0.5">{form.modality_type}-specific fields are shown</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {allSpecs.map(({ key, label, placeholder }) => (
              <div key={key}><label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
                <input value={specs[key] || ''} onChange={e => setSpec(key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder={placeholder} /></div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-bold text-slate-900">Product Images</h2>
        <div className="flex gap-2">
          <input type="url" value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" placeholder="https://images.pexels.com/..."
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImg(); }}} />
          <button type="button" onClick={addImg} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"><Plus className="w-4 h-4" />Add</button>
        </div>
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group aspect-video">
                <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-slate-200" />
                <button type="button" onClick={() => removeImg(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#1a6b3c] hover:bg-[#155730] disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors">
          {loading ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/inventory')} className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-sm transition-colors">Cancel</button>
      </div>
    </form>
  );
}
