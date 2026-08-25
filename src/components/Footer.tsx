import React, { useState } from 'react';
import { NavTab } from '../types';
import { X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAdminAuth } from '../context/AdminAuthContext';

interface FooterProps {
  onSelectTab?: (tab: NavTab) => void;
  onOpenPrivacy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);
  const { t } = useLanguage();
  const { isAuthenticated } = useAdminAuth();

  return (
    <>
      <footer
        id="main-footer"
        className="relative z-10 w-full border-t border-neutral-100 bg-[#fafafc] py-10 transition-colors"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-10 lg:px-12">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <button
              id="footer-logo-btn"
              onClick={() => onSelectTab && onSelectTab('home')}
              className="font-display text-2xl font-extrabold tracking-tight text-neutral-950 hover:opacity-80 transition cursor-pointer"
            >
              lovey
            </button>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium text-neutral-500">
            <span>{t.footer.rights}</span>
            <div className="hidden sm:block h-3 w-[1px] bg-neutral-200" />
            <div className="flex items-center space-x-4">
              <button
                id="footer-privacy-btn"
                onClick={() =>
                  setModalContent({
                    title: t.footer.privacy,
                    text: t.footer.privacyText,
                  })
                }
                className="text-neutral-500 hover:text-neutral-900 transition underline-offset-4 hover:underline cursor-pointer"
              >
                {t.footer.privacy}
              </button>
              <button
                id="footer-terms-btn"
                onClick={() =>
                  setModalContent({
                    title: t.footer.terms,
                    text: t.footer.termsText,
                  })
                }
                className="text-neutral-500 hover:text-neutral-900 transition underline-offset-4 hover:underline cursor-pointer"
              >
                {t.footer.terms}
              </button>
              {isAuthenticated && (
                <button
                  id="footer-admin-btn"
                  onClick={() => onSelectTab && onSelectTab('admin')}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold transition underline-offset-4 hover:underline cursor-pointer"
                >
                  <ShieldCheck size={12} />
                  <span>관리자 모드 (EDIT)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Sleek Lightbox Info Modal */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalContent(null)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200/80 z-10 break-keep"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-neutral-950">
                  {modalContent.title}
                </h3>
                <button
                  onClick={() => setModalContent(null)}
                  className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
                {modalContent.text}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalContent(null)}
                  className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer"
                >
                  {t.footer.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
