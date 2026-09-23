import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  InputSourceMode,
  MeshModelType,
  RenderSettings,
  GlyphItem,
} from '../types';
import { ThreeSceneManager } from '../utils/threeSceneManager';
import { renderGlyphCanvas } from '../utils/ditherEngine';
import { Camera, AlertCircle, Move3D, Eye } from 'lucide-react';

interface GlyphViewportProps {
  sourceMode: InputSourceMode;
  modelType: MeshModelType;
  customGeometry: any;
  glyphs: GlyphItem[];
  settings: RenderSettings;
  bgColor: string;
  fgColor: string;
  uploadedImageUrl: string | null;
  onSetSourceImageData: (data: ImageData | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const GlyphViewport: React.FC<GlyphViewportProps> = ({
  sourceMode,
  modelType,
  customGeometry,
  glyphs,
  settings,
  bgColor,
  fgColor,
  uploadedImageUrl,
  onSetSourceImageData,
  canvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeManagerRef = useRef<ThreeSceneManager | null>(null);

  // Webcam state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [cameraRetryCount, setCameraRetryCount] = useState(0);

  // Uploaded image element
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // FPS & Performance stats
  const [fps, setFps] = useState(60);
  const [glyphCount, setGlyphCount] = useState(0);

  // Initialize Three.js scene manager
  useEffect(() => {
    const width = 800;
    const height = 800;
    const manager = new ThreeSceneManager(width, height);
    threeManagerRef.current = manager;

    return () => {
      manager.dispose();
      threeManagerRef.current = null;
    };
  }, []);

  // Update model in ThreeSceneManager when modelType or customGeometry changes
  useEffect(() => {
    if (threeManagerRef.current) {
      threeManagerRef.current.setModel(modelType, customGeometry);
    }
  }, [modelType, customGeometry]);

  // Load uploaded image element
  useEffect(() => {
    if (sourceMode === 'image' && uploadedImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedImageUrl;
      img.onload = () => {
        imageElementRef.current = img;
      };
    }
  }, [sourceMode, uploadedImageUrl]);

  // Request / Initialize camera stream
  const requestCameraAccess = useCallback(() => {
    setWebcamError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setWebcamError('Camera API is not supported in this browser environment.');
      setWebcamActive(false);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
      })
      .then((s) => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current
            .play()
            .then(() => {
              setWebcamActive(true);
              setWebcamError(null);
            })
            .catch(() => {
              setWebcamActive(true);
            });
        }
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        const name = err?.name;
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setWebcamError(
            'Camera permission was dismissed or denied. Click "Enable Camera" or check your browser address bar icon to allow access.'
          );
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          setWebcamError('No camera device found on your system.');
        } else {
          setWebcamError('Could not start camera feed: ' + (err?.message || 'Access error'));
        }
        setWebcamActive(false);
      });
  }, []);

  // Initialize or teardown webcam
  useEffect(() => {
    if (sourceMode === 'webcam') {
      requestCameraAccess();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        setWebcamActive(false);
      };
    }
  }, [sourceMode, cameraRetryCount, requestCameraAccess]);

  // Animation render loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCounter = 0;
    let lastFpsUpdate = performance.now();

    // Offscreen 2D canvas for webcam & image sampling
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    const renderLoop = (timeNow: number) => {
      const deltaTime = (timeNow - lastTime) / 1000;
      lastTime = timeNow;

      frameCounter++;
      if (timeNow - lastFpsUpdate > 1000) {
        setFps(frameCounter);
        frameCounter = 0;
        lastFpsUpdate = timeNow;
      }

      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (canvas && container) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = container.getBoundingClientRect();
        const displayWidth = Math.floor(rect.width);
        const displayHeight = Math.floor(rect.height);

        if (displayWidth > 0 && displayHeight > 0) {
          if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            let sourceImageData: ImageData | null = null;

            if (sourceMode === '3d-mesh' && threeManagerRef.current) {
              threeManagerRef.current.setSize(displayWidth, displayHeight);
              threeManagerRef.current.update(settings, deltaTime);
              sourceImageData = threeManagerRef.current.renderAndGetImageData();
            } else if (sourceMode === 'webcam' && videoRef.current && webcamActive) {
              const video = videoRef.current;
              if (video.readyState >= 2) {
                offCanvas.width = displayWidth;
                offCanvas.height = displayHeight;
                if (offCtx) {
                  // Mirror camera for natural feel
                  offCtx.save();
                  offCtx.translate(displayWidth, 0);
                  offCtx.scale(-1, 1);
                  offCtx.drawImage(video, 0, 0, displayWidth, displayHeight);
                  offCtx.restore();
                  sourceImageData = offCtx.getImageData(0, 0, displayWidth, displayHeight);
                }
              }
            } else if (sourceMode === 'image' && imageElementRef.current) {
              const img = imageElementRef.current;
              offCanvas.width = displayWidth;
              offCanvas.height = displayHeight;
              if (offCtx) {
                const imgAspect = img.width / img.height;
                const canvasAspect = displayWidth / displayHeight;
                let drawW = displayWidth;
                let drawH = displayHeight;
                let offsetX = 0;
                let offsetY = 0;

                const fitMode = settings.imageFit || 'contain';

                if (fitMode === 'contain') {
                  // Contain: image fits entirely on screen with no clipping/loss
                  if (imgAspect > canvasAspect) {
                    drawW = displayWidth;
                    drawH = displayWidth / imgAspect;
                    offsetY = (displayHeight - drawH) / 2;
                  } else {
                    drawH = displayHeight;
                    drawW = displayHeight * imgAspect;
                    offsetX = (displayWidth - drawW) / 2;
                  }
                } else if (fitMode === 'cover') {
                  // Cover: fills entire viewport, cropping excess edges
                  if (canvasAspect > imgAspect) {
                    drawW = displayWidth;
                    drawH = displayWidth / imgAspect;
                    offsetY = (displayHeight - drawH) / 2;
                  } else {
                    drawH = displayHeight;
                    drawW = displayHeight * imgAspect;
                    offsetX = (displayWidth - drawW) / 2;
                  }
                } else {
                  // Stretch: fit exactly to canvas dimensions
                  drawW = displayWidth;
                  drawH = displayHeight;
                }

                // If inverted is true, unpainted canvas borders should be black; otherwise white (so no glyphs appear outside the image in contain mode)
                offCtx.fillStyle = settings.invert ? '#000000' : '#ffffff';
                offCtx.fillRect(0, 0, displayWidth, displayHeight);
                offCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
                sourceImageData = offCtx.getImageData(0, 0, displayWidth, displayHeight);
              }
            }

            if (sourceImageData) {
              onSetSourceImageData(sourceImageData);

              renderGlyphCanvas({
                sourceImageData,
                targetCtx: ctx,
                targetWidth: displayWidth,
                targetHeight: displayHeight,
                glyphs,
                settings,
                bgColor,
                fgColor,
                time: timeNow * 0.001,
              });

              // Rough glyph instance count estimate
              const cols = Math.floor(displayWidth / settings.cellSize);
              const rows = Math.floor(displayHeight / settings.cellSize);
              setGlyphCount(Math.round(cols * rows * 0.45));
            } else {
              // Neutral background while loading
              ctx.fillStyle = bgColor;
              ctx.fillRect(0, 0, displayWidth, displayHeight);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    sourceMode,
    webcamActive,
    settings,
    glyphs,
    bgColor,
    fgColor,
    onSetSourceImageData,
    canvasRef,
  ]);

  // Pointer interaction for 3D orbit
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (sourceMode === '3d-mesh' && threeManagerRef.current) {
      threeManagerRef.current.handlePointerDown(e.clientX, e.clientY);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (sourceMode === '3d-mesh' && threeManagerRef.current) {
      threeManagerRef.current.handlePointerMove(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (sourceMode === '3d-mesh' && threeManagerRef.current) {
      threeManagerRef.current.handlePointerUp();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture release fallback
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hidden video element for live webcam stream */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full block touch-none"
      />

      {/* Subtle Bottom HUD Overlay */}
      <div className="absolute bottom-5 left-5 pointer-events-none z-10 flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs flex items-center gap-2 font-mono">
          <Move3D className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span>DRAG TO ORBIT 3D</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60">~{glyphCount} ICONS</span>
        </div>

        <div className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/50 text-xs font-mono">
          {fps} FPS
        </div>
      </div>

      {/* Webcam overlay prompt / error banner */}
      {sourceMode === 'webcam' && (
        <>
          {!webcamActive && !webcamError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/70 backdrop-blur-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center mb-4 text-[#d4ff00] animate-pulse">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Requesting Camera Access</h3>
              <p className="text-xs text-white/60 max-w-sm mb-5 leading-relaxed">
                Please allow camera permissions in your browser prompt to see your live video stream transformed into real-time icon dither.
              </p>
              <button
                onClick={() => {
                  setCameraRetryCount((c) => c + 1);
                  requestCameraAccess();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bce400] text-black font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Prompt Camera Permission</span>
              </button>
            </div>
          )}

          {webcamError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Camera Permission Needed</h3>
              <p className="text-xs text-red-200/90 max-w-md mb-6 leading-relaxed bg-red-950/40 p-3 rounded-lg border border-red-500/20">
                {webcamError}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setCameraRetryCount((c) => c + 1);
                    requestCameraAccess();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bce400] text-black font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Ask For Camera Permission Again</span>
                </button>
              </div>
              <span className="text-[11px] text-white/40 mt-4">
                Tip: If your browser already blocked it, tap the lock/camera icon next to the URL in your browser bar to set Camera to "Allow".
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
