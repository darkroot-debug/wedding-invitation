/**
 * Wedding theme music controller using the official YouTube IFrame Player API
 * for the couple's chosen YouTube track (ZgXaA-aEy8o), with:
 * - Soft volume fade-in on book open
 * - Seamless looping
 * - Mobile inline playback (playsinline: 1) for iOS & Android
 * - Custom local MP3 override support
 * - Graceful Web Audio fallback if YouTube is unavailable or embed-restricted
 */

export const DEFAULT_YOUTUBE_VIDEO_ID = 'ZgXaA-aEy8o';

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  unMute: () => void;
  mute: () => void;
  destroy: () => void;
}

interface YTGlobal {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      width?: number | string;
      height?: number | string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
        onError?: (event: { data: number }) => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState?: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
  };
}

declare global {
  interface Window {
    YT?: YTGlobal;
    onYouTubeIframeAPIReady?: () => void;
  }
}

class WeddingMusicEngine {
  // YouTube IFrame Player state
  private ytPlayer: YTPlayerInstance | null = null;
  private ytReady = false;
  private ytFailed = false;
  private ytInitStarted = false;
  private ytFadeTimer: number | null = null;
  private pendingPlay: { softFadeIn: boolean } | null = null;

  // Optional custom MP3 state
  private customAudio: HTMLAudioElement | null = null;
  private customFadeTimer: number | null = null;

  // Soft Web Audio fallback (only used if YouTube cannot load or embed is blocked)
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private synthTimer: number | null = null;
  private noteIndex = 0;

  private isPlayingState = false;
  private usingFallbackSynth = false;

  private readonly targetYtVolume = 52;

  private readonly yamanMotif = [
    246.94, 293.66, 329.63, 369.99, 440.0, 369.99, 329.63, 293.66,
    246.94, 293.66, 369.99, 440.0, 493.88, 554.37, 493.88, 440.0,
  ];

  /** Preload the hidden YouTube IFrame player behind the opening book loader */
  public preloadYouTube(videoId = DEFAULT_YOUTUBE_VIDEO_ID): void {
    if (typeof window === 'undefined' || this.ytInitStarted) return;
    this.ytInitStarted = true;

    const mountPlayer = () => {
      if (!window.YT || !window.YT.Player || this.ytPlayer) return;

      // Hidden off-screen container (non-zero dimensions so iOS/Android don't throttle audio)
      let host = document.getElementById('wedding-yt-music-host');
      if (!host) {
        host = document.createElement('div');
        host.id = 'wedding-yt-music-host';
        host.setAttribute('aria-hidden', 'true');
        host.style.position = 'fixed';
        host.style.left = '-9999px';
        host.style.bottom = '0';
        host.style.width = '200px';
        host.style.height = '200px';
        host.style.opacity = '0.001';
        host.style.pointerEvents = 'none';
        host.style.zIndex = '-1';
        document.body.appendChild(host);
      }

      try {
        this.ytPlayer = new window.YT.Player(host, {
          width: 200,
          height: 200,
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (ev) => {
              this.ytReady = true;
              ev.target.setVolume(0);
              if (this.pendingPlay && !this.customAudio) {
                const { softFadeIn } = this.pendingPlay;
                this.pendingPlay = null;
                this.startYouTubePlayback(softFadeIn);
              }
            },
            onStateChange: (ev) => {
              // Ensure seamless looping when the track finishes
              if (ev.data === 0 && this.isPlayingState && !this.customAudio) {
                ev.target.seekTo(0, true);
                ev.target.playVideo();
              }
            },
            onError: () => {
              // If embed is blocked or offline, seamlessly fall back to ambient melody
              this.ytFailed = true;
              this.ytReady = false;
              this.clearYtFade();
              if (this.isPlayingState && !this.customAudio) {
                this.startFallbackSynth(true);
              }
            },
          },
        });
      } catch {
        this.ytFailed = true;
      }
    };

    if (window.YT && window.YT.Player) {
      mountPlayer();
      return;
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      mountPlayer();
    };

