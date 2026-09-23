import React, { useState } from 'react';
import {
  Sliders,
  Sun,
  Layers,
  Palette,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Upload,
  Play,
  Pause,
  ZoomIn,
} from 'lucide-react';
import {
  InputSourceMode,
  MeshModelType,
  GlyphPresetId,
  RenderSettings,
  ColorTheme,
} from '../types';
import { GLYPH_PRESETS } from '../utils/glyphs';
import { COLOR_THEMES } from '../utils/themes';

interface ControlPanelProps {
  sourceMode: InputSourceMode;
  modelType: MeshModelType;
  onSelectModel: (model: MeshModelType) => void;
  onUploadCustomModel: (file: File) => void;
  glyphPresetId: GlyphPresetId;
  onSelectGlyphPreset: (id: GlyphPresetId) => void;
  settings: RenderSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<RenderSettings>>;
  activeTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  customBgColor: string;
  customFgColor: string;
  onChangeCustomColors: (bg: string, fg: string) => void;
  onUploadImage: (file: File) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  sourceMode,
  modelType,
  onSelectModel,
  onUploadCustomModel,
  glyphPresetId,
  onSelectGlyphPreset,
  settings,
  onUpdateSettings,
  activeTheme,
  onSelectTheme,
  customBgColor,
  customFgColor,
  onChangeCustomColors,
  onUploadImage,
}) => {
  const [activeTab, setActiveTab] = useState<'glyphs' | 'grid' | 'lighting' | 'colors'>('glyphs');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeGlyphPreset = GLYPH_PRESETS.find((p) => p.id === glyphPresetId) || GLYPH_PRESETS[0];

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:top-20 md:bottom-auto md:w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-300 z-20 overflow-hidden flex flex-col ${
        isCollapsed ? 'h-14' : 'max-h-[85vh]'
      }`}
    >
      {/* Top Header of the Panel */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#d4ff00]" />
          <span className="text-xs font-bold tracking-wide uppercase text-white/90">
            Control Studio
          </span>
          <span className="text-[10px] text-white/40 font-mono">
            {settings.cellSize}px GRID
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))
            }
            className={`p-1.5 rounded text-xs transition-colors ${
              settings.autoRotate
                ? 'bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/40'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title={settings.autoRotate ? 'Pause Auto-Orbit' : 'Start Auto-Orbit'}
          >
            {settings.autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-white/10 bg-black/40 text-[11px] font-medium">
            <button
              onClick={() => setActiveTab('glyphs')}
              className={`py-2 px-1 flex flex-col items-center gap-1 transition-colors border-b-2 ${
                activeTab === 'glyphs'
                  ? 'border-[#d4ff00] text-[#d4ff00] bg-white/[0.04]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Glyphs</span>
            </button>

            <button
              onClick={() => setActiveTab('grid')}
              className={`py-2 px-1 flex flex-col items-center gap-1 transition-colors border-b-2 ${
                activeTab === 'grid'
                  ? 'border-[#d4ff00] text-[#d4ff00] bg-white/[0.04]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid & Size</span>
            </button>

            <button
              onClick={() => setActiveTab('lighting')}
              className={`py-2 px-1 flex flex-col items-center gap-1 transition-colors border-b-2 ${
                activeTab === 'lighting'
                  ? 'border-[#d4ff00] text-[#d4ff00] bg-white/[0.04]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light & Shadow</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`py-2 px-1 flex flex-col items-center gap-1 transition-colors border-b-2 ${
                activeTab === 'colors'
                  ? 'border-[#d4ff00] text-[#d4ff00] bg-white/[0.04]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
          </div>

          {/* Panel Scrollable Body */}
          <div className="p-4 overflow-y-auto space-y-4 max-h-[62vh]">
            {/* Source Specific Quick Selectors */}
            {sourceMode === '3d-mesh' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                  3D Sculpture Model
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'classical-torso', label: 'Classical Torso' },
                    { id: 'classical-bust', label: 'Classical Bust' },
                    { id: 'trefoil-knot', label: 'Trefoil Knot' },
                    { id: 'neo-skull', label: 'Cyber Skull' },
                    { id: 'cyber-obelisk', label: 'Neo Obelisk' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onSelectModel(m.id as MeshModelType)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                        modelType === m.id
                          ? 'border-[#d4ff00] bg-[#d4ff00]/10 text-white font-medium'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}

                  <label className="px-2.5 py-1.5 rounded-lg border border-dashed border-white/20 bg-white/5 text-white/70 hover:border-white/40 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="truncate">Upload OBJ</span>
                    <input
                      type="file"
                      accept=".obj"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadCustomModel(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {sourceMode === 'image' && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                  Custom Image Source
                </label>
                <label className="w-full py-3.5 px-3 rounded-lg border border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#d4ff00]/50 cursor-pointer flex flex-col items-center justify-center gap-1 text-center transition-all">
                  <Upload className="w-5 h-5 text-[#d4ff00]" />
                  <span className="text-xs font-medium text-white">Upload Any Photo or Graphic</span>
                  <span className="text-[10px] text-white/40">PNG, JPG, WEBP, SVG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUploadImage(file);
                    }}
                  />
                </label>

                {/* Image Fit Mode */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider block">
                    Photo Screen Fitting
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {[
                      { id: 'contain', label: 'Fit Full Image', desc: 'No crop / whole picture' },
                      { id: 'cover', label: 'Fill & Crop', desc: 'Cover viewport' },
                      { id: 'stretch', label: 'Stretch', desc: 'Exact fit' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({
                            ...settings,
                            imageFit: mode.id as 'contain' | 'cover' | 'stretch',
                          })
                        }
                        className={`px-2 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                          (settings.imageFit || 'contain') === mode.id
                            ? 'border-[#d4ff00] bg-[#d4ff00]/15 text-[#d4ff00] font-semibold'
                            : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span className="text-[11px] leading-tight">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: GLYPHS */}
            {activeTab === 'glyphs' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                    Glyph & Dingbat Preset
                  </label>
                  <div className="space-y-2">
                    {GLYPH_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => onSelectGlyphPreset(preset.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                          glyphPresetId === preset.id
                            ? 'border-[#d4ff00] bg-[#d4ff00]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white">
                            {preset.name}
                          </span>
                          {glyphPresetId === preset.id && (
                            <span className="w-2 h-2 rounded-full bg-[#d4ff00]"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/50 mb-2">{preset.description}</p>
                        {/* Sample preview of symbols in this preset */}
                        <div className="flex items-center gap-1.5 flex-wrap bg-black/40 p-1.5 rounded border border-white/5">
                          {preset.glyphs.slice(0, 10).map((g, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 flex items-center justify-center text-white/90"
                              title={g.name}
                            >
                              <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                <path d={g.svgPath} />
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Glyph Density Ramp Display */}
                <div className="bg-black/50 border border-white/10 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Density Spectrum:</span>
                    <span className="text-white/40 font-mono text-[10px]">
                      Light → Dark Tone
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-white/5 p-2 rounded">
                    {activeGlyphPreset.glyphs.map((g, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1"
                        title={`${g.name} (weight: ${Math.round(g.weight * 100)}%)`}
                      >
                        <svg viewBox="0 0 100 100" className="w-4 h-4 fill-[#d4ff00]">
                          <path d={g.svgPath} />
                        </svg>
                        <span className="text-[8px] text-white/30 font-mono">
                          {Math.round(g.weight * 100)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GRID & SIZE */}
            {activeTab === 'grid' && (
              <div className="space-y-4">
                {/* Cell Size / Resolution */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Grid Resolution (Cell Size)</span>
                    <span className="text-[#d4ff00] font-mono">{settings.cellSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="48"
                    step="1"
                    value={settings.cellSize}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        cellSize: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>Micro Halftone (6px)</span>
                    <span>Macro Poster (48px)</span>
                  </div>
                </div>

                {/* Icon Scale */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Glyph Scale Multiplier</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.iconScale.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.05"
                    value={settings.iconScale}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        iconScale: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Rotation Jitter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Rotation Jitter Angle</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.rotationJitter}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={settings.rotationJitter}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        rotationJitter: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Wave Distortion */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Kinetic Wave Distortion</span>
                    <span className="text-[#d4ff00] font-mono">
                      {Math.round(settings.shapeDistortion * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.shapeDistortion}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        shapeDistortion: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Camera Zoom */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Camera Zoom</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.zoom.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={settings.zoom}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        zoom: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: LIGHTING & SHADOWS */}
            {activeTab === 'lighting' && (
              <div className="space-y-4">
                {/* Light Angle X */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Key Light Horizontal Angle</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.lightAngleX}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={settings.lightAngleX}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        lightAngleX: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Light Angle Y */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Key Light Elevation</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.lightAngleY}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="5"
                    value={settings.lightAngleY}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        lightAngleY: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Shadow Contrast</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.contrast.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={settings.contrast}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        contrast: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Threshold */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">Silhouette Cut-Off Threshold</span>
                    <span className="text-[#d4ff00] font-mono">
                      {settings.threshold.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.8"
                    step="0.02"
                    value={settings.threshold}
                    onChange={(e) =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        threshold: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#d4ff00] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Invert */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-xs text-white/80">Invert Tone Density</span>
                  <button
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, invert: !prev.invert }))
                    }
                    className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                      settings.invert
                        ? 'bg-[#d4ff00] text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {settings.invert ? 'Inverted' : 'Standard'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: THEMES & COLORS */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                    Curated Color Palettes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onSelectTheme(theme);
                          onChangeCustomColors(theme.background, theme.foreground);
                        }}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          activeTheme.id === theme.id
                            ? 'border-[#d4ff00] bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex -space-x-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-black/30"
                            style={{ backgroundColor: theme.background }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/30"
                            style={{ backgroundColor: theme.foreground }}
                          />
                        </div>
                        <span className="text-xs text-white truncate font-medium">
                          {theme.name.split(' (')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Pickers */}
                <div className="p-3 bg-black/50 border border-white/10 rounded-lg space-y-3">
                  <span className="text-xs font-semibold text-white block">
                    Custom Color Overrides
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-white/60 block mb-1">
                        Canvas Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customBgColor}
                          onChange={(e) =>
                            onChangeCustomColors(e.target.value, customFgColor)
                          }
                          className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-white/80">
                          {customBgColor.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/60 block mb-1">
                        Glyph Foreground
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customFgColor}
                          onChange={(e) =>
                            onChangeCustomColors(customBgColor, e.target.value)
                          }
                          className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-white/80">
                          {customFgColor.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
