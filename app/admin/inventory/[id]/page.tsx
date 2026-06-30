'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { supabase, Product } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', params.id).maybeSingle().then(({ data }) => { setProduct(data); setLoading(false); });
  }, [params.id]);

  if (loading) return <div className="animate-pulse text-slate-400 text-sm p-6">Loading...</div>;
  if (!product) return (
    <div className="text-center p-10">
      <p className="text-slate-500 mb-3">Product not found.</p>
      <Link href="/admin/inventory" className="text-[#1a6b3c] text-sm hover:underline">Back to Inventory</Link>
    </div>
  );

  const { id, created_at, ...formData } = product;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/inventory" className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="font-bold text-slate-900">Edit Product</h1>
          <p className="text-xs text-slate-500 truncate max-w-xs">{product.title}</p>
        </div>
      </div>
      <ProductForm initialData={formData} productId={id} />
    </div>
  );
}
