'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Package, TrendingUp, Clock, CheckCircle, ArrowUpRight,
  ShoppingCart, RefreshCw, Wrench, FileText, Plus, ChevronRight,
} from 'lucide-react';
import { STATUS_COLORS, CONDITION_COLORS } from '@/lib/constants';

type Stats = {
  totalProducts: number;
  availableProducts: number;
  totalLeads: number;
  newLeads: number;
  buyLeads: number;
  sellLeads: number;
  amcLeads: number;
  aerbLeads: number;
  closedLeads: number;
};

type RecentLead = {
  id: string;
  name: string;
  phone: string;
  institution_name: string | null;
  requirement_type: string;
  status: string;
  created_at: string;
};

type RecentProduct = {
  id: string;
  title: string;
  brand: string;
  modality_type: string;
  condition: string;
  is_available: boolean;
  images: string[];
};

const TYPE_COLORS: Record<string, string> = {
  'Buy': 'bg-green-100 text-[#1a6b3c]',
  'Sell/Buyback': 'bg-amber-100 text-amber-700',
  'Service/AMC': 'bg-teal-100 text-teal-700',
  'AERB': 'bg-slate-100 text-slate-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    async function load() {
      const [total, avail, leads, newL, buy, sell, amc, aerb, closed, recentL, recentP] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_available', true),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('requirement_type', 'Buy'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('requirement_type', 'Sell/Buyback'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('requirement_type', 'Service/AMC'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('requirement_type', 'AERB'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Closed'),
        supabase.from('leads').select('id,name,phone,institution_name,requirement_type,status,created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('products').select('id,title,brand,modality_type,condition,is_available,images').order('created_at', { ascending: false }).limit(4),
      ]);
      setStats({
        totalProducts: total.count || 0,
        availableProducts: avail.count || 0,
        totalLeads: leads.count || 0,
        newLeads: newL.count || 0,
        buyLeads: buy.count || 0,
        sellLeads: sell.count || 0,
        amcLeads: amc.count || 0,
        aerbLeads: aerb.count || 0,
        closedLeads: closed.count || 0,
      });
      setRecentLeads((recentL.data as RecentLead[]) || []);
      setRecentProducts((recentP.data as RecentProduct[]) || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back — here's what's happening today.</p>
        </div>
        <Link href="/admin/inventory/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" />Add Product
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Inventory', value: stats?.totalProducts ?? '—', sub: `${stats?.availableProducts ?? '—'} listed`, icon: Package, bg: 'bg-green-50', ic: 'text-[#1a6b3c]' },
          { label: 'Total Leads', value: stats?.totalLeads ?? '—', sub: `${stats?.newLeads ?? '—'} new`, icon: TrendingUp, bg: 'bg-sky-50', ic: 'text-sky-600' },
          { label: 'Pending Deals', value: stats?.newLeads ?? '—', sub: 'Need attention', icon: Clock, bg: 'bg-amber-50', ic: 'text-amber-600' },
          { label: 'Closed Deals', value: stats?.closedLeads ?? '—', sub: 'Successfully closed', icon: CheckCircle, bg: 'bg-teal-50', ic: 'text-teal-600' },
        ].map(({ label, value, sub, icon: Icon, bg, ic }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${ic}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Leads by category */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">Queries by Category</h3>
          <Link href="/admin/leads" className="text-xs text-[#1a6b3c] font-medium hover:underline flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Buy Inquiries', value: stats?.buyLeads ?? '—', icon: ShoppingCart, href: '/admin/leads', color: 'text-[#1a6b3c]', bg: 'bg-green-50' },
            { label: 'Sell / Buyback', value: stats?.sellLeads ?? '—', icon: RefreshCw, href: '/admin/leads', color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'AMC Service', value: stats?.amcLeads ?? '—', icon: Wrench, href: '/admin/leads', color: 'text-teal-700', bg: 'bg-teal-50' },
            { label: 'AERB Compliance', value: stats?.aerbLeads ?? '—', icon: FileText, href: '/admin/leads', color: 'text-slate-600', bg: 'bg-slate-50' },
          ].map(({ label, value, icon: Icon, href, color, bg }) => (
            <Link key={label} href={href}
              className={`${bg} rounded-xl p-4 hover:shadow-sm transition-all group border border-transparent hover:border-slate-200`}>
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs font-medium text-slate-600 mt-0.5">{label}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Leads</h3>
            <Link href="/admin/leads" className="text-xs text-[#1a6b3c] hover:underline font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No leads yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentLeads.map(lead => (
                <div key={lead.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-500">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.institution_name || lead.phone}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded hidden sm:inline ${TYPE_COLORS[lead.requirement_type] || 'bg-slate-100 text-slate-700'}`}>
                    {lead.requirement_type}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[lead.status] || 'bg-slate-100 text-slate-700'}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Listings</h3>
            <Link href="/admin/inventory" className="text-xs text-[#1a6b3c] hover:underline font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No products yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentProducts.map(p => (
                <Link key={p.id} href={`/admin/inventory/${p.id}`}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors group">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-10 h-8 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-8 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#1a6b3c] transition-colors">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.brand}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-[#1a6b3c] bg-green-50 px-2 py-0.5 rounded hidden sm:inline">{p.modality_type}</span>
                    <span className={`w-2 h-2 rounded-full ${p.is_available ? 'bg-emerald-500' : 'bg-slate-300'}`} title={p.is_available ? 'Active' : 'Hidden'} />
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="px-5 py-3 border-t border-slate-100">
            <Link href="/admin/inventory/new"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-[#1a6b3c] hover:bg-green-50 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />Add New Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
