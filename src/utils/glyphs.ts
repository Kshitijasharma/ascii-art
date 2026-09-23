/**
 * Vector Glyph definitions & Preset libraries
 * Recreates the exact icon dither aesthetics from the video
 */

import { GlyphItem, GlyphPresetId } from '../types';

// Pre-compiled Path2D objects for ultra-fast canvas rasterization
const path2DCache = new Map<string, Path2D>();

export function getCachedPath2D(svgPath: string): Path2D {
  let p = path2DCache.get(svgPath);
  if (!p) {
    p = new Path2D(svgPath);
    path2DCache.set(svgPath, p);
  }
  return p;
}

/**
 * All paths are normalized to a 100x100 coordinate box centered at (50, 50).
 */
export const GLYPH_ITEMS: Record<string, GlyphItem> = {
  // --- Acid & Y2K Icons (Exact match to video frames 00:01 & 00:02) ---
  eightBall: {
    id: 'eightBall',
    name: '8-Ball',
    weight: 0.95,
    viewBox: '0 0 100 100',
    char: '🎱',
    // Outer solid circle + inner white circle with 8 cutout
    svgPath:
      'M 50,2 A 48,48 0 1,0 50,98 A 48,48 0 1,0 50,2 Z ' +
      'M 50,30 A 10,10 0 1,1 50,50 A 10,10 0 1,1 50,30 Z ' +
      'M 50,50 A 12,12 0 1,1 50,74 A 12,12 0 1,1 50,50 Z',
  },
  flower: {
    id: 'flower',
    name: 'Flower',
    weight: 0.88,
    viewBox: '0 0 100 100',
    char: '✿',
    // 6-petal rounded flower with hollow center
    svgPath:
      'M 50,20 C 58,20 62,30 57,37 C 65,33 74,40 68,48 C 76,52 73,63 65,63 C 68,72 58,78 52,71 C 48,78 38,76 39,67 C 31,68 28,58 35,52 C 28,45 34,35 43,38 C 40,29 48,20 50,20 Z',
  },
  lightning: {
    id: 'lightning',
    name: 'Lightning',
    weight: 0.70,
    viewBox: '0 0 100 100',
    char: '⚡',
    svgPath: 'M 58,5 L 22,55 L 48,55 L 42,95 L 78,45 L 52,45 Z',
  },
  hazard: {
    id: 'hazard',
    name: 'Hazard Triangle',
    weight: 0.78,
    viewBox: '0 0 100 100',
    char: '⚠',
    svgPath:
      'M 50,10 L 92,86 L 8,86 Z M 46,38 L 54,38 L 53,62 L 47,62 Z M 50,70 A 4,4 0 1,0 50,78 A 4,4 0 1,0 50,70 Z',
  },
  sun: {
    id: 'sun',
    name: 'Sun Burst',
    weight: 0.82,
    viewBox: '0 0 100 100',
    char: '☀',
    svgPath:
      'M 50,32 A 18,18 0 1,0 50,68 A 18,18 0 1,0 50,32 Z ' +
      'M 46,6 L 54,6 L 54,22 L 46,22 Z M 46,78 L 54,78 L 54,94 L 46,94 Z ' +
      'M 6,46 L 22,46 L 22,54 L 6,54 Z M 78,46 L 94,46 L 94,54 L 78,54 Z ' +
      'M 18,24 L 29,19 L 38,34 L 27,39 Z M 71,61 L 82,56 L 91,71 L 80,76 Z ' +
      'M 27,61 L 38,66 L 29,81 L 18,76 Z M 80,24 L 91,29 L 82,44 L 71,39 Z',
  },
  snowflake: {
    id: 'snowflake',
    name: 'Snowflake',
    weight: 0.65,
    viewBox: '0 0 100 100',
    char: '❄',
    svgPath:
      'M 47,8 L 53,8 L 53,38 L 68,23 L 73,28 L 57,44 L 73,44 L 73,50 L 57,50 L 73,66 L 68,71 L 53,56 L 53,92 L 47,92 L 47,56 L 32,71 L 27,66 L 43,50 L 27,50 L 27,44 L 43,44 L 27,28 L 32,23 L 47,38 Z',
  },
  scissors: {
    id: 'scissors',
    name: 'Scissors',
    weight: 0.55,
    viewBox: '0 0 100 100',
    char: '✂',
    svgPath:
      'M 30,70 A 14,14 0 1,1 44,56 L 60,40 L 78,22 L 84,28 L 54,58 L 68,72 A 14,14 0 1,1 54,86 L 46,78 L 38,86 A 14,14 0 0,1 30,70 Z ' +
      'M 68,82 A 6,6 0 1,0 68,70 A 6,6 0 1,0 68,82 Z M 32,74 A 6,6 0 1,0 32,62 A 6,6 0 1,0 32,74 Z',
  },
  star5: {
    id: 'star5',
    name: 'Five Star',
    weight: 0.75,
    viewBox: '0 0 100 100',
    char: '★',
    svgPath:
      'M 50,5 L 63,35 L 96,38 L 71,60 L 78,93 L 50,75 L 22,93 L 29,60 L 4,38 L 37,35 Z',
  },
  sparkle: {
    id: 'sparkle',
    name: 'Diamond Sparkle',
    weight: 0.45,
    viewBox: '0 0 100 100',
    char: '✦',
    svgPath:
      'M 50,6 Q 50,50 6,50 Q 50,50 50,94 Q 50,50 94,50 Q 50,50 50,6 Z',
  },
  asterisk: {
    id: 'asterisk',
    name: 'Heavy Asterisk',
    weight: 0.85,
    viewBox: '0 0 100 100',
    char: '✱',
    svgPath:
      'M 44,6 L 56,6 L 56,38 L 84,22 L 90,32 L 62,48 L 90,64 L 84,74 L 56,58 L 56,94 L 44,94 L 44,58 L 16,74 L 10,64 L 38,48 L 10,32 L 16,22 L 44,38 Z',
  },
  smiley: {
    id: 'smiley',
    name: 'Smiley',
    weight: 0.60,
    viewBox: '0 0 100 100',
    char: '☺',
    svgPath:
      'M 50,6 A 44,44 0 1,0 50,94 A 44,44 0 1,0 50,6 Z M 50,14 A 36,36 0 1,1 50,86 A 36,36 0 1,1 50,14 Z ' +
      'M 36,34 A 4,4 0 1,1 36,42 A 4,4 0 1,1 36,34 Z M 64,34 A 4,4 0 1,1 64,42 A 4,4 0 1,1 64,34 Z ' +
      'M 32,56 Q 50,76 68,56 Q 50,66 32,56 Z',
  },
  skull: {
    id: 'skull',
    name: 'Skull',
    weight: 0.86,
    viewBox: '0 0 100 100',
    char: '☠',
    svgPath:
      'M 50,10 C 26,10 22,30 22,46 C 22,58 30,64 34,70 L 36,88 L 64,88 L 66,70 C 70,64 78,58 78,46 C 78,30 74,10 50,10 Z ' +
      'M 36,44 A 8,8 0 1,1 36,60 A 8,8 0 1,1 36,44 Z M 64,44 A 8,8 0 1,1 64,60 A 8,8 0 1,1 64,44 Z ' +
      'M 46,64 L 54,64 L 50,72 Z M 42,78 L 44,86 M 50,78 L 50,86 M 58,78 L 56,86',
  },

  // --- Geometric & Halftone Basic Shapes ---
  circleFilled: {
    id: 'circleFilled',
    name: 'Circle Solid',
    weight: 1.0,
    viewBox: '0 0 100 100',
    svgPath: 'M 50,5 A 45,45 0 1,0 50,95 A 45,45 0 1,0 50,5 Z',
  },
  circleRing: {
    id: 'circleRing',
    name: 'Ring',
    weight: 0.5,
    viewBox: '0 0 100 100',
    svgPath: 'M 50,10 A 40,40 0 1,0 50,90 A 40,40 0 1,0 50,10 Z M 50,26 A 24,24 0 1,1 50,74 A 24,24 0 1,1 50,26 Z',
  },
  targetDot: {
    id: 'targetDot',
    name: 'Target Ring',
    weight: 0.7,
    viewBox: '0 0 100 100',
    svgPath:
      'M 50,10 A 40,40 0 1,0 50,90 A 40,40 0 1,0 50,10 Z M 50,24 A 26,26 0 1,1 50,76 A 26,26 0 1,1 50,24 Z ' +
      'M 50,38 A 12,12 0 1,0 50,62 A 12,12 0 1,0 50,38 Z',
  },
  squareFilled: {
    id: 'squareFilled',
    name: 'Square',
    weight: 1.0,
    viewBox: '0 0 100 100',
    svgPath: 'M 10,10 L 90,10 L 90,90 L 10,90 Z',
  },
  cross: {
    id: 'cross',
    name: 'Swiss Cross',
    weight: 0.6,
    viewBox: '0 0 100 100',
    svgPath: 'M 38,10 L 62,10 L 62,38 L 90,38 L 90,62 L 62,62 L 62,90 L 38,90 L 38,62 L 10,62 L 10,38 L 38,38 Z',
  },
  xMark: {
    id: 'xMark',
    name: 'Cross X',
    weight: 0.5,
    viewBox: '0 0 100 100',
    svgPath: 'M 18,10 L 50,42 L 82,10 L 90,18 L 58,50 L 90,82 L 82,90 L 50,58 L 18,90 L 10,82 L 42,50 L 10,18 Z',
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    weight: 0.75,
    viewBox: '0 0 100 100',
    svgPath: 'M 50,10 L 90,85 L 10,85 Z',
  },
  dotTiny: {
    id: 'dotTiny',
    name: 'Micro Dot',
    weight: 0.15,
    viewBox: '0 0 100 100',
    svgPath: 'M 50,38 A 12,12 0 1,0 50,62 A 12,12 0 1,0 50,38 Z',
  },
};

