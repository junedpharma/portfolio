'use client';

import React from 'react';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { heroImage, managerName, managerTitle } = content.branchInfo;

  return (
    <section id="hero" className="relative w-full min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Full-bleed 100vw x 100vh Background Profile Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={heroImage || "/juned-patel.jpg"}
          alt={`${managerName} — ${managerTitle}`}
          fill
          sizes="100vw"
          className="object-cover object-top sm:object-center animate-slow-zoom"
          priority
        />
        {/* Subtle Dark Gradient Overlays for Elegance & Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute inset-0 bg-slate-950/10"></div>
      </div>

      {/* Floating Bottom Info Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto pb-8 sm:pb-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-xl text-left w-full sm:w-auto">
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {managerName}
          </h2>
          <p className="text-xs sm:text-sm font-extrabold text-[#059669] mt-1 tracking-wide">
            {managerTitle}
          </p>
        </div>
      </div>
    </section>
  );
};
