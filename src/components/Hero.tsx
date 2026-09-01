'use client';

import React from 'react';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { heroImage, managerName, managerTitle } = content.branchInfo;

  return (
    <section id="hero" className="relative w-full bg-slate-950 text-white min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      {/* Hero Image Container */}
      <div className="relative w-full h-[calc(100vh-5rem)] flex items-center justify-center p-2 sm:p-0">
        <Image
          src={heroImage || "/juned-patel.jpg"}
          alt={`${managerName} — ${managerTitle}`}
          fill
          sizes="100vw"
          className="object-contain sm:object-cover object-center sm:animate-slow-zoom"
          priority
        />
      </div>
    </section>
  );
};
