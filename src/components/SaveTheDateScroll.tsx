import React, { useEffect, useRef, useState } from 'react';
import { CalendarPlus, Check, Hand } from 'lucide-react';
import { BakedAssets } from '../lib/artBaker';
import {
  COPY,
  LanguageCode,
  WEDDING_TARGET_ISO,
  downloadWeddingIcs,
} from '../data/weddingContent';
import { useViewportActivity } from '../hooks/useViewportHooks';

interface SaveTheDateScrollProps {
  assets: BakedAssets;
  lang: LanguageCode;
  onUnrolled: () => void;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getCountdown(): CountdownParts {
  const target = new Date(WEDDING_TARGET_ISO).getTime();
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

export const SaveTheDateScroll: React.FC<SaveTheDateScrollProps> = ({
  assets,
  lang,
  onUnrolled,
}) => {
  const { ref, inView, hasRevealed } = useViewportActivity<HTMLElement>();
  const [unrolled, setUnrolled] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0..1 while dragging
  const [dragging, setDragging] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [countdown, setCountdown] = useState<CountdownParts>(() => getCountdown());

  const dragStartYRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);

  // Live 1-second countdown (only ticks while in view to save battery)
  useEffect(() => {
    if (!inView) return;
    setCountdown(getCountdown());
    const id = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);
    return () => window.clearInterval(id);
  }, [inView]);

  const completeUnroll = () => {
    if (unrolled) return;
    setUnrolled(true);
    setPullProgress(1);
    setDragging(false);
    onUnrolled();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (unrolled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartYRef.current = e.clientY;
    hasMovedRef.current = false;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging || dragStartYRef.current === null || unrolled) return;
    const dy = Math.max(0, e.clientY - dragStartYRef.current);
    if (dy > 6) hasMovedRef.current = true;
    const progress = Math.min(1, dy / 135);
    setPullProgress(progress);
    if (progress >= 0.45) {
      completeUnroll();
    }
  };

  const handlePointerUp = () => {
    if (unrolled) return;
    if (!hasMovedRef.current || pullProgress > 0.28) {
      // Single tap or generous pull immediately unfurls smoothly
      completeUnroll();
    } else {
      setPullProgress(0);
      setDragging(false);
    }
    dragStartYRef.current = null;
  };

  const handleAddCalendar = () => {
    downloadWeddingIcs();
    setCalendarAdded(true);
    window.setTimeout(() => setCalendarAdded(false), 3200);
  };

  const units = COPY.countdownUnits[lang];
  const pad2 = (n: number) => String(n).padStart(2, '0');

  // Scroll vertical opening factor: smoothly transforms height/scale without layout jump
  const openRatio = unrolled ? 1 : pullProgress;

