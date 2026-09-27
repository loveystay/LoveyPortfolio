import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS, Translations, ProjectTranslation } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  getProjectTranslation: (projectId: string) => ProjectTranslation | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lovey_preferred_lang') as Language;
    if (saved && (saved === 'ko' || saved === 'en' || saved === 'ja')) {
      return saved;
    }
    // Auto-detect browser language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('en')) return 'en';
    return 'ko';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lovey_preferred_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = TRANSLATIONS[language];

  const ID_MAP: Record<string, string> = {
    'tech-review-youtube': '1',
    'lifestyle-vlog-youtube': '2',
    'shorts-reels-package': '3',
    'minimalist-watch-store': '4',
    'living-kitchen-detail': '5',
    'info-education-youtube': '6',
    'wireless-audio-detail': '7',
    'cosmetic-brand-detail': '8',
  };

  const getProjectTranslation = (projectId: string): ProjectTranslation | undefined => {
    const mappedKey = ID_MAP[projectId] || projectId;
    return t.projects[mappedKey] || t.projects[projectId];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getProjectTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
