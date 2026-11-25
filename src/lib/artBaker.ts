/**
 * Pre-renders all botanical 3D roses, hanging marigold garlands, gold Ganesh Ji emblem,
 * illustrated ceremony scenes, and romantic couple story artworks ONCE to cached static
 * image URLs behind the initial preloader.
 *
 * Performance guarantee:
 * - Zero live CSS blur animations on large layers (blurred layers are baked once here).
 * - Zero live SVG filter overhead during scroll or swipe.
 * - Instant GPU texture compositing on iPhone & Android even with battery saver enabled.
 */

export interface BakedAssets {
  ganeshGold: string;
  roseWine: string;
  roseBlush: string;
  roseCornerTopRight: string;
  roseCornerBottomLeft: string;
  roseBlurredFore: string;
  roseBlurredBack: string;
  marigoldStrandLong: string;
  marigoldStrandShort: string;
  heroArchBlurred: string;
  stories: {
    story1: string;
    story2: string;
    story3: string;
    story4: string;
  };
  scenes: {
    tilak: string;
    haldi: string;
    ghritdhari: string;
    baraat: string;
  };
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/** Draws a lush, painterly 3D multi-layered rose with chiaroscuro petal depth */
function paintRoseBloom(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  palette: {
    core: string;
    deep: string;
    mid: string;
    light: string;
    rim: string;
  },
  seedAngle = 0
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(seedAngle);

  // Soft ambient shadow beneath the bloom
  const baseShadow = ctx.createRadialGradient(4, 8, radius * 0.1, 4, 8, radius * 1.15);
  baseShadow.addColorStop(0, 'rgba(54, 14, 24, 0.28)');
  baseShadow.addColorStop(0.7, 'rgba(54, 14, 24, 0.08)');
  baseShadow.addColorStop(1, 'rgba(54, 14, 24, 0)');
  ctx.fillStyle = baseShadow;
  ctx.beginPath();
  ctx.arc(4, 8, radius * 1.15, 0, Math.PI * 2);
  ctx.fill();

  // 5 concentric rings of curved overlapping rose petals (outer -> inner)
  const rings = [
    { count: 7, dist: 0.52, rx: 0.54, ry: 0.44, angleOffset: 0.1, c1: palette.mid, c2: palette.rim },
    { count: 6, dist: 0.38, rx: 0.46, ry: 0.37, angleOffset: 0.6, c1: palette.deep, c2: palette.light },
    { count: 5, dist: 0.25, rx: 0.37, ry: 0.3, angleOffset: 1.15, c1: palette.core, c2: palette.mid },
    { count: 5, dist: 0.14, rx: 0.27, ry: 0.22, angleOffset: 0.35, c1: palette.core, c2: palette.light },
    { count: 4, dist: 0.06, rx: 0.16, ry: 0.13, angleOffset: 0.9, c1: palette.core, c2: palette.rim },
  ];

  rings.forEach((ring, rIdx) => {
    for (let i = 0; i < ring.count; i++) {
      const a = (i / ring.count) * Math.PI * 2 + ring.angleOffset + rIdx * 0.23;
      ctx.save();
      ctx.rotate(a);
      ctx.translate(radius * ring.dist, 0);

      const pw = radius * ring.rx;
      const ph = radius * ring.ry;

      const grad = ctx.createLinearGradient(-pw * 0.7, 0, pw * 0.85, 0);
      grad.addColorStop(0, ring.c1);
      grad.addColorStop(0.68, ring.c2);
      grad.addColorStop(1, palette.rim);

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(42, 8, 16, 0.24)';
      ctx.shadowBlur = 7 - rIdx;
      ctx.shadowOffsetX = -2;
      ctx.shadowOffsetY = 2;

      // Sculpted heart-like rose petal contour
      ctx.beginPath();
      ctx.moveTo(-pw * 0.55, 0);
      ctx.bezierCurveTo(-pw * 0.4, -ph * 1.05, pw * 0.55, -ph * 0.98, pw * 0.78, -ph * 0.14);
      ctx.quadraticCurveTo(pw * 0.88, 0, pw * 0.78, ph * 0.14);
      ctx.bezierCurveTo(pw * 0.55, ph * 0.98, -pw * 0.4, ph * 1.05, -pw * 0.55, 0);
      ctx.closePath();
      ctx.fill();

      // Delicate curled sunlit rim highlight
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(255, 245, 236, 0.32)';
      ctx.lineWidth = Math.max(0.8, radius * 0.015);
      ctx.beginPath();
      ctx.moveTo(pw * 0.18, -ph * 0.78);
      ctx.quadraticCurveTo(pw * 0.85, 0, pw * 0.18, ph * 0.78);
      ctx.stroke();

      ctx.restore();
    }
  });

  // Velvet spiral heart center
  const centerGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius * 0.15);
  centerGrad.addColorStop(0, palette.core);
  centerGrad.addColorStop(1, palette.deep);
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Paints an antique sage/emerald leaf with metallic champagne-gold veins */
function paintGoldVeinedLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  tone: 'sage' | 'gold' = 'sage'
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const grad = ctx.createLinearGradient(0, -length * 0.25, length, length * 0.25);
  if (tone === 'gold') {
    grad.addColorStop(0, '#99742d');
    grad.addColorStop(0.5, '#d8b468');
    grad.addColorStop(1, '#f3dfa8');
  } else {
    grad.addColorStop(0, '#2a4236');
    grad.addColorStop(0.55, '#4c6d59');
    grad.addColorStop(1, '#7a967e');
  }

  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(34, 14, 18, 0.2)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(length * 0.28, -length * 0.36, length * 0.75, -length * 0.26, length, 0);
  ctx.bezierCurveTo(length * 0.75, length * 0.26, length * 0.28, length * 0.36, 0, 0);
  ctx.closePath();
  ctx.fill();

  // Central gold-tinted vein
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = tone === 'gold' ? 'rgba(255,248,225,0.65)' : 'rgba(232,207,160,0.45)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(length * 0.88, 0);
  ctx.stroke();

