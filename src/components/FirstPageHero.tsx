import React from 'react';
import { ChevronDown } from 'lucide-react';
import { BakedAssets } from '../lib/artBaker';
import { COPY, LanguageCode } from '../data/weddingContent';
import { useViewportActivity } from '../hooks/useViewportHooks';

interface FirstPageHeroProps {
  assets: BakedAssets;
  archBackdropUrl: string;
  lang: LanguageCode;
  started: boolean;
  onScrollNext: () => void;
}

const TypedBlurName: React.FC<{
  text: string;
  startDelayMs: number;
  active: boolean;
}> = ({ text, startDelayMs, active }) => {
  const chars = Array.from(text);
  return (
    <span className="inline-block" aria-label={text}>
      {chars.map((ch, idx) => (
        <span
          key={`${text}-${idx}`}
          aria-hidden="true"
          className={active ? 'animate-letter-in inline-block' : 'opacity-0 inline-block'}
          style={{
            animationDelay: `${startDelayMs + idx * 85}ms`,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
};

export const FirstPageHero: React.FC<FirstPageHeroProps> = ({
  assets,
  archBackdropUrl,
  lang,
  started,
  onScrollNext,
}) => {
  const { ref, inView } = useViewportActivity<HTMLElement>('120px 0px 120px 0px');

  return (
    <section
      ref={ref}
      id="hero"
      className={`relative z-10 w-full h-[100dvh] min-h-[580px] max-h-[100dvh] flex flex-col items-center justify-center px-5 pt-11 pb-5 overflow-hidden ${
        !inView && started ? 'anim-paused' : ''
      }`}
    >
      {/* Thin Champagne-Gold Arch Frame holding Photo #1 (soft, pre-blurred, slowly zooming) */}
      <div className="relative w-full max-w-[390px] sm:max-w-[430px] h-[min(86dvh,700px)] flex flex-col items-center justify-between px-5 sm:px-8 pt-6 pb-4 text-center">
        {/* Arch Background Container */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-t-[220px] rounded-b-[28px] overflow-hidden border border-[#c9a252]/75 shadow-[0_18px_46px_-22px_rgba(110,31,47,0.28)]"
        >
          {/* Pre-blurred softly tinted couple portrait zooming smoothly (transform only) */}
          <img
            src={archBackdropUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover animate-arch-zoom opacity-90 select-none"
          />
          {/* Subtle warm ivory vignette inside the arch for effortless WCAG AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf4ec]/55 via-[#faf4ec]/45 to-[#f6e6e2]/75" />
        </div>

        {/* Inner Double Hairline Gold Arch */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] rounded-t-[213px] rounded-b-[22px] border border-[#c9a252]/40"
        />

        {/* Top: Gold Ganesh Ji Medallion + Invocation + "Together with their families" */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={assets.ganeshGold}
            alt="Lord Ganesha Medallion"
            className={`w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] object-contain transition-all duration-700 ${
              started ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          />
          <p
            className={`mt-1 text-[10px] sm:text-[11px] tracking-[0.22em] text-[#7a2a3b] font-medium transition-all duration-700 delay-100 ${
              started ? 'opacity-95 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {COPY.togetherWith[lang]}
          </p>
        </div>

        {/* Middle: Groom Name + Lineage, "&", Bride Name + Lineage */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1">
          {/* Groom Name typed letter by letter */}
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.35rem,9.2vw,3.35rem)] leading-[1.06] font-semibold text-[#6e1f2f] tracking-wide">
            <TypedBlurName
              text={COPY.groomName[lang]}
              startDelayMs={220}
              active={started}
            />
          </h1>

          {/* Groom Family Lineage */}
          <div
            className={`mt-1.5 space-y-0.5 text-[11px] sm:text-[12px] leading-[1.38] text-[#4b222c] max-w-[295px] transition-all duration-700 delay-500 ${
              started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <p className="text-[#6d454e] text-[10.5px] sm:text-[11px]">
              {COPY.groomGrandson[lang]}
            </p>
            <p className="font-medium text-[#5c2532]">{COPY.groomSon[lang]}</p>
          </div>

          {/* Ornamental Champagne-Gold "&" */}
          <div
            className={`my-2 sm:my-2.5 flex items-center gap-3 transition-all duration-700 delay-700 ${
              started ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a252]" />
            <span className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-[#b68938] leading-none">
              &amp;
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a252]" />
          </div>

          {/* Bride Name typed letter by letter */}
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.35rem,9.2vw,3.35rem)] leading-[1.06] font-semibold text-[#6e1f2f] tracking-wide">
            <TypedBlurName
              text={COPY.brideName[lang]}
              startDelayMs={820}
              active={started}
            />
          </h2>

          {/* Bride Family Lineage */}
          <div
            className={`mt-1.5 space-y-0.5 text-[11px] sm:text-[12px] leading-[1.38] text-[#4b222c] max-w-[295px] transition-all duration-700 delay-[1050ms] ${
              started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <p className="text-[#6d454e] text-[10.5px] sm:text-[11px]">
              {COPY.brideGranddaughter[lang]}
            </p>
            <p className="font-medium text-[#5c2532]">{COPY.brideDaughter[lang]}</p>
          </div>
        </div>

        {/* Bottom: Warm Invite Line + Animated Scroll-Down Arrow */}
        <div className="relative z-10 flex flex-col items-center">
          <p
            className={`max-w-[285px] text-[11.5px] sm:text-[12.5px] leading-[1.45] italic font-[family-name:var(--font-display)] text-[#592330] transition-all duration-700 delay-[1200ms] ${
              started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {COPY.inviteLine[lang]}
          </p>

          <button
            type="button"
            onClick={onScrollNext}
            aria-label={COPY.scrollDown[lang]}
            className="mt-2 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center text-[#7c2a3c] hover:text-[#6e1f2f] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a252] rounded-full"
          >
            <span className="text-[9.5px] tracking-[0.22em] font-medium opacity-80">
              {COPY.scrollDown[lang]}
            </span>
            <ChevronDown className="w-5 h-5 mt-0.5 animate-soft-bounce text-[#b68938]" />
          </button>
        </div>
      </div>
    </section>
  );
};
