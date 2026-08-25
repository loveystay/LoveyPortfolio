import React, { useState } from 'react';
import { Project } from '../types';
import { Play, ArrowRight, ArrowUpRight, Sparkles, Film, Image as ImageIcon, RotateCcw, MessageSquare, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { WatermarkOverlay } from './WatermarkOverlay';

interface SelectedWorksViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onPlayVideo: (project: Project) => void;
  onOpenContactModal: () => void;
}

export const SelectedWorksView: React.FC<SelectedWorksViewProps> = ({
  projects,
  onSelectProject,
  onPlayVideo,
  onOpenContactModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL PROJECTS');
  const { t, getProjectTranslation } = useLanguage();

  const filterTabs = [
    { key: 'ALL PROJECTS', label: t.worksPage.tabs.all },
    { key: 'YOUTUBE VIDEO', label: t.worksPage.tabs.youtube },
    { key: 'SHORTS', label: t.worksPage.tabs.shorts },
    { key: 'PRODUCT PAGE', label: t.worksPage.tabs.product },
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'ALL PROJECTS') return true;
    if (activeFilter === 'YOUTUBE VIDEO') return project.category === 'YOUTUBE VIDEO' || project.category === 'VIDEO EDITING';
    if (activeFilter === 'PRODUCT PAGE') return project.category === 'PRODUCT PAGE';
    if (activeFilter === 'SHORTS') return project.category === 'SHORTS / REELS';
    return true;
  });

  const isVideoFilter = activeFilter === 'YOUTUBE VIDEO' || activeFilter === 'SHORTS';
  const isProductFilter = activeFilter === 'PRODUCT PAGE';

  const emptyTitle = isVideoFilter
    ? t.worksPage.emptyState.videoEmptyTitle
    : isProductFilter
    ? t.worksPage.emptyState.productEmptyTitle
    : t.worksPage.emptyState.title;

  return (
    <div id="selected-works-view" className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 sm:px-10 lg:px-12">
      {/* Page Title & Subtitle */}
      <div className="border-b border-neutral-100 pb-8 sm:pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950"
        >
          {t.worksPage.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-sm sm:text-base md:text-lg text-neutral-600 font-normal break-keep"
        >
          {t.worksPage.subtitle}
        </motion.p>

        {/* Filter Navigation Tabs */}
        <div className="mt-6 sm:mt-8 flex items-center space-x-6 sm:space-x-8 text-xs font-bold tracking-wider uppercase overflow-x-auto no-scrollbar pb-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                id={`works-filter-${tab.key.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveFilter(tab.key)}
                className={`relative pb-2 transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          id="works-empty-state"
          className="mt-10 sm:mt-14 rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-3xl mx-auto"
        >
          {/* Icon Badge */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200/80 text-neutral-600 shadow-2xs mb-5">
            {isVideoFilter ? (
              <Film size={28} className="text-blue-600" />
            ) : isProductFilter ? (
              <ImageIcon size={28} className="text-blue-600" />
            ) : (
              <Layers size={28} className="text-neutral-600" />
            )}
          </div>

          <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold tracking-wider text-neutral-600 uppercase mb-3 border border-neutral-200/60">
            {activeFilter}
          </span>

          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 break-keep">
            {emptyTitle}
          </h3>

          <p className="mt-2.5 max-w-lg text-sm sm:text-base text-neutral-600 font-normal leading-relaxed break-keep whitespace-pre-line">
            {t.worksPage.emptyState.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {activeFilter !== 'ALL PROJECTS' && (
              <button
                id="empty-reset-filter-btn"
                onClick={() => setActiveFilter('ALL PROJECTS')}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-neutral-800 uppercase shadow-2xs hover:bg-neutral-50 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{t.worksPage.emptyState.allFilterBtn}</span>
              </button>
            )}

            <button
              id="empty-contact-btn"
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>{t.worksPage.emptyState.contactBtn}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {filteredProjects.map((project, index) => {
            const pTrans = getProjectTranslation(project.id);
            const projectTitle = pTrans?.title || project.title;
            const projectDesc = pTrans?.description || project.description;
            const projectClient = pTrans?.client || project.client || 'Portfolio Work';
            const projectDuration = pTrans?.duration || project.duration;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.25), ease: [0.16, 1, 0.3, 1] }}
                id={`work-card-${project.id}`}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs transition-shadow duration-200 hover:border-neutral-300 hover:shadow-md flex flex-col justify-between will-change-transform"
              >
                {/* Media container */}
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-neutral-950">
                    <img
                      src={project.image}
                      alt={projectTitle}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-103 will-change-transform"
                    />

                    {/* Category Pill on image */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded-md bg-neutral-950/70 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                        {project.category}
                      </span>
                    </div>

                    {/* Copyright Watermark Overlay */}
                    <WatermarkOverlay variant="card" text="lovey" />

                    {/* Video Play Overlay */}
                    {(project.categoryTag === 'VIDEO' || project.categoryTag === 'SHORTS' || project.videoUrl) && (
                      <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/35 transition-colors flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayVideo(project);
                          }}
                          className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-md backdrop-blur-xs transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                          aria-label="Play video"
                        >
                          <Play size={18} className="fill-blue-600 ml-0.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Text Information block */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400">
                      <span className="truncate max-w-[170px]">{projectClient}</span>
                      <span className="shrink-0">{project.year}</span>
                    </div>

                    <h3 className="mt-1.5 font-display text-base sm:text-lg font-bold tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors line-clamp-1 break-keep leading-snug">
                      {projectTitle}
                    </h3>

                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed break-keep">
                      {projectDesc}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{t.homeWorks.viewCaseStudy}</span>
                    <ArrowUpRight size={13} />
                  </span>
                  {projectDuration && (
                    <span className="text-[11px] text-neutral-400 font-medium truncate max-w-[150px]">
                      {projectDuration}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA Button */}
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <button
          id="works-explore-more-btn"
          onClick={onOpenContactModal}
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 px-8 py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <Sparkles size={15} />
          <span>{t.contactSection.aiConsultBtn}</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
};
