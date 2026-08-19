import React, { useState } from 'react';
import { Project } from '../types';
import { Play, Film, Image as ImageIcon, Layers, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { WatermarkOverlay } from './WatermarkOverlay';

interface HomeWorksSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onPlayVideo: (project: Project) => void;
  onViewAllWorks: () => void;
}

export const HomeWorksSection: React.FC<HomeWorksSectionProps> = ({
  projects,
  onSelectProject,
  onPlayVideo,
  onViewAllWorks,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VIDEO' | 'PRODUCT'>('ALL');
  const { t, getProjectTranslation } = useLanguage();

  const filterTabs = [
    { key: 'ALL', label: t.homeWorks.tabAll },
    { key: 'VIDEO', label: t.homeWorks.tabVideo },
    { key: 'PRODUCT', label: t.homeWorks.tabProduct },
  ] as const;

  // Curate exactly 4 projects for each category filter tab on the homepage
  const getFilteredProjects = () => {
    if (activeFilter === 'ALL') {
      // 4 featured works (balanced 2 videos + 2 product pages)
      const videos = projects.filter((p) => p.categoryTag === 'VIDEO' || p.categoryTag === 'SHORTS');
      const products = projects.filter((p) => p.categoryTag === 'PRODUCT' || p.category === 'PRODUCT PAGE');
      return [...videos.slice(0, 2), ...products.slice(0, 2)];
    }
    if (activeFilter === 'VIDEO') {
      return projects.filter((p) => p.categoryTag === 'VIDEO' || p.categoryTag === 'SHORTS').slice(0, 4);
    }
    if (activeFilter === 'PRODUCT') {
      return projects.filter((p) => p.categoryTag === 'PRODUCT' || p.category === 'PRODUCT PAGE').slice(0, 4);
    }
    return projects.slice(0, 4);
  };

  const filteredProjects = getFilteredProjects();

  const isVideoFilter = activeFilter === 'VIDEO';
  const isProductFilter = activeFilter === 'PRODUCT';
  const emptyTitle = isVideoFilter
    ? t.worksPage.emptyState.videoEmptyTitle
    : isProductFilter
    ? t.worksPage.emptyState.productEmptyTitle
    : t.worksPage.emptyState.title;

  return (
    <section
      id="home-works-section"
      className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12"
    >
      {/* Header & Category Filters */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-neutral-100 pb-8">
        <div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950">
            {t.homeWorks.title1}
          </h2>
          <p className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-400 sm:text-neutral-400">
            {t.homeWorks.title2}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-6 sm:space-x-8 text-xs font-bold tracking-wider uppercase overflow-x-auto no-scrollbar pb-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                id={`home-filter-${tab.key.toLowerCase()}`}
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

      {/* 2-Column Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          id="home-works-empty-state"
          className="mt-10 sm:mt-12 rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-3xl mx-auto"
        >
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

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {activeFilter !== 'ALL' && (
              <button
                id="home-empty-reset-btn"
                onClick={() => setActiveFilter('ALL')}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-neutral-800 uppercase shadow-2xs hover:bg-neutral-50 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{t.worksPage.emptyState.allFilterBtn}</span>
              </button>
            )}

            <button
              id="home-empty-all-works-btn"
              onClick={onViewAllWorks}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <span>{t.homeWorks.viewAll}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-12 md:grid-cols-2">
          {filteredProjects.map((project, index) => {
            const isVideo = project.categoryTag === 'VIDEO' || project.categoryTag === 'SHORTS' || !!project.videoUrl;
            const pTrans = getProjectTranslation(project.id);
            const projectTitle = pTrans?.title || project.title;
            const projectDesc = pTrans?.description || project.description;

            return (
              <motion.div
                key={`${activeFilter}-${project.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
                id={`curated-project-card-${project.id}`}
                className="group cursor-pointer flex flex-col will-change-transform"
                onClick={() => onSelectProject(project)}
              >
                {/* Image Frame with rounded corners & subtle border */}
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xs transition-shadow duration-200 group-hover:shadow-md border border-neutral-200/60">
                  {/* Image */}
                  <img
                    src={project.image}
                    alt={projectTitle}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-103 will-change-transform"
                  />

                  {/* Category Pill on top left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="rounded-md bg-neutral-950/75 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Copyright Watermark Overlay */}
                  <WatermarkOverlay variant="card" text="lovey" />

                  {/* Subtle dark gradient overlay for visual depth */}
                  <div className="absolute inset-0 bg-neutral-950/15 group-hover:bg-neutral-950/25 transition-colors" />

                  {/* Circular Play Button for video projects */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        id={`play-btn-${project.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayVideo(project);
                        }}
                        className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-md backdrop-blur-xs transition-transform duration-300 group-hover:scale-110 hover:bg-white hover:text-blue-700 cursor-pointer"
                        aria-label={`Play video for ${projectTitle}`}
                      >
                        <Play size={18} className="fill-blue-600 ml-0.5 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Tag Row */}
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg md:text-xl font-bold tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors break-keep leading-snug">
                      {projectTitle}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-normal line-clamp-1 break-keep">
                      {projectDesc}
                    </p>
                  </div>

                  {/* Pill Tag */}
                  <span className="shrink-0 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
                    {project.categoryTag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Explore More link */}
      {filteredProjects.length > 0 && (
        <div className="mt-16 text-center">
          <button
            id="home-view-all-works-btn"
            onClick={onViewAllWorks}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-600 hover:text-blue-600 uppercase transition-colors cursor-pointer"
          >
            <span>{t.homeWorks.viewAll} ({projects.length})</span>
            <span className="text-blue-600 font-bold">→</span>
          </button>
        </div>
      )}
    </section>
  );
};
