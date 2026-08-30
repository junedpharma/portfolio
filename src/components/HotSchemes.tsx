'use client';

import React from 'react';
import Image from 'next/image';
import { Gift, PackageCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useContent } from '@/context/ContentContext';

export const HotSchemes: React.FC = () => {
  const { content } = useContent();
  const { schemes } = content;

  return (
    <section id="schemes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-teal-700 tracking-tight">
          Schemes & Articles
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {schemes.map((product) => (
          <ScrollReveal key={product.id}>
            <div className="bg-gradient-to-br from-teal-50/80 via-white to-teal-50/30 border border-teal-200/90 rounded-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden border-t-4 border-t-teal-600 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all duration-300 h-full group">
              
              <div className="space-y-4">
                {/* Title */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
                  {product.name}
                </h3>

                {/* Article Image Container (If Available) */}
                {product.articleImage && (
                  <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-teal-200/80 bg-gradient-to-b from-teal-100/50 to-white flex items-center justify-center p-3 shadow-inner">
                    <Image
                      src={product.articleImage}
                      alt={product.awardedArticle}
                      width={400}
                      height={300}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Awarded Article Highlight Card in Teal */}
                <div className="bg-gradient-to-r from-teal-100/90 to-emerald-100/70 border border-teal-300/80 rounded-xl p-3.5 sm:p-4 space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-teal-600" /> Awarded Article
                  </span>
                  <p className="text-lg sm:text-xl font-black text-teal-950 leading-snug">
                    {product.awardedArticle}
                  </p>
                </div>
              </div>

              {/* Single Line Mobile Footer */}
              <div className="pt-4 mt-4 border-t border-teal-100/80 flex flex-row items-center justify-between gap-2">
                <span className="text-xs sm:text-base font-extrabold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
                  <PackageCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600 shrink-0" /> Min Purchase Order
                </span>
                <span className="text-xs sm:text-lg font-black text-teal-900 bg-teal-200/80 border border-teal-300 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl shadow-xs whitespace-nowrap shrink-0">
                  {product.minPurchaseQty} Units
                </span>
              </div>

            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
