import React, { useState } from 'react';
import { Check, Copy, ExternalLink, MapPin } from 'lucide-react';
import {
  COPY,
  GOOGLE_MAPS_URL,
  LanguageCode,
  VENUE_ADDRESS,
} from '../data/weddingContent';
import { useViewportActivity } from '../hooks/useViewportHooks';

interface LocationSectionProps {
  lang: LanguageCode;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang }) => {
  const { ref, inView, hasRevealed } = useViewportActivity<HTMLElement>();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(VENUE_ADDRESS);
      } else {
        const ta = document.createElement('textarea');
        ta.value = VENUE_ADDRESS;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section
      ref={ref}
      id="location"
      className={`relative z-10 w-full max-w-[460px] mx-auto px-5 py-16 sm:py-20 flex flex-col items-center text-center ${
        !inView ? 'anim-paused' : ''
      }`}
    >
      {/* Section Heading */}
      <div className={`reveal-soft ${hasRevealed ? 'is-visible' : ''}`}>
        <p className="text-[11px] tracking-[0.24em] text-[#9b7329] font-medium">
          RANCHI · JHARKHAND
        </p>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(1.85rem,7vw,2.45rem)] text-[#6e1f2f] leading-tight text-balance">
          {COPY.locationHeading[lang]}
        </h2>
        <p className="mt-1.5 text-xs text-[#6e4a52]">{COPY.locationSub[lang]}</p>
      </div>

      {/* Illustrated Interactive Map Card (Tapping opens Google Maps directly) */}
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Shahdeo Banquet Hall on Google Maps"
        className={`group relative mt-7 block w-full overflow-hidden rounded-[24px] border border-[#c9a252]/75 bg-[#fbf4e9] shadow-[0_20px_42px_-18px_rgba(88,24,36,0.28)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a252] reveal-soft ${
          hasRevealed ? 'is-visible' : ''
        }`}
      >
        <svg
          viewBox="0 0 400 265"
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Illustrated route map to Shahdeo Banquet Hall near Krishi Bhawan on Kanke Road, Ranchi"
        >
          <defs>
            <linearGradient id="mapPaper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fdf8f0" />
              <stop offset="100%" stopColor="#f3e5d7" />
            </linearGradient>
            <linearGradient id="roadGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e5c88e" />
              <stop offset="100%" stopColor="#d1a754" />
            </linearGradient>
          </defs>

          {/* Soft parchment map canvas */}
          <rect width="400" height="265" fill="url(#mapPaper)" />

          {/* Botanical garden patches & architectural blocks */}
          <path
            d="M18 28 Q72 18 108 52 Q122 86 76 102 Q26 108 18 28 Z"
            fill="#dfe7d8"
            opacity="0.72"
          />
          <path
            d="M276 168 Q340 156 382 192 Q388 238 332 248 Q272 246 276 168 Z"
            fill="#dfe7d8"
            opacity="0.68"
          />
          <rect x="136" y="34" width="66" height="40" rx="6" fill="#eedfd4" />
          <rect x="242" y="42" width="76" height="44" rx="6" fill="#eedfd4" />
          <rect x="44" y="148" width="74" height="46" rx="6" fill="#eedfd4" />
          <rect x="168" y="186" width="84" height="44" rx="6" fill="#eedfd4" />

          {/* Secondary Ranchi lanes */}
          <path
            d="M0 118 Q130 112 225 130 T400 104"
            fill="none"
            stroke="#e8d8c8"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M150 0 Q154 110 138 265"
            fill="none"
            stroke="#e8d8c8"
            strokeWidth="7"
          />

          {/* Main Kanke Road thoroughfare */}
          <path
            d="M28 228 C96 204, 152 162, 208 134 C252 112, 294 94, 342 82"
            fill="none"
            stroke="#ffffff"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M28 228 C96 204, 152 162, 208 134 C252 112, 294 94, 342 82"
            fill="none"
            stroke="url(#roadGold)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.32"
          />

          {/* Animated Dashed Champagne-Wine Wedding Route from Baraat Start -> Venue */}
          <path
            d="M72 212 C122 188, 162 158, 208 134 C248 113, 286 98, 314 90"
            fill="none"
            stroke="#6e1f2f"
            strokeWidth="3.2"
            strokeDasharray="7 9"
            strokeLinecap="round"
            className="animate-route-dash"
          />

          {/* Road Name Typography */}
          <text
            x="196"
            y="165"
            fill="#8c6424"
            fontSize="9.5"
            fontWeight="600"
            letterSpacing="2.2"
            transform="rotate(-24 196 165)"
          >
            KANKE ROAD
          </text>

          {/* Landmark 1: Baraat Start (Reliance Mart · SS. Memorial College) */}
          <g transform="translate(72, 212)">
            <circle r="7" fill="#faf4ec" stroke="#c9a252" strokeWidth="2.4" />
            <circle r="3" fill="#6e1f2f" />
            <text
              x="12"
              y="18"
              fill="#5d2d37"
              fontSize="9.2"
              fontWeight="600"
            >
              Reliance Mart
            </text>
            <text x="12" y="30" fill="#7c545d" fontSize="8.2">
              SS. Memorial College (Baraat)
            </text>
          </g>

          {/* Landmark 2: Krishi Bhawan */}
          <g transform="translate(212, 114)">
            <rect
              x="-4"
              y="-4"
              width="8"
              height="8"
              rx="2"
              fill="#d4af53"
              stroke="#faf4ec"
              strokeWidth="1.5"
            />
            <text
              x="-34"
              y="-12"
              fill="#6e4a52"
              fontSize="9.2"
              fontWeight="500"
            >
              Krishi Bhawan
            </text>
          </g>

          {/* Destination Pin: Shahdeo Banquet Hall (Pulsing Wine & Gold Pin) */}
          <g transform="translate(314, 88)">
            <circle
              r="14"
              fill="#6e1f2f"
              opacity="0.22"
              className="animate-pin-halo"
              style={{ transformOrigin: '0px 0px' }}
            />
            <path
              d="M0 -30 C11 -30 18 -22 18 -12 C18 -1 0 10 0 10 C0 10 -18 -1 -18 -12 C-18 -22 -11 -30 0 -30 Z"
              fill="#6e1f2f"
              stroke="#f4dfae"
              strokeWidth="2"
            />
            <circle cy="-13" r="5" fill="#f4dfae" />
            {/* Destination Label */}
            <rect
              x="-118"
              y="-56"
              width="148"
              height="24"
              rx="12"
              fill="#6e1f2f"
              opacity="0.94"
            />
            <text
              x="-44"
              y="-40.5"
              textAnchor="middle"
              fill="#f8e7bf"
              fontSize="9.5"
              fontWeight="600"
              letterSpacing="0.4"
            >
              Shahdeo Banquet Hall
            </text>
          </g>

          {/* Minimal Antique Compass Rose (Top-Left) */}
          <g transform="translate(38, 36)" opacity="0.65">
            <circle r="13" fill="none" stroke="#c9a252" strokeWidth="1" />
            <path d="M0 -10 L2.6 0 L0 10 L-2.6 0 Z" fill="#6e1f2f" />
            <path d="M-10 0 L0 -2.6 L10 0 L0 2.6 Z" fill="#c9a252" />
            <text
              x="0"
              y="-15"
              textAnchor="middle"
              fill="#7c5616"
              fontSize="7"
              fontWeight="600"
            >
              N
            </text>
          </g>
        </svg>
      </a>

      {/* Venue Full Address */}
      <div className="mt-5 flex items-start justify-center gap-2 text-center max-w-[330px]">
        <MapPin className="w-4 h-4 text-[#6e1f2f] mt-0.5 shrink-0" />
        <p className="text-[13px] leading-relaxed text-[#4b222c] font-medium">
          {VENUE_ADDRESS}
        </p>
      </div>

      {/* Action Buttons: "Get directions" and "Copy address" */}
      <div className="mt-5 w-full flex items-center justify-center gap-3">
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[46px] px-5 py-2.5 rounded-full bg-[#6e1f2f] text-[#faf1e2] border border-[#c9a252]/65 shadow-[0_10px_24px_-10px_rgba(110,31,47,0.5)] hover:bg-[#5b1725] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 text-xs tracking-[0.12em] font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a252]"
        >
          <span>{COPY.getDirections[lang]}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#f4dfae]" />
        </a>

        <button
          type="button"
          onClick={handleCopyAddress}
          className="min-h-[46px] px-5 py-2.5 rounded-full bg-[#faf4ec]/90 text-[#6e1f2f] border border-[#c9a252]/75 hover:bg-[#f3e4d4] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 text-xs tracking-[0.12em] font-medium whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a252]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#6e1f2f]" />
              <span>{COPY.copiedAddress[lang]}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#9b7329]" />
              <span>{COPY.copyAddress[lang]}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
