'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, Lead } from '@/lib/supabase';
import { LEAD_STATUSES, STATUS_COLORS } from '@/lib/constants';
import { Search, ChevronDown, ShoppingCart, RefreshCw, Wrench, FileText, Inbox } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  'Buy': 'bg-green-100 text-[#1a6b3c]',
  'Sell/Buyback': 'bg-amber-100 text-amber-700',
  'Service/AMC': 'bg-teal-100 text-teal-700',
  'AERB': 'bg-slate-100 text-slate-700',
};

const QUERY_TYPES = ['All', 'Buy', 'Sell/Buyback', 'Service/AMC', 'AERB'] as const;
type QueryType = (typeof QUERY_TYPES)[number];

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  'All':          { icon: Inbox,       label: 'All Queries',     color: 'text-slate-600',    bg: 'bg-slate-50' },
  'Buy':          { icon: ShoppingCart, label: 'Buy Inquiries',  color: 'text-[#1a6b3c]',   bg: 'bg-green-50' },
  'Sell/Buyback': { icon: RefreshCw,   label: 'Sell / Buyback',  color: 'text-amber-700',    bg: 'bg-amber-50' },
  'Service/AMC':  { icon: Wrench,      label: 'AMC Service',     color: 'text-teal-700',     bg: 'bg-teal-50' },
  'AERB':         { icon: FileText,    label: 'AERB Compliance', color: 'text-slate-700',    bg: 'bg-slate-50' },
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState<QueryType>('All');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = useCallback(async () => {
    let q = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (filterStatus) q = q.eq('status', filterStatus);
    if (search.trim()) q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%,institution_name.ilike.%${search}%`);
    const { data } = await q;
    setAllLeads(data || []);
    setLoading(false);
  }, [search, filterStatus]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    setLeads(activeTab === 'All' ? allLeads : allLeads.filter(l => l.requirement_type === activeTab));
    setSelected(null);
  }, [activeTab, allLeads]);

  const counts = QUERY_TYPES.reduce((acc, t) => {
    acc[t] = t === 'All' ? allLeads.length : allLeads.filter(l => l.requirement_type === t).length;
    return acc;
  }, {} as Record<QueryType, number>);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    setAllLeads(prev => prev.map(l => l.id === id ? { ...l, status: status as Lead['status'] } : l));
    if (selected?.id === id) setSelected(l => l ? { ...l, status: status as Lead['status'] } : l);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    await supabase.from('leads').update({ notes }).eq('id', selected.id);
    setAllLeads(prev => prev.map(l => l.id === selected.id ? { ...l, notes } : l));
    setSelected(l => l ? { ...l, notes } : l);
    setSavingNotes(false);
  };

  const openLead = (l: Lead) => { setSelected(l); setNotes(l.notes || ''); };

  return (
    <div className="space-y-5">
      {/* Category tab strip with counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {QUERY_TYPES.map(t => {
          const meta = TYPE_META[t];
          const Icon = meta.icon;
          const active = activeTab === t;
          return (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${active ? `${meta.bg} border-current ${meta.color} shadow-sm` : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? meta.bg : 'bg-slate-100'}`}>
                <Icon className={`w-4 h-4 ${active ? meta.color : 'text-slate-500'}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${active ? meta.color : 'text-slate-700'}`}>{meta.label}</p>
                <p className={`text-lg font-bold leading-tight ${active ? meta.color : 'text-slate-900'}`}>{counts[t]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] w-56" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white appearance-none">
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
        <p className="text-sm text-slate-500 ml-auto">
          {leads.length} {activeTab !== 'All' ? `${activeTab} ` : ''}lead{leads.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-5">
        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden flex-1 min-w-0 ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm animate-pulse">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">No {activeTab !== 'All' ? activeTab : ''} leads found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                    {activeTab === 'All' && <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Type</th>}
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map(l => (
                    <tr key={l.id} onClick={() => openLead(l)}
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${selected?.id === l.id ? 'bg-green-50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{l.name}</p>
                        <p className="text-xs text-slate-500">{l.institution_name || l.phone}</p>
                      </td>
                      {activeTab === 'All' && (
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${TYPE_COLORS[l.requirement_type] || 'bg-slate-100 text-slate-700'}`}>
                            {l.requirement_type}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-slate-600">
                        {[l.city, l.region_state].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <select value={l.status}
                          onChange={e => { e.stopPropagation(); updateStatus(l.id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          className={`text-xs font-semibold px-2 py-0.5 rounded border-0 focus:ring-1 focus:ring-[#1a6b3c] cursor-pointer ${STATUS_COLORS[l.status] || 'bg-slate-100 text-slate-700'}`}>
                          {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">
                        {new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 sticky top-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Lead Details</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block ${TYPE_COLORS[selected.requirement_type] || 'bg-slate-100 text-slate-700'}`}>
                    {selected.requirement_type}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-700 lg:hidden">Close</button>
              </div>
              <div className="space-y-3">
                {([
                  ['Name', selected.name],
                  ['Phone', selected.phone],
                  selected.email ? ['Email', selected.email] : null,
                  selected.institution_name ? ['Institution', selected.institution_name] : null,
                  selected.city ? ['City', selected.city] : null,
                  selected.region_state ? ['State', selected.region_state] : null,
                  ['Date', new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                ] as ([string, string] | null)[]).filter(Boolean).map(row => {
                  const [label, value] = row as [string, string];
                  return (
                    <div key={label} className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-slate-500 w-20 flex-shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm text-slate-900 flex-1 break-words">{value}</span>
                    </div>
                  );
                })}
              </div>
              {selected.message && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Message</p>
                  <p className="text-sm text-slate-700">{selected.message}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Status</p>
                <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] bg-white">
                  {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Internal Notes</p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] resize-none"
                  placeholder="Add follow-up notes, next steps..." />
                <button onClick={saveNotes} disabled={savingNotes}
                  className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold rounded-lg text-xs transition-colors">
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
