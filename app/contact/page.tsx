import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import CallbackForm from '@/components/CallbackForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1a0f] border-b border-white/5 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-[2px] bg-[#4ade80] rounded" />
            <span className="text-[#4ade80] font-semibold text-xs uppercase tracking-widest">Get in Touch</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-slate-400">Our equipment specialists are based in New Delhi and ready to assist you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <CallbackForm requirementType="Buy" />
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-xl font-bold text-slate-900">Direct Contact</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              {[
                { icon: Phone, label: 'Phone', value: '+91 95554 14998', href: 'tel:+919555414998' },
                { icon: Mail, label: 'Email', value: 'info@khadiindiahealthcare.com', href: 'mailto:info@khadiindiahealthcare.com' },
                { icon: Globe, label: 'Website', value: 'www.khadiindiahealthcare.com', href: 'https://www.khadiindiahealthcare.com' },
                { icon: MapPin, label: 'Headquarters', value: 'New Delhi, India — Serving PAN India', href: null },
                { icon: Clock, label: 'Business Hours', value: 'Mon to Sat: 9 AM to 7 PM IST', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#f0faf4] rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1a6b3c]/10">
                    <Icon className="w-4 h-4 text-[#1a6b3c]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-slate-900 hover:text-[#1a6b3c] transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1a6b3c] text-white rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-base">Regional Offices</h3>
              <div className="space-y-2 text-sm text-green-100">
                {[
                  'New Delhi, NCR (Headquarters)',
                  'Mumbai, Maharashtra',
                  'Bangalore, Karnataka',
                  'Chennai, Tamil Nadu',
                  'Hyderabad, Telangana',
                  'Ahmedabad, Gujarat',
                  'Kolkata, West Bengal',
                ].map(loc => (
                  <div key={loc} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full flex-shrink-0" />
                    {loc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
