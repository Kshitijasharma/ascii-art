import React from 'react';
import {
  Sparkles,
  Camera,
  Image as ImageIcon,
  Box,
  Play,
  HelpCircle,
} from 'lucide-react';
import { InputSourceMode, MeshModelType } from '../types';

interface LandingHomeProps {
  onEnterStudio: (sourceMode?: InputSourceMode, model?: MeshModelType) => void;
  onOpenGithubReadme: () => void;
  onOpenHowItWorks: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  onEnterStudio,
  onOpenHowItWorks,
}) => {
  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col justify-between p-6 sm:p-10 md:p-12 select-none font-calibri">
      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between pb-6 border-b border-black/15">
        {/* Top Left Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterStudio('3d-mesh')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-sm bg-black text-white flex items-center justify-center font-bold text-sm tracking-tight group-hover:bg-[#bcf800] group-hover:text-black transition-colors">
              AR
            </span>
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-black group-hover:text-black transition-colors">
              asciireadme
            </span>
          </button>
        </div>

        {/* Top Right "How it works?" button with neon lime hover */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenHowItWorks}
            className="px-4 py-1.5 rounded-sm border border-black/20 text-base font-semibold text-black hover:bg-[#bcf800] hover:border-black/50 hover:text-black transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            title="How it works?"
          >
            <HelpCircle className="w-4 h-4 text-black" strokeWidth={2.2} />
            <span>How it works ?</span>
          </button>
        </div>
      </header>

      {/* Main Fullscreen Hero Section - centered & using full width */}
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center py-10 sm:py-14 px-4 max-w-6xl mx-auto space-y-6">
        {/* Subtle Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-black/15 bg-black/[0.03] text-sm text-black/80 font-medium">
          <Sparkles className="w-4 h-4 text-black" />
          <span>Transform your github into ascii art</span>
        </div>

        {/* The single-line centered headline utilizing the full horizontal space */}
        <h1 className="w-full text-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold text-black tracking-tight leading-none whitespace-nowrap overflow-visible">
          change your github readme
        </h1>

        {/* Clean subtitle */}
        <p className="text-base sm:text-xl text-black/70 max-w-2xl mx-auto font-normal leading-relaxed">
          Turn your GitHub profile, code, and photos into kinetic icon dithering & ascii art.
        </p>

        {/* Action Buttons Row with exact neon lime #bcf800 hover effect */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onEnterStudio('3d-mesh')}
            className="px-8 py-3.5 rounded-md bg-black text-white font-semibold text-base sm:text-lg transition-all border border-black hover:bg-[#bcf800] hover:text-black hover:border-black hover:shadow-md flex items-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open 3D Studio Live</span>
          </button>
        </div>
      </main>

      {/* Bottom Launcher Modes (without skull button, 3 cleanly balanced options) with neon lime hover effect */}
      <footer className="w-full pt-6 border-t border-black/15">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-sm sm:text-base font-bold tracking-wider uppercase text-black/90">
            Choose a canvas mode:
          </span>
          <span className="text-xs sm:text-sm text-black/50 font-medium">60 FPS WebGL Halftone</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              title: 'Classical Torso',
              desc: '3D sculpture bust',
              mode: '3d-mesh' as InputSourceMode,
              model: 'classical-torso' as MeshModelType,
              icon: Box,
            },
            {
              title: 'Live Webcam',
              desc: 'Camera mirror dithering',
              mode: 'webcam' as InputSourceMode,
              model: 'classical-torso' as MeshModelType,
              icon: Camera,
            },
            {
              title: 'Custom Photo',
              desc: 'Aspect-fit image upload',
              mode: 'image' as InputSourceMode,
              model: 'classical-torso' as MeshModelType,
              icon: ImageIcon,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => onEnterStudio(card.mode, card.model)}
                className="p-3.5 sm:p-4 rounded-md border border-black/15 bg-white hover:bg-[#bcf800] hover:border-black/50 hover:shadow-md cursor-pointer transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-1.5 rounded bg-black/5 group-hover:bg-white text-black transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-black/50 group-hover:text-black font-semibold">
                    Launch →
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black leading-tight">
                  {card.title}
                </h4>
                <p className="text-xs sm:text-sm text-black/60 group-hover:text-black/80 mt-1 leading-snug">
                  {card.desc}
                </p>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