  ctx.restore();
}

const WINE_ROSE = {
  core: '#350914',
  deep: '#5c1424',
  mid: '#7c2235',
  light: '#a84459',
  rim: '#d68a98',
};

const BLUSH_ROSE = {
  core: '#9c4355',
  deep: '#c46c7d',
  mid: '#df9aa6',
  light: '#f1c7ce',
  rim: '#fdf1f2',
};

const IVORY_ROSE = {
  core: '#b98f61',
  deep: '#d6b48c',
  mid: '#ebd5b8',
  light: '#f7ead7',
  rim: '#fffaf3',
};

function bakeSingleRose(palette: typeof WINE_ROSE, blurPx = 0): string {
  const size = 280;
  const [canvas, ctx] = makeCanvas(size, size);

  if (blurPx > 0 && 'filter' in ctx) {
    ctx.filter = `blur(${blurPx}px)`;
  }

  paintGoldVeinedLeaf(ctx, 140, 140, 118, -2.5, 'sage');
  paintGoldVeinedLeaf(ctx, 140, 140, 110, 0.55, 'sage');
  paintGoldVeinedLeaf(ctx, 140, 140, 96, -0.75, 'gold');
  paintRoseBloom(ctx, 140, 140, 84, palette, 0.4);

  return canvas.toDataURL('image/png');
}

