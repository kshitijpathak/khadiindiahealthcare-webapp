'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';
import { CONDITION_COLORS, MODALITIES, formatINR } from '@/lib/constants';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, Package } from 'lucide-react';

const ALL_TABS = ['All', ...MODALITIES] as const;
type Tab = (typeof ALL_TABS)[number];

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (search.trim()) q = q.or(`title.ilike.%${search}%,brand.ilike.%${search}%,modality_type.ilike.%${search}%`);
    const { data } = await q;
    setAll(data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    setProducts(activeTab === 'All' ? all : all.filter(p => p.modality_type === activeTab));
  }, [activeTab, all]);

  const counts = ALL_TABS.reduce((acc, t) => {
    acc[t] = t === 'All' ? all.length : all.filter(p => p.modality_type === t).length;
    return acc;
  }, {} as Record<Tab, number>);

  const toggleAvail = async (p: Product) => {
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id);
    const updated = (x: Product) => x.id === p.id ? { ...x, is_available: !x.is_available } : x;
    setAll(prev => prev.map(updated));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setAll(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, brand, type..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white" />
        </div>
        <Link href="/admin/inventory/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" />Add Product
        </Link>
      </div>

      {/* Modality tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {ALL_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab
                ? 'bg-[#1a6b3c] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}>
            {tab}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm animate-pulse">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm mb-3">
              {activeTab === 'All' ? 'No products yet.' : `No ${activeTab} products found.`}
            </p>
            <Link href="/admin/inventory/new" className="text-[#1a6b3c] text-sm font-medium hover:underline">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Modality</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Condition</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Price</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Visibility</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-10 h-8 object-cover rounded-lg flex-shrink-0 hidden sm:block" />
                        ) : (
                          <div className="w-10 h-8 bg-slate-100 rounded-lg flex-shrink-0 hidden sm:flex items-center justify-center">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-semibold text-[#1a6b3c] bg-green-50 px-2 py-0.5 rounded">{p.modality_type}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${CONDITION_COLORS[p.condition] || 'bg-slate-100 text-slate-700'}`}>{p.condition}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-700 font-medium">
                      {formatINR(p.base_price, p.show_price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleAvail(p)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${p.is_available ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {p.is_available ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        {p.is_available ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/inventory/${p.id}`}
                          className="p-1.5 text-slate-500 hover:text-[#1a6b3c] hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">{products.length} product{products.length !== 1 ? 's' : ''}{activeTab !== 'All' ? ` in ${activeTab}` : ''}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
