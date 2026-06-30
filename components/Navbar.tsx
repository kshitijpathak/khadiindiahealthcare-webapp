'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Lock, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  {
    label: 'Equipment',
    href: '/catalog',
    children: [
      { label: 'CT Scanners', href: '/catalog?modality=CT' },
      { label: 'MRI Systems', href: '/catalog?modality=MRI' },
      { label: 'Cath Lab', href: '/catalog?modality=Cath+Lab' },
      { label: 'Ultrasound', href: '/catalog?modality=USG' },
      { label: 'X-Ray Systems', href: '/catalog?modality=X-Ray' },
      { label: 'Spares & Parts', href: '/catalog?modality=Spares' },
    ],
  },
  { label: 'Sell Equipment', href: '/sell' },
  { label: 'AMC / AERB', href: '/services' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded bg-[#1a6b3c] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08A7.2 7.2 0 0112 19.2z"/>
                </svg>
              </div>
              <div className="w-px h-6 bg-slate-200" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight leading-none">
                Khadi India <span className="text-[#1a6b3c]">Healthcare</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1a6b3c] rounded-md hover:bg-green-50 transition-colors">
                    {link.label}<ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                      {link.children.map((c) => (
                        <Link key={c.href} href={c.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-[#1a6b3c] transition-colors">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1a6b3c] rounded-md hover:bg-green-50 transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/catalog" className="px-4 py-2 text-sm font-semibold text-white bg-[#1a6b3c] hover:bg-[#155730] rounded-lg transition-colors">
              View Inventory
            </Link>
            {isAdmin ? (
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a6b3c] border border-[#1a6b3c]/30 hover:bg-green-50 rounded-lg transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" />Dashboard
              </Link>
            ) : (
              <Link href="/admin/login" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 rounded-lg transition-colors">
                <Lock className="w-3 h-3" />Admin
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-700 rounded-md" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <div key={link.label}>
              <Link href={link.href} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1a6b3c] hover:bg-green-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
              {link.children?.map((c) => (
                <Link key={c.href} href={c.href} className="block px-6 py-1.5 text-sm text-slate-600 hover:text-[#1a6b3c] hover:bg-green-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  {c.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <Link href={isAdmin ? '/admin' : '/admin/login'} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-[#1a6b3c]">
              {isAdmin ? <LayoutDashboard className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
