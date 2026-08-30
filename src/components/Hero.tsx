'use client';

import React from 'react';
import Image from 'next/image';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-12 text-center">
      {/* 100% Natural Aspect Ratio Image Container */}
      <div className="relative inline-block w-full max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
        <Image
          src="/juned-patel.jpg"
          alt="Juned Patel — Branch Manager, ATC Pharma"
          width={900}
          height={1200}
          sizes="(max-width: 768px) 100vw, 800px"
          className="w-full h-auto block object-scale-down animate-slow-zoom"
          priority
        />
      </div>
    </section>
  );
};
