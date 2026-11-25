import React from 'react';
import { BakedAssets } from '../lib/artBaker';
import { COPY, LanguageCode } from '../data/weddingContent';
import { useViewportActivity } from '../hooks/useViewportHooks';

interface GrandReceptionCardProps {
  assets: BakedAssets;
  lang: LanguageCode;
}

const SPARKLES = [
  { top: '12%', left: '16%', size: 12, delay: '0s' },
  { top: '20%', right: '24%', size: 10, delay: '0.6s' },
  { top: '44%', left: '9%', size: 9, delay: '1.1s' },
  { top: '52%', right: '11%', size: 13, delay: '0.35s' },
  { bottom: '22%', left: '22%', size: 10, delay: '1.5s' },
  { bottom: '15%', right: '18%', size: 12, delay: '0.85s' },
];

export const GrandReceptionCard: React.FC<GrandReceptionCardProps> = ({ assets, lang }) => {
  const { ref, inView, hasRevealed } = useViewportActivity<HTMLElement>();

  return (
    <section
      ref={ref}
      id="reception"
      className={`relative z-10 w-full max-w-[460px] mx-auto px-5 py-16 sm:py-20 ${
        !inView ? 'anim-paused' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-[26px] velvet-surface border border-[#d6b676]/65 px-7 py-12 sm:px-9 sm:py-14 text-center reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      >
        {/* Double Champagne-Gold Inner Filigree Borders */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-[18px] border border-[#e8cfa0]/50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[18px] rounded-[14px] border border-[#c9a252]/28"
        />

        {/* Subtle Twinkling Champagne-Gold 4-Point Sparkles (paused when off-screen) */}
        {SPARKLES.map((sp, idx) => (
          <svg
            key={idx}
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute text-[#f5e1ae] animate-twinkle"
            style={{
              top: sp.top,
              left: sp.left,
              right: sp.right,
              bottom: sp.bottom,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              animationDelay: sp.delay,
            }}
            fill="currentColor"
          >
            <path d="M12 1 L14.4 9.6 L23 12 L14.4 14.4 L12 23 L9.6 14.4 L1 12 L9.6 9.6 Z" />
          </svg>
        ))}

        {/* Blooming 3D Rose Clusters in Two Opposite Corners */}
        <img
          src={assets.roseCornerTopRight}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none select-none absolute -top-5 -right-5 w-32 sm:w-36 opacity-90 transition-all duration-1000 ease-out ${
            hasRevealed ? 'scale-100 rotate-0' : 'scale-75 rotate-12 opacity-0'
          }`}
        />
        <img
          src={assets.roseCornerBottomLeft}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none select-none absolute -bottom-5 -left-5 w-32 sm:w-36 opacity-90 transition-all duration-1000 delay-150 ease-out ${
            hasRevealed ? 'scale-100 rotate-0' : 'scale-75 -rotate-12 opacity-0'
          }`}
        />

        {/* Card Copy in Warm Champagne Gold */}
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,6vw,2rem)] leading-tight text-[#f8e7bf] font-semibold tracking-[0.18em]">
            {COPY.receptionHeading[lang]}
          </h2>

          <div className="my-4 flex items-center gap-3">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-[#e8cfa0]/75" />
            <span className="w-2 h-2 rotate-45 border border-[#f4dfae]" />
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-[#e8cfa0]/75" />
          </div>

          <p className="max-w-[310px] text-[14px] sm:text-[15px] leading-[1.78] text-[#f7e9cf] font-normal tracking-[0.01em]">
            {COPY.receptionBody[lang]}
          </p>
        </div>
      </div>
    </section>
  );
};
