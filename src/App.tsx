/**
 * GlyphDither 3D - Icon & ASCII Halftone Studio
 * Recreates the exact 3D icon dither effect from the user's reference video
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  InputSourceMode,
  MeshModelType,
  GlyphPresetId,
  RenderSettings,
  ColorTheme,
} from './types';
import { GLYPH_PRESETS } from './utils/glyphs';
import { COLOR_THEMES } from './utils/themes';
import { parseOBJ } from './utils/objParser';
import { Header } from './components/Header';
import { GlyphViewport } from './components/GlyphViewport';
import { ControlPanel } from './components/ControlPanel';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ExportModal } from './components/ExportModal';

const DEFAULT_SETTINGS: RenderSettings = {
  cellSize: 14,
  iconScale: 1.15,
  contrast: 1.6,
  brightness: 0.05,
  gamma: 1.2,
  threshold: 0.12,
  rotationJitter: 15,
  invert: false,
  autoRotate: true,
  rotationSpeed: 0.6,
  lightAngleX: 45,
  lightAngleY: 30,
  lightIntensity: 2.2,
  zoom: 1.05,
  wireframeOverlay: false,
  shapeDistortion: 0.0,
  imageFit: 'contain',
};

export default function App() {
  const [sourceMode, setSourceMode] = useState<InputSourceMode>('3d-mesh');
  const [modelType, setModelType] = useState<MeshModelType>('classical-torso');
  const [customGeometry, setCustomGeometry] = useState<any>(null);

  const [glyphPresetId, setGlyphPresetId] = useState<GlyphPresetId>('acid-y2k');
  const [settings, setSettings] = useState<RenderSettings>(DEFAULT_SETTINGS);

  const [activeTheme, setActiveTheme] = useState<ColorTheme>(COLOR_THEMES[0]);
  const [customBgColor, setCustomBgColor] = useState<string>(COLOR_THEMES[0].background);
  const [customFgColor, setCustomFgColor] = useState<string>(COLOR_THEMES[0].foreground);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [sourceImageData, setSourceImageData] = useState<ImageData | null>(null);

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Find active glyph list
  const activeGlyphPreset =
    GLYPH_PRESETS.find((p) => p.id === glyphPresetId) || GLYPH_PRESETS[0];

  // Handle uploading custom OBJ file
  const handleUploadCustomModel = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        try {
          const geo = parseOBJ(text);
          setCustomGeometry(geo);
          setModelType('custom-file');
        } catch (err) {
          console.error('Failed to parse OBJ file:', err);
          alert('Could not parse .obj file. Please ensure it is a valid Wavefront OBJ file.');
        }
      }
    };
    reader.readAsText(file);
  }, []);

  // Handle uploading custom image
  const handleUploadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedImageUrl(url);
    setSourceMode('image');
  }, []);

  // Reset view to default
  const handleResetView = useCallback(() => {
    setSettings((prev) => ({
      ...DEFAULT_SETTINGS,
      autoRotate: prev.autoRotate,
    }));
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-black text-white font-sans">
      {/* Top Header */}
      <Header
        sourceMode={sourceMode}
        onSelectSourceMode={setSourceMode}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetView={handleResetView}
      />

      {/* Main Interactive Viewport */}
      <main className="flex-1 relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        <GlyphViewport
          sourceMode={sourceMode}
          modelType={modelType}
          customGeometry={customGeometry}
          glyphs={activeGlyphPreset.glyphs}
          settings={settings}
          bgColor={customBgColor}
          fgColor={customFgColor}
          uploadedImageUrl={uploadedImageUrl}
          onSetSourceImageData={setSourceImageData}
          canvasRef={canvasRef}
        />

        {/* Studio Controls Drawer/Sidebar */}
        <ControlPanel
          sourceMode={sourceMode}
          modelType={modelType}
          onSelectModel={(m) => {
            setModelType(m);
            setCustomGeometry(null);
          }}
          onUploadCustomModel={handleUploadCustomModel}
          glyphPresetId={glyphPresetId}
          onSelectGlyphPreset={setGlyphPresetId}
          settings={settings}
          onUpdateSettings={setSettings}
          activeTheme={activeTheme}
          onSelectTheme={setActiveTheme}
          customBgColor={customBgColor}
          customFgColor={customFgColor}
          onChangeCustomColors={(bg, fg) => {
            setCustomBgColor(bg);
            setCustomFgColor(fg);
          }}
          onUploadImage={handleUploadImage}
        />
      </main>

      {/* Educational Guide & Code Generator Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Export Modal (SVG Vector, High-Res PNG, Video) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        canvasRef={canvasRef}
        sourceImageData={sourceImageData}
        glyphs={activeGlyphPreset.glyphs}
        settings={settings}
        bgColor={customBgColor}
        fgColor={customFgColor}
      />
    </div>
  );
}
