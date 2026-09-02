'use client';

import React, { useState, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';
import { SiteContent, NoticeItem, SchemeProduct, SalesRep } from '@/data/contentStore';
import { uploadFileToFirebaseStorage } from '@/lib/storage';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { Save, Plus, Trash2, ArrowLeft, Building2, Bell, Gift, Users, CheckCircle2, FileText, Image as ImageIcon, Loader2, LogOut, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState<SiteContent>(content);
  const [activeTab, setActiveTab] = useState<'branch' | 'notices' | 'schemes' | 'sales'>('branch');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync content state when context content updates
  const [prevContent, setPrevContent] = useState(content);
  if (content !== prevContent) {
    setPrevContent(content);
    setFormData(content);
  }

  // Email / Password Auth Handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
    } catch (err: unknown) {
      console.error('Authentication Error:', err);
      const authErr = err as { code?: string; message?: string };
      if (authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/user-not-found' || authErr.code === 'auth/wrong-password') {
        setAuthError('Invalid email or password. Please check your credentials.');
      } else if (authErr.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Try logging in.');
      } else if (authErr.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters long.');
      } else {
        setAuthError(authErr.message || 'Failed to authenticate.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSave = async () => {
    await updateContent(formData);
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

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileUrl = await uploadFileToFirebaseStorage(file);
        handleBranchChange('heroImage', fileUrl);
      } catch (err) {
        console.error('Hero image upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }
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

  const handleNoticePDFUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileUrl = await uploadFileToFirebaseStorage(file);
        setFormData((prev) => ({
          ...prev,
          notices: prev.notices.map((notice) =>
            notice.id === id
              ? { ...notice, pdfUrl: fileUrl, pdfName: file.name }
              : notice
          )
        }));
      } catch (err: unknown) {
        console.error('PDF upload failed:', err);
        const uploadErr = err as { message?: string };
        alert(uploadErr.message || 'PDF upload failed. Please try a smaller PDF file.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveNoticePDF = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      notices: prev.notices.map((notice) =>
        notice.id === id ? { ...notice, pdfUrl: '', pdfName: '' } : notice
      )
    }));
  };

  const handleAddNotice = () => {
    const newNotice: NoticeItem = {
      id: `notice-${Date.now()}`,
      type: 'general',
      badgeText: 'Update Notice',
      title: 'New Branch Announcement',
      description: 'Enter announcement details here...',
      pdfUrl: '',
      pdfName: ''
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

  const handleArticleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileUrl = await uploadFileToFirebaseStorage(file);
        handleSchemeChange(id, 'articleImage', fileUrl);
      } catch (err) {
        console.error('Article image upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }
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
      name: '',
      role: '',
      territory: '',
      phone: '',
      operatorNumber: ''
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

  // Auth Loading View
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-[#059669] font-bold text-sm bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#059669]" /> Verifying Admin Authentication...
        </div>
      </div>
    );
  }

  // Unauthenticated Login View Matching Website Theme (White & Teal)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">

          {/* Brand & Title */}
          <div className="text-center space-y-2.5">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                JUNED PATEL
              </h1>
            </div>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs font-bold leading-relaxed">
              {authError}
            </div>
          )}

          {/* Simple Email & Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#059669]" /> Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-[#059669] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#059669]" /> Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-[#059669] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAuth ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website Home
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Render Functions for Reusable Content Sections
  const renderBranchSection = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 space-y-6 shadow-xs">
      <h2 className="text-lg sm:text-xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-emerald-600" /> Branch Manager & Profile Photo
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Manager Name</label>
          <input
            type="text"
            value={formData.branchInfo.managerName}
            onChange={(e) => handleBranchChange('managerName', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Manager Designation Title</label>
          <input
            type="text"
            value={formData.branchInfo.managerTitle}
            onChange={(e) => handleBranchChange('managerTitle', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Phone Number</label>
          <input
            type="text"
            value={formData.branchInfo.phone}
            onChange={(e) => handleBranchChange('phone', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Email Address</label>
          <input
            type="email"
            value={formData.branchInfo.email}
            onChange={(e) => handleBranchChange('email', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Warehouse Address</label>
          <input
            type="text"
            value={formData.branchInfo.address}
            onChange={(e) => handleBranchChange('address', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Operating Hours</label>
          <input
            type="text"
            value={formData.branchInfo.operatingHours}
            onChange={(e) => handleBranchChange('operatingHours', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Hero Image File Picker */}
        <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#059669]" /> Profile Image
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageUpload}
              className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoticesSection = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-row items-center justify-between bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-600" /> Branch Notices ({formData.notices.length})
        </h2>
        <button
          onClick={handleAddNotice}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {formData.notices.map((notice, index) => (
          <div key={notice.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400">Notice #{index + 1}</span>
              <button
                onClick={() => handleDeleteNotice(notice.id)}
                className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-extrabold"
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

            {/* Notice PDF File Upload */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" /> PDF Attachment
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleNoticePDFUpload(notice.id, e)}
                className="block w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer"
              />
              {notice.pdfName && (
                <div className="flex items-center justify-between text-xs bg-rose-50 border border-rose-200 p-2 rounded-lg text-rose-900 mt-2">
                  <span className="truncate font-bold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" /> {notice.pdfName}
                  </span>
                  <button
                    onClick={() => handleRemoveNoticePDF(notice.id)}
                    className="text-rose-700 font-bold hover:underline ml-2 cursor-pointer text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchemesSection = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-row items-center justify-between bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Gift className="w-5 h-5 text-teal-600" /> Schemes & Articles ({formData.schemes.length})
        </h2>
        <button
          onClick={handleAddScheme}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Scheme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {formData.schemes.map((scheme, index) => (
          <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400">Scheme #{index + 1}</span>
              <button
                onClick={() => handleDeleteScheme(scheme.id)}
                className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-black"
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

            {/* Article Image File Picker */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#059669]" /> Article Image File Picker
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleArticleImageUpload(scheme.id, e)}
                className="block w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSalesSection = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-row items-center justify-between bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#059669]" /> Sales Representatives ({formData.salesTeam.length})
        </h2>
        <button
          onClick={handleAddSales}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Representative
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {formData.salesTeam.map((sales, index) => (
          <div key={sales.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400">Sales Rep #{index + 1}</span>
              <button
                onClick={() => handleDeleteSales(sales.id)}
                className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Operator Number</label>
              <input
                type="text"
                value={sales.operatorNumber}
                onChange={(e) => handleSalesChange(sales.id, 'operatorNumber', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28">
      {/* Sticky Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0">
              <ArrowLeft className="w-4 h-4" /> Live Website
            </Link>
            <h1 className="text-base sm:text-lg font-black text-white tracking-wide truncate">
              ADMIN
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Logged In User Profile Badge */}
            <span className="hidden md:inline-block text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full truncate">
              {user.email || 'Authenticated Admin'}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-900/60 border border-rose-800 hover:bg-rose-800 text-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Log Out</span>
            </button>

            {/* Desktop Save Button */}
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="hidden sm:flex px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs sm:text-sm items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Floating Fixed Save Button Bar for Mobile View */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#059669] active:bg-[#047857] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl border border-emerald-400/30 backdrop-blur-md cursor-pointer disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 bg-[#059669] text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> All Content Changes Saved Successfully!
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">

        {/* Desktop Navigation Tabs (Visible on Desktop sm:flex) */}
        <div className="hidden sm:flex overflow-x-auto gap-2 border-b border-slate-300 pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('branch')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'branch'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
          >
            <Building2 className="w-4 h-4" /> Branch Info & Header
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'notices'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
          >
            <Bell className="w-4 h-4" /> Notices ({formData.notices.length})
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'schemes'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
          >
            <Gift className="w-4 h-4" /> Schemes & Articles ({formData.schemes.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'sales'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
          >
            <Users className="w-4 h-4" /> Sales Reps ({formData.salesTeam.length})
          </button>
        </div>

        {/* MOBILE VIEW: Render ALL Sections Vertically in a Single Page */}
        <div className="sm:hidden space-y-8">
          <section id="mobile-branch">{renderBranchSection()}</section>
          <section id="mobile-notices">{renderNoticesSection()}</section>
          <section id="mobile-schemes">{renderSchemesSection()}</section>
          <section id="mobile-sales">{renderSalesSection()}</section>
        </div>

        {/* DESKTOP VIEW: Render Only Selected Active Tab */}
        <div className="hidden sm:block">
          {activeTab === 'branch' && renderBranchSection()}
          {activeTab === 'notices' && renderNoticesSection()}
          {activeTab === 'schemes' && renderSchemesSection()}
          {activeTab === 'sales' && renderSalesSection()}
        </div>

      </div>
    </div>
  );
}
