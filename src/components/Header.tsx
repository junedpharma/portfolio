'use client';

import React, { useState } from 'react';
import { Pill, Menu, X } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export const Header: React.FC = () => {
  const { content } = useContent();
  const { managerName, managerTitle } = content.branchInfo;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" onClick={closeMobileMenu} className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#059669] to-[#0d9488] flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5 sm:w-6 sm:h-6 rotate-45" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {managerName}
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-[#059669] tracking-wide">
              {managerTitle}
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 sm:gap-8">
          <a href="#hero" className="text-sm font-semibold text-slate-600 hover:text-[#059669] transition-colors">Home</a>
          <a href="#notices" className="text-sm font-semibold text-slate-600 hover:text-[#059669] transition-colors">Branch Notices</a>
          <a href="#schemes" className="text-sm font-semibold text-slate-600 hover:text-[#059669] transition-colors">Schemes & Articles</a>
          <a href="#contacts" className="text-sm font-semibold text-slate-600 hover:text-[#059669] transition-colors">Sales Contacts</a>
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#059669] transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
          <a
            href="#hero"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm hover:bg-emerald-50 hover:text-[#059669] transition-colors"
          >
            Home
          </a>
          <a
            href="#notices"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm hover:bg-emerald-50 hover:text-[#059669] transition-colors"
          >
            Branch Notices
          </a>
          <a
            href="#schemes"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm hover:bg-emerald-50 hover:text-[#059669] transition-colors"
          >
            Schemes & Articles
          </a>
          <a
            href="#contacts"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm hover:bg-emerald-50 hover:text-[#059669] transition-colors"
          >
            Sales Contacts
          </a>
        </nav>
      )}
    </header>
  );
};
