'use client';

import React from 'react';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { heroImage, managerName, managerTitle } = content.branchInfo;

  return (
    <section id="hero" className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-6 sm:pt-4 sm:pb-8 text-center flex justify-center items-center">
      {/* Desktop view limited to 100vw and max 80vh height so it fits within screen view */}
      <div className="relative inline-block w-full max-w-[100vw] max-h-[80vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white flex justify-center items-center">
        <Image
          src={heroImage}
          alt={`${managerName} — ${managerTitle}`}
          width={900}
          height={1200}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 900px"
          className="w-auto h-auto max-w-full max-h-[80vh] object-contain sm:object-cover animate-slow-zoom"
          priority
        />
      </div>
    </section>
  );
};
