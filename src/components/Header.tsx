import React from 'react';
import { Camera, Image as ImageIcon, Box, HelpCircle, Download, RotateCcw } from 'lucide-react';
import { InputSourceMode } from '../types';

interface HeaderProps {
  sourceMode: InputSourceMode;
  onSelectSourceMode: (mode: InputSourceMode) => void;
  onOpenHowItWorks: () => void;
  onOpenExport: () => void;
  onResetView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sourceMode,
  onSelectSourceMode,
  onOpenHowItWorks,
  onOpenExport,
  onResetView,
}) => {
  return (
    <header className="h-14 px-4 md:px-6 border-b border-white/10 bg-black/90 backdrop-blur-md flex items-center justify-between shrink-0 z-30 select-none">
      {/* Zone 1: Single text element wordmark in display font */}
      <div className="flex items-center gap-3">
        <span className="font-display text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] inline-block animate-pulse"></span>
          GLYPH // DITHER 3D
        </span>
      </div>

      {/* Zone 2: Navigation Links / Segmented Mode Selector */}
      <nav className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10 text-xs">
        <button
          onClick={() => onSelectSourceMode('3d-mesh')}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-all whitespace-nowrap ${
            sourceMode === '3d-mesh'
              ? 'bg-[#d4ff00] text-black font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
          title="3D Classical Sculptures & Models"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Mesh</span>
        </button>

        <button
          onClick={() => onSelectSourceMode('image')}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-all whitespace-nowrap ${
            sourceMode === 'image'
              ? 'bg-[#d4ff00] text-black font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
          title="Upload Custom Image or Texture"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image</span>
        </button>

        <button
          onClick={() => onSelectSourceMode('webcam')}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-all whitespace-nowrap ${
            sourceMode === 'webcam'
              ? 'bg-[#d4ff00] text-black font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
          title="Live Camera Feed Halftone"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Live Webcam</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetView}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
          title="Reset 3D Camera Angle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={onOpenHowItWorks}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span className="hidden md:inline">How It Works & Code</span>
          <span className="md:hidden">Guide</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-black bg-[#d4ff00] hover:bg-[#bce400] rounded-md transition-colors shadow-sm whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export SVG / PNG</span>
        </button>
      </div>
    </header>
  );
};
