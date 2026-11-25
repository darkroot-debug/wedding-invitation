import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { BakedAssets } from '../lib/artBaker';
import {
  COPY,
  LanguageCode,
  WEDDING_FUNCTIONS,
  WeddingFunctionItem,
} from '../data/weddingContent';
import { useViewportActivity } from '../hooks/useViewportHooks';

interface FestivitiesCarouselProps {
  assets: BakedAssets;
  lang: LanguageCode;
}

/** Custom small animated ritual icon for each ceremony (pauses when off-screen via parent class) */
const RitualMiniIcon: React.FC<{ id: WeddingFunctionItem['id'] }> = ({ id }) => {
  if (id === 'tilak') {
    // Flickering ceremonial diya
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <path
          d="M20 7 C23.5 13 24 18 20 21 C16 18 16.5 13 20 7 Z"
          fill="#f59e0b"
          className="animate-flame"
        />
        <path
          d="M20 11 C21.8 14.5 22 17.5 20 19.5 C18 17.5 18.2 14.5 20 11 Z"
          fill="#fef08a"
          className="animate-flame"
        />
        <path
          d="M9 24 Q20 29 31 24 Q28 32 20 32 Q12 32 9 24 Z"
          fill="#c9a252"
          stroke="#7c5616"
          strokeWidth="1.2"
        />
      </svg>
    );
  }
  if (id === 'haldi') {
    // Swaying marigold bloom
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 animate-rose-sway" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, idx) => (
          <ellipse
            key={idx}
            cx="20"
            cy="11"
            rx="4"
            ry="7"
            fill={idx % 2 === 0 ? '#f59e0b' : '#ea580c'}
            transform={`rotate(${idx * 36} 20 20)`}
            opacity="0.92"
          />
        ))}
        <circle cx="20" cy="20" r="6" fill="#fde047" />
      </svg>
    );
  }
  if (id === 'ghritdhari') {
    // Sacred glowing kalash with mango leaves
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <path d="M14 15 Q10 10 15 8 Q18 11 18 15" fill="#4c6d59" />
        <path d="M26 15 Q30 10 25 8 Q22 11 22 15" fill="#4c6d59" />
        <circle cx="20" cy="12" r="4.2" fill="#8b4d26" />
        <ellipse
          cx="20"
          cy="25"
          rx="9"
          ry="9.5"
          fill="#d4a342"
          stroke="#8b621c"
          strokeWidth="1.2"
        />
        <path d="M13 21 Q20 23.5 27 21" stroke="#b91c1c" strokeWidth="2.2" fill="none" />
        <circle cx="20" cy="6.5" r="2.2" fill="#fde047" className="animate-twinkle" />
      </svg>
    );
  }
  // Baraat: glowing festive lantern
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 animate-rose-sway" aria-hidden="true">
      <line x1="20" y1="4" x2="20" y2="10" stroke="#e5c687" strokeWidth="1.5" />
      <path d="M14 11 H26 L28 15 H12 Z" fill="#c9a252" />
      <rect
        x="13"
        y="15"
        width="14"
        height="15"
        rx="2"
        fill="#fef3c7"
        stroke="#c9a252"
        strokeWidth="1.4"
      />
      <circle cx="20" cy="22.5" r="3.5" fill="#f59e0b" className="animate-flame" />
      <path d="M12 30 H28 L24 34 H16 Z" fill="#c9a252" />
    </svg>
  );
};

