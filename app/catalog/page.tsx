'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronRight, MapPin, Tag } from 'lucide-react';
import { supabase, Product } from '@/lib/supabase';
import { MODALITIES, BRANDS, CONDITIONS, INDIAN_STATES, CONDITION_COLORS, formatINR } from '@/lib/constants';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [modalities, setModalities] = useState<string[]>(searchParams.get('modality') ? [searchParams.get('modality')!] : []);
  const [brands, setBrands] = useState<string[]>(searchParams.get('brand') ? [searchParams.get('brand')!] : []);
  const [conditions, setConditions] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('products').select('*').eq('is_available', true).order('created_at', { ascending: false });
    if (modalities.length) q = q.in('modality_type', modalities);
    if (brands.length) q = q.in('brand', brands);
    if (conditions.length) q = q.in('condition', conditions);
    if (states.length) q = q.in('location_state', states);
    if (search.trim()) q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
    const { data } = await q;
    setProducts(data || []);
    setLoading(false);
  }, [search, modalities, brands, conditions, states]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const clearAll = () => { setSearch(''); setModalities([]); setBrands([]); setConditions([]); setStates([]); };

  const activeCount = modalities.length + brands.length + conditions.length + states.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#1a6b3c] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium">Equipment Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-5">Imaging Equipment Inventory</h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by model, brand, modality..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-transparent" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-60 flex-shrink-0 space-y-4">
            <FilterSection title="Modality" options={MODALITIES as unknown as string[]} selected={modalities} onToggle={v => toggle(modalities, setModalities, v)} />
            <FilterSection title="Brand" options={BRANDS as unknown as string[]} selected={brands} onToggle={v => toggle(brands, setBrands, v)} />
            <FilterSection title="Condition" options={CONDITIONS as unknown as string[]} selected={conditions} onToggle={v => toggle(conditions, setConditions, v)} />
            <FilterSection title="State" options={INDIAN_STATES as unknown as string[]} selected={states} onToggle={v => toggle(states, setStates, v)} scrollable />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-slate-500">{loading ? 'Loading...' : `${products.length} result${products.length !== 1 ? 's' : ''}`}</p>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors">
                    <X className="w-3 h-3" /> Clear ({activeCount})
                  </button>
                )}
              </div>
              <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="w-4 h-4" /> Filters {activeCount > 0 && `(${activeCount})`}
              </button>
            </div>

            {showFilters && (
              <div className="lg:hidden bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-4">
                <FilterSection title="Modality" options={MODALITIES as unknown as string[]} selected={modalities} onToggle={v => toggle(modalities, setModalities, v)} />
                <FilterSection title="Brand" options={BRANDS as unknown as string[]} selected={brands} onToggle={v => toggle(brands, setBrands, v)} />
                <FilterSection title="Condition" options={CONDITIONS as unknown as string[]} selected={conditions} onToggle={v => toggle(conditions, setConditions, v)} />
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-slate-200" />
                    <div className="p-4 space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-200 rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No equipment found</h3>
                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters.</p>
                <button onClick={clearAll} className="text-[#1a6b3c] text-sm font-medium hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, options, selected, onToggle, scrollable }: { title: string; options: string[]; selected: string[]; onToggle: (v: string) => void; scrollable?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-900 text-sm mb-3">{title}</h3>
      <div className={`space-y-2 ${scrollable ? 'max-h-48 overflow-y-auto scrollbar-hide' : ''}`}>
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} className="w-4 h-4 rounded border-slate-300 text-[#1a6b3c] focus:ring-[#1a6b3c]" />
            <span className="text-sm text-slate-700 group-hover:text-[#1a6b3c] transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0] || 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg';
  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-green-200 hover:shadow-lg transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CONDITION_COLORS[product.condition] || 'bg-slate-100 text-slate-700'}`}>
            {product.condition}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-[#1a6b3c] bg-green-50 px-2 py-0.5 rounded">{product.modality_type}</span>
          <span className="text-xs text-slate-500">{product.brand}</span>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#1a6b3c] transition-colors">{product.title}</h3>
        {product.location_state && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <MapPin className="w-3 h-3" /><span>{product.location_state}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[#1a6b3c]">
            <Tag className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{formatINR(product.base_price, product.show_price)}</span>
          </div>
          <span className="text-xs text-[#1a6b3c] font-medium group-hover:underline">View Details</span>
        </div>
      </div>
    </Link>
  );
}
