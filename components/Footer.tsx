import Link from 'next/link';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0d1f14] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-[#1a6b3c] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08A7.2 7.2 0 0112 19.2z"/>
                  </svg>
                </div>
                <span className="font-bold text-white text-base">
                  Khadi India <span className="text-[#4ade80]">Healthcare</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">www.khadiindiahealthcare.com</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trusted dealer and refurbisher of diagnostic imaging equipment. Headquartered in Delhi, serving hospitals across all 29 states of India.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#4ade80] flex-shrink-0" /><a href="tel:+919555414998" className="hover:text-white transition-colors">+91 95554 14998</a></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#4ade80] flex-shrink-0" /><a href="mailto:info@khadiindiahealthcare.com" className="hover:text-white transition-colors">info@khadiindiahealthcare.com</a></div>
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#4ade80] flex-shrink-0 mt-0.5" /><span>New Delhi, India — Serving PAN India</span></div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#4ade80] flex-shrink-0" /><a href="https://www.khadiindiahealthcare.com" className="hover:text-white transition-colors">www.khadiindiahealthcare.com</a></div>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Equipment</h4>
            <ul className="space-y-2 text-sm">
              {[['CT Scanners','/catalog?modality=CT'],['MRI Systems','/catalog?modality=MRI'],['Cath Lab Systems','/catalog?modality=Cath+Lab'],['Ultrasound','/catalog?modality=USG'],['X-Ray Systems','/catalog?modality=X-Ray'],['Spares & Parts','/catalog?modality=Spares']].map(([l,h]) => (
                <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Services</h4>
            <ul className="space-y-2 text-sm">
              {[['Sell Your Equipment','/sell'],['AMC Services','/services'],['AERB Assistance','/services'],['Contact Us','/contact'],['About Us','/about']].map(([l,h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Track Record</h4>
            <div className="space-y-3">
              {[{label:'500+',sub:'Hospitals Served'},{label:'15+',sub:'Years Experience'},{label:'29',sub:'States Covered'},{label:'1200+',sub:'Installations Done'}].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="text-xl font-bold text-[#4ade80]">{s.label}</div>
                  <div className="text-sm text-slate-400">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>2024 Khadi India Healthcare. All rights reserved. | New Delhi, India</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