  return (
    <section
      ref={ref}
      id="save-the-date"
      className={`relative z-10 w-full max-w-[460px] mx-auto px-5 py-16 sm:py-20 flex flex-col items-center text-center ${
        !inView ? 'anim-paused' : ''
      }`}
    >
      {/* Section Heading */}
      <div className={`reveal-soft ${hasRevealed ? 'is-visible' : ''}`}>
        <p className="text-[11px] tracking-[0.24em] text-[#9b7329] font-medium">
          02 · 12 · 2026
        </p>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(1.85rem,7vw,2.45rem)] text-[#6e1f2f] leading-tight text-balance">
          {COPY.saveTheDateHeading[lang]}
        </h2>
      </div>

      {/* Golden Rod + Interactive Unrolling Scroll */}
      <div className="relative mt-9 w-full max-w-[348px] flex flex-col items-center">
        {/* Top Golden Rod with Antique Turned Finials */}
        <div className="relative z-20 w-full flex items-center justify-center">
          {/* Left Finial */}
          <div
            aria-hidden="true"
            className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f6e3b4] via-[#c9a252] to-[#7c581b] shadow-md shrink-0 -mr-1"
          />
          <div
            aria-hidden="true"
            className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#f3dca4] via-[#b88d3a] to-[#745117] shrink-0"
          />
          {/* Main Metallic Rod */}
          <div
            aria-hidden="true"
            className="h-3.5 flex-1 bg-gradient-to-b from-[#f9eac4] via-[#d2a952] to-[#87621f] shadow-[0_6px_14px_rgba(78,24,34,0.24)]"
          />
          {/* Right Finial */}
          <div
            aria-hidden="true"
            className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#f3dca4] via-[#b88d3a] to-[#745117] shrink-0"
          />
          <div
            aria-hidden="true"
            className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f6e3b4] via-[#c9a252] to-[#7c581b] shadow-md shrink-0 -ml-1"
          />
        </div>

        {/* Unfurling Scroll Sheet */}
        <div
          className="relative z-10 w-[88%] overflow-hidden origin-top transition-[max-height] duration-[950ms] ease-[cubic-bezier(0.22,0.9,0.28,1)]"
          style={{
            maxHeight: unrolled
              ? '410px'
              : `${Math.round(52 + openRatio * 290)}px`,
          }}
        >
          <div className="relative bg-gradient-to-b from-[#fcf6ec] via-[#fbf3e6] to-[#f4e5d9] border-x border-[#c9a252]/70 px-6 py-8 shadow-[0_20px_40px_-16px_rgba(88,24,36,0.28)]">
            {/* Inner Gold Double Frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 border border-[#c9a252]/65 rounded-sm"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[16px] border border-[#c9a252]/30 rounded-sm"
            />

            {/* Blooming Rose Corners inside Scroll */}
            <img
              src={assets.roseCornerTopRight}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none select-none absolute -top-2 -right-2 w-24 h-24 object-contain transition-all duration-1000 ${
                unrolled ? 'opacity-95 scale-100' : 'opacity-0 scale-75'
              }`}
            />
            <img
              src={assets.roseCornerBottomLeft}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none select-none absolute -bottom-2 -left-2 w-24 h-24 object-contain transition-all duration-1000 delay-150 ${
                unrolled ? 'opacity-95 scale-100' : 'opacity-0 scale-75'
              }`}
            />

