import React from 'react';
import { BakedAssets } from '../lib/artBaker';
import { COPY, LanguageCode } from '../data/weddingContent';
import { useViewportActivity } from '../hooks/useViewportHooks';

interface ClosingSectionProps {
  assets: BakedAssets;
  lang: LanguageCode;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ assets, lang }) => {
  const { ref, hasRevealed } = useViewportActivity<HTMLElement>();

  return (
    <footer
      ref={ref}
      id="closing"
      className="relative z-10 w-full max-w-[460px] mx-auto px-6 pt-12 pb-24 sm:pb-28 flex flex-col items-center text-center"
    >
      {/* Subtle Top Ornamental Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a252]/75" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#c9a252]" />
        <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a252]/75" />
      </div>

      {/* Gold Ganesh Ji Emblem */}
      <img
        src={assets.ganeshGold}
        alt="Gold Ganesh Ji"
        className={`w-16 h-16 sm:w-20 sm:h-20 object-contain reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      />

      {/* Closing Headline */}
      <h2
        className={`mt-4 font-[family-name:var(--font-display)] text-[clamp(1.75rem,6.8vw,2.3rem)] leading-[1.22] text-[#6e1f2f] font-medium max-w-[330px] text-balance reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      >
        {COPY.closingHeading[lang]}
      </h2>

      <p
        className={`mt-3 text-[11px] tracking-[0.22em] text-[#9b7329] font-medium reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      >
        {COPY.closingWarm[lang]}
      </p>

      {/* Family Names (Clean editorial whitespace, zero nested cards) */}
      <div
        className={`mt-8 w-full max-w-[350px] space-y-6 reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      >
        {/* Groom's Family */}
        <div className="space-y-1">
          <p className="text-[10.5px] tracking-[0.2em] text-[#9b7329] font-semibold">
            {COPY.groomSideLabel[lang]}
          </p>
          <p className="font-[family-name:var(--font-display)] text-base sm:text-[17px] text-[#531b27] font-medium">
            Smt. Rashmi Sinha &amp; Shri Sushil Kumar Sinha
          </p>
        </div>

        <div className="mx-auto w-14 h-px bg-[#c9a252]/40" />

        {/* Bride's Family */}
        <div className="space-y-1">
          <p className="text-[10.5px] tracking-[0.2em] text-[#9b7329] font-semibold">
            {COPY.brideSideLabel[lang]}
          </p>
          <p className="font-[family-name:var(--font-display)] text-base sm:text-[17px] text-[#531b27] font-medium">
            Smt. Rita Sinha &amp; Late Lala Randhir Kumar
          </p>
        </div>
      </div>

      {/* Monogram Seal */}
      <div className="mt-10 flex flex-col items-center">
        <span className="font-[family-name:var(--font-display)] italic text-2xl text-[#6e1f2f]">
          {COPY.groomName[lang]} &amp; {COPY.brideName[lang]}
        </span>
        <span className="mt-1 text-[11px] tracking-[0.24em] text-[#8d6728] tabular-nums">
          02 · 12 · 2026 · RANCHI
        </span>
      </div>
    </footer>
  );
};
