import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'mobile' | 'footer';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; short: string }[] = [
    { code: 'ko', label: '한국어', short: 'KO' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ja', label: '日本語', short: 'JA' },
  ];

  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-between py-3 border-t border-neutral-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Globe size={14} className="text-neutral-400" />
          <span>LANGUAGE</span>
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-full">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                language === lang.code
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              {lang.short}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id="language-selector"
      className="inline-flex items-center gap-0.5 rounded-full border border-neutral-200/90 bg-neutral-100/70 p-0.5 backdrop-blur-xs shadow-2xs"
      aria-label="Language Selector"
    >
      <div className="pl-2 pr-1 text-neutral-400 hidden lg:block">
        <Globe size={13} />
      </div>
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            id={`lang-btn-${lang.code}`}
            type="button"
            onClick={() => setLanguage(lang.code)}
            title={lang.label}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white text-neutral-950 shadow-xs font-extrabold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            {lang.short}
          </button>
        );
      })}
    </div>
  );
};
