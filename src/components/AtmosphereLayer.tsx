import React, { useMemo } from 'react';
import { BakedAssets } from '../lib/artBaker';

interface AtmosphereLayerProps {
  assets: BakedAssets;
  visible: boolean;
}

/**
 * Fixed 3D roses at screen corners/edges (bloom, sway & parallax on scroll)
 * + Hanging marigold strings at the top that swing with scroll velocity.
 * Pure GPU-composited transforms driven by CSS vars (--scroll-p, --garland-swing).
 */
export const AtmosphereLayer: React.FC<AtmosphereLayerProps> = ({ assets, visible }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-20 overflow-hidden transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Hanging Marigold Garlands (Genda Phool) at Top — swing physically on scroll */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-1 sm:px-6">
        <div className="flex items-start gap-0 sm:gap-2">
          <img
            src={assets.marigoldStrandLong}
            alt=""
            className="w-9 sm:w-12 origin-top select-none opacity-95"
            style={{
              transform: 'rotate(calc(var(--garland-swing, 0deg) * 1.15)) translateZ(0)',
              transition: 'transform 120ms linear',
            }}
          />
          <img
            src={assets.marigoldStrandShort}
            alt=""
            className="w-8 sm:w-10 -ml-2 origin-top select-none opacity-90"
            style={{
              transform: 'rotate(calc(var(--garland-swing, 0deg) * -0.85)) translateZ(0)',
              transition: 'transform 150ms linear',
            }}
          />
        </div>

        <div className="flex items-start gap-0 sm:gap-2">
          <img
            src={assets.marigoldStrandShort}
            alt=""
            className="w-8 sm:w-10 -mr-2 origin-top select-none opacity-90"
            style={{
              transform: 'rotate(calc(var(--garland-swing, 0deg) * 0.9)) translateZ(0)',
              transition: 'transform 150ms linear',
            }}
          />
          <img
            src={assets.marigoldStrandLong}
            alt=""
            className="w-9 sm:w-12 origin-top select-none opacity-95"
            style={{
              transform: 'rotate(calc(var(--garland-swing, 0deg) * -1.15)) translateZ(0)',
              transition: 'transform 120ms linear',
            }}
          />
        </div>
      </div>

      {/* Fixed 3D Rose Cluster — Top Right Corner (parallax shift + gentle sway) */}
      <div
        className="absolute -top-8 -right-10 sm:-top-6 sm:-right-6 w-36 sm:w-52 opacity-90"
        style={{
          transform:
            'translate3d(calc(var(--scroll-p, 0) * 10px), calc(var(--scroll-p, 0) * -28px), 0)',
        }}
      >
        <img
          src={assets.roseCornerTopRight}
          alt=""
          className="w-full h-auto animate-rose-sway select-none"
        />
      </div>

      {/* Fixed 3D Rose Cluster — Bottom Left Corner */}
      <div
        className="absolute -bottom-10 -left-10 sm:-bottom-6 sm:-left-6 w-36 sm:w-52 opacity-90"
        style={{
          transform:
            'translate3d(calc(var(--scroll-p, 0) * -10px), calc(var(--scroll-p, 0) * 24px), 0)',
        }}
      >
        <img
          src={assets.roseCornerBottomLeft}
          alt=""
          className="w-full h-auto animate-rose-sway-alt select-none"
        />
      </div>

      {/* Subtle Side-Edge Parallax Roses (visible gently on edges without blocking copy) */}
      <div
        className="absolute top-[44%] -left-14 sm:-left-10 w-24 sm:w-36 opacity-75"
        style={{
          transform: 'translate3d(0, calc(var(--scroll-p, 0) * -46px), 0)',
        }}
      >
        <img
          src={assets.roseBlush}
          alt=""
          className="w-full h-auto animate-rose-sway select-none"
        />
      </div>

      <div
        className="absolute top-[58%] -right-14 sm:-right-10 w-24 sm:w-36 opacity-75"
        style={{
          transform: 'translate3d(0, calc(var(--scroll-p, 0) * 42px), 0)',
        }}
      >
        <img
          src={assets.roseWine}
          alt=""
          className="w-full h-auto animate-rose-sway-alt select-none"
        />
      </div>
    </div>
  );
};

interface PetalBurstProps {
  burstKey: number;
  withConfetti?: boolean;
}

/** Lightweight GPU petal & champagne-gold confetti burst (auto-fades out) */
export const PetalShower: React.FC<PetalBurstProps> = ({ burstKey, withConfetti = false }) => {
  const particles = useMemo(() => {
    if (burstKey === 0) return [];
    const count = withConfetti ? 28 : 20;
    return Array.from({ length: count }, (_, idx) => {
      const seed = (idx * 37 + burstKey * 19) % 100;
      const isGoldConfetti = withConfetti && idx % 3 === 0;
      return {
        id: `${burstKey}-${idx}`,
        left: `${4 + ((idx * 100) / count + (seed % 7) - 3) % 92}%`,
        delay: `${((seed % 14) * 0.12).toFixed(2)}s`,
        dur: `${(3.8 + (seed % 5) * 0.55).toFixed(2)}s`,
        driftX: `${(idx % 2 === 0 ? 1 : -1) * (24 + (seed % 46))}px`,
        spin: `${(idx % 2 === 0 ? 1 : -1) * (190 + (seed % 180))}deg`,
        size: isGoldConfetti ? 8 + (seed % 5) : 12 + (seed % 8),
        color: isGoldConfetti
          ? idx % 2 === 0
            ? '#e5c687'
            : '#f6e1ae'
          : idx % 3 === 0
            ? '#7c2235'
            : idx % 3 === 1
              ? '#d48695'
              : '#eab7c0',
        isGoldConfetti,
      };
    });
  }, [burstKey, withConfetti]);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-petal-fall absolute -top-6 block"
          style={
            {
              left: p.left,
              width: `${p.size}px`,
              height: p.isGoldConfetti ? `${p.size * 0.6}px` : `${p.size * 1.25}px`,
              backgroundColor: p.color,
              borderRadius: p.isGoldConfetti ? '2px' : '65% 35% 60% 40% / 60% 40% 60% 40%',
              boxShadow: '0 2px 5px rgba(72, 16, 28, 0.14)',
              '--delay': p.delay,
              '--dur': p.dur,
              '--drift-x': p.driftX,
              '--spin': p.spin,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
