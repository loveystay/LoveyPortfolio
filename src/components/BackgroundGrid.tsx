import React from 'react';

interface BackgroundGridProps {
  watermarkText?: string;
  watermarkPosition?: 'hero' | 'contact' | 'none';
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  watermarkText,
  watermarkPosition = 'none',
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 4-column subtle architectural vertical lines */}
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-full grid-cols-4 border-x border-neutral-200/50">
          <div className="border-r border-neutral-200/50"></div>
          <div className="border-r border-neutral-200/50"></div>
          <div className="border-r border-neutral-200/50"></div>
          <div></div>
        </div>
      </div>

      {/* Decorative large typographic watermarks matching the screenshot */}
      {watermarkPosition === 'hero' && (
        <>
          <div
            id="watermark-visual"
            className="absolute -left-12 top-28 font-display text-[11rem] sm:text-[18rem] font-black tracking-tighter text-neutral-900/[0.02] uppercase leading-none select-none"
          >
            VISUAL
          </div>
          <div
            id="watermark-portfolio"
            className="absolute right-0 top-1/3 font-display text-[10rem] sm:text-[16rem] font-black tracking-tighter text-neutral-900/[0.02] uppercase leading-none select-none"
          >
            PORTFOLIO
          </div>
        </>
      )}

      {watermarkPosition === 'contact' && (
        <div
          id="watermark-connect"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-display text-[12rem] sm:text-[22rem] font-black tracking-tighter text-neutral-900/[0.025] uppercase leading-none select-none"
        >
          CONNECT
        </div>
      )}

      {watermarkText && (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/4 font-display text-[10rem] sm:text-[18rem] font-black tracking-tighter text-neutral-900/[0.02] uppercase leading-none select-none">
          {watermarkText}
        </div>
      )}
    </div>
  );
};
