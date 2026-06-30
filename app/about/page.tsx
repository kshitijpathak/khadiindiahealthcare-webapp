import Link from 'next/link';
import { CheckCircle, Award, Users, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0a1a0f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px] bg-[#4ade80] rounded" />
              <span className="text-[#4ade80] font-semibold text-xs uppercase tracking-widest">About Us</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">India&apos;s Trusted Medical Equipment Partner</h1>
            <p className="text-slate-400 leading-relaxed">
              Headquartered in New Delhi, Khadi India Healthcare has been bridging the gap between world-class diagnostic imaging and the Indian healthcare ecosystem for over 15 years. We serve hospitals, diagnostic centres, and nursing homes across all 29 states of India.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Hospitals Served', icon: Users },
            { value: '15+', label: 'Years of Experience', icon: Award },
            { value: '29', label: 'States Covered', icon: MapPin },
            { value: '1200+', label: 'Installations Done', icon: CheckCircle },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#1a6b3c]/30 transition-colors">
              <div className="w-12 h-12 bg-[#f0faf4] rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#1a6b3c]/10">
                <Icon className="w-6 h-6 text-[#1a6b3c]" />
              </div>
              <div className="text-3xl font-bold text-[#1a6b3c] mb-1">{value}</div>
              <div className="text-sm text-slate-600">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px] bg-[#1a6b3c] rounded" />
              <span className="text-[#1a6b3c] font-semibold text-xs uppercase tracking-widest">Our Mission</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Making World-Class Imaging Accessible to Every Indian Hospital
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Based in New Delhi, we believe every patient in India deserves access to accurate diagnostics — regardless of location or hospital budget. Our refurbishment model makes this vision a reality by delivering OEM-quality systems at a fraction of the cost.
            </p>
            <ul className="space-y-3">
              {[
                'All equipment undergoes rigorous 200-point quality inspection',
                'OEM-trained engineers perform every refurbishment',
                'AERB compliance verified and documented before delivery',
                'Full warranty documentation and after-sales support',
                'Pan-India service network with 4-hour emergency SLA',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-[#1a6b3c] flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img src="https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg" alt="Our facility" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#0a1a0f] rounded-3xl p-10 text-center text-white">
          <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-3">Ready to work with us?</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">Browse our current inventory or get in touch with our New Delhi team to discuss your requirements.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/catalog" className="px-6 py-2.5 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold rounded-xl text-sm transition-colors">View Equipment</Link>
              <Link href="/contact" className="px-6 py-2.5 bg-white/8 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl text-sm transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
