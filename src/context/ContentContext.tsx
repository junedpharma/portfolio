'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, INITIAL_SITE_CONTENT } from '@/data/contentStore';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const FIRESTORE_COLLECTION = 'portfolio';
const FIRESTORE_DOC_ID = 'siteContent';

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isFirestoreSyncing: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(true);

  useEffect(() => {
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    
    // Subscribe to Cloud Firestore real-time updates
    const unsubscribe = onSnapshot(
      contentDocRef,
      (docSnap) => {
        setIsFirestoreSyncing(false);
        if (docSnap.exists()) {
          setContent(docSnap.data() as SiteContent);
        } else {
          setDoc(contentDocRef, INITIAL_SITE_CONTENT).catch((err) => {
            console.warn('Firestore initial document write error:', err);
          });
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
    setContent(newContent);
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(contentDocRef, newContent);
  };

  const resetToDefault = async () => {
    setContent(INITIAL_SITE_CONTENT);
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(contentDocRef, INITIAL_SITE_CONTENT);
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
