'use client';

import React from 'react';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { heroImage, managerName, managerTitle } = content.branchInfo;

  return (
    <section id="hero" className="relative w-full bg-slate-950 text-white min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden">
      {/* Hero Image Container */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[50vh] sm:min-h-[calc(100vh-10rem)] p-2 sm:p-0">
        <Image
          src={heroImage || "/juned-patel.jpg"}
          alt={`${managerName} — ${managerTitle}`}
          fill
          sizes="100vw"
          className="object-contain sm:object-cover object-center sm:object-center sm:animate-slow-zoom"
          priority
        />
        {/* Subtle Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Floating Info Overlay Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-xl text-left w-full sm:w-auto">
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
