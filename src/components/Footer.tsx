'use client';

import React from 'react';
import { Tablet, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export const Footer: React.FC = () => {
  const { content } = useContent();
  const { managerName, managerTitle, phone, email, address, operatingHours } = content.branchInfo;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Branding & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Profile Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#0d9488] flex items-center justify-center text-white font-bold shadow-md">
                <Tablet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-wide">{managerName}</h3>
                <p className="text-xs font-bold text-[#059669]">{managerTitle}</p>
              </div>
            </div>
          </div>

          {/* Contact Details Column 1: Phone & Email */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Branch Contact</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#059669] shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-bold transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#059669] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column 2: Branch Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Branch Warehouse Address</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Branch Hours</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <Clock className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">{operatingHours}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
