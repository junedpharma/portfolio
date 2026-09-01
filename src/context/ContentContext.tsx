'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, INITIAL_SITE_CONTENT } from '@/data/contentStore';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'atc_portfolio_site_content_v1';
const FIRESTORE_COLLECTION = 'portfolio';
const FIRESTORE_DOC_ID = 'siteContent';

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isFirestoreSyncing: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

/**
 * Strips heavy base64 Data URLs (images & PDFs) from content before caching in localStorage.
 * Ensures localStorage uses only ~5 KB of pure text JSON, preventing QuotaExceededError completely!
 */
function stripMediaFromContent(data: SiteContent): SiteContent {
  return {
    ...data,
    branchInfo: {
      ...data.branchInfo,
      heroImage: data.branchInfo.heroImage?.startsWith('data:') ? '' : data.branchInfo.heroImage
    },
    notices: data.notices.map((notice) => ({
      ...notice,
      pdfUrl: notice.pdfUrl?.startsWith('data:') ? '' : notice.pdfUrl
    })),
    schemes: data.schemes.map((scheme) => ({
      ...scheme,
      articleImage: scheme.articleImage?.startsWith('data:') ? '' : scheme.articleImage
    }))
  };
}

/**
 * Safely caches text-only site content to localStorage (~5 KB).
 * Omits base64 images/PDFs so localStorage never exceeds its quota.
 */
function safeSaveToLocalStorage(key: string, data: SiteContent) {
  try {
    const textOnlyContent = stripMediaFromContent(data);
    localStorage.setItem(key, JSON.stringify(textOnlyContent));
  } catch (e) {
    console.warn('localStorage write skipped:', e);
  }
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(false);

  useEffect(() => {
    // 1. Fast initial text load from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setContent(JSON.parse(saved));
      }
    } catch (_e) {
      // Ignore cache load errors
    }

    // 2. Subscribe to real-time Cloud Firestore updates (loads full images & PDFs)
    setIsFirestoreSyncing(true);
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    
    const unsubscribe = onSnapshot(
      contentDocRef,
      (docSnap) => {
        setIsFirestoreSyncing(false);
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as SiteContent;
          setContent(remoteData);
          safeSaveToLocalStorage(LOCAL_STORAGE_KEY, remoteData);
        } else {
          // Document doesn't exist in Firestore yet, seed with initial content
          setDoc(contentDocRef, INITIAL_SITE_CONTENT).catch((err) => {
            console.warn('Firestore initial document write skipped/failed:', err);
          });
        }
      },
      (error) => {
        console.warn('Firestore listener warning (using local store fallback):', error);
        setIsFirestoreSyncing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    setContent(newContent);
    
    // Save text-only version to localStorage
    safeSaveToLocalStorage(LOCAL_STORAGE_KEY, newContent);

    // Save full document (with images & PDFs) to Cloud Firestore
    try {
      const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(contentDocRef, newContent);
    } catch (error) {
      console.warn('Firestore setDoc failed/skipped:', error);
    }
  };

  const resetToDefault = async () => {
    setContent(INITIAL_SITE_CONTENT);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(contentDocRef, INITIAL_SITE_CONTENT);
    } catch (e) {
      console.error('Failed to reset site content:', e);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetToDefault, isFirestoreSyncing }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
