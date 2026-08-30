'use client';

import React from 'react';
import { PackageCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export const NoticesSection: React.FC = () => {
  return (
    <section id="notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-rose-700 flex items-center justify-center gap-3 drop-shadow-xs">
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 animate-pulse" />
          <span>IMPORTANT NOTICE</span>
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {/* Notice 1: Festival Holiday Notice */}
        <ScrollReveal>
          <div className="bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/40 border-2 border-amber-300 border-l-8 border-l-amber-500 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between space-y-5 h-full group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 fill-white text-amber-500" /> Holiday Closure
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-900 transition-colors">
                Branch Closure on Rakshabandhan
              </h3>

              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
                ATC Pharma branch office will remain closed on <strong className="text-amber-950 font-black underline underline-offset-2">Friday, 28th August 2026</strong> on account of the festival of <strong className="text-amber-950 font-black">Rakshabandhan</strong>. Regular branch billing and dispatch operations will resume on Saturday, 29th August 2026.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Notice 2: Stock Arrival Notice */}
        <ScrollReveal>
          <div className="bg-gradient-to-br from-teal-50 via-emerald-50/70 to-teal-100/40 border-2 border-teal-300 border-l-8 border-l-teal-600 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between space-y-5 h-full group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-teal-600 text-white shadow-xs flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-white" /> New Stock Arrival
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-teal-900 transition-colors flex items-center gap-2">
                <span>Fresh Antibiotic Stock</span>
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
              </h3>

              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
                Fresh 2026 manufacturing batches for <strong className="text-teal-950 font-black">ATC-CEF 200mg</strong> & <strong className="text-teal-950 font-black">ATC-CLAV 625mg</strong> have arrived at the branch warehouse. Complete technical compositions and scheme details are updated below.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
