/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { BakedAssets, bakeAndPreloadAllAssets } from './lib/artBaker';
import { weddingMusic } from './lib/weddingAudio';
import { LanguageCode } from './data/weddingContent';
import { useScrollCssVars } from './hooks/useViewportHooks';
import { OpeningBook } from './components/OpeningBook';
import { AtmosphereLayer, PetalShower } from './components/AtmosphereLayer';
import { FirstPageHero } from './components/FirstPageHero';
import { SaveTheDateScroll } from './components/SaveTheDateScroll';
import { FestivitiesCarousel } from './components/FestivitiesCarousel';
import { GrandReceptionCard } from './components/GrandReceptionCard';
import { LocationSection } from './components/LocationSection';
import { ClosingSection } from './components/ClosingSection';

export default function App() {
  const [assets, setAssets] = useState<BakedAssets | null>(null);
  const [loadProgress, setLoadProgress] = useState(8);
  const [ready, setReady] = useState(false);

  const [bookOpened, setBookOpened] = useState(false);
  const [heroStarted, setHeroStarted] = useState(false);
  const lang: LanguageCode = 'en';
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Petal & confetti burst counter
  const [petalBurst, setPetalBurst] = useState<{ key: number; confetti: boolean }>({
    key: 0,
    confetti: false,
  });

  // Pre-render flowers, Ganesh Ji, scenes, preload fonts & YouTube music player behind the cover loader
  useEffect(() => {
    let active = true;
    weddingMusic.preloadYouTube();
    bakeAndPreloadAllAssets((pct) => {
      if (active) setLoadProgress(pct);
    }).then((baked) => {
      if (!active) return;
      setAssets(baked);
      // Small graceful beat at 100% before showing "Tap the book to open"
      window.setTimeout(() => {
        if (active) setReady(true);
      }, 260);
    });
    return () => {
      active = false;
    };
  }, []);

  // Lock background body scroll while the 3D opening book is closed
  useEffect(() => {
    if (!bookOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [bookOpened]);

  // Zero-rerender scroll parallax & swinging marigold garlands once invite is open
  useScrollCssVars(bookOpened);

  const handleBookOpenStart = useCallback(() => {
    // Trigger rose petal shower & soft music fade-in inside the tap gesture
    setPetalBurst((prev) => ({ key: prev.key + 1, confetti: false }));
    weddingMusic.play(true).then((ok) => {
      if (ok) setIsMusicPlaying(true);
    });
  }, []);

  const handleBookOpenComplete = useCallback(() => {
    setBookOpened(true);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    window.setTimeout(() => {
      setHeroStarted(true);
    }, 80);
  }, []);

  const handleToggleMusic = useCallback(() => {
    if (weddingMusic.isPlaying()) {
      weddingMusic.pause();
      setIsMusicPlaying(false);
    } else {
      weddingMusic.play(false).then((ok) => {
        if (ok) setIsMusicPlaying(true);
      });
    }
  }, []);

  const handleScrollToSaveDate = useCallback(() => {
    const el = document.getElementById('save-the-date');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleScrollUnrolled = useCallback(() => {
    setPetalBurst((prev) => ({ key: prev.key + 1, confetti: true }));
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden paper-grain">
      {/* Compact Floating Music Control (Top-Right) */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-5 z-[60] flex items-center gap-2">
        {/* Small Play / Pause Music Button (44px touch target) */}
        {bookOpened && (
          <button
            type="button"
            onClick={handleToggleMusic}
            aria-label={isMusicPlaying ? 'Pause wedding music' : 'Play wedding music'}
            className="w-11 h-11 rounded-full bg-[#6e1f2f] text-[#f6e3b8] border border-[#d6b676]/75 shadow-[0_8px_20px_-6px_rgba(78,20,32,0.45)] hover:bg-[#591624] active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a252]"
          >
            {isMusicPlaying ? (
              <span className="flex items-center gap-1">
                <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
                  <span className="w-[2px] h-full bg-[#f4dfae] rounded-full animate-eq-1 origin-bottom" />
                  <span className="w-[2px] h-full bg-[#f4dfae] rounded-full animate-eq-2 origin-bottom" />
                  <span className="w-[2px] h-full bg-[#f4dfae] rounded-full animate-eq-3 origin-bottom" />
                </span>
                <Pause className="w-3 h-3 fill-current" />
              </span>
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* 1. Opening 3D Wine-Velvet Book (unmounts cleanly after opening transition) */}
      {!bookOpened && (
        <OpeningBook
          assets={assets}
          progress={loadProgress}
          ready={ready}
          lang={lang}
          onOpenStart={handleBookOpenStart}
          onOpenComplete={handleBookOpenComplete}
        />
      )}

      {/* Celebratory Petal & Confetti Shower */}
      <PetalShower burstKey={petalBurst.key} withConfetti={petalBurst.confetti} />

      {/* Fixed Parallax 3D Roses & Hanging Marigold Garlands */}
      {assets && <AtmosphereLayer assets={assets} visible={bookOpened} />}

      {/* Continuous Seamless Invitation Flow (Sections 2 through 8) */}
      {assets && (
        <main
          className={`relative z-10 w-full transition-opacity duration-700 ${
            bookOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* 2. First Page (exact 100dvh, centered, never cut) */}
          <FirstPageHero
            assets={assets}
            archBackdropUrl={assets.heroArchBlurred}
            lang={lang}
            started={heroStarted}
            onScrollNext={handleScrollToSaveDate}
          />

          {/* 3. Save the Date — Pull to Reveal Scroll + Live Countdown + Add to Calendar */}
          <SaveTheDateScroll
            assets={assets}
            lang={lang}
            onUnrolled={handleScrollUnrolled}
          />

          {/* 4. Wedding Functions — Swipeable Looping 3D Card Carousel */}
          <FestivitiesCarousel assets={assets} lang={lang} />

          {/* 5. Baraat Note — Deep Wine & Gold Sparkle Card with Corner Roses */}
          <GrandReceptionCard assets={assets} lang={lang} />

          {/* 6. Location — Illustrated Map Card + Directions + Copy Address */}
          <LocationSection lang={lang} />

          {/* 7. Closing — Ganesh Ji, Heartfelt Message, Both Family Names */}
          <ClosingSection assets={assets} lang={lang} />
        </main>
      )}
    </div>
  );
}
