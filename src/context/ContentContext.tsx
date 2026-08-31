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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(false);

  useEffect(() => {
    // 1. First, load fast initial cache from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setContent(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load site content from localStorage:', e);
    }

    // 2. Subscribe to real-time Cloud Firestore updates
    setIsFirestoreSyncing(true);
    const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    
    const unsubscribe = onSnapshot(
      contentDocRef,
      (docSnap) => {
        setIsFirestoreSyncing(false);
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as SiteContent;
          setContent(remoteData);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteData));
          } catch (err) {
            console.error('Failed to cache Firestore data in localStorage:', err);
          }
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
    
    // Save to localStorage immediately for instant feedback
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('Failed to save site content to localStorage:', e);
    }

    // Save to Cloud Firestore
    try {
      const contentDocRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(contentDocRef, newContent);
    } catch (error) {
      console.warn('Firestore setDoc failed/skipped (local cache updated):', error);
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
