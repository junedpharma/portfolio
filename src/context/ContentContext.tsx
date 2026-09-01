'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '@/data/contentStore';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const FIRESTORE_COLLECTION = 'portfolio';
const FIRESTORE_DOC_ID = 'siteContent';

const EMPTY_SITE_CONTENT: SiteContent = {
  branchInfo: {
    managerName: '',
    managerTitle: '',
    phone: '',
    email: '',
    address: '',
    operatingHours: '',
    heroImage: ''
  },
  notices: [],
  schemes: [],
  salesTeam: []
};

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  isFirestoreSyncing: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

function sanitizeContentForFirestore(data: SiteContent): SiteContent {
  if (!data) return EMPTY_SITE_CONTENT;
  return {
    branchInfo: {
      managerName: data.branchInfo?.managerName || '',
      managerTitle: data.branchInfo?.managerTitle || '',
      phone: data.branchInfo?.phone || '',
      email: data.branchInfo?.email || '',
      address: data.branchInfo?.address || '',
      operatingHours: data.branchInfo?.operatingHours || '',
      heroImage: data.branchInfo?.heroImage || ''
    },
    notices: (data.notices || []).map((notice) => ({
      id: notice.id || `notice-${Date.now()}`,
      type: notice.type || 'general',
      badgeText: notice.badgeText || '',
      title: notice.title || '',
      description: notice.description || '',
      pdfUrl: notice.pdfUrl || '',
      pdfName: notice.pdfName || ''
    })),
    schemes: (data.schemes || []).map((scheme) => ({
      id: scheme.id || `scheme-${Date.now()}`,
      name: scheme.name || '',
      minPurchaseQty: scheme.minPurchaseQty || 0,
      awardedArticle: scheme.awardedArticle || '',
      articleImage: scheme.articleImage || ''
    })),
    salesTeam: (data.salesTeam || []).map((sales) => ({
      id: sales.id || `sales-${Date.now()}`,
      name: sales.name || '',
      role: sales.role || '',
      territory: sales.territory || '',
      phone: sales.phone || '',
      operatorNumber: sales.operatorNumber || ''
    }))
  };
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(EMPTY_SITE_CONTENT);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(true);

  useEffect(() => {
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    
    // Subscribe to Cloud Firestore real-time updates
    const unsubscribe = onSnapshot(
      contentDocRef,
      (docSnap) => {
        setIsFirestoreSyncing(false);
        if (docSnap.exists()) {
          setContent(sanitizeContentForFirestore(docSnap.data() as SiteContent));
        }
      },
      (error) => {
        console.warn('Firestore listener warning:', error);
        setIsFirestoreSyncing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    const sanitizedData = sanitizeContentForFirestore(newContent);
    setContent(sanitizedData);
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(contentDocRef, sanitizedData);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isFirestoreSyncing }}>
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
