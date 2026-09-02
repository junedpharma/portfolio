'use client';

import React from 'react';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { heroImage, managerName, managerTitle } = content.branchInfo;

  return (
    <section id="hero" className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-6 sm:pt-4 sm:pb-8 text-center flex justify-center items-center">
      {/* Dynamic Responsive Hero Banner — Expands Full Width for High-Resolution Images */}
      <div className="relative w-full max-h-[85vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white flex justify-center items-center">
        <Image
          src={heroImage}
          alt={`${managerName} — ${managerTitle}`}
          width={1200}
          height={900}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="w-full h-auto max-h-[85vh] object-cover animate-slow-zoom block"
          priority
        />
      </div>
    </section>
  );
};
