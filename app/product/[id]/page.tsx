'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Phone, MessageSquare, MapPin, CheckCircle, X } from 'lucide-react';
import { supabase, Product } from '@/lib/supabase';
import { CONDITION_COLORS, formatINR } from '@/lib/constants';
import CallbackForm from '@/components/CallbackForm';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showCallback, setShowCallback] = useState(false);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', params.id).maybeSingle().then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div>;
  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-slate-700">Product Not Found</h1>
      <Link href="/catalog" className="text-[#1a6b3c] hover:underline text-sm">Back to Catalog</Link>
    </div>
  );

  const images = product.images?.length ? product.images : ['https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg'];
  const specs = product.specifications as Record<string, unknown>;
  const wa = `https://wa.me/919555414998?text=${encodeURIComponent(`Hi, I'm interested in the ${product.title}. Please share more details.`)}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-[#1a6b3c]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/catalog" className="hover:text-[#1a6b3c]">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Carousel */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
              <div className="relative aspect-[16/9]">
                <img src={images[currentImage]} alt={product.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage(c => (c - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                      <ChevronLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <button onClick={() => setCurrentImage(c => (c + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                      <ChevronRight className="w-4 h-4 text-slate-700" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? 'bg-white' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImage ? 'border-[#1a6b3c]' : 'border-transparent hover:border-slate-300'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Technical Specifications</h2>
              <SpecTable modality={product.modality_type} specs={specs} />
            </div>

            {product.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About This System</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold text-[#1a6b3c] bg-green-50 px-2.5 py-0.5 rounded">{product.modality_type}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${CONDITION_COLORS[product.condition] || 'bg-slate-100 text-slate-700'}`}>{product.condition}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">{product.title}</h1>
              <p className="text-sm text-slate-500 mb-4">{product.brand}</p>
              {product.location_state && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" /><span>Available in {product.location_state}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-4 mb-5">
                <p className="text-xs text-slate-500 mb-1">Price</p>
                <p className="text-2xl font-bold text-[#1a6b3c]">{formatINR(product.base_price, product.show_price)}</p>
                {product.show_price && <p className="text-xs text-slate-500 mt-1">+ GST and installation charges applicable</p>}
              </div>
              <div className="space-y-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm">
                  <MessageSquare className="w-4 h-4" /> Inquire via WhatsApp
                </a>
                <button onClick={() => setShowCallback(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold rounded-xl transition-colors text-sm">
                  <Phone className="w-4 h-4" /> Request Callback
                </button>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 space-y-2">
                {['Free site survey and feasibility study','Certified installation team','12-month warranty on refurbished units','AERB documentation support','Operator training included'].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" /><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCallback && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Request a Callback</h3>
              <button onClick={() => setShowCallback(false)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5">
              <CallbackForm productId={product.id} productTitle={product.title} onSuccess={() => setShowCallback(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecTable({ modality, specs }: { modality: string; specs: Record<string, unknown> }) {
  const ctFields = [{ key: 'sliceCount', label: 'Slice Count' },{ key: 'tubeCondition', label: 'Tube Condition' },{ key: 'gantryBore', label: 'Gantry Bore' },{ key: 'scanSpeed', label: 'Scan Speed' }];
  const mriFields = [{ key: 'teslaStrength', label: 'Field Strength' },{ key: 'boreDiameter', label: 'Bore Diameter' },{ key: 'channels', label: 'Channels' },{ key: 'gradientStrength', label: 'Gradient Strength' }];
  const common = [{ key: 'manufacturingYear', label: 'Manufacturing Year' },{ key: 'warranty', label: 'Warranty' }];
  const modalityFields = modality === 'CT' ? ctFields : modality === 'MRI' ? mriFields : [];
  const allFields = [...modalityFields, ...common];
  const extraFields = Object.entries(specs).filter(([k]) => !allFields.some(f => f.key === k));
  const hasData = allFields.some(f => specs[f.key] !== undefined) || extraFields.length > 0;
  if (!hasData) return <p className="text-sm text-slate-500">Specifications available on request.</p>;
  return (
    <div className="divide-y divide-slate-100">
      {allFields.map(({ key, label }) => specs[key] !== undefined ? (
        <div key={key} className="py-3 grid grid-cols-2 gap-4">
          <span className="text-sm text-slate-500">{label}</span>
          <span className="text-sm font-semibold text-slate-900">{String(specs[key])}</span>
        </div>
      ) : null)}
      {extraFields.map(([key, value]) => (
        <div key={key} className="py-3 grid grid-cols-2 gap-4">
          <span className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          <span className="text-sm font-semibold text-slate-900">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
