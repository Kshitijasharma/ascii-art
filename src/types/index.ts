/**
 * Core type definitions for the Glyph Dither 3D Studio
 */

export type InputSourceMode = '3d-mesh' | 'webcam' | 'image';

export type MeshModelType =
  | 'classical-torso'
  | 'classical-bust'
  | 'winged-victory'
  | 'trefoil-knot'
  | 'neo-skull'
  | 'cyber-obelisk'
  | 'custom-file';

export type GlyphPresetId =
  | 'acid-y2k'
  | 'dingbats-brutalist'
  | 'ascii-density'
  | 'halftone-dots'
  | 'geometric-cross'
  | 'custom-glyphs';

export interface GlyphItem {
  id: string;
  name: string;
  weight: number; // 0 (lightest/thinnest) to 1 (densest/darkest)
  svgPath: string; // SVG path data for canvas and SVG export
  viewBox: string; // usually "0 0 24 24" or "0 0 100 100"
  char?: string;   // fallback unicode character
}

export interface ColorTheme {
  id: string;
  name: string;
  background: string;
  foreground: string;
  accent?: string;
}

export interface RenderSettings {
  cellSize: number;       // Grid resolution in pixels (4 to 48)
  iconScale: number;      // Scale multiplier of the icon within cell (0.4 to 1.8)
  contrast: number;       // 0.5 to 3.0
  brightness: number;     // -0.5 to 0.5
  gamma: number;          // 0.5 to 2.5
  threshold: number;      // 0.0 to 1.0 (cut-off)
  rotationJitter: number; // 0 to 180 degrees
  invert: boolean;        // Invert luminance mapping
  autoRotate: boolean;
  rotationSpeed: number;  // 0.1 to 3.0
  lightAngleX: number;    // -180 to 180
  lightAngleY: number;    // -90 to 90
  lightIntensity: number; // 0.5 to 3.0
  zoom: number;           // Camera zoom
  wireframeOverlay: boolean;
  shapeDistortion: number;// subtle wave/ripple
  imageFit: 'contain' | 'cover' | 'stretch'; // How uploaded photos fit canvas
}
