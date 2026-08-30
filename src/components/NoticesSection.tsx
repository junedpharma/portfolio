'use client';

import React from 'react';
import { PackageCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useContent } from '@/context/ContentContext';

export const NoticesSection: React.FC = () => {
  const { content } = useContent();
  const { notices } = content;

  return (
    <section id="notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-rose-700 flex items-center justify-center gap-3 drop-shadow-xs">
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 animate-pulse" />
          <span>IMPORTANT NOTICE</span>
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {notices.map((notice) => (
          <ScrollReveal key={notice.id}>
            <div
              className={`border-2 border-l-8 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 h-full group ${
                notice.type === 'holiday'
                  ? 'bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/40 border-amber-300 border-l-amber-500 hover:border-amber-400'
                  : 'bg-gradient-to-br from-teal-50 via-emerald-50/70 to-teal-100/40 border-teal-300 border-l-teal-600 hover:border-teal-400'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xs flex items-center gap-2 ${
                      notice.type === 'holiday' ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                  >
                    {notice.type === 'holiday' ? (
                      <AlertTriangle className="w-4 h-4 fill-white text-amber-500" />
                    ) : (
                      <PackageCheck className="w-4 h-4 text-white" />
                    )}
                    {notice.badgeText}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-slate-800 transition-colors flex items-center gap-2">
                  <span>{notice.title}</span>
                  {notice.type !== 'holiday' && <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />}
                </h3>

                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
                  {notice.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
