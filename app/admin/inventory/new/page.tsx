import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/inventory" className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="font-bold text-slate-900">Add New Product</h1>
          <p className="text-xs text-slate-500">Create a new inventory listing</p>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
