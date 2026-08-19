import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface WatermarkOverlayProps {
  variant?: 'card' | 'modal' | 'video' | 'detail';
  text?: string;
  subtext?: string;
  showCenterWatermark?: boolean;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  variant = 'card',
  text = 'lovey',
  subtext = 'CREATIVE STUDIO · ALL RIGHTS RESERVED',
  showCenterWatermark = true,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Subtle Semi-Transparent Diagonal Center Watermark (Anti-Theft) */}
      {showCenterWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-12 select-none opacity-[0.14] transition-opacity group-hover:opacity-[0.22] flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {text}
            </span>
            <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1">
              PROTECTED PORTFOLIO WORK
            </span>
          </div>
        </div>
      )}

      {/* 2. Sleek Corner Watermark Stamp */}
      {variant === 'card' && (
        <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-md bg-neutral-950/65 backdrop-blur-md px-2 py-0.5 border border-white/10 shadow-xs">
            <ShieldCheck size={10} className="text-emerald-400" />
            <span className="font-display text-[9px] font-bold tracking-wider text-white/90 uppercase">
              © {text}
            </span>
          </div>
        </div>
      )}

      {variant === 'modal' && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-950/75 backdrop-blur-md px-3 py-1 border border-white/15 shadow-md">
            <ShieldCheck size={12} className="text-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="font-display text-[10px] font-extrabold tracking-wider text-white uppercase leading-tight">
                © {text} STUDIO
              </span>
              <span className="text-[8px] font-mono text-neutral-300 font-medium tracking-tight">
                {subtext}
              </span>
            </div>
          </div>
        </div>
      )}

      {variant === 'video' && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-md bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 border border-white/15 shadow-sm">
            <Lock size={11} className="text-blue-400" />
            <span className="font-display text-[10px] font-bold tracking-wider text-white uppercase">
              © {text} · ORIGINAL WORK
            </span>
          </div>
        </div>
      )}

      {variant === 'detail' && (
        <div className="sticky top-2 right-2 z-20 flex justify-end p-2 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-md bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 border border-white/20 shadow-md">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span className="font-display text-[10px] font-bold tracking-wider text-white uppercase">
              © {text} · PORTFOLIO ASSET
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