export const FestivitiesCarousel: React.FC<FestivitiesCarouselProps> = ({ assets, lang }) => {
  const { ref, inView, hasRevealed } = useViewportActivity<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  const count = WEDDING_FUNCTIONS.length;
  const wrapIndex = (idx: number) => ((idx % count) + count) % count;

  const goPrev = () => setActiveIndex((prev) => wrapIndex(prev - 1));
  const goNext = () => setActiveIndex((prev) => wrapIndex(prev + 1));

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = true;
    setDragOffsetX(0);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      setDragOffsetX(Math.max(-110, Math.min(110, dx)));
    }
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    if (dragOffsetX < -42) {
      goNext();
    } else if (dragOffsetX > 42) {
      goPrev();
    }
    draggingRef.current = false;
    pointerStartRef.current = null;
    setDragOffsetX(0);
  };

  return (
    <section
      ref={ref}
      id="festivities"
      className={`relative z-10 w-full max-w-[560px] mx-auto px-4 py-16 sm:py-20 flex flex-col items-center ${
        !inView ? 'anim-paused' : ''
      }`}
    >
      {/* Heading */}
      <div className={`text-center px-3 reveal-soft ${hasRevealed ? 'is-visible' : ''}`}>
        <p className="text-[11px] tracking-[0.24em] text-[#9b7329] font-medium">
          01 &amp; 02 · 12 · 2026
        </p>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(1.85rem,7vw,2.45rem)] text-[#6e1f2f] leading-tight text-balance">
          {COPY.festivitiesHeading[lang]}
        </h2>
        <p className="mt-1.5 text-xs text-[#6e4a52]">{COPY.festivitiesSub[lang]}</p>
      </div>

      {/* 3D Perspective Swipeable Stage */}
      <div
        className="relative mt-8 w-full h-[452px] sm:h-[476px] flex items-center justify-center select-none overflow-hidden"
        style={{ perspective: '1100px', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {WEDDING_FUNCTIONS.map((item, idx) => {
          // Circular shortest offset: -1 (left), 0 (center), +1 (right), 2 (back/hidden)
          let offset = idx - activeIndex;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isVisible = isCenter || isLeft || isRight;

          const dragShift = isCenter ? dragOffsetX * 0.45 : dragOffsetX * 0.25;
          const translateX = offset * 172 + dragShift;
          const translateZ = isCenter ? 0 : -110;
          const rotateY = offset * -19;
          const scale = isCenter ? 1 : 0.85;
          const opacity = isCenter ? 1 : isVisible ? 0.56 : 0;

          const isDarkCard = item.id === 'baraat';

          return (
            <article
              key={item.id}
              onClick={() => {
                if (isLeft) goPrev();
                else if (isRight) goNext();
              }}
              aria-hidden={!isCenter}
              className={`absolute w-[min(78vw,302px)] h-[428px] sm:h-[448px] rounded-[24px] overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.22,0.9,0.28,1)] ${
                isCenter
                  ? 'z-30 border-[#c9a252]/85 shadow-[0_24px_48px_-16px_rgba(78,20,32,0.34)]'
                  : 'z-10 border-[#c9a252]/40 cursor-pointer'
              }`}
              style={{
                transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                pointerEvents: isVisible ? 'auto' : 'none',
                willChange: 'transform, opacity',
              }}
            >
              {/* Pre-baked Soft Illustrated Scene */}
              <img
                src={assets.scenes[item.sceneKey]}
                alt={item.name[lang]}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover select-none"
              />

              {/* Soft dimming veil on neighbor cards (emulates depth-of-field without animating live blur) */}
              {!isCenter && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#faf4ec]/35 pointer-events-none z-20"
                />
              )}

              {/* Measured Scrim for Crisp WCAG AA Contrast */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 ${
                  isDarkCard
                    ? 'bg-gradient-to-b from-[#2b0a14]/55 via-[#3d0f1d]/68 to-[#220710]/92'
                    : 'bg-gradient-to-b from-[#fcf6ee]/62 via-[#faf2e7]/78 to-[#f7ebe1]/95'
                }`}
              />

              {/* Hairline Inner Champagne Border */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-3 rounded-[16px] border ${
                  isDarkCard ? 'border-[#e8cfa0]/35' : 'border-[#c9a252]/45'
                }`}
              />

              {/* Card Body */}
              <div className="relative z-10 h-full flex flex-col items-center justify-between px-6 py-7 text-center">
                {/* Top: Animated Ritual Icon + Event Sequence */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                      isDarkCard
                        ? 'bg-[#6e1f2f]/60 border-[#e8cfa0]/45'
                        : 'bg-[#faf4ec]/85 border-[#c9a252]/55'
                    }`}
                  >
                    <RitualMiniIcon id={item.id} />
                  </div>
                  <p
                    className={`mt-3 text-[11px] tracking-[0.2em] font-medium ${
                      isDarkCard ? 'text-[#f0d8a3]' : 'text-[#8c6424]'
                    }`}
                  >
                    {item.dayDate[lang]}
                  </p>
                </div>

                {/* Middle: Title, Time, Place */}
                <div className="flex flex-col items-center my-auto py-2">
                  <h3
                    className={`font-[family-name:var(--font-display)] text-[24px] sm:text-[26px] leading-[1.18] font-semibold text-balance ${
                      isDarkCard ? 'text-[#faf1df]' : 'text-[#6e1f2f]'
                    }`}
                  >
                    {item.name[lang]}
                  </h3>

                  <div
                    className={`my-3 w-10 h-px ${
                      isDarkCard ? 'bg-[#e5c687]/55' : 'bg-[#c9a252]/65'
                    }`}
                  />

                  <div
                    className={`flex items-center justify-center gap-1.5 text-xs font-medium ${
                      isDarkCard ? 'text-[#f4dfae]' : 'text-[#5b2532]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0 opacity-85" />
                    <span>{item.time[lang]}</span>
                  </div>

                  {item.place && (
                    <div
                      className={`mt-2.5 flex items-start justify-center gap-1.5 text-xs leading-relaxed max-w-[232px] ${
                        isDarkCard ? 'text-[#f3e5d7]/90' : 'text-[#5c3a42]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-85" />
                      <span>{item.place[lang]}</span>
                    </div>
                  )}
                </div>

                {/* Bottom: Dress-code row with colour swatch (when provided) */}
                {item.dressLabel && item.dressColorName && item.dressSwatch && (
                  <div
                    className={`w-full pt-3.5 border-t flex items-center justify-center gap-2.5 ${
                      isDarkCard ? 'border-[#e8cfa0]/25' : 'border-[#c9a252]/30'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 rounded-full border border-white/80 shadow-sm shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${item.dressSwatch} 55%, ${item.dressSwatchSecondary ?? item.dressSwatch} 100%)`,
                      }}
                    />
                    <span
                      className={`text-[11px] leading-tight text-left ${
                        isDarkCard ? 'text-[#f5e7ce]' : 'text-[#4e222c]'
                      }`}
                    >
                      <span className="opacity-75">{item.dressLabel[lang]}: </span>
                      <strong className="font-medium">{item.dressColorName[lang]}</strong>
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Controls & Dots (44x44px touch hitboxes) */}
      <div className="mt-2 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous ceremony"
          className="min-w-[44px] min-h-[44px] rounded-full border border-[#c9a252]/55 bg-[#faf4ec]/80 text-[#6e1f2f] hover:bg-[#6e1f2f] hover:text-[#faf1e2] transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a252]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Ceremonies">
          {WEDDING_FUNCTIONS.map((fn, idx) => (
            <button
              key={fn.id}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={fn.name[lang]}
              onClick={() => setActiveIndex(idx)}
              className="min-w-[24px] min-h-[36px] flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a252] rounded-full"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-6 bg-[#6e1f2f]'
                    : 'w-2 bg-[#c9a252]/55 hover:bg-[#c9a252]'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next ceremony"
          className="min-w-[44px] min-h-[44px] rounded-full border border-[#c9a252]/55 bg-[#faf4ec]/80 text-[#6e1f2f] hover:bg-[#6e1f2f] hover:text-[#faf1e2] transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a252]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
