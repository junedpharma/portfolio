'use client';

import React from 'react';
import { Phone, Mail, MapPin, UserCheck, MessageSquare } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export interface SalesRepresentative {
  id: string;
  name: string;
  role: string;
  territory: string;
  phone: string;
  email: string;
  avatarBg: string;
}

const SALES_TEAM: SalesRepresentative[] = [
  {
    id: "sales-1",
    name: "Ramesh Sharma",
    role: "Senior Area Sales Executive",
    territory: "Central Market & Station Road Beat",
    phone: "+91 98230 11223",
    email: "ramesh.sharma@atcpharma.com",
    avatarBg: "from-emerald-500 to-teal-600"
  },
  {
    id: "sales-2",
    name: "Aman Khan",
    role: "Territory Sales Representative",
    territory: "Hospital Zone & Civil Line Chemists",
    phone: "+91 98901 22334",
    email: "aman.khan@atcpharma.com",
    avatarBg: "from-teal-600 to-cyan-600"
  },
  {
    id: "sales-3",
    name: "Vikas Patel",
    role: "Field Representative & Institutional Sales",
    territory: "Suburban Wholesale Markets & Outer Beats",
    phone: "+91 97654 33445",
    email: "vikas.patel@atcpharma.com",
    avatarBg: "from-[#059669] to-[#047857]"
  }
];

export const SalesContacts: React.FC = () => {
  return (
    <section id="contacts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-900 tracking-tight">
          Sales Contact Representatives
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {SALES_TEAM.map((person) => (
          <ScrollReveal key={person.id}>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden h-full">
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${person.avatarBg} flex items-center justify-center text-white font-bold shadow-md`}>
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{person.name}</h3>
                    <p className="text-xs font-semibold text-[#047857]">{person.role}</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Territory / Beat</strong>
                      <span className="text-slate-600">{person.territory}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#059669] shrink-0" />
                    <a href={`tel:${person.phone}`} className="font-bold text-slate-900 hover:text-[#059669] transition-colors">
                      {person.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#059669] shrink-0" />
                    <a href={`mailto:${person.email}`} className="text-slate-600 hover:text-[#059669] transition-colors">
                      {person.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${person.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(person.name)},%20I%20am%20inquiring%20about%20ATC%20Pharma%20schemes.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-[#059669] text-[#047857] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Contact via WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