function bakeRoseCornerCluster(orientation: 'topRight' | 'bottomLeft'): string {
  const size = 360;
  const [canvas, ctx] = makeCanvas(size, size);

  ctx.save();
  if (orientation === 'bottomLeft') {
    ctx.translate(size, size);
    ctx.rotate(Math.PI);
  }

  // Lush foliage fan sweeping from top-right corner
  paintGoldVeinedLeaf(ctx, 270, 75, 145, 2.75, 'sage');
  paintGoldVeinedLeaf(ctx, 290, 95, 138, 2.25, 'sage');
  paintGoldVeinedLeaf(ctx, 255, 65, 130, 3.05, 'gold');
  paintGoldVeinedLeaf(ctx, 305, 130, 128, 1.78, 'sage');
  paintGoldVeinedLeaf(ctx, 230, 52, 108, 2.55, 'gold');

  // Tiny champagne pearls / buds
  const buds = [
    [138, 62, 6],
    [164, 96, 5],
    [282, 224, 6],
    [244, 188, 5],
  ];
  buds.forEach(([bx, by, br]) => {
    const g = ctx.createRadialGradient(bx - 1, by - 1, 1, bx, by, br);
    g.addColorStop(0, '#fff7e4');
    g.addColorStop(0.6, '#d9b56a');
    g.addColorStop(1, '#9c752b');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3 sculpted layered roses in triangle cluster
  paintRoseBloom(ctx, 198, 72, 54, BLUSH_ROSE, 0.5);
  paintRoseBloom(ctx, 294, 162, 50, IVORY_ROSE, 1.3);
  paintRoseBloom(ctx, 272, 82, 74, WINE_ROSE, -0.35);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

/** Paints a plump fluffy Indian marigold (genda phool) floret */
function paintMarigoldFloret(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  variant: 'saffron' | 'orange' | 'yellow'
): void {
  const colors =
    variant === 'orange'
      ? ['#9a3412', '#ea580c', '#fb923c', '#fed7aa']
      : variant === 'yellow'
        ? ['#b45309', '#f59e0b', '#fbbf24', '#fef08a']
        : ['#b45309', '#ea580c', '#f59e0b', '#fde68a'];

  ctx.save();
  ctx.translate(cx, cy);

  // Soft shadow
  ctx.fillStyle = 'rgba(72, 24, 10, 0.2)';
  ctx.beginPath();
  ctx.arc(2, 3, r * 1.02, 0, Math.PI * 2);
  ctx.fill();

  const layers = [
    { count: 14, dist: 0.62, pr: 0.36, color: colors[0] },
    { count: 12, dist: 0.48, pr: 0.34, color: colors[1] },
    { count: 10, dist: 0.3, pr: 0.3, color: colors[2] },
    { count: 6, dist: 0.13, pr: 0.22, color: colors[3] },
  ];

  layers.forEach((l, li) => {
    ctx.fillStyle = l.color;
    for (let i = 0; i < l.count; i++) {
      const a = (i / l.count) * Math.PI * 2 + li * 0.3;
      const px = Math.cos(a) * r * l.dist;
      const py = Math.sin(a) * r * l.dist;
      ctx.beginPath();
      ctx.arc(px, py, r * l.pr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.restore();
}

function bakeMarigoldStrand(bloomCount: number): string {
  const w = 96;
  const h = bloomCount * 42 + 64;
  const [canvas, ctx] = makeCanvas(w, h);
  const cx = w / 2;

  // Gold silk thread
  ctx.strokeStyle = '#c9a252';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h - 22);
  ctx.stroke();

  // Mango leaves near the top
  paintGoldVeinedLeaf(ctx, cx, 14, 34, 2.35, 'sage');
  paintGoldVeinedLeaf(ctx, cx, 14, 34, 0.78, 'sage');

  const pattern: Array<'saffron' | 'orange' | 'yellow'> = ['orange', 'saffron', 'yellow', 'saffron'];
  for (let i = 0; i < bloomCount; i++) {
    const y = 30 + i * 40;
    // Tiny white jasmine bud between marigolds
    if (i > 0) {
      ctx.fillStyle = '#fff9f0';
      ctx.beginPath();
      ctx.arc(cx, y - 20, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5c7c63';
      ctx.beginPath();
      ctx.arc(cx, y - 25, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    paintMarigoldFloret(ctx, cx, y, 16.5, pattern[i % pattern.length]);
  }

  // Ornate tiny antique gold bell + wine silk tassel at bottom
  const bellY = 30 + bloomCount * 40 - 12;
  const bellGrad = ctx.createLinearGradient(cx - 10, bellY, cx + 10, bellY + 18);
  bellGrad.addColorStop(0, '#96722d');
  bellGrad.addColorStop(0.5, '#f4dfae');
  bellGrad.addColorStop(1, '#96722d');
  ctx.fillStyle = bellGrad;
  ctx.beginPath();
  ctx.moveTo(cx, bellY);
  ctx.quadraticCurveTo(cx + 10, bellY + 6, cx + 11, bellY + 16);
  ctx.lineTo(cx - 11, bellY + 16);
  ctx.quadraticCurveTo(cx - 10, bellY + 6, cx, bellY);
  ctx.closePath();
  ctx.fill();

  // Wine tassel fringe
  ctx.fillStyle = '#6e1f2f';
  ctx.beginPath();
  ctx.moveTo(cx - 5, bellY + 16);
  ctx.lineTo(cx + 5, bellY + 16);
  ctx.lineTo(cx + 8, bellY + 34);
  ctx.lineTo(cx - 8, bellY + 34);
  ctx.closePath();
  ctx.fill();

  return canvas.toDataURL('image/png');
}

/**
 * Renders a reverent, finely sculpted antique-gold Lord Ganesha medallion
 * via inline SVG rasterized once onto a high-DPI canvas.
 */
async function bakeGaneshGold(): Promise<string> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
    <defs>
      <linearGradient id="gFoil" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f7e7ba"/>
        <stop offset="32%" stop-color="#d4af53"/>
        <stop offset="58%" stop-color="#9e762a"/>
        <stop offset="82%" stop-color="#ebd191"/>
        <stop offset="100%" stop-color="#8b6520"/>
      </linearGradient>
      <radialGradient id="gHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f7e7ba" stop-opacity="0.28"/>
        <stop offset="70%" stop-color="#d4af53" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#d4af53" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Soft sacred halo -->
    <circle cx="120" cy="120" r="108" fill="url(#gHalo)"/>
    <!-- Outer double filigree ring -->
    <circle cx="120" cy="120" r="102" fill="none" stroke="url(#gFoil)" stroke-width="1.6" stroke-dasharray="3 4"/>
    <circle cx="120" cy="120" r="94" fill="none" stroke="url(#gFoil)" stroke-width="1.2"/>
    <!-- 12 delicate lotus petals around ring -->
    <g fill="none" stroke="url(#gFoil)" stroke-width="1.2" opacity="0.72">
      ${Array.from({ length: 12 })
        .map(
          (_, i) =>
            `<path d="M120 18 Q128 28 120 36 Q112 28 120 18 Z" transform="rotate(${i * 30} 120 120)"/>`
        )
        .join('')}
    </g>
    <!-- Stylized calligraphic Lord Ganesha form (Mukut, Tilak, Ears, Trunk, Seated Base) -->
    <g fill="none" stroke="url(#gFoil)" stroke-linecap="round" stroke-linejoin="round">
      <!-- Three-tier Mukut (Crown) -->
      <path d="M104 68 C108 57, 132 57, 136 68" stroke-width="3.2"/>
      <path d="M110 58 C114 48, 126 48, 130 58" stroke-width="2.8"/>
      <path d="M116 48 C118 40, 122 40, 124 48" stroke-width="2.6"/>
      <circle cx="120" cy="39" r="2.6" fill="url(#gFoil)"/>
      <!-- Auspicious Tilak -->
      <path d="M115 74 Q120 77 125 74" stroke-width="2.2"/>
      <path d="M116 79 Q120 82 124 79" stroke-width="2"/>
      <circle cx="120" cy="84" r="1.9" fill="url(#gFoil)"/>
      <!-- Left & Right Graceful Ears -->
      <path d="M98 80 C76 74, 68 94, 78 112 C84 122, 95 119, 98 110" stroke-width="3.2"/>
      <path d="M95 88 C82 86, 78 98, 85 107" stroke-width="1.7" opacity="0.8"/>
      <path d="M142 80 C164 74, 172 94, 162 112 C156 122, 145 119, 142 110" stroke-width="3.2"/>
      <path d="M145 88 C158 86, 162 98, 155 107" stroke-width="1.7" opacity="0.8"/>
      <!-- Serene Eyes -->
      <path d="M104 91 Q109 87 113 91" stroke-width="2.1"/>
      <path d="M127 91 Q131 87 136 91" stroke-width="2.1"/>
      <!-- Forehead arch sweeping into left-curving auspicious trunk -->
      <path d="M99 81 C100 68, 140 68, 141 81 C142 96, 132 103, 126 112 C119 123, 122 138, 111 142 C102 145, 95 137, 100 130 C103 126, 109 128, 109 133" stroke-width="4.2"/>
      <!-- Graceful Tusk accents -->
      <path d="M105 107 Q108 113 113 113" stroke-width="2.2"/>
      <path d="M135 107 Q133 111 130 112" stroke-width="2"/>
      <!-- Ornamental Shoulder & Seated Belly Curve -->
      <path d="M92 126 C81 138, 86 159, 104 166 C118 171, 134 169, 145 161 C156 153, 157 135, 146 125" stroke-width="3.4"/>
      <!-- Sacred Janeu (diagonal curve) -->
      <path d="M100 132 Q122 145 142 154" stroke-width="1.6" opacity="0.8"/>
      <!-- Seated Lotus Base -->
      <path d="M84 176 Q120 189 156 176" stroke-width="2.8"/>
      <path d="M96 184 Q120 193 144 184" stroke-width="1.8" opacity="0.85"/>
    </g>
  </svg>`;

  return rasterizeSvg(svg, 240, 240);
}

function rasterizeSvg(svgMarkup: string, w: number, h: number): Promise<string> {
  return new Promise((resolve) => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const [canvas, ctx] = makeCanvas(w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('');
    };
    img.src = url;
  });
}

/** Helper: draw soft warm bokeh orbs */
function paintBokehOrbs(
  ctx: CanvasRenderingContext2D,
  orbs: Array<[number, number, number, string]>
): void {
  orbs.forEach(([x, y, r, color]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(255, 244, 224, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** Helper: paint an ornate Mughal/Rajasthani scalloped palace arch frame inside canvas */
function paintPalaceArchSilhouette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fill: string,
  strokeGold: string
): void {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  // Cut-out inner cusped arch (counter-clockwise)
  const margin = w * 0.11;
  const topY = h * 0.08;
  const springY = h * 0.34;
  ctx.moveTo(margin, h);
  ctx.lineTo(w - margin, h);
  ctx.lineTo(w - margin, springY);
  ctx.bezierCurveTo(w - margin, topY + 60, w * 0.65, topY + 26, w * 0.5, topY);
  ctx.bezierCurveTo(w * 0.35, topY + 26, margin, topY + 60, margin, springY);
  ctx.closePath();
  ctx.fill('evenodd');

  // Fine gold arch inlay line
  ctx.strokeStyle = strokeGold;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(margin + 10, h);
  ctx.lineTo(margin + 10, springY);
  ctx.bezierCurveTo(margin + 10, topY + 66, w * 0.36, topY + 34, w * 0.5, topY + 12);
  ctx.bezierCurveTo(w * 0.64, topY + 34, w - margin - 10, topY + 66, w - margin - 10, springY);
  ctx.lineTo(w - margin - 10, h);
  ctx.stroke();
  ctx.restore();
}

/** Helper: paint affectionate Indian couple silhouette in royal attire (editorial gouache style) */
function paintCoupleSilhouette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  groomTone: string,
  brideTone: string,
  goldHighlight: string
): void {
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(scale, scale);

  // Groom (left, slightly taller, royal sherwani + safa turban)
  ctx.fillStyle = groomTone;
  // Torso & Sherwani coat
  ctx.beginPath();
  ctx.moveTo(-64, 0);
  ctx.lineTo(-54, -142);
  ctx.quadraticCurveTo(-34, -158, -14, -146);
  ctx.lineTo(-4, -95);
  ctx.lineTo(2, 0);
  ctx.closePath();
  ctx.fill();

  // Groom neck & head facing slightly right toward bride
  ctx.beginPath();
  ctx.ellipse(-32, -172, 16, 20, 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Safa (royal turban) with kalgi feather
  ctx.fillStyle = '#8b2639';
  ctx.beginPath();
  ctx.ellipse(-34, -187, 21, 13, -0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = goldHighlight;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-48, -187);
  ctx.quadraticCurveTo(-34, -193, -18, -184);
  ctx.stroke();
  // Kalgi ornament
  ctx.beginPath();
  ctx.moveTo(-25, -196);
  ctx.quadraticCurveTo(-18, -214, -12, -206);
  ctx.stroke();

  // Gold embroidered sherwani neckline & shawl
  ctx.strokeStyle = goldHighlight;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-42, -150);
  ctx.lineTo(-24, -150);
  ctx.moveTo(-33, -150);
  ctx.lineTo(-30, -82);
  ctx.stroke();

  // Bride (right, leaning gently toward groom, flowing lehenga & odhani veil)
  const brideGrad = ctx.createLinearGradient(0, -165, 65, 0);
  brideGrad.addColorStop(0, brideTone);
  brideGrad.addColorStop(0.65, '#8e2d41');
  brideGrad.addColorStop(1, '#581523');
  ctx.fillStyle = brideGrad;

  // Flowing Lehenga flare
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.quadraticCurveTo(6, -80, 14, -128);
  ctx.quadraticCurveTo(28, -138, 42, -126);
  ctx.quadraticCurveTo(62, -74, 82, 0);
  ctx.closePath();
  ctx.fill();

  // Bride head & bun with gajra flowers
  ctx.fillStyle = '#3b151e';
  ctx.beginPath();
  ctx.ellipse(26, -154, 14.5, 18, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(41, -152, 8.5, 0, Math.PI * 2);
  ctx.fill();
  // Jasmine gajra arc
  ctx.strokeStyle = '#fff5e4';
  ctx.lineWidth = 3;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.arc(41, -152, 9.5, -1.2, 1.3);
  ctx.stroke();
  ctx.setLineDash([]);

  // Translucent champagne-gold odhani veil flowing from her head down her back
  const veilGrad = ctx.createLinearGradient(15, -170, 92, -20);
  veilGrad.addColorStop(0, 'rgba(244, 223, 174, 0.56)');
  veilGrad.addColorStop(0.6, 'rgba(225, 178, 152, 0.34)');
  veilGrad.addColorStop(1, 'rgba(244, 223, 174, 0.08)');
  ctx.fillStyle = veilGrad;
  ctx.beginPath();
  ctx.moveTo(18, -170);
  ctx.quadraticCurveTo(54, -168, 74, -108);
  ctx.quadraticCurveTo(96, -54, 98, 0);
  ctx.lineTo(44, 0);
  ctx.quadraticCurveTo(44, -68, 34, -128);
  ctx.closePath();
  ctx.fill();

  // Gold gota patti border along veil & lehenga hem
  ctx.strokeStyle = goldHighlight;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(18, -170);
  ctx.quadraticCurveTo(54, -168, 74, -108);
  ctx.quadraticCurveTo(95, -54, 97, 0);
  ctx.stroke();

  // Delicate joined hands glow between them
  paintBokehOrbs(ctx, [[-3, -96, 22, 'rgba(248, 224, 168, 0.42)']]);

  ctx.restore();
}

/** Story 1 + Hero Arch Portrait: Golden Hour Palace Arch */
function bakeStory1(): string {
  const w = 600;
  const h = 800;
  const [canvas, ctx] = makeCanvas(w, h);

  // Warm sunset golden-blush sky backdrop
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#f3d4b8');
  sky.addColorStop(0.35, '#f6dfd0');
  sky.addColorStop(0.68, '#d99e8e');
  sky.addColorStop(1, '#5d1c2b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Sunlit glowing halo behind the couple
  const sun = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.45, 310);
  sun.addColorStop(0, 'rgba(255, 248, 228, 0.96)');
  sun.addColorStop(0.38, 'rgba(246, 211, 152, 0.65)');
  sun.addColorStop(0.75, 'rgba(218, 146, 134, 0.25)');
  sun.addColorStop(1, 'rgba(110, 31, 47, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  // Distant heritage palace domes & minarets in golden mist
  ctx.fillStyle = 'rgba(164, 96, 98, 0.24)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.lineTo(130, h * 0.72);
  ctx.quadraticCurveTo(175, h * 0.61, 220, h * 0.72);
  ctx.lineTo(370, h * 0.72);
  ctx.quadraticCurveTo(435, h * 0.58, 500, h * 0.72);
  ctx.lineTo(w, h * 0.72);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Warm reflection terrace floor
  const floor = ctx.createLinearGradient(0, h * 0.74, 0, h);
  floor.addColorStop(0, '#7c2b3c');
  floor.addColorStop(1, '#3d0e19');
  ctx.fillStyle = floor;
  ctx.fillRect(0, h * 0.74, w, h * 0.26);

  // Couple centered inside the golden hour glow
  paintCoupleSilhouette(ctx, w * 0.49, h * 0.82, 1.52, '#4a1220', '#7e2438', '#f0d494');

  // Floating sunlit bokeh dust & petals
  paintBokehOrbs(ctx, [
    [165, 290, 38, 'rgba(255, 244, 212, 0.48)'],
    [435, 250, 44, 'rgba(255, 236, 198, 0.44)'],
    [220, 470, 26, 'rgba(255, 232, 182, 0.35)'],
    [410, 510, 34, 'rgba(255, 222, 178, 0.32)'],
    [300, 190, 52, 'rgba(255, 248, 225, 0.36)'],
  ]);

  // Framing sandstone palace arch with fine gold inlay
  paintPalaceArchSilhouette(ctx, w, h, 'rgba(92, 27, 42, 0.34)', 'rgba(244, 223, 174, 0.65)');

  return canvas.toDataURL('image/jpeg', 0.88);
}

/** Story 2: Heritage Garden & Pink Bougainvillea Walk */
function bakeStory2(): string {
  const w = 600;
  const h = 800;
  const [canvas, ctx] = makeCanvas(w, h);

  // Airy sunlit ivory-apricot afternoon courtyard
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#fbf1e4');
  bg.addColorStop(0.45, '#f4dbd2');
  bg.addColorStop(1, '#d7a49b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Diagonal warm sunbeams
  ctx.save();
  ctx.fillStyle = 'rgba(255, 250, 236, 0.32)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(240, 0);
  ctx.lineTo(540, h);
  ctx.lineTo(240, h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Heritage colonnade arches in soft sandstone
  ctx.fillStyle = 'rgba(184, 134, 118, 0.25)';
  [90, 300, 510].forEach((x) => {
    ctx.fillRect(x - 16, 180, 32, 460);
  });
  ctx.strokeStyle = 'rgba(166, 118, 86, 0.38)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(195, 240, 90, Math.PI, 0);
  ctx.arc(405, 240, 90, Math.PI, 0);
  ctx.stroke();

  // Lush cascading bougainvillea / rose clusters from top corners
  paintRoseBloom(ctx, 76, 84, 58, BLUSH_ROSE, 0.2);
  paintRoseBloom(ctx, 168, 62, 44, WINE_ROSE, 1.1);
  paintRoseBloom(ctx, 518, 96, 62, BLUSH_ROSE, -0.5);
  paintRoseBloom(ctx, 434, 54, 42, IVORY_ROSE, 0.7);
  paintGoldVeinedLeaf(ctx, 110, 120, 92, 1.1, 'sage');
  paintGoldVeinedLeaf(ctx, 490, 124, 96, 2.2, 'sage');

  // Courtyard marble walkway
  const walk = ctx.createLinearGradient(0, h * 0.72, 0, h);
  walk.addColorStop(0, '#e5cabf');
  walk.addColorStop(1, '#b7857e');
  ctx.fillStyle = walk;
  ctx.fillRect(0, h * 0.72, w, h * 0.28);

  // Couple strolling together in ivory & blush tones
  paintCoupleSilhouette(ctx, w * 0.5, h * 0.83, 1.45, '#5b2230', '#9f4055', '#f7e5be');

  paintBokehOrbs(ctx, [
    [130, 360, 42, 'rgba(255, 247, 232, 0.45)'],
    [460, 340, 46, 'rgba(255, 243, 224, 0.42)'],
    [310, 260, 62, 'rgba(255, 250, 238, 0.36)'],
  ]);

  return canvas.toDataURL('image/jpeg', 0.88);
}

/** Story 3: Twilight Pavilion Glowing with Brass Diyas & Fairy Lights */
function bakeStory3(): string {
  const w = 600;
  const h = 800;
  const [canvas, ctx] = makeCanvas(w, h);

  // Deep royal wine-twilight atmosphere
  const dusk = ctx.createLinearGradient(0, 0, 0, h);
  dusk.addColorStop(0, '#2a0b14');
  dusk.addColorStop(0.42, '#5a1828');
  dusk.addColorStop(0.76, '#872c3c');
  dusk.addColorStop(1, '#360d18');
  ctx.fillStyle = dusk;
  ctx.fillRect(0, 0, w, h);

  // Hanging curtain of warm golden fairy lights
  for (let col = 0; col < 11; col++) {
    const x = 50 + col * 50;
    ctx.strokeStyle = 'rgba(244, 223, 174, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 340 + (col % 3) * 45);
    ctx.stroke();

    for (let row = 0; row < 5; row++) {
      const y = 44 + row * 68 + (col % 2) * 22;
      paintBokehOrbs(ctx, [[x, y, 22 + (row % 2) * 8, 'rgba(255, 219, 138, 0.42)']]);
      ctx.fillStyle = '#fff5d6';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Warm central glow behind couple
  paintBokehOrbs(ctx, [
    [w * 0.5, h * 0.54, 210, 'rgba(244, 189, 108, 0.36)'],
    [w * 0.5, h * 0.58, 120, 'rgba(255, 232, 172, 0.4)'],
  ]);

  // Couple bathed in candlelight
  paintCoupleSilhouette(ctx, w * 0.5, h * 0.84, 1.5, '#2b0912', '#6e1f2f', '#f6dc9c');

  // Row of glowing earthen diyas in the foreground
  [105, 190, 298, 410, 495].forEach((dx, idx) => {
    const dy = 716 + (idx % 2) * 14;
    paintBokehOrbs(ctx, [[dx, dy - 16, 48, 'rgba(255, 198, 92, 0.45)']]);
    // Flame
    ctx.fillStyle = '#fff3b8';
    ctx.beginPath();
    ctx.moveTo(dx, dy - 26);
    ctx.quadraticCurveTo(dx + 8, dy - 12, dx, dy - 4);
    ctx.quadraticCurveTo(dx - 8, dy - 12, dx, dy - 26);
    ctx.fill();
    // Brass diya bowl
    ctx.fillStyle = '#c89b46';
    ctx.beginPath();
    ctx.ellipse(dx, dy, 18, 7, 0, 0, Math.PI);
    ctx.fill();
  });

  return canvas.toDataURL('image/jpeg', 0.88);
}

/** Story 4: Intimate Bridal Mehendi Hands & Champagne Gold Bangles */
function bakeStory4(): string {
  const w = 600;
  const h = 800;
  const [canvas, ctx] = makeCanvas(w, h);

  // Rich wine velvet & champagne silk drapery backdrop
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.48, 30, w * 0.5, h * 0.5, 520);
  bg.addColorStop(0, '#99394b');
  bg.addColorStop(0.5, '#641b2a');
  bg.addColorStop(1, '#310b14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Diagonal champagne silk fold
  const silk = ctx.createLinearGradient(0, h * 0.25, w, h * 0.8);
  silk.addColorStop(0, 'rgba(245, 224, 182, 0)');
  silk.addColorStop(0.5, 'rgba(245, 224, 182, 0.22)');
  silk.addColorStop(1, 'rgba(245, 224, 182, 0)');
  ctx.fillStyle = silk;
  ctx.fillRect(0, 0, w, h);

  // Ornamental sacred mandala halo behind clasped hands
  ctx.save();
  ctx.translate(w * 0.5, h * 0.49);
  ctx.strokeStyle = 'rgba(244, 223, 174, 0.34)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 178, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 152, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 24; i++) {
    ctx.save();
    ctx.rotate((i / 24) * Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(0, -152);
    ctx.quadraticCurveTo(14, -172, 0, -196);
    ctx.quadraticCurveTo(-14, -172, 0, -152);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Groom's sleeve & warm hand entering from left
  ctx.save();
  ctx.fillStyle = '#47101c';
  ctx.beginPath();
  ctx.moveTo(0, 440);
  ctx.lineTo(188, 375);
  ctx.lineTo(222, 470);
  ctx.lineTo(0, 565);
  ctx.closePath();
  ctx.fill();
  // Gold embroidered cuff
  ctx.strokeStyle = '#e7c67e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(176, 380);
  ctx.lineTo(208, 474);
  ctx.stroke();

  // Clasped hands stylized artistic contour
  const skinGrad = ctx.createLinearGradient(170, 360, 440, 450);
  skinGrad.addColorStop(0, '#d8a684');
  skinGrad.addColorStop(0.5, '#e8bc9d');
  skinGrad.addColorStop(1, '#c99272');
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.moveTo(186, 392);
  ctx.bezierCurveTo(250, 355, 345, 360, 412, 392);
  ctx.bezierCurveTo(432, 405, 425, 446, 392, 456);
  ctx.bezierCurveTo(328, 478, 250, 478, 204, 452);
  ctx.closePath();
  ctx.fill();

  // Delicate henna mehendi lotus & vine filigree on bride's hand
  ctx.strokeStyle = '#5c1f1a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(345, 418, 16, 0, Math.PI * 2);
  ctx.stroke();
  for (let p = 0; p < 8; p++) {
    const a = (p / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(345 + Math.cos(a) * 19, 418 + Math.sin(a) * 19, 4.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Bride's bangles (gold & wine chooda stack) on right wrist
  const bangleColors = ['#f2d694', '#8b1e34', '#d4af37', '#a82740', '#f6e1ae', '#6e1f2f', '#d4af37'];
  bangleColors.forEach((col, i) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(416 + i * 11, 362);
    ctx.quadraticCurveTo(405 + i * 11, 416, 422 + i * 11, 474);
    ctx.stroke();
  });

  // Bride's embroidered wine & gold sleeve on far right
  ctx.fillStyle = '#7a1f32';
  ctx.beginPath();
  ctx.moveTo(494, 358);
  ctx.lineTo(w, 326);
  ctx.lineTo(w, 515);
  ctx.lineTo(500, 478);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Soft corner rose & warm candlelight bokeh
  paintRoseBloom(ctx, 110, 690, 62, BLUSH_ROSE, 0.4);
  paintRoseBloom(ctx, 495, 130, 56, IVORY_ROSE, -0.4);
  paintBokehOrbs(ctx, [
    [300, 412, 85, 'rgba(255, 224, 152, 0.3)'],
    [155, 220, 44, 'rgba(255, 228, 170, 0.28)'],
    [455, 620, 52, 'rgba(255, 214, 150, 0.25)'],
  ]);

  return canvas.toDataURL('image/jpeg', 0.88);
}

/** Bakes a softly pre-blurred version of any image URL so we NEVER animate live blur */
export function bakeSoftBlurredImage(src: string, blurPx = 7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = 480;
      const h = 640;
      const [canvas, ctx] = makeCanvas(w, h);
      if ('filter' in ctx) {
        ctx.filter = `blur(${blurPx}px) saturate(1.06)`;
      }
      // Draw slightly oversized to avoid blurred transparent edges
      ctx.drawImage(img, -24, -24, w + 48, h + 48);
      ctx.filter = 'none';
      // Warm champagne-ivory veil for crisp typography contrast
      const veil = ctx.createLinearGradient(0, 0, 0, h);
      veil.addColorStop(0, 'rgba(250, 244, 236, 0.72)');
      veil.addColorStop(0.5, 'rgba(250, 242, 234, 0.62)');
      veil.addColorStop(1, 'rgba(246, 231, 226, 0.78)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/** Paints the 4 bespoke blurred-painterly Wedding Festivities scene backdrops */
function bakeCeremonyScene(kind: 'tilak' | 'haldi' | 'ghritdhari' | 'baraat'): string {
  const w = 520;
  const h = 680;
  const [canvas, ctx] = makeCanvas(w, h);

  if (kind === 'tilak') {
    // Warm sunlit ivory-gold heritage veranda + brass Tilak thali + glowing diyas + toran
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#f8ecd9');
    bg.addColorStop(0.5, '#f2d9ba');
    bg.addColorStop(1, '#c8915c');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle archway
    paintPalaceArchSilhouette(ctx, w, h, 'rgba(134, 62, 42, 0.14)', 'rgba(201, 162, 82, 0.45)');

    // Hanging marigold & mango leaf toran swag across top
    for (let i = 0; i < 9; i++) {
      const x = 44 + i * 54;
      const sag = Math.sin((i / 8) * Math.PI) * 58;
      paintMarigoldFloret(ctx, x, 42 + sag, 18, i % 2 === 0 ? 'orange' : 'saffron');
    }

    // Ornate brass Tilak thali in soft painter's perspective
    const thaliGrad = ctx.createRadialGradient(w * 0.5, h * 0.65, 16, w * 0.5, h * 0.65, 165);
    thaliGrad.addColorStop(0, '#fce9b3');
    thaliGrad.addColorStop(0.55, '#d4a243');
    thaliGrad.addColorStop(1, '#8c5e18');
    ctx.fillStyle = thaliGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.68, 156, 62, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kumkum & haldi bowls + glowing diya
    ctx.fillStyle = '#a82222';
    ctx.beginPath();
    ctx.ellipse(w * 0.39, h * 0.66, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8a317';
    ctx.beginPath();
    ctx.ellipse(w * 0.61, h * 0.66, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    paintBokehOrbs(ctx, [
      [w * 0.5, h * 0.59, 88, 'rgba(255, 224, 132, 0.65)'],
      [120, 260, 72, 'rgba(255, 240, 200, 0.45)'],
      [410, 280, 68, 'rgba(255, 232, 186, 0.42)'],
    ]);
  } else if (kind === 'haldi') {
    // Lush sunlit marigold, turmeric & bamboo mandap canopy
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#fef3c7');
    bg.addColorStop(0.52, '#fde088');
    bg.addColorStop(1, '#d97706');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Bamboo mandap pillars & banana leaves
    ctx.fillStyle = 'rgba(74, 118, 62, 0.34)';
    ctx.fillRect(36, 0, 26, h);
    ctx.fillRect(w - 62, 0, 26, h);
    paintGoldVeinedLeaf(ctx, 56, 150, 150, 0.55, 'sage');
    paintGoldVeinedLeaf(ctx, w - 56, 150, 150, 2.6, 'sage');

    // Cascading garlands of lush marigolds across upper half
    for (let col = 0; col < 7; col++) {
      const gx = 70 + col * 64;
      const count = col % 2 === 0 ? 5 : 3;
      for (let r = 0; r < count; r++) {
        paintMarigoldFloret(ctx, gx, 34 + r * 38, 19, (col + r) % 3 === 0 ? 'orange' : 'yellow');
      }
    }

    // Brass Haldi Kalash & turmeric urli at bottom
    const urli = ctx.createRadialGradient(w * 0.5, h * 0.72, 15, w * 0.5, h * 0.72, 145);
    urli.addColorStop(0, '#fef08a');
    urli.addColorStop(0.6, '#d97706');
    urli.addColorStop(1, '#78350f');
    ctx.fillStyle = urli;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.74, 138, 56, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scattered rose & marigold petals
    paintBokehOrbs(ctx, [
      [w * 0.5, h * 0.42, 175, 'rgba(255, 250, 222, 0.55)'],
      [150, 480, 56, 'rgba(251, 191, 36, 0.42)'],
      [380, 460, 62, 'rgba(245, 158, 11, 0.38)'],
    ]);
  } else if (kind === 'ghritdhari') {
    // Auspicious sacred brass kalash, mango leaves, coconut, crimson silk & ghee lamp
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#faece4');
    bg.addColorStop(0.5, '#efc4b2');
    bg.addColorStop(1, '#8c292b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Sacred radiant chakra halo behind kalash
    paintBokehOrbs(ctx, [
      [w * 0.5, h * 0.48, 210, 'rgba(255, 232, 172, 0.65)'],
      [w * 0.5, h * 0.48, 110, 'rgba(255, 248, 224, 0.72)'],
    ]);

    // Five mango leaves fanning out from kalash neck
    [-0.95, -0.45, 0, 0.45, 0.95].forEach((ang) => {
      paintGoldVeinedLeaf(ctx, w * 0.5, h * 0.55, 105, -Math.PI / 2 + ang, 'sage');
    });

    // Sacred coconut resting atop kalash
    const coco = ctx.createRadialGradient(w * 0.48, h * 0.48, 6, w * 0.5, h * 0.5, 42);
    coco.addColorStop(0, '#9a5b32');
    coco.addColorStop(1, '#4c2612');
    ctx.fillStyle = coco;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.51, 34, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gleaming brass kalash vessel
    const kalash = ctx.createRadialGradient(w * 0.44, h * 0.62, 14, w * 0.5, h * 0.66, 98);
    kalash.addColorStop(0, '#fff2c4');
    kalash.addColorStop(0.45, '#d4a342');
    kalash.addColorStop(1, '#7c4d14');
    ctx.fillStyle = kalash;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.67, 76, 84, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red sacred mauli thread band
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - 48, h * 0.58);
    ctx.quadraticCurveTo(w * 0.5, h * 0.61, w * 0.5 + 48, h * 0.58);
    ctx.stroke();

    // Corner roses
    paintRoseBloom(ctx, 84, 590, 48, WINE_ROSE, 0.4);
    paintRoseBloom(ctx, 438, 598, 46, BLUSH_ROSE, -0.6);
  } else {
    // Royal Baraat Night: deep wine-indigo twilight, illuminated golden lanterns, chandeliers & palace glow
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1e0913');
    bg.addColorStop(0.42, '#4c1424');
    bg.addColorStop(0.75, '#6e1f2f');
    bg.addColorStop(1, '#2b0a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Starlight & festive golden sparkler bursts
    [
      [110, 120, 42],
      [410, 140, 52],
      [260, 88, 34],
    ].forEach(([sx, sy, sr]) => {
      paintBokehOrbs(ctx, [[sx, sy, sr * 1.6, 'rgba(255, 224, 142, 0.34)']]);
      ctx.strokeStyle = 'rgba(255, 232, 168, 0.55)';
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(sx + Math.cos(a) * 6, sy + Math.sin(a) * 6);
        ctx.lineTo(sx + Math.cos(a) * sr, sy + Math.sin(a) * sr);
        ctx.stroke();
      }
    });

    // Illuminated grand banquet hall palace silhouette in the distance
    ctx.fillStyle = 'rgba(244, 212, 144, 0.22)';
    ctx.beginPath();
    ctx.moveTo(60, h * 0.66);
    ctx.lineTo(60, h * 0.48);
    ctx.quadraticCurveTo(130, h * 0.38, 200, h * 0.48);
    ctx.quadraticCurveTo(260, h * 0.32, 320, h * 0.48);
    ctx.quadraticCurveTo(390, h * 0.38, 460, h * 0.48);
    ctx.lineTo(460, h * 0.66);
    ctx.closePath();
    ctx.fill();

    // Glowing procession chandeliers / Baraat street lanterns receding into perspective
    [
      [96, 360, 44],
      [424, 360, 44],
      [152, 465, 36],
      [368, 465, 36],
      [212, 550, 30],
      [308, 550, 30],
    ].forEach(([lx, ly, lr]) => {
      paintBokehOrbs(ctx, [[lx, ly, lr * 1.4, 'rgba(255, 214, 122, 0.48)']]);
      ctx.fillStyle = '#fff3c4';
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Golden festive avenue glow
    const road = ctx.createLinearGradient(0, h * 0.56, 0, h);
    road.addColorStop(0, 'rgba(244, 200, 120, 0.28)');
    road.addColorStop(1, 'rgba(42, 10, 19, 0.88)');
    ctx.fillStyle = road;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.58);
    ctx.lineTo(w * 0.65, h * 0.58);
    ctx.lineTo(w * 0.92, h);
    ctx.lineTo(w * 0.08, h);
    ctx.closePath();
    ctx.fill();
  }

  // Softly pre-blur the finished watercolor scene onto a final image so cards have dreamy depth with zero live blur cost
  const [finalCanvas, finalCtx] = makeCanvas(w, h);
  if ('filter' in finalCtx) {
    finalCtx.filter = 'blur(3.5px)';
  }
  finalCtx.drawImage(canvas, -10, -10, w + 20, h + 20);
  finalCtx.filter = 'none';

  return finalCanvas.toDataURL('image/jpeg', 0.84);
}

function preloadImageUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (!url) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().catch(() => undefined).finally(() => resolve());
      } else {
        resolve();
      }
    };
    img.onerror = () => resolve();
    img.src = url;
  });
}

let cachedPromise: Promise<BakedAssets> | null = null;

export function bakeAndPreloadAllAssets(
  onProgress?: (percent: number) => void
): Promise<BakedAssets> {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    onProgress?.(12);
    const ganeshGold = await bakeGaneshGold();
    onProgress?.(24);

    const roseWine = bakeSingleRose(WINE_ROSE, 0);
    const roseBlush = bakeSingleRose(BLUSH_ROSE, 0);
    const roseBlurredFore = bakeSingleRose(WINE_ROSE, 6);
    const roseBlurredBack = bakeSingleRose(BLUSH_ROSE, 4);
    const roseCornerTopRight = bakeRoseCornerCluster('topRight');
    const roseCornerBottomLeft = bakeRoseCornerCluster('bottomLeft');
    onProgress?.(46);

    const marigoldStrandLong = bakeMarigoldStrand(6);
    const marigoldStrandShort = bakeMarigoldStrand(4);
    onProgress?.(56);

    const story1 = bakeStory1();
    const story2 = bakeStory2();
    const story3 = bakeStory3();
    const story4 = bakeStory4();
    const heroArchBlurred = await bakeSoftBlurredImage(story1, 6);
    onProgress?.(74);

    const tilak = bakeCeremonyScene('tilak');
    const haldi = bakeCeremonyScene('haldi');
    const ghritdhari = bakeCeremonyScene('ghritdhari');
    const baraat = bakeCeremonyScene('baraat');
    onProgress?.(86);

    const assets: BakedAssets = {
      ganeshGold,
      roseWine,
      roseBlush,
      roseCornerTopRight,
      roseCornerBottomLeft,
      roseBlurredFore,
      roseBlurredBack,
      marigoldStrandLong,
      marigoldStrandShort,
      heroArchBlurred,
      stories: { story1, story2, story3, story4 },
      scenes: { tilak, haldi, ghritdhari, baraat },
    };

    // Wait for fonts & decoded bitmap readiness behind the loader
    const allUrls = [
      ganeshGold,
      roseWine,
      roseBlush,
      roseCornerTopRight,
      roseCornerBottomLeft,
      roseBlurredFore,
      roseBlurredBack,
      marigoldStrandLong,
      marigoldStrandShort,
      heroArchBlurred,
      story1,
      story2,
      story3,
      story4,
      tilak,
      haldi,
      ghritdhari,
      baraat,
    ];

    await Promise.all([
      ...allUrls.map(preloadImageUrl),
      document.fonts ? document.fonts.ready.catch(() => undefined) : Promise.resolve(),
    ]);

    onProgress?.(100);
    return assets;
  })();

  return cachedPromise;
}