/**
 * Ordered Glyph Presets sorted from light (sparse) to dark (dense).
 */
export interface GlyphPreset {
  id: GlyphPresetId;
  name: string;
  description: string;
  glyphs: GlyphItem[];
}

export const GLYPH_PRESETS: GlyphPreset[] = [
  {
    id: 'acid-y2k',
    name: 'Acid Cyber Dingbats',
    description: 'The exact high-contrast icon set from the video: 8-balls, flowers, lightning, stars, hazard, and scissors.',
    glyphs: [
      GLYPH_ITEMS.dotTiny,
      GLYPH_ITEMS.sparkle,
      GLYPH_ITEMS.scissors,
      GLYPH_ITEMS.smiley,
      GLYPH_ITEMS.snowflake,
      GLYPH_ITEMS.lightning,
      GLYPH_ITEMS.star5,
      GLYPH_ITEMS.hazard,
      GLYPH_ITEMS.sun,
      GLYPH_ITEMS.flower,
      GLYPH_ITEMS.asterisk,
      GLYPH_ITEMS.skull,
      GLYPH_ITEMS.eightBall,
    ].sort((a, b) => a.weight - b.weight),
  },
  {
    id: 'dingbats-brutalist',
    name: 'Brutalist Swiss Matrix',
    description: 'Architectural crosses, target rings, triangles, bold asterisks, and geometric solids.',
    glyphs: [
      GLYPH_ITEMS.dotTiny,
      GLYPH_ITEMS.xMark,
      GLYPH_ITEMS.circleRing,
      GLYPH_ITEMS.cross,
      GLYPH_ITEMS.targetDot,
      GLYPH_ITEMS.triangle,
      GLYPH_ITEMS.asterisk,
      GLYPH_ITEMS.squareFilled,
      GLYPH_ITEMS.circleFilled,
    ].sort((a, b) => a.weight - b.weight),
  },
  {
    id: 'halftone-dots',
    name: 'Optical Halftone Dots',
    description: 'Precision variable-diameter dots recreating offset lithography and screen printing.',
    glyphs: [
      { id: 'dot-1', name: 'Dot 1', weight: 0.1, viewBox: '0 0 100 100', svgPath: 'M 50,44 A 6,6 0 1,0 50,56 A 6,6 0 1,0 50,44 Z' },
      { id: 'dot-2', name: 'Dot 2', weight: 0.25, viewBox: '0 0 100 100', svgPath: 'M 50,38 A 12,12 0 1,0 50,62 A 12,12 0 1,0 50,38 Z' },
      { id: 'dot-3', name: 'Dot 3', weight: 0.45, viewBox: '0 0 100 100', svgPath: 'M 50,30 A 20,20 0 1,0 50,70 A 20,20 0 1,0 50,30 Z' },
      { id: 'dot-4', name: 'Dot 4', weight: 0.70, viewBox: '0 0 100 100', svgPath: 'M 50,20 A 30,30 0 1,0 50,80 A 30,30 0 1,0 50,20 Z' },
      { id: 'dot-5', name: 'Dot 5', weight: 0.95, viewBox: '0 0 100 100', svgPath: 'M 50,6 A 44,44 0 1,0 50,94 A 44,44 0 1,0 50,6 Z' },
    ],
  },
  {
    id: 'geometric-cross',
    name: 'Cyber Crosshairs & Diamonds',
    description: 'Diamond sparkles, stars, and crosshairs for sleek tech silhouettes.',
    glyphs: [
      GLYPH_ITEMS.dotTiny,
      GLYPH_ITEMS.sparkle,
      GLYPH_ITEMS.xMark,
      GLYPH_ITEMS.cross,
      GLYPH_ITEMS.star5,
      GLYPH_ITEMS.circleRing,
      GLYPH_ITEMS.eightBall,
    ].sort((a, b) => a.weight - b.weight),
  },
  {
    id: 'ascii-density',
    name: 'Classic ASCII Ramp',
    description: 'Classic character density ramp: . : - = + * # % @',
    glyphs: [
      { id: 'ascii-dot', name: '.', weight: 0.1, viewBox: '0 0 100 100', svgPath: 'M 48,70 L 52,70 L 52,74 L 48,74 Z', char: '.' },
      { id: 'ascii-colon', name: ':', weight: 0.2, viewBox: '0 0 100 100', svgPath: 'M 48,45 L 52,45 L 52,49 L 48,49 Z M 48,70 L 52,70 L 52,74 L 48,74 Z', char: ':' },
      { id: 'ascii-minus', name: '-', weight: 0.35, viewBox: '0 0 100 100', svgPath: 'M 25,48 L 75,48 L 75,52 L 25,52 Z', char: '-' },
      { id: 'ascii-plus', name: '+', weight: 0.5, viewBox: '0 0 100 100', svgPath: 'M 46,25 L 54,25 L 54,46 L 75,46 L 75,54 L 54,54 L 54,75 L 46,75 L 46,54 L 25,54 L 25,46 L 46,46 Z', char: '+' },
      { id: 'ascii-star', name: '*', weight: 0.65, viewBox: '0 0 100 100', svgPath: GLYPH_ITEMS.asterisk.svgPath, char: '*' },
      { id: 'ascii-hash', name: '#', weight: 0.8, viewBox: '0 0 100 100', svgPath: 'M 38,15 L 42,15 L 42,35 L 58,35 L 58,15 L 62,15 L 62,35 L 80,35 L 80,40 L 62,40 L 62,60 L 80,60 L 80,65 L 62,65 L 62,85 L 58,85 L 58,65 L 42,65 L 42,85 L 38,85 L 38,65 L 20,65 L 20,60 L 38,60 L 38,40 L 20,40 L 20,35 L 38,35 Z', char: '#' },
      { id: 'ascii-at', name: '@', weight: 0.95, viewBox: '0 0 100 100', svgPath: GLYPH_ITEMS.eightBall.svgPath, char: '@' },
    ],
  },
];