            {/* Revealed Wedding Date Content */}
            <div
              className={`relative z-10 flex flex-col items-center transition-all duration-700 delay-200 ${
                unrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
            >
              <img
                src={assets.ganeshGold}
                alt="Gold Ganesh Ji"
                className="w-14 h-14 object-contain"
              />
              <p className="mt-2.5 text-[11px] tracking-[0.22em] text-[#8d6728] font-medium">
                {COPY.weddingDateDay[lang]}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-[28px] sm:text-[31px] font-semibold text-[#6e1f2f] leading-tight">
                {COPY.weddingDateFull[lang]}
              </p>

              <div className="my-3.5 flex items-center gap-2.5">
                <span className="w-8 h-px bg-[#c9a252]/70" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#c9a252]" />
                <span className="w-8 h-px bg-[#c9a252]/70" />
              </div>

              <p className="text-xs sm:text-[13px] leading-relaxed text-[#572631] font-medium max-w-[230px]">
                {COPY.weddingVenueShort[lang]}
              </p>
              <p className="mt-1 text-[11px] text-[#7a5059]">
                {COPY.groomName[lang]} &amp; {COPY.brideName[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rolled Cylinder Edge */}
        <div className="relative z-20 w-[92%] h-5 rounded-full bg-gradient-to-b from-[#fbf2e3] via-[#e7d0b2] to-[#c49d56] border border-[#c9a252]/65 shadow-[0_8px_18px_-4px_rgba(78,24,34,0.3)] flex items-center justify-center">
          <div className="w-[82%] h-px bg-[#96722d]/35" />
        </div>

        {/* Hanging Wine & Gold Silk Tassel (Draggable & Tappable) */}
        <div className="relative z-30 flex flex-col items-center -mt-0.5">
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label={COPY.pullHint[lang]}
            style={{ touchAction: unrolled ? 'auto' : 'none' }}
            className={`group relative flex flex-col items-center min-w-[68px] min-h-[76px] pt-0 pb-2 focus-visible:outline-2 focus-visible:outline-[#c9a252] rounded-xl ${
              unrolled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {/* Gold braided silk cord */}
            <span
              className="block w-[2.5px] bg-gradient-to-b from-[#d9b56a] to-[#9b7329] transition-all duration-300"
              style={{ height: unrolled ? '18px' : `${28 + pullProgress * 18}px` }}
            />
            {/* Gold bead cap */}
            <span className="block w-4 h-4 rounded-full bg-gradient-to-br from-[#f8e6b8] via-[#c9a252] to-[#7c581b] shadow-sm -mb-1 relative z-10" />
            {/* Wine silk tassel body */}
            <span className="block w-5 h-10 rounded-b-lg bg-gradient-to-b from-[#85263a] via-[#6e1f2f] to-[#47101c] shadow-md relative overflow-hidden">
              <span className="absolute inset-x-0 top-1.5 h-[2px] bg-[#e5c687]" />
              <span className="absolute inset-y-2 left-1.5 w-px bg-white/15" />
              <span className="absolute inset-y-2 right-1.5 w-px bg-black/25" />
            </span>

            {/* Animated Hand Hint (disappears once unrolled) */}
            {!unrolled && (
              <span
                aria-hidden="true"
                className="animate-finger-pull pointer-events-none absolute -right-7 top-7 flex items-center justify-center w-8 h-8 rounded-full bg-[#faf4ec]/90 border border-[#c9a252]/60 shadow-sm text-[#6e1f2f]"
              >
                <Hand className="w-4 h-4" />
              </span>
            )}
          </button>

          {!unrolled && (
            <p className="mt-1 text-xs text-[#7c3443] font-medium tracking-wide">
              {COPY.pullHint[lang]}
            </p>
          )}
        </div>
      </div>

      {/* One-Line Live Countdown (days · hrs · min · sec) */}
      <div
        className={`mt-9 w-full flex flex-col items-center reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      >
        {countdown.expired ? (
          <p className="font-[family-name:var(--font-display)] italic text-base text-[#6e1f2f]">
            {COPY.weddingArrived[lang]}
          </p>
        ) : (
          <div
            aria-label="Live wedding countdown"
            className="flex items-baseline justify-center gap-2 sm:gap-3 text-[#6e1f2f] tabular-nums whitespace-nowrap"
          >
            <span className="font-[family-name:var(--font-display)] text-2xl sm:text-[28px] font-semibold">
              {pad2(countdown.days)}
            </span>
            <span className="text-[11px] tracking-wider text-[#7e545d] -ml-1">
              {units.d}
            </span>
            <span aria-hidden="true" className="text-[#c9a252] font-semibold">
              ·
            </span>
            <span className="font-[family-name:var(--font-display)] text-2xl sm:text-[28px] font-semibold">
              {pad2(countdown.hours)}
            </span>
            <span className="text-[11px] tracking-wider text-[#7e545d] -ml-1">
              {units.h}
            </span>
            <span aria-hidden="true" className="text-[#c9a252] font-semibold">
              ·
            </span>
            <span className="font-[family-name:var(--font-display)] text-2xl sm:text-[28px] font-semibold">
              {pad2(countdown.minutes)}
            </span>
            <span className="text-[11px] tracking-wider text-[#7e545d] -ml-1">
              {units.m}
            </span>
            <span aria-hidden="true" className="text-[#c9a252] font-semibold">
              ·
            </span>
            <span className="font-[family-name:var(--font-display)] text-2xl sm:text-[28px] font-semibold">
              {pad2(countdown.seconds)}
            </span>
            <span className="text-[11px] tracking-wider text-[#7e545d] -ml-1">
              {units.s}
            </span>
          </div>
        )}

        {/* Add to Calendar CTA */}
        <button
          type="button"
          onClick={handleAddCalendar}
          className="mt-5 min-h-[46px] px-6 py-2.5 rounded-full bg-[#6e1f2f] text-[#faf1e2] border border-[#c9a252]/65 shadow-[0_10px_24px_-10px_rgba(110,31,47,0.55)] hover:bg-[#5b1725] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2.5 text-xs tracking-[0.14em] font-medium whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a252]"
        >
          {calendarAdded ? (
            <>
              <Check className="w-4 h-4 text-[#f4dfae]" />
              <span>{COPY.calendarSaved[lang]}</span>
            </>
          ) : (
            <>
              <CalendarPlus className="w-4 h-4 text-[#f4dfae]" />
              <span>{COPY.addToCalendar[lang]}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
