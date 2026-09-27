import React, { useState } from 'react';
import { Project, DetailSection } from '../types';
import { Smartphone, Monitor, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { WatermarkOverlay } from './WatermarkOverlay';

interface DetailDocViewerProps {
  project: Project;
}

export const DetailDocViewer: React.FC<DetailDocViewerProps> = ({ project }) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));
  const handleZoomReset = () => setZoomLevel(100);

  const sections: DetailSection[] = project.detailSections && project.detailSections.length > 0
    ? project.detailSections
    : [
        {
          badge: 'INTRO POINT 01',
          title: `${project.title} - Visual Story`,
          subtitle: 'Capturing customer attention in the first 3 seconds',
          image: project.image,
          text: project.description,
          points: project.highlights || [
            'Logical selling point structure for high conversion',
            'High-res retouching highlighting texture and quality',
            'Optimized typography for mobile e-commerce'
          ]
        }
      ];

  const labelMobileView = language === 'ko' ? '모바일 뷰 (390px)' : language === 'ja' ? 'モバイル表示 (390px)' : 'Mobile View (390px)';
  const labelWideView = language === 'ko' ? '와이드 뷰 (확장)' : language === 'ja' ? 'ワイド表示 (拡張)' : 'Wide View (Expanded)';
  const labelGuide = language === 'ko'
    ? '실제 스마트스토어/쿠팡/와디즈 규격으로 제작된 세로형 풀스크롤 상세페이지 전문입니다. 아래로 스크롤하여 전체 디자인을 확인하실 수 있습니다.'
    : language === 'ja'
    ? '実際のEC・クラウドファンディング規格で制作されたフルスクロール商品ページです。下へスクロールして全体デザインをご確認いただけます。'
    : 'Full-scroll product detail page built to marketplace standards. Scroll down to inspect the full design composition.';
  const labelQualityTitle = language === 'ko' ? '100% 품질 보증 & 엄격한 검수' : language === 'ja' ? '100% 品質保証＆厳格な検品' : '100% Quality Assurance & Inspection';
  const labelQualityDesc = language === 'ko'
    ? '엄격한 품질 검수를 거쳐 꼼꼼하게 포장하여 신속하게 발송해 드립니다.'
    : language === 'ja'
    ? '厳正な検品を経て丁寧に梱包し、安全にお届けいたします。'
    : 'Rigorous quality inspection followed by premium packaging and delivery.';
  const labelCompletedBadge = language === 'ko' ? '상세페이지 제작 완료' : language === 'ja' ? '商品ページ制作完了' : 'Product Page Verified';

  return (
    <div className="flex flex-col items-center w-full bg-neutral-900/90 rounded-2xl p-3 sm:p-6 border border-neutral-800 text-neutral-100">
      {/* Control Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-800 px-2">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-neutral-800/90 p-1 rounded-xl border border-neutral-700">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span>{labelMobileView}</span>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span>{labelWideView}</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-800/90 px-2 py-1 rounded-xl border border-neutral-700 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-2 font-mono text-[11px] text-neutral-300 font-bold w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
          </div>
          <button
            onClick={handleZoomReset}
            className="flex items-center gap-1 bg-neutral-800/90 px-2.5 py-1.5 rounded-xl border border-neutral-700 text-[11px] font-semibold text-neutral-300 hover:text-white transition cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">100%</span>
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="w-full text-center mb-4 text-xs text-neutral-400 flex items-center justify-center gap-1.5 px-2 break-keep">
        <Sparkles size={13} className="text-blue-400 shrink-0" />
        <span>{labelGuide}</span>
      </div>

      {/* Simulated Device Canvas */}
      <div className="w-full overflow-x-auto py-2 flex justify-center no-scrollbar">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out, width 0.3s ease',
          }}
          className={`overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-2xl border border-neutral-700/80 transition-all ${
            viewMode === 'mobile' ? 'w-full max-w-[420px]' : 'w-full max-w-[760px]'
          }`}
        >
          {/* Mock E-commerce Store Header */}
          <div className="bg-neutral-950 px-4 py-3 text-white flex items-center justify-between text-xs border-b border-neutral-800">
            <span className="font-display font-black tracking-tight text-white uppercase text-sm">
              {project.client || 'LOVEY STORE'}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span className="bg-blue-600/80 px-2 py-0.5 rounded text-white font-bold uppercase">
                OFFICIAL
              </span>
            </div>
          </div>

          {/* Full Long Detail Page Image if available */}
          {project.longDetailImage && (
            <div className="relative w-full border-b border-neutral-100 bg-neutral-900 flex justify-center group">
              <img
                src={project.longDetailImage}
                alt={`${project.title} 전체 상세페이지`}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain"
              />
              <WatermarkOverlay variant="detail" text="lovey" />
            </div>
          )}

          {/* Product Page Detail Sections Flow (if no long image or as structured breakdown) */}
          {(!project.longDetailImage || (project.detailSections && project.detailSections.length > 0)) &&
            sections.map((sec, idx) => (
            <div key={idx} className="border-b border-neutral-100">
              {/* Section Visual Hero */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 group">
                <img
                  src={sec.image}
                  alt={sec.title || `Section ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <WatermarkOverlay variant="card" text="lovey" />
              </div>

              {/* Section Narrative Copy & Highlights */}
              <div className="p-5 sm:p-7 space-y-4">
                {sec.badge && (
                  <span className="inline-block rounded bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider font-mono-tag">
                    {sec.badge}
                  </span>
                )}

                {sec.title && (
                  <h3 className="font-display text-lg sm:text-xl font-black text-neutral-950 leading-snug break-keep">
                    {sec.title}
                  </h3>
                )}

                {sec.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold text-blue-600 break-keep">
                    {sec.subtitle}
                  </p>
                )}

                {sec.text && (
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed break-keep">
                    {sec.text}
                  </p>
                )}

                {sec.points && sec.points.length > 0 && (
                  <div className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                    {sec.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-800">
                        <CheckCircle2 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                        <span className="break-keep font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specs Table if section contains specs */}
              {sec.specs && sec.specs.length > 0 && (
                <div className="px-5 sm:px-7 pb-6">
                  <div className="rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 text-xs">
                    {sec.specs.map((sp, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between p-2.5 sm:p-3 bg-white hover:bg-neutral-50/50">
                        <span className="font-semibold text-neutral-500">{sp.label}</span>
                        <span className="font-bold text-neutral-900 text-right">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Extra Gallery Cuts if available */}
          {project.gallery && project.gallery.length > 1 && (
            <div className="p-5 sm:p-7 bg-neutral-50/50 border-b border-neutral-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                LIFESTYLE GALLERY
              </span>
              <h4 className="font-display text-base font-bold text-neutral-950 mb-3">
                {language === 'ko' ? '실사용 연출 컷 & 디테일' : language === 'ja' ? '着用・使用イメージ＆ディテール' : 'Product Lifestyle & Detail Cuts'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.gallery.map((gImg, gIdx) => (
                  <div key={gIdx} className="rounded-xl overflow-hidden aspect-4/3 bg-neutral-100 border border-neutral-200/80">
                    <img
                      src={gImg}
                      alt={`Gallery detail ${gIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quality Assurance / Q&A Box */}
          <div className="p-6 bg-neutral-900 text-white text-center">
            <ShieldCheck size={28} className="mx-auto text-blue-400 mb-2" />
            <h4 className="font-display text-base font-bold">{labelQualityTitle}</h4>
            <p className="mt-1 text-xs text-neutral-400 break-keep">
              {labelQualityDesc}
            </p>
          </div>

          {/* Mobile Bottom Sticky Action CTA Simulation */}
          <div className="bg-white border-t border-neutral-200 p-4 flex items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10px] font-semibold text-neutral-400 block">
                {language === 'ko' ? '포트폴리오 레퍼런스' : language === 'ja' ? 'ポートフォリオ参考' : 'Portfolio Reference'}
              </span>
              <span className="text-xs font-bold text-neutral-900">{project.client || 'E-commerce Client'}</span>
            </div>
            <div className="flex items-center gap-2">
              {project.storeUrl && (
                <a
                  href={project.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-800 transition"
                >
                  <span>{language === 'ko' ? '판매처 보기' : language === 'ja' ? '販売ページへ' : 'Live Store'}</span>
                </a>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs">
                <ShoppingBag size={13} />
                {labelCompletedBadge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
