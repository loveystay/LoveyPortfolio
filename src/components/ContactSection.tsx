import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  onOpenContactModal: () => void;
  onShowToast: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenContactModal,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const email = 'contact@staylovey.com';

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      }
      setCopied(true);
      onShowToast(t.contactSection.copied);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      onShowToast(t.contactSection.copied);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      id="contact-section"
      className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-28 sm:px-10 lg:px-12 text-center"
    >
      {/* Massive Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl will-change-transform px-2"
      >
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-neutral-950 leading-[1.15]">
          <span>{t.contactSection.headingPart1}</span>
          <span className="block font-serif-italic font-medium text-neutral-600 sm:text-neutral-500 my-1">
            {t.contactSection.headingHighlight}
          </span>
          <span>{t.contactSection.headingPart2}</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-neutral-600 font-normal max-w-xl mx-auto leading-relaxed px-2 text-center">
          <span className="block break-keep">{t.contactSection.subtitlePart1}</span>
          <span className="block mt-1 break-keep text-neutral-600 font-normal">{t.contactSection.subtitlePart2}</span>
        </p>

        {/* Tags */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {['#YOUTUBE EDITING', '#LONG FORM', '#SHORTS REELS', '#PRODUCT PAGE'].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white/60 px-3 sm:px-4 py-1.5 font-mono-tag text-[11px] sm:text-xs font-semibold tracking-wider text-neutral-700 uppercase backdrop-blur-xs whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Contact Email Box */}
        <div className="mt-10 sm:mt-12 mx-auto max-w-xl px-2">
          <div
            id="contact-email-card"
            className="group relative flex flex-col items-center justify-center rounded-3xl border border-neutral-200/90 bg-white/80 p-6 sm:p-8 shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-neutral-300 hover:shadow-md"
          >
            <span className="font-mono-tag text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              {t.contactSection.emailLabel}
            </span>

            <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3 max-w-full">
              <a
                href={`mailto:${email}`}
                id="contact-email-link"
                className="font-display text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-950 transition-colors hover:text-blue-600 truncate sm:overflow-visible"
              >
                {email}
              </a>

              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 cursor-pointer"
                title={t.contactSection.copyEmail}
                aria-label={t.contactSection.copyEmail}
              >
                {copied ? (
                  <Check size={15} className="text-green-600 font-bold" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>

            {/* Quick interactive action */}
            <div className="mt-6 pt-4 border-t border-neutral-100 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="contact-section-inquiry-btn"
                onClick={onOpenContactModal}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 hover:text-blue-700 uppercase cursor-pointer"
              >
                <Sparkles size={14} />
                <span>{t.contactSection.aiConsultBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
