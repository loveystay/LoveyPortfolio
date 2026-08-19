import React from 'react';
import { SKILL_STACK } from '../data/projects';
import { ArrowRight, CheckCircle2, Clock, Target, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface AboutViewProps {
  onOpenContactModal: () => void;
  onExploreWorks: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onOpenContactModal,
  onExploreWorks,
}) => {
  const { t } = useLanguage();

  const principles = [
    {
      icon: <Zap size={22} className="text-blue-600" />,
      title: t.aboutPage.p1Title,
      description: t.aboutPage.p1Desc,
      tag: t.aboutPage.p1Tag,
    },
    {
      icon: <Target size={22} className="text-blue-600" />,
      title: t.aboutPage.p2Title,
      description: t.aboutPage.p2Desc,
      tag: t.aboutPage.p2Tag,
    },
    {
      icon: <Clock size={22} className="text-blue-600" />,
      title: t.aboutPage.p3Title,
      description: t.aboutPage.p3Desc,
      tag: t.aboutPage.p3Tag,
    },
    {
      icon: <ShieldCheck size={22} className="text-blue-600" />,
      title: t.aboutPage.p4Title,
      description: t.aboutPage.p4Desc,
      tag: t.aboutPage.p4Tag,
    },
  ];

  return (
    <div id="about-view" className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 sm:px-10 lg:px-12">
      {/* Editorial Intro */}
      <div className="border-b border-neutral-100 pb-10 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <span className="font-mono-tag text-xs font-bold tracking-widest text-blue-600 uppercase">
            {t.aboutPage.eyebrow}
          </span>
          <h1 className="mt-3 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 leading-[1.2] sm:leading-[1.25]">
            <span className="block">{t.aboutPage.mainHeadingPart1}</span>
            <span className="block mt-1 sm:mt-2 text-neutral-900">{t.aboutPage.mainHeadingPart2}</span>
          </h1>
          <div className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-neutral-600 font-normal leading-relaxed space-y-1.5 sm:space-y-2 break-keep">
            <p className="font-semibold text-neutral-900 whitespace-normal sm:whitespace-nowrap">{t.aboutPage.intro1}</p>
            <p className="whitespace-normal sm:whitespace-nowrap">{t.aboutPage.intro2}</p>
            <p className="whitespace-normal sm:whitespace-nowrap leading-relaxed">{t.aboutPage.intro3}</p>
          </div>
        </motion.div>
      </div>

      {/* Work Principles */}
      <div className="mt-12 sm:mt-16">
        <div className="max-w-2xl mb-6 sm:mb-8">
          <span className="font-mono-tag text-xs font-bold tracking-widest text-blue-600 uppercase">
            WORK PRINCIPLES
          </span>
          <h2 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 break-keep">
            {t.aboutPage.principlesTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 break-keep">
            {t.aboutPage.principlesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {principles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50 mb-3 sm:mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold text-neutral-950 break-keep">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed break-keep">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 sm:mt-5 pt-3 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50/60 px-2 py-0.5 rounded whitespace-nowrap">
                  {item.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills & Software Toolkit */}
      <div className="mt-12 sm:mt-16 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="max-w-2xl">
          <span className="font-mono-tag text-xs font-bold tracking-widest text-blue-600 uppercase">
            CAPABILITIES & TOOLS
          </span>
          <h2 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 break-keep">
            {t.aboutPage.toolsTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 break-keep">
            {t.aboutPage.toolsSubtitle}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-neutral-900 break-keep">
                {t.aboutPage.tool1Title}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed break-keep">
                {t.aboutPage.tool1Desc}
              </p>
            </div>
            <div className="mt-4 sm:mt-5 pt-4 border-t border-neutral-200/50 flex flex-wrap gap-1.5">
              {['Premiere Pro', 'Photoshop'].map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs border border-neutral-200/60 whitespace-nowrap"
                >
                  <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-neutral-900 break-keep">
                {t.aboutPage.tool2Title}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed break-keep">
                {t.aboutPage.tool2Desc}
              </p>
            </div>
            <div className="mt-4 sm:mt-5 pt-4 border-t border-neutral-200/50 flex flex-wrap gap-1.5">
              {['Premiere Pro', 'Photoshop'].map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs border border-neutral-200/60 whitespace-nowrap"
                >
                  <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-neutral-900 break-keep">
                {t.aboutPage.tool3Title}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed break-keep">
                {t.aboutPage.tool3Desc}
              </p>
            </div>
            <div className="mt-4 sm:mt-5 pt-4 border-t border-neutral-200/50 flex flex-wrap gap-1.5">
              {['Photoshop', 'Figma', 'Illustrator'].map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs border border-neutral-200/60 whitespace-nowrap"
                >
                  <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Policies & Guidelines */}
      <div className="mt-12 sm:mt-16 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="max-w-2xl">
          <span className="font-mono-tag text-xs font-bold tracking-widest text-blue-600 uppercase">
            POLICY & GUIDELINES
          </span>
          <h2 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 break-keep">
            {t.aboutPage.policyTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 break-keep">
            {t.aboutPage.policySubtitle}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 break-keep flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold">1</span>
              {t.aboutPage.policyDepositTitle}
            </h4>
            <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
              {t.aboutPage.policyDepositDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 break-keep flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold">2</span>
              {t.aboutPage.policyDurationTitle}
            </h4>
            <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
              {t.aboutPage.policyDurationDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 break-keep flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold">3</span>
              {t.aboutPage.policyPrepTitle}
            </h4>
            <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
              {t.aboutPage.policyPrepDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-5 sm:p-6">
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 break-keep flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold">4</span>
              {t.aboutPage.policyFeedbackTitle}
            </h4>
            <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
              {t.aboutPage.policyFeedbackDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Working Process */}
      <div className="mt-12 sm:mt-16 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="max-w-2xl">
          <span className="font-mono-tag text-xs font-bold tracking-widest text-blue-600 uppercase">
            {t.process.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 break-keep">
            {t.process.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 break-keep">
            {t.process.subtitle}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl bg-neutral-50/70 p-5 border border-neutral-200/70">
            <span className="font-mono-tag text-xs font-bold text-blue-600">STEP 01</span>
            <h4 className="mt-2 text-sm sm:text-base font-bold text-neutral-900 break-keep">{t.process.step1Title}</h4>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed break-keep">
              {t.process.step1Desc}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50/70 p-5 border border-neutral-200/70">
            <span className="font-mono-tag text-xs font-bold text-blue-600">STEP 02</span>
            <h4 className="mt-2 text-sm sm:text-base font-bold text-neutral-900 break-keep">{t.process.step2Title}</h4>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed break-keep">
              {t.process.step2Desc}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50/70 p-5 border border-neutral-200/70">
            <span className="font-mono-tag text-xs font-bold text-blue-600">STEP 03</span>
            <h4 className="mt-2 text-sm sm:text-base font-bold text-neutral-900 break-keep">{t.process.step3Title}</h4>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed break-keep">
              {t.process.step3Desc}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50/70 p-5 border border-neutral-200/70">
            <span className="font-mono-tag text-xs font-bold text-blue-600">STEP 04</span>
            <h4 className="mt-2 text-sm sm:text-base font-bold text-neutral-900 break-keep">{t.process.step4Title}</h4>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed break-keep">
              {t.process.step4Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Collaboration Message / CTA */}
      <div className="mt-12 sm:mt-16 rounded-3xl border border-blue-100 bg-blue-50/40 p-6 sm:p-10 lg:p-12 text-center">
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 break-keep">
          {t.aboutPage.bannerTitle}
        </h3>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed break-keep">
          {t.aboutPage.bannerDesc}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
          <button
            onClick={onOpenContactModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md hover:bg-blue-700 transition cursor-pointer active:scale-95"
          >
            <span>{t.aboutPage.bannerBtn}</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={onExploreWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-xs font-bold tracking-wider text-neutral-700 uppercase shadow-2xs hover:bg-neutral-50 transition cursor-pointer active:scale-95"
          >
            <span>{t.homeWorks.tabAll}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

