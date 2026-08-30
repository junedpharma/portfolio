'use client';

import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { SiteContent, NoticeItem, SchemeProduct, SalesRep } from '@/data/contentStore';
import { Save, Download, RotateCcw, Plus, Trash2, ArrowLeft, Building2, Bell, Gift, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { content, updateContent, resetToDefault, exportJSON } = useContent();
  const [formData, setFormData] = useState<SiteContent>(content);
  const [activeTab, setActiveTab] = useState<'branch' | 'notices' | 'schemes' | 'sales'>('branch');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sync state when content updates
  React.useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleSave = () => {
    updateContent(formData);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Branch Info Handlers
  const handleBranchChange = (field: keyof typeof formData.branchInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      branchInfo: {
        ...prev.branchInfo,
        [field]: value
      }
    }));
  };

  // Notice Handlers
  const handleNoticeChange = (id: string, field: keyof NoticeItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      notices: prev.notices.map((notice) =>
        notice.id === id ? { ...notice, [field]: value } : notice
      )
    }));
  };

  const handleAddNotice = () => {
    const newNotice: NoticeItem = {
      id: `notice-${Date.now()}`,
      type: 'general',
      badgeText: 'Update Notice',
      title: 'New Branch Announcement',
      description: 'Enter announcement details here...'
    };
    setFormData((prev) => ({
      ...prev,
      notices: [...prev.notices, newNotice]
    }));
  };

  const handleDeleteNotice = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      notices: prev.notices.filter((n) => n.id !== id)
    }));
  };

  // Scheme Handlers
  const handleSchemeChange = (id: string, field: keyof SchemeProduct, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      schemes: prev.schemes.map((scheme) =>
        scheme.id === id ? { ...scheme, [field]: value } : scheme
      )
    }));
  };

  const handleAddScheme = () => {
    const newScheme: SchemeProduct = {
      id: `scheme-${Date.now()}`,
      name: 'New Product Formulation',
      minPurchaseQty: 10,
      awardedArticle: '1 Free Bonus Box',
      articleImage: ''
    };
    setFormData((prev) => ({
      ...prev,
      schemes: [...prev.schemes, newScheme]
    }));
  };

  const handleDeleteScheme = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      schemes: prev.schemes.filter((s) => s.id !== id)
    }));
  };

  // Sales Rep Handlers
  const handleSalesChange = (id: string, field: keyof SalesRep, value: string) => {
    setFormData((prev) => ({
      ...prev,
      salesTeam: prev.salesTeam.map((sales) =>
        sales.id === id ? { ...sales, [field]: value } : sales
      )
    }));
  };

  const handleAddSales = () => {
    const newSales: SalesRep = {
      id: `sales-${Date.now()}`,
      name: 'New Executive Name',
      role: 'Territory Representative',
      territory: 'Assigned Beat Zone',
      phone: '+91 90000 00000',
      email: 'sales@atcpharma.com'
    };
    setFormData((prev) => ({
      ...prev,
      salesTeam: [...prev.salesTeam, newSales]
    }));
  };

  const handleDeleteSales = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      salesTeam: prev.salesTeam.filter((s) => s.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Live Website
            </Link>
            <h1 className="text-lg font-black text-white tracking-wide">
              ADMIN CONTENT MANAGER
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={exportJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download updated JSON file (Ready for Firestore later)"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button
              onClick={resetToDefault}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 border border-rose-800 hover:bg-rose-800 text-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-[#059669] text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 font-bold text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5" /> All Content Changes Saved Successfully!
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-300 pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('branch')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'branch'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Branch Info & Header
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" /> Notices & Announcements ({formData.notices.length})
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'schemes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Gift className="w-4 h-4" /> Schemes & Articles ({formData.schemes.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Sales Representatives ({formData.salesTeam.length})
          </button>
        </div>

        {/* Tab 1: Branch Info */}
        {activeTab === 'branch' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Branch Manager & Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Manager Name</label>
                <input
                  type="text"
                  value={formData.branchInfo.managerName}
                  onChange={(e) => handleBranchChange('managerName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Manager Designation Title</label>
                <input
                  type="text"
                  value={formData.branchInfo.managerTitle}
                  onChange={(e) => handleBranchChange('managerTitle', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Phone Number</label>
                <input
                  type="text"
                  value={formData.branchInfo.phone}
                  onChange={(e) => handleBranchChange('phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Email Address</label>
                <input
                  type="email"
                  value={formData.branchInfo.email}
                  onChange={(e) => handleBranchChange('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Warehouse Address</label>
                <input
                  type="text"
                  value={formData.branchInfo.address}
                  onChange={(e) => handleBranchChange('address', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Operating Hours</label>
                <input
                  type="text"
                  value={formData.branchInfo.operatingHours}
                  onChange={(e) => handleBranchChange('operatingHours', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Image Path / URL</label>
                <input
                  type="text"
                  value={formData.branchInfo.heroImage}
                  onChange={(e) => handleBranchChange('heroImage', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Notices */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Manage Branch Notices</h2>
              <button
                onClick={handleAddNotice}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Notice
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.notices.map((notice, index) => (
                <div key={notice.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-400">Notice #{index + 1}</span>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={notice.badgeText}
                      onChange={(e) => handleNoticeChange(notice.id, 'badgeText', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title</label>
                    <input
                      type="text"
                      value={notice.title}
                      onChange={(e) => handleNoticeChange(notice.id, 'title', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content / Description</label>
                    <textarea
                      rows={4}
                      value={notice.description}
                      onChange={(e) => handleNoticeChange(notice.id, 'description', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Schemes & Articles */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Manage Schemes & Articles</h2>
              <button
                onClick={handleAddScheme}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product Scheme
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.schemes.map((scheme, index) => (
                <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-400">Scheme #{index + 1}</span>
                    <button
                      onClick={() => handleDeleteScheme(scheme.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete Scheme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={scheme.name}
                      onChange={(e) => handleSchemeChange(scheme.id, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Awarded Article Description</label>
                    <input
                      type="text"
                      value={scheme.awardedArticle}
                      onChange={(e) => handleSchemeChange(scheme.id, 'awardedArticle', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Purchase Quantity</label>
                    <input
                      type="number"
                      value={scheme.minPurchaseQty}
                      onChange={(e) => handleSchemeChange(scheme.id, 'minPurchaseQty', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Article Image Path (Optional)</label>
                    <input
                      type="text"
                      value={scheme.articleImage || ''}
                      onChange={(e) => handleSchemeChange(scheme.id, 'articleImage', e.target.value)}
                      placeholder="/inhaler-jar.jpg"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Sales Team */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Manage Sales Representatives</h2>
              <button
                onClick={handleAddSales}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Representative
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.salesTeam.map((sales, index) => (
                <div key={sales.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-400">Sales Rep #{index + 1}</span>
                    <button
                      onClick={() => handleDeleteSales(sales.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete Representative"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={sales.name}
                      onChange={(e) => handleSalesChange(sales.id, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation Role</label>
                    <input
                      type="text"
                      value={sales.role}
                      onChange={(e) => handleSalesChange(sales.id, 'role', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Territory / Beat Area</label>
                    <input
                      type="text"
                      value={sales.territory}
                      onChange={(e) => handleSalesChange(sales.id, 'territory', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={sales.phone}
                      onChange={(e) => handleSalesChange(sales.id, 'phone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={sales.email}
                      onChange={(e) => handleSalesChange(sales.id, 'email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
