'use client';

import React from 'react';
import { Phone, MapPin, UserCheck, MessageSquare, PhoneCall } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useContent } from '@/context/ContentContext';

export const SalesContacts: React.FC = () => {
  const { content } = useContent();
  const { salesTeam } = content;

  return (
    <section id="contacts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-900 tracking-tight">
          Sales Contact Representatives
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {salesTeam.map((person, index) => {
          const bgGradients = [
            "from-emerald-500 to-teal-600",
            "from-teal-600 to-cyan-600",
            "from-[#059669] to-[#047857]"
          ];
          const avatarBg = bgGradients[index % bgGradients.length];

          return (
            <ScrollReveal key={person.id}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden h-full">
                <div className="space-y-4">
                  {/* Header Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white font-bold shadow-md`}>
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

                    {person.operatorNumber && (
                      <div className="flex items-center gap-2.5">
                        <PhoneCall className="w-4 h-4 text-[#059669] shrink-0" />
                        <div>
                          <strong className="text-slate-900 inline-block mr-1">Operator:</strong>
                          <a href={`tel:${person.operatorNumber}`} className="text-slate-700 font-semibold hover:text-[#059669] transition-colors">
                            {person.operatorNumber}
                          </a>
                        </div>
                      </div>
                    )}
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
          );
        })}
      </div>
    </section>
  );
};
