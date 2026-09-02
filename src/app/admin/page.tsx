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

  // Extract clean display file name from stored property or fallback URL
  const getDisplayFileName = (storedName?: string, fallbackUrl?: string) => {
    if (storedName && storedName.trim()) return storedName;
    if (!fallbackUrl) return '';
    try {
      const parts = fallbackUrl.split('/');
      const last = parts[parts.length - 1];
      const clean = last.includes('?') ? last.split('?')[0] : last;
      const decoded = decodeURIComponent(clean);
      return decoded.replace(/^\d+_/, '');
    } catch {
      return 'Uploaded_File';
    }
  };

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
        setFormData((prev) => ({
          ...prev,
          branchInfo: {
            ...prev.branchInfo,
            heroImage: fileUrl,
            heroImageName: file.name
          }
        }));
      } catch (err: unknown) {
        console.error('Hero image upload failed:', err);
        const uploadErr = err as { message?: string };
        alert(uploadErr.message || 'Hero image upload failed.');
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    }
  };

  const handleRemoveHeroImage = () => {
    const inputEl = document.getElementById('hero-image-input') as HTMLInputElement | null;
    if (inputEl) inputEl.value = '';
    setFormData((prev) => ({
      ...prev,
      branchInfo: {
        ...prev.branchInfo,
        heroImage: '',
        heroImageName: ''
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
        e.target.value = '';
      }
    }
  };

  const handleRemoveNoticePDF = (id: string) => {
    const inputEl = document.getElementById(`pdf-input-${id}`) as HTMLInputElement | null;
    if (inputEl) inputEl.value = '';
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
        setFormData((prev) => ({
          ...prev,
          schemes: prev.schemes.map((scheme) =>
            scheme.id === id ? { ...scheme, articleImage: fileUrl, articleImageName: file.name } : scheme
          )
        }));
      } catch (err: unknown) {
        console.error('Article image upload failed:', err);
        const uploadErr = err as { message?: string };
        alert(uploadErr.message || 'Article image upload failed.');
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    }
  };

  const handleRemoveArticleImage = (id: string) => {
    const inputEl = document.getElementById(`scheme-img-input-${id}`) as HTMLInputElement | null;
    if (inputEl) inputEl.value = '';
    setFormData((prev) => ({
      ...prev,
      schemes: prev.schemes.map((scheme) =>
        scheme.id === id ? { ...scheme, articleImage: '', articleImageName: '' } : scheme
      )
    }));
  };

  const handleAddScheme = () => {
    const newScheme: SchemeProduct = {
      id: `scheme-${Date.now()}`,
      name: 'New Product Formulation',
      minPurchaseQty: 10,
      awardedArticle: '1 Free Bonus Box',
      articleImage: '',
      articleImageName: ''
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

  // Sales Team Handlers
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
      name: 'New Representative',
      role: 'Sales Representative',
      territory: 'Silvassa Division',
      phone: '+91 98765 43210',
      operatorNumber: '+91 98765 43210'
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#059669] animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Loading Portal...</p>
      </div>
    );
  }

  // If user is not authenticated, render Login Modal
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Admin Control Portal</h1>
            <p className="text-xs text-slate-500 font-medium">Enter your credentials to manage branch content</p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3.5 rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#059669]" /> Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="pateljuned35@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#059669] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#059669]" /> Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#059669] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] hover:from-[#047857] hover:to-[#0f766e] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroFileName = getDisplayFileName(formData.branchInfo.heroImageName, formData.branchInfo.heroImage);

  const renderBranchSection = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
      <h2 className="text-base sm:text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#059669]" /> Branch & Manager Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Manager Name</label>
          <input
            type="text"
            value={formData.branchInfo.managerName}
            onChange={(e) => handleBranchChange('managerName', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-[#059669] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Manager Designation / Title</label>
          <input
            type="text"
            value={formData.branchInfo.managerTitle}
            onChange={(e) => handleBranchChange('managerTitle', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-[#059669] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Direct Helpline</label>
          <input
            type="text"
            value={formData.branchInfo.phone}
            onChange={(e) => handleBranchChange('phone', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-[#059669] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Official Email</label>
          <input
            type="email"
            value={formData.branchInfo.email}
            onChange={(e) => handleBranchChange('email', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-[#059669] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Warehouse Address</label>
          <input
            type="text"
            value={formData.branchInfo.address}
            onChange={(e) => handleBranchChange('address', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-[#059669] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch Operating Hours</label>
          <input
            type="text"
            value={formData.branchInfo.operatingHours}
            onChange={(e) => handleBranchChange('operatingHours', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:border-[#059669] focus:outline-none"
          />
        </div>

        {/* Hero Image File Picker & File Name Display */}
        <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#059669]" /> Profile Banner Image File
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              id="hero-image-input"
              type="file"
              accept="image/*"
              onChange={handleHeroImageUpload}
              className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            />
          </div>
          {heroFileName && (
            <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900 mt-2">
              <span className="truncate font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" /> {heroFileName}
              </span>
              <button
                type="button"
                onClick={handleRemoveHeroImage}
                className="text-rose-700 font-bold hover:underline ml-2 cursor-pointer text-[11px] shrink-0"
              >
                Remove Image
              </button>
            </div>
          )}
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
          type="button"
          onClick={handleAddNotice}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {formData.notices.map((notice, index) => {
          const displayPdfName = getDisplayFileName(notice.pdfName, notice.pdfUrl);
          return (
            <div key={notice.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-400">Notice #{index + 1}</span>
                <button
                  type="button"
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

              {/* Notice PDF File Upload & File Name Display */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-600" /> PDF Attachment File
                </label>
                <input
                  id={`pdf-input-${notice.id}`}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleNoticePDFUpload(notice.id, e)}
                  className="block w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer"
                />
                {displayPdfName && (
                  <div className="flex items-center justify-between text-xs bg-rose-50 border border-rose-200 p-2 rounded-lg text-rose-900 mt-2">
                    <span className="truncate font-bold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" /> {displayPdfName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNoticePDF(notice.id)}
                      className="text-rose-700 font-bold hover:underline ml-2 cursor-pointer text-[11px] shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
          type="button"
          onClick={handleAddScheme}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Scheme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {formData.schemes.map((scheme, index) => {
          const displayImageName = getDisplayFileName(scheme.articleImageName, scheme.articleImage);
          return (
            <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-400">Scheme #{index + 1}</span>
                <button
                  type="button"
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

              {/* Article Image File Picker & File Name Display */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#059669]" /> Article Image File
                </label>
                <input
                  id={`scheme-img-input-${scheme.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleArticleImageUpload(scheme.id, e)}
                  className="block w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
                {displayImageName && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-900 mt-2">
                    <span className="truncate font-bold flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {displayImageName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArticleImage(scheme.id)}
                      className="text-rose-700 font-bold hover:underline ml-2 cursor-pointer text-[11px] shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
          type="button"
          onClick={handleAddSales}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Representative
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {formData.salesTeam.map((sales, index) => (
          <div key={sales.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400">Representative #{index + 1}</span>
              <button
                type="button"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Role / Division</label>
              <input
                type="text"
                value={sales.role}
                onChange={(e) => handleSalesChange(sales.id, 'role', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Territory</label>
              <input
                type="text"
                value={sales.territory}
                onChange={(e) => handleSalesChange(sales.id, 'territory', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Mobile Phone</label>
              <input
                type="text"
                value={sales.phone}
                onChange={(e) => handleSalesChange(sales.id, 'phone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operator / Hotline Number</label>
              <input
                type="text"
                value={sales.operatorNumber}
                onChange={(e) => handleSalesChange(sales.id, 'operatorNumber', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">Content successfully saved & synced to live website!</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Site"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                ATC Pharma Admin Dashboard
              </h1>
              <p className="text-[11px] text-emerald-400 font-semibold hidden sm:block">
                Logged in as {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] hover:from-[#047857] hover:to-[#0f766e] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save & Sync Site
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('branch')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'branch'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#059669]" /> Branch & Manager Info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" /> Branch Notices ({formData.notices.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'schemes'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gift className="w-4 h-4 text-teal-500" /> Schemes & Articles ({formData.schemes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" /> Sales Representatives ({formData.salesTeam.length})
          </button>
        </div>

        {/* Tab Panel Content */}
        {activeTab === 'branch' && renderBranchSection()}
        {activeTab === 'notices' && renderNoticesSection()}
        {activeTab === 'schemes' && renderSchemesSection()}
        {activeTab === 'sales' && renderSalesSection()}
      </div>
    </div>
  );
}
