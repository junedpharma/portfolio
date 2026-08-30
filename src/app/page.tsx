'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { NoticesSection } from '@/components/NoticesSection';
import { HotSchemes } from '@/components/HotSchemes';
import { SalesContacts } from '@/components/SalesContacts';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-[#059669] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <NoticesSection />
        <HotSchemes />
        <SalesContacts />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
