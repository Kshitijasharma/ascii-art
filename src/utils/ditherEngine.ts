/**
 * Real-time Glyph Dithering & Halftone Rasterizer Engine
 * Recreates the dynamic 3D symbol matrix visual effect
 */

import { GlyphItem, RenderSettings } from '../types';
import { getCachedPath2D } from './glyphs';

export interface DitherRenderParams {
  sourceImageData: ImageData;
  targetCtx: CanvasRenderingContext2D;
  targetWidth: number;
  targetHeight: number;
  glyphs: GlyphItem[];
  settings: RenderSettings;
  bgColor: string;
  fgColor: string;
  time?: number;
}

export interface GlyphInstance {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  glyph: GlyphItem;
}

/**
 * Computes all glyph instances across the grid based on source luminance.
 */
export function computeGlyphGrid(
  sourceImageData: ImageData,
  targetWidth: number,
  targetHeight: number,
  glyphs: GlyphItem[],
  settings: RenderSettings,
  time = 0
): { instances: GlyphInstance[]; cols: number; rows: number } {
  const { data, width: srcW, height: srcH } = sourceImageData;
  const cellSize = Math.max(4, Math.round(settings.cellSize));
  const cols = Math.floor(targetWidth / cellSize);
  const rows = Math.floor(targetHeight / cellSize);

  const instances: GlyphInstance[] = [];
  const glyphCount = glyphs.length;
  if (glyphCount === 0) return { instances, cols, rows };

  const xOffset = (targetWidth - cols * cellSize) / 2;
  const yOffset = (targetHeight - rows * cellSize) / 2;

  // Pre-calculate pseudo-random deterministic jitter
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = xOffset + c * cellSize + cellSize / 2;
      const cy = yOffset + r * cellSize + cellSize / 2;

      // Map target canvas coordinates to source image coordinates
      const srcX = Math.min(srcW - 1, Math.max(0, Math.floor((cx / targetWidth) * srcW)));
      const srcY = Math.min(srcH - 1, Math.max(0, Math.floor((cy / targetHeight) * srcH)));

      const pixelIdx = (srcY * srcW + srcX) * 4;
      const rVal = data[pixelIdx];
      const gVal = data[pixelIdx + 1];
      const bVal = data[pixelIdx + 2];
      const alpha = data[pixelIdx + 3] / 255;

      // Perceptual standard luminance
      let lum = (0.299 * rVal + 0.587 * gVal + 0.114 * bVal) / 255;

      // If background has alpha 0 or white, treat as empty background
      if (alpha < 0.05) {
        lum = 1.0;
      }

      // Contrast & Brightness adjustment
      lum = (lum - 0.5) * settings.contrast + 0.5 + settings.brightness;
      lum = Math.max(0, Math.min(1, lum));

      // Gamma correction
      lum = Math.pow(lum, settings.gamma);

      // Invert toggle
      if (settings.invert) {
        lum = 1.0 - lum;
      }

      // In the video, the statue is in dark silhouette / shadows, and the background is bright lime yellow.
      // So dark pixels (low lum) produce dense icons (density -> 1).
      // Bright pixels (high lum) produce no icons (density -> 0).
      let density = 1.0 - lum;

      // Apply threshold cut-off
      if (density < settings.threshold) {
        continue;
      }

      // Normalize density after threshold cut-off
      const effectiveDensity = Math.min(
        1.0,
        Math.max(0.0, (density - settings.threshold) / (1.0 - settings.threshold + 0.0001))
      );

      // Map effective density to glyph tier
      const glyphIndex = Math.min(
        glyphCount - 1,
        Math.floor(effectiveDensity * glyphCount)
      );
      const glyph = glyphs[glyphIndex];

      // Subtle dynamic wave distortion if enabled
      let jitterX = 0;
      let jitterY = 0;
      if (settings.shapeDistortion > 0) {
        jitterX = Math.sin(r * 0.3 + time * 3) * (cellSize * 0.2 * settings.shapeDistortion);
        jitterY = Math.cos(c * 0.3 + time * 3) * (cellSize * 0.2 * settings.shapeDistortion);
      }

      // Rotation jitter
      let rotation = 0;
      if (settings.rotationJitter > 0) {
        // Deterministic pseudo-random seed per cell
        const pseudoRand = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
        const normalizedRand = pseudoRand - Math.floor(pseudoRand);
        rotation = (normalizedRand - 0.5) * (settings.rotationJitter * (Math.PI / 180));
      }

      // Calculate size scaling
      // Icons in deep shadows can be slightly larger for that punchy poster graphic look
      const scaleMultiplier = settings.iconScale * (0.65 + effectiveDensity * 0.45);
      const iconSize = (cellSize / 100) * scaleMultiplier;

      instances.push({
        x: cx + jitterX,
        y: cy + jitterY,
        scale: iconSize,
        rotation,
        glyph,
      });
    }
  }

  return { instances, cols, rows };
}

/**
 * Draws the glyph grid on a 2D HTML5 canvas at 60fps.
 */
export function renderGlyphCanvas(params: DitherRenderParams): void {
  const {
    sourceImageData,
    targetCtx,
    targetWidth,
    targetHeight,
    glyphs,
    settings,
    bgColor,
    fgColor,
    time = 0,
  } = params;

  // Clear and fill background
  targetCtx.fillStyle = bgColor;
  targetCtx.fillRect(0, 0, targetWidth, targetHeight);

  // Compute grid
  const { instances } = computeGlyphGrid(
    sourceImageData,
    targetWidth,
    targetHeight,
    glyphs,
    settings,
    time
  );

  // Render all glyphs in foreground color
  targetCtx.fillStyle = fgColor;

  for (let i = 0; i < instances.length; i++) {
    const inst = instances[i];
    const path2D = getCachedPath2D(inst.glyph.svgPath);

    targetCtx.save();
    targetCtx.translate(inst.x, inst.y);
    if (inst.rotation !== 0) {
      targetCtx.rotate(inst.rotation);
    }
    targetCtx.scale(inst.scale, inst.scale);
    // Path coordinates are centered around (50, 50)
    targetCtx.translate(-50, -50);

    targetCtx.fill(path2D);
    targetCtx.restore();
  }
}

/**
 * Generates pure Vector SVG markup for infinite-resolution poster prints.
 */
export function generateVectorSVG(
  sourceImageData: ImageData,
  targetWidth: number,
  targetHeight: number,
  glyphs: GlyphItem[],
  settings: RenderSettings,
  bgColor: string,
  fgColor: string
): string {
  const { instances } = computeGlyphGrid(
    sourceImageData,
    targetWidth,
    targetHeight,
    glyphs,
    settings,
    0
  );

  let pathsSvg = '';
  for (let i = 0; i < instances.length; i++) {
    const inst = instances[i];
    const transform = `translate(${inst.x.toFixed(2)},${inst.y.toFixed(2)}) rotate(${((inst.rotation * 180) / Math.PI).toFixed(1)}) scale(${inst.scale.toFixed(4)}) translate(-50,-50)`;
    pathsSvg += `  <path d="${inst.glyph.svgPath}" transform="${transform}" />\n`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${targetWidth} ${targetHeight}" width="${targetWidth}" height="${targetHeight}">
  <rect width="100%" height="100%" fill="${bgColor}" />
  <g fill="${fgColor}">
${pathsSvg}  </g>
</svg>`;
}
