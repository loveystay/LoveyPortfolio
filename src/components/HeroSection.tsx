import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onExploreWorks: () => void;
  onGetInTouch?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWorks,
}) => {
  const { t } = useLanguage();

  return (
    <section
      id="hero-section"
      className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center px-6 pt-16 pb-20 text-center sm:px-10 lg:px-12"
    >
      {/* Badge: OPEN FOR PROJECTS */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        id="hero-status-badge"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-xs mb-8"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
        </span>
        <span className="font-mono-tag text-[11px] font-semibold tracking-wider text-neutral-800 uppercase">
          {t.hero.status}
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-5xl px-2"
      >
        <h1 className="flex flex-col items-center justify-center font-display tracking-tight text-neutral-950">
          <span className="text-4xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-none text-neutral-950">
            {t.hero.title1}
          </span>
          <span className="font-serif-italic font-medium tracking-normal text-neutral-500 sm:text-neutral-500 text-3xl sm:text-6xl md:text-7xl lg:text-[6.2rem] mt-1 sm:mt-2 whitespace-nowrap leading-tight">
            {t.hero.title2}
          </span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        id="hero-subtitle"
        className="mt-6 sm:mt-8 max-w-full sm:max-w-2xl text-[12.5px] xs:text-[14px] sm:text-lg md:text-xl font-normal text-neutral-700 leading-relaxed px-1 sm:px-4 text-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal break-keep tracking-tight"
      >
        {t.hero.subtitle}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 sm:mt-10 flex items-center justify-center w-full sm:w-auto"
      >
        <button
          id="hero-explore-works-btn"
          onClick={onExploreWorks}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-9 py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <span>{t.hero.exploreBtn}</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </motion.div>
    </section>
  );
};