    if (!document.getElementById('youtube-iframe-api-script')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api-script';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        this.ytFailed = true;
      };
      document.head.appendChild(script);
    }
  }

  private clearYtFade(): void {
    if (this.ytFadeTimer !== null) {
      window.clearInterval(this.ytFadeTimer);
      this.ytFadeTimer = null;
    }
  }

  private startYouTubePlayback(softFadeIn: boolean): void {
    if (!this.ytPlayer || !this.ytReady) return;
    this.stopFallbackSynth();
    this.clearYtFade();

    try {
      this.ytPlayer.unMute();
      const startVol = softFadeIn ? 2 : this.targetYtVolume;
      this.ytPlayer.setVolume(startVol);
      this.ytPlayer.playVideo();
      this.isPlayingState = true;
      this.usingFallbackSynth = false;

      if (softFadeIn) {
        let currentVol = startVol;
        this.ytFadeTimer = window.setInterval(() => {
          if (!this.ytPlayer || !this.isPlayingState) {
            this.clearYtFade();
            return;
          }
          currentVol = Math.min(this.targetYtVolume, currentVol + 2);
          try {
            this.ytPlayer.setVolume(currentVol);
          } catch {
            this.clearYtFade();
          }
          if (currentVol >= this.targetYtVolume) {
            this.clearYtFade();
          }
        }, 105);
      }
    } catch {
      this.ytFailed = true;
      this.startFallbackSynth(softFadeIn);
    }
  }

  private ensureSynthContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1600;

      this.masterGain.connect(filter);
      filter.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private scheduleSynthNote = (): void => {
    if (!this.isPlayingState || !this.usingFallbackSynth || !this.ctx || !this.masterGain) return;
    const freq = this.yamanMotif[this.noteIndex % this.yamanMotif.length];
    this.noteIndex += 1;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(0.16, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.3);

    this.synthTimer = window.setTimeout(this.scheduleSynthNote, 820);
  };

  private async startFallbackSynth(softFadeIn: boolean): Promise<boolean> {
    const ctx = this.ensureSynthContext();
    if (!ctx || !this.masterGain) return false;
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (!this.droneGain) {
        this.droneGain = ctx.createGain();
        this.droneGain.gain.value = 0.1;
        this.droneGain.connect(this.masterGain);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 146.83;
        osc.connect(this.droneGain);
        osc.start();
      }
      this.isPlayingState = true;
      this.usingFallbackSynth = true;
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      this.masterGain.gain.linearRampToValueAtTime(0.28, now + (softFadeIn ? 2.4 : 0.4));

      if (this.synthTimer) window.clearTimeout(this.synthTimer);
      this.scheduleSynthNote();
      return true;
    } catch {
      return false;
    }
  }

  private stopFallbackSynth(): void {
    this.usingFallbackSynth = false;
    if (this.synthTimer) {
      window.clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
    }
  }

  public setCustomMp3(objectUrl: string): void {
    const wasPlaying = this.isPlayingState;
    this.pause();

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }
    const audio = new Audio(objectUrl);
    audio.loop = true;
    audio.volume = 0;
    this.customAudio = audio;

    if (wasPlaying) {
      this.play(true);
    }
  }

  public clearCustomMp3(): void {
    const wasPlaying = this.isPlayingState;
    this.pause();
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
      this.customAudio = null;
    }
    if (wasPlaying) {
      this.play(true);
    }
  }

  public hasCustomMp3(): boolean {
    return this.customAudio !== null;
  }

  public async play(softFadeIn = true): Promise<boolean> {
    // 1. Custom local MP3 override (if host attached one)
    if (this.customAudio) {
      try {
        this.customAudio.loop = true;
        this.customAudio.volume = softFadeIn ? 0.02 : 0.42;
        await this.customAudio.play();
        this.isPlayingState = true;

        if (softFadeIn) {
          if (this.customFadeTimer) window.clearInterval(this.customFadeTimer);
          const targetVol = 0.42;
          this.customFadeTimer = window.setInterval(() => {
            if (!this.customAudio || !this.isPlayingState) {
              if (this.customFadeTimer) window.clearInterval(this.customFadeTimer);
              return;
            }
            const next = Math.min(targetVol, this.customAudio.volume + 0.018);
            this.customAudio.volume = next;
            if (next >= targetVol && this.customFadeTimer) {
              window.clearInterval(this.customFadeTimer);
            }
          }, 110);
        }
        return true;
      } catch {
        return false;
      }
    }

    // 2. YouTube theme music (ZgXaA-aEy8o)
    if (!this.ytFailed) {
      if (!this.ytInitStarted) {
        this.preloadYouTube();
      }
      if (this.ytReady && this.ytPlayer) {
        this.startYouTubePlayback(softFadeIn);
        return true;
      }
      // Queue start as soon as the YouTube IFrame finishes initializing
      this.pendingPlay = { softFadeIn };
      this.isPlayingState = true;
      return true;
    }

    // 3. Fallback ambient synth if YouTube failed
    return this.startFallbackSynth(softFadeIn);
  }

  public pause(): void {
    this.isPlayingState = false;
    this.pendingPlay = null;
    this.clearYtFade();

    if (this.ytPlayer && this.ytReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // ignore player state errors
      }
    }

    if (this.customFadeTimer) {
      window.clearInterval(this.customFadeTimer);
      this.customFadeTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }

    this.stopFallbackSynth();
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
  }
}

export const weddingMusic = new WeddingMusicEngine();
