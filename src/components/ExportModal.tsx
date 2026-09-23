import React, { useState } from 'react';
import { X, Download, FileCode, Film, Check, Loader2, Sparkles } from 'lucide-react';
import { GlyphItem, RenderSettings } from '../types';
import { generateVectorSVG, renderGlyphCanvas } from '../utils/ditherEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sourceImageData: ImageData | null;
  glyphs: GlyphItem[];
  settings: RenderSettings;
  bgColor: string;
  fgColor: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  sourceImageData,
  glyphs,
  settings,
  bgColor,
  fgColor,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export High-Res PNG
  const handleExportPNG = (scale: number) => {
    if (!sourceImageData) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const outWidth = sourceImageData.width * scale;
        const outHeight = sourceImageData.height * scale;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = outWidth;
        offCanvas.height = outHeight;
        const ctx = offCanvas.getContext('2d');

        if (ctx) {
          const scaledSettings = {
            ...settings,
            cellSize: settings.cellSize * scale,
          };

          renderGlyphCanvas({
            sourceImageData,
            targetCtx: ctx,
            targetWidth: outWidth,
            targetHeight: outHeight,
            glyphs,
            settings: scaledSettings,
            bgColor,
            fgColor,
          });

          const dataUrl = offCanvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `glyph-dither-${outWidth}x${outHeight}.png`;
          a.click();

          setDownloadSuccess(`png-${scale}`);
          setTimeout(() => setDownloadSuccess(null), 3000);
        }
      } catch (err) {
        console.error('PNG export failed:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  };

  // 2. Export Vector SVG
  const handleExportSVG = () => {
    if (!sourceImageData) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const svgContent = generateVectorSVG(
          sourceImageData,
          sourceImageData.width,
          sourceImageData.height,
          glyphs,
          settings,
          bgColor,
          fgColor
        );

        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glyph-dither-vector.svg';
        a.click();
        URL.revokeObjectURL(url);

        setDownloadSuccess('svg');
        setTimeout(() => setDownloadSuccess(null), 3000);
      } catch (err) {
        console.error('SVG export failed:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  };

  // 3. Record Video Loop (WebM)
  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    try {
      const stream = canvas.captureStream(60);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glyph-dither-animation.webm';
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setDownloadSuccess('video');
        setTimeout(() => setDownloadSuccess(null), 3000);
      };

      mediaRecorder.start();
      setIsRecording(true);

      const durationMs = 4000;
      const interval = 100;
      let elapsed = 0;

      const timer = setInterval(() => {
        elapsed += interval;
        setRecordProgress(Math.min(100, Math.round((elapsed / durationMs) * 100)));
        if (elapsed >= durationMs) {
          clearInterval(timer);
          mediaRecorder.stop();
        }
      }, interval);
    } catch (err) {
      console.error('Video recording failed:', err);
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#d4ff00]/10 text-[#d4ff00]">
              <Download className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Export Artwork
              </h2>
              <p className="text-xs text-white/50">
                Vector SVG for print, high-res PNG, or animated video
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Option 1: True Vector SVG */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#d4ff00]" />
                <span className="text-sm font-semibold text-white">
                  Infinite Vector SVG
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d4ff00]/20 text-[#d4ff00] font-mono">
                  PRO
                </span>
              </div>
              <p className="text-xs text-white/50 max-w-xs">
                Clean SVG paths for Adobe Illustrator, Figma, pen plotters, or poster printing.
              </p>
            </div>

            <button
              onClick={handleExportSVG}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {downloadSuccess === 'svg' ? (
                <>
                  <Check className="w-4 h-4 text-[#d4ff00]" />
                  <span>Exported!</span>
                </>
              ) : (
                <span>Download SVG</span>
              )}
            </button>
          </div>

          {/* Option 2: High-Resolution Raster PNG */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4ff00]" />
              <span className="text-sm font-semibold text-white">
                High-Resolution PNG Poster
              </span>
            </div>
            <p className="text-xs text-white/50">
              Crisp raster export with pixel-perfect icon anti-aliasing.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: '1x Screen', scale: 1 },
                { label: '2x Retina', scale: 2 },
                { label: '4x Ultra HD', scale: 4 },
              ].map((res) => (
                <button
                  key={res.scale}
                  onClick={() => handleExportPNG(res.scale)}
                  disabled={isGenerating}
                  className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex flex-col items-center gap-1"
                >
                  <span>{res.label}</span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {sourceImageData
                      ? `${sourceImageData.width * res.scale}px`
                      : 'Auto'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Animated 4s Video Loop */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#d4ff00]" />
                <span className="text-sm font-semibold text-white">
                  Rotating Animation (WebM)
                </span>
              </div>
              <p className="text-xs text-white/50 max-w-xs">
                Captures 4 seconds of smooth 60fps 3D rotation for social media.
              </p>
            </div>

            <button
              onClick={handleRecordVideo}
              disabled={isRecording}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording ({recordProgress}%)</span>
                </>
              ) : downloadSuccess === 'video' ? (
                <>
                  <Check className="w-4 h-4 text-[#d4ff00]" />
                  <span>Recorded!</span>
                </>
              ) : (
                <span>Record Loop</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-end bg-black/60">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
