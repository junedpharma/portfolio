'use client';

import React from 'react';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { heroImage, managerName, managerTitle } = content.branchInfo;

  return (
    <section id="hero" className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-12 text-center">
      {/* 100% Natural Aspect Ratio Image Container — No Black Bars */}
      <div className="relative inline-block w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
        <Image
          src={heroImage || "/juned-patel.jpg"}
          alt={`${managerName} — ${managerTitle}`}
          width={900}
          height={1200}
          sizes="(max-width: 768px) 100vw, 900px"
          className="w-full h-auto block object-cover animate-slow-zoom"
          priority
        />
      </div>
    </section>
  );
};
