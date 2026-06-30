'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, ChevronRight, Shield, Award, Wrench, Headphones, TrendingDown, Clock3, BadgeCheck } from 'lucide-react';

const CATEGORIES = [
  { title: 'CT Scanners', modality: 'CT', desc: '16 to 640-slice systems', img: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', count: '24 units' },
  { title: 'MRI Systems', modality: 'MRI', desc: '1.5T and 3.0T wide-bore', img: 'https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg', count: '18 units' },
  { title: 'Cath Lab', modality: 'Cath Lab', desc: 'Single and biplane cardiac', img: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg', count: '12 units' },
  { title: 'Ultrasound', modality: 'USG', desc: 'Premium diagnostic platforms', img: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', count: '31 units' },
  { title: 'X-Ray Systems', modality: 'X-Ray', desc: 'DR, CR and portable units', img: 'https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg', count: '45 units' },
  { title: 'Spares & Parts', modality: 'Spares', desc: 'OEM-grade tubes and coils', img: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg', count: '100+ items' },
];

const BRANDS = ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Toshiba (Canon)', 'Mindray', 'Hitachi'];

const TESTIMONIALS = [
  { text: 'We sourced a 128-slice CT from Khadi India Healthcare. Running flawlessly for 2 years with excellent after-sales support.', author: 'Dr. Pradeep Mehta', role: 'Director, Sunshine Diagnostics, Pune', avatar: 'PM' },
  { text: 'The AMC process was seamless. Engineers respond within 4 hours and their team is fully trained on OEM systems.', author: 'Mr. Rajiv Bansal', role: 'Admin Head, Max Healthcare, Delhi', avatar: 'RB' },
  { text: 'Professional buyback service. Got a fair valuation for our old MRI system within 24 hours.', author: 'Dr. Meena Krishnan', role: 'MD, Meena Scan Centre, Chennai', avatar: 'MK' },
];

const WHY_US = [
  { icon: TrendingDown, title: '40-60% Cost Savings', desc: 'vs. new OEM equipment price. Same clinical performance, fraction of the cost.' },
  { icon: BadgeCheck, title: '200-Point QC Process', desc: 'Every system passes our rigorous quality checklist before it reaches you.' },
  { icon: Clock3, title: '72-Hour Installation', desc: 'From delivery to first scan in under 72 hours with our certified team.' },
  { icon: Headphones, title: '24/7 Pan-India Support', desc: 'Service engineers across 29 states with guaranteed 4-hour emergency response.' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/catalog?q=${encodeURIComponent(query.trim())}` : '/catalog');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a1a0f] overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a6b3c]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-[#1a6b3c]/30 border border-[#1a6b3c]/40 rounded-full px-3.5 py-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">New Delhi, India — Serving PAN India</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Certified Medical
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">
                Imaging Equipment
              </span>
              <br />
              <span className="text-slate-400 text-4xl sm:text-5xl lg:text-6xl font-normal">for Indian Hospitals</span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-2xl leading-relaxed">
              CT, MRI, Cath Lab, X-Ray and Ultrasound systems — refurbished to clinical standards at
              <strong className="text-white font-semibold"> 40-60% below OEM pricing</strong>.
              AERB compliant. Delivered and installed.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search by modality, brand, or model..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white/8 backdrop-blur border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-sm transition-all"
                />
              </div>
              <button type="submit" className="px-6 py-3.5 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2">
              {['64-Slice CT', '1.5T MRI', 'Cath Lab', 'DR X-Ray', 'Siemens', 'Philips', 'GE'].map(tag => (
                <button key={tag} onClick={() => router.push(`/catalog?q=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 text-xs text-slate-400 bg-white/6 hover:bg-white/12 border border-white/10 hover:border-white/20 rounded-full transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '500+', label: 'Hospitals Served', sub: 'Across 29 states' },
              { value: '1200+', label: 'Installations', sub: 'Successfully completed' },
              { value: '15+', label: 'Years Active', sub: 'In medical equipment' },
              { value: '4 hrs', label: 'SLA Response', sub: 'Emergency breakdown' },
            ].map(s => (
              <div key={s.value} className="bg-white/4 border border-white/8 rounded-2xl px-5 py-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm font-medium text-slate-300 mt-0.5">{s.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────── */}
      <section className="bg-[#f8faf9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Equipment from</p>
            {BRANDS.map(b => (
              <Link key={b} href={`/catalog?brand=${encodeURIComponent(b.split(' ')[0])}`}
                className="text-sm font-semibold text-slate-500 hover:text-[#1a6b3c] transition-colors">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-[2px] bg-[#1a6b3c] rounded" />
                <span className="text-[#1a6b3c] font-semibold text-xs uppercase tracking-widest">Browse Catalog</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Diagnostic Imaging Equipment</h2>
              <p className="text-slate-500 mt-2 text-sm">All systems AERB compliant and ready for installation</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#1a6b3c] hover:text-[#155730] transition-colors">
              View all inventory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured + Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Large featured card */}
            <Link href={`/catalog?modality=${encodeURIComponent(CATEGORIES[0].modality)}`}
              className="group lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-2xl min-h-[340px] lg:min-h-0">
              <img src={CATEGORIES[0].img} alt={CATEGORIES[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <span className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-widest">{CATEGORIES[0].count} available</span>
                <h3 className="text-2xl font-bold text-white mb-1">{CATEGORIES[0].title}</h3>
                <p className="text-sm text-slate-300 mb-4">{CATEGORIES[0].desc}</p>
                <div className="flex items-center gap-1.5 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Browse <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* 5 smaller cards */}
            {CATEGORIES.slice(1).map(cat => (
              <Link key={cat.modality} href={`/catalog?modality=${encodeURIComponent(cat.modality)}`}
                className="group relative overflow-hidden rounded-2xl min-h-[160px]">
                <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">{cat.count}</span>
                  <h3 className="text-base font-bold text-white">{cat.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f8faf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-[2px] bg-[#1a6b3c] rounded" />
                <span className="text-[#1a6b3c] font-semibold text-xs uppercase tracking-widest">Why Choose Us</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                The most trusted name in refurbished imaging
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Khadi India Healthcare has been serving Indian hospitals since 2009 — delivering clinical-grade refurbished imaging systems with full AERB compliance, OEM-level warranties, and pan-India after-sales support.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {WHY_US.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#1a6b3c]/30 hover:shadow-sm transition-all">
                    <div className="w-9 h-9 bg-[#f0faf4] rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-4.5 h-4.5 text-[#1a6b3c]" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img src="https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg" alt="Medical equipment facility" className="w-full h-full object-cover" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-[#1a6b3c]" />
                  <span className="text-sm font-bold text-slate-900">AERB Certified</span>
                </div>
                <p className="text-xs text-slate-500">Every unit verified before delivery</p>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_,i) => <div key={i} className="w-6 h-1.5 bg-[#1a6b3c] rounded-full" />)}
                </div>
              </div>
              {/* Top floating tag */}
              <div className="absolute top-6 -right-4 bg-[#1a6b3c] text-white rounded-xl px-4 py-2.5 shadow-lg">
                <div className="text-xl font-bold">40-60%</div>
                <div className="text-xs text-emerald-200">Cost savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-5 h-[2px] bg-[#1a6b3c] rounded" />
              <span className="text-[#1a6b3c] font-semibold text-xs uppercase tracking-widest">Our Services</span>
              <div className="w-5 h-[2px] bg-[#1a6b3c] rounded" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">End-to-End Healthcare Solutions</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">From procurement to compliance — we handle the entire lifecycle of your imaging equipment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '01', title: 'Buy Equipment', href: '/catalog',
                desc: 'Browse our certified inventory of CT, MRI, Cath Lab, X-Ray and Ultrasound systems. AERB compliant and ready for delivery.',
                cta: 'Browse Inventory', color: '#1a6b3c',
                features: ['40-60% below OEM price', 'AERB certified', '12-month warranty', 'Installation included'],
              },
              {
                num: '02', title: 'Sell or Buyback', href: '/sell',
                desc: 'Get the best market price for your used imaging equipment. Free valuation within 24 hours, transparent pricing.',
                cta: 'Get Valuation', color: '#0f5460',
                features: ['Free on-site valuation', 'Instant offer', 'We handle deinstallation', 'Immediate payment'],
              },
              {
                num: '03', title: 'AMC & AERB', href: '/services',
                desc: 'Annual Maintenance Contracts and end-to-end AERB license support for all major OEM brands across India.',
                cta: 'Learn More', color: '#2d5a1b',
                features: ['4-hr emergency SLA', 'OEM-grade spares', 'AERB documentation', 'Remote diagnostics'],
              },
            ].map(svc => (
              <div key={svc.num} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#1a6b3c]/30 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-5xl font-bold text-slate-100 select-none leading-none">{svc.num}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: svc.color}}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{svc.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{svc.desc}</p>
                <ul className="space-y-1.5 mb-6">
                  {svc.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor: svc.color}} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={svc.href} className="flex items-center gap-2 text-sm font-semibold transition-colors group-hover:gap-3" style={{color: svc.color}}>
                  {svc.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-20 bg-[#f8faf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-[2px] bg-[#1a6b3c] rounded" />
                <span className="text-[#1a6b3c] font-semibold text-xs uppercase tracking-widest">Testimonials</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Trusted by Hospital Leaders</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="w-9 h-9 bg-[#1a6b3c] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.author}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ────────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'AERB Compliant', sub: 'All systems pre-verified' },
              { icon: Award, label: 'ISO 9001 Certified', sub: 'Quality management system' },
              { icon: Wrench, label: '12-Month Warranty', sub: 'On all refurbished units' },
              { icon: Headphones, label: '24/7 Support', sub: 'Pan-India service network' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#f0faf4] rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1a6b3c]/10">
                  <Icon className="w-5 h-5 text-[#1a6b3c]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-[#0a1a0f] rounded-3xl px-8 md:px-14 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#1a6b3c]/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative text-white max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                Need guidance choosing the right system?
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our equipment specialists in Delhi will help you identify the right modality, brand, and configuration within your budget — with full installation and compliance support.
              </p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="/catalog" className="px-6 py-3 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold rounded-xl text-sm text-center transition-colors">
                Browse Inventory
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl text-sm text-center transition-colors">
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
