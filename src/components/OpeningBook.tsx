import React, { useEffect, useState } from 'react';
import { BakedAssets } from '../lib/artBaker';
import { COPY, LanguageCode } from '../data/weddingContent';

interface OpeningBookProps {
  assets: BakedAssets | null;
  progress: number;
  ready: boolean;
  lang: LanguageCode;
  onOpenStart: () => void;
  onOpenComplete: () => void;
}

export const OpeningBook: React.FC<OpeningBookProps> = ({
  assets,
  progress,
  ready,
  lang,
  onOpenStart,
  onOpenComplete,
}) => {
  const [openingPhase, setOpeningPhase] = useState<'idle' | 'swing' | 'zoom'>('idle');
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Gentle pointer / touch tilt parallax for the front & back 3D roses
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x: nx, y: ny });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  const handleTapBook = () => {
    if (!ready || openingPhase !== 'idle') return;
    onOpenStart();
    setOpeningPhase('swing');
    window.setTimeout(() => {
      setOpeningPhase('zoom');
    }, 680);
    window.setTimeout(() => {
      onOpenComplete();
    }, 1520);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fbf4ee] via-[#f5e3df] to-[#efd7d3] paper-grain transition-opacity duration-700 ${
        openingPhase === 'zoom' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ height: '100dvh' }}
      aria-label="Wedding invitation cover"
    >
      {/* Back-layer softly pre-blurred 3D roses (parallax slower) */}
      {assets && (
        <>
          <img
            src={assets.roseBlurredBack}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -top-10 -left-10 w-48 sm:w-64 opacity-75 transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallax.x * -10}px, ${parallax.y * -10}px, 0) rotate(-14deg)`,
            }}
          />
          <img
            src={assets.roseBlurredBack}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -bottom-12 -right-8 w-52 sm:w-72 opacity-75 transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallax.x * 12}px, ${parallax.y * 10}px, 0) rotate(24deg)`,
            }}
          />
          <img
            src={assets.roseBlush}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute top-[14%] right-[-36px] sm:right-[10%] w-36 sm:w-44 opacity-80 animate-rose-sway"
          />
          <img
            src={assets.roseWine}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute bottom-[16%] left-[-34px] sm:left-[12%] w-36 sm:w-44 opacity-80 animate-rose-sway-alt"
          />
        </>
      )}

      {/* Auspicious top line */}
      <p
        className={`relative z-20 mb-5 text-xs tracking-[0.22em] text-[#7c2e3f] font-medium transition-opacity duration-500 ${
          openingPhase !== 'idle' ? 'opacity-0' : 'opacity-90'
        }`}
      >
        {COPY.auspiciousInvocation[lang]}
      </p>

      {/* 3D Wine-Velvet Book Stage */}
      <div className="book-stage relative z-20 flex items-center justify-center">
        <button
          type="button"
          onClick={handleTapBook}
          disabled={!ready}
          aria-label={COPY.tapBook[lang]}
          className={`book-3d group relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a252] transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.9,0.28,1)] ${
            openingPhase === 'zoom'
              ? 'scale-[1.48] translate-x-6'
              : openingPhase === 'swing'
                ? 'scale-[1.06] translate-x-4'
                : 'hover:scale-[1.02] active:scale-[0.99]'
          }`}
          style={{
            width: 'min(74vw, 292px)',
            height: 'min(54dvh, 412px)',
          }}
        >
          {/* Warm soft shadow under book */}
          <div
            aria-hidden="true"
            className="absolute -bottom-5 left-5 right-3 h-7 rounded-full bg-[#4a121f]/30 blur-lg"
          />

          {/* Gilded page block edges on the right */}
          <div
            aria-hidden="true"
            className="absolute top-[6px] bottom-[6px] -right-[8px] w-[10px] rounded-r-[4px]"
            style={{
              background:
                'repeating-linear-gradient(90deg, #f3e4c3 0px, #d7b670 1.5px, #f8eed9 3px)',
              boxShadow: '2px 2px 8px rgba(54,14,24,0.25)',
            }}
          />

          {/* Inner First Cream Page (revealed only as velvet cover swings open) */}
          <div
            className={`absolute inset-0 z-0 rounded-r-xl rounded-l-[4px] bg-gradient-to-br from-[#fcf7ef] via-[#f8efe3] to-[#f2e2d7] border border-[#d6b676]/70 shadow-inner flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-opacity duration-300 ${
              openingPhase === 'idle' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="absolute inset-2.5 border border-[#c9a252]/45 rounded-r-lg rounded-l-[2px] pointer-events-none" />
            {assets?.ganeshGold && (
              <img
                src={assets.ganeshGold}
                alt="Lord Ganesha"
                className="w-20 h-20 object-contain opacity-95"
              />
            )}
            <p className="mt-3 text-[11px] tracking-[0.22em] text-[#8a6530]">
              02 · 12 · 2026
            </p>
          </div>

          {/* 3D Swinging Wine-Velvet Front Cover */}
          <div
            className={`book-cover-3d absolute inset-0 z-20 rounded-r-xl rounded-l-[5px] ${
              openingPhase !== 'idle' ? 'is-open' : ''
            }`}
          >
            {/* Front Face of Velvet Cover */}
            <div className="book-face velvet-surface absolute inset-0 rounded-r-xl rounded-l-[5px] flex flex-col items-center justify-between py-7 px-6 overflow-hidden">
              {/* Bound Spine Ridge on Left */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#2c0710]/70 via-[#8f2e42]/30 to-transparent border-r border-[#f4dfae]/15"
              />

              {/* Double Champagne-Gold Embossed Frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[12px] rounded-r-[8px] rounded-l-[2px] border border-[#e6c887]/75"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[17px] rounded-r-[6px] rounded-l-[2px] border border-[#c9a252]/40"
              />

              {/* Subtle Gold Corner Filigree Brackets */}
              {[
                'top-[18px] left-[22px]',
                'top-[18px] right-[18px] rotate-90',
                'bottom-[18px] right-[18px] rotate-180',
                'bottom-[18px] left-[22px] -rotate-90',
              ].map((pos, idx) => (
                <svg
                  key={idx}
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`pointer-events-none absolute w-5 h-5 text-[#e8cfa0]/80 ${pos}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M2 14V2h12M6 10V6h4" />
                </svg>
              ))}

              {/* Top Cover Subtitle */}
              <span className="relative z-10 text-[10px] tracking-[0.26em] text-[#ecd5a4]/90 font-medium pl-2">
                {COPY.coverSubtitle[lang]}
              </span>

              {/* Central Embossed Gold Ganesh Ji Medallion + Couple Names */}
              <div className="relative z-10 flex flex-col items-center pl-2">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#f4dfae]/10"
                  />
                  {assets?.ganeshGold ? (
                    <img
                      src={assets.ganeshGold}
                      alt="Gold Ganesh Ji Emblem"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border border-[#e8cfa0]/40" />
                  )}
                </div>

                <h1 className="mt-4 font-[family-name:var(--font-display)] text-[26px] sm:text-[29px] leading-tight text-[#f6e3b8] tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {COPY.groomName[lang]}{' '}
                  <span className="italic font-normal text-[#d8b366]">&amp;</span>{' '}
                  {COPY.brideName[lang]}
                </h1>
              </div>

              {/* Bottom Gold Date */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 pl-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#e5c687]/75 to-transparent" />
                <span className="text-[11px] tracking-[0.26em] text-[#edd6a8]/90 tabular-nums">
                  02 · 12 · 2026
                </span>
              </div>
            </div>

            {/* Inner Back Face of the Swinging Cover (Marbled Blush Paper) */}
            <div className="book-face-back absolute inset-0 rounded-l-xl rounded-r-[5px] bg-gradient-to-br from-[#f6e8df] to-[#ecd4cb] border border-[#c9a252]/50 flex items-center justify-center p-6">
              <div className="w-full h-full border border-[#c9a252]/40 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="font-[family-name:var(--font-display)] italic text-lg text-[#6e1f2f]/80">
                  S &amp; R
                </span>
                <span className="mt-1 text-[10px] tracking-[0.2em] text-[#7e5446]/80">
                  Ranchi · 2026
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Foreground pre-blurred 3D roses (stronger parallax for true 3D depth) */}
      {assets && (
        <>
          <img
            src={assets.roseBlurredFore}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -bottom-16 -left-12 w-52 sm:w-64 opacity-85 z-30 transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallax.x * 18}px, ${parallax.y * 16}px, 0) rotate(12deg)`,
            }}
          />
          <img
            src={assets.roseBlurredFore}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -top-16 -right-14 w-48 sm:w-60 opacity-80 z-30 transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallax.x * -18}px, ${parallax.y * -14}px, 0) rotate(-28deg)`,
            }}
          />
        </>
      )}

      {/* Preloader OR "Tap the book to open" prompt */}
      <div
        className={`relative z-30 mt-8 min-h-[54px] flex flex-col items-center justify-center transition-opacity duration-500 ${
          openingPhase !== 'idle' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {!ready ? (
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-40 h-[3px] rounded-full bg-[#6e1f2f]/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9e762a] via-[#d9b56a] to-[#6e1f2f] transition-all duration-300"
                style={{ width: `${Math.max(10, progress)}%` }}
              />
            </div>
            <p className="text-[11px] tracking-[0.18em] text-[#6e1f2f]/80 font-medium tabular-nums">
              {COPY.loadingLabel[lang]} · {Math.round(progress)}%
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTapBook}
            className="min-h-[44px] px-6 py-2 flex items-center gap-2.5 text-xs tracking-[0.2em] font-medium text-[#6e1f2f] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a252] rounded-full"
          >
            <span className="w-5 h-px bg-[#c9a252]" aria-hidden="true" />
            <span>{COPY.tapBook[lang]}</span>
            <span className="w-5 h-px bg-[#c9a252]" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
