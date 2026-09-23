import React, { useState } from 'react';
import { X, Copy, Check, Code2, Cpu, Eye, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'code-canvas' | 'code-three' | 'code-shader' | 'code-svg'>('architecture');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const canvasCodeSnippet = `// Minimal Standalone Canvas2D Symbol Halftone
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 16; // Grid resolution

// 1. Array of SVG Path2D or unicode dingbats sorted by visual weight
const glyphs = [
  new Path2D('M 50,44 A 6,6 0 1,0 50,56 Z'), // light dot
  new Path2D('M 50,6 Q 50,50 6,50 Q 50,50 50,94 Z'), // diamond
  new Path2D('M 58,5 L 22,55 L 48,55 L 42,95 L 78,45 Z'), // lightning
  new Path2D('M 50,20 C 58,20 62,30 57,37 ... Z'), // flower
  new Path2D('M 50,2 A 48,48 0 1,0 50,98 Z') // 8-ball (dense)
];

function render(sourceImageData) {
  const { data, width, height } = sourceImageData;
  ctx.fillStyle = '#D4FF00'; // Electric volt background
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#080808'; // Onyx icons

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      // Sample luminance: 0.299R + 0.587G + 0.114B
      const idx = (y * width + x) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
      
      // Invert: dark shadows become dense glyphs
      const density = 1.0 - lum;
      if (density < 0.15) continue; // Skip highlights

      // Map to glyph index
      const glyphIdx = Math.min(glyphs.length - 1, Math.floor(density * glyphs.length));
      
      ctx.save();
      ctx.translate(x + cellSize / 2, y + cellSize / 2);
      ctx.scale((cellSize / 100) * 1.2, (cellSize / 100) * 1.2);
      ctx.translate(-50, -50);
      ctx.fill(glyphs[glyphIdx]);
      ctx.restore();
    }
  }
}`;

  const threeCodeSnippet = `// Three.js Luminance Buffer to Glyph Matrix Pipeline
import * as THREE from 'three';

// 1. Setup Three.js 3D Scene with Classical Sculpture
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(0, 0, 8);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const mesh = new THREE.Mesh(
  classicalSculptureGeometry,
  new THREE.MeshStandardMaterial({ roughness: 0.4 })
);
scene.add(mesh);

// 2. Offscreen Render Target or WebGL Canvas
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(width, height);

// 3. Render loop extracting pixels to feed 2D Glyph rasterizer
function animate() {
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);

  // Read pixel buffer
  const offscreenCanvas = document.createElement('canvas');
  const ctx = offscreenCanvas.getContext('2d');
  ctx.drawImage(renderer.domElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);

  // Send to 2D symbol dither engine
  drawGlyphGrid(imageData);
  requestAnimationFrame(animate);
}`;

  const glslCodeSnippet = `// GLSL Fragment Shader: Texture Atlas Glyph Halftone
uniform sampler2D u_sceneTexture; // Offscreen 3D sculpture render
uniform sampler2D u_glyphAtlas;   // Texture atlas of icons (8-ball, flower, etc.)
uniform vec2 u_resolution;
uniform float u_cellSize;         // Grid cell size in pixels

void main() {
  // 1. Discretize UV coordinates into grid cells
  vec2 cellIndex = floor(gl_FragCoord.xy / u_cellSize);
  vec2 cellUV = fract(gl_FragCoord.xy / u_cellSize);
  vec2 sampleCoord = (cellIndex * u_cellSize + u_cellSize * 0.5) / u_resolution;

  // 2. Read luminance of 3D sculpture at cell center
  vec4 color = texture2D(u_sceneTexture, sampleCoord);
  float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  float density = clamp(1.0 - lum, 0.0, 1.0);

  // 3. Pick glyph slice from atlas based on density
  float numGlyphs = 12.0;
  float glyphTier = floor(density * numGlyphs);
  vec2 atlasUV = vec2((cellUV.x + glyphTier) / numGlyphs, cellUV.y);

  float glyphMask = texture2D(u_glyphAtlas, atlasUV).r;

  // 4. Output high-contrast acid green (#D4FF00) and noir (#080808)
  vec3 bgColor = vec3(0.83, 1.0, 0.0);
  vec3 fgColor = vec3(0.03, 0.03, 0.03);
  gl_FragColor = vec4(mix(bgColor, fgColor, glyphMask), 1.0);
}`;

  const svgCodeSnippet = `// Exporting to Adobe Illustrator / Figma as Real Vector SVG
function generateVectorSVG(instances, width, height, bgColor, fgColor) {
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" ' +
            'viewBox="0 0 ' + width + ' ' + height + '" ' +
            'width="' + width + '" height="' + height + '">\\n';
  svg += '  <rect width="100%" height="100%" fill="' + bgColor + '" />\\n';
  svg += '  <g fill="' + fgColor + '">\\n';

  for (const item of instances) {
    const transform = 'translate(' + item.x + ',' + item.y + ') ' +
                      'rotate(' + item.rotation + ') ' +
                      'scale(' + item.scale + ') ' +
                      'translate(-50,-50)';
    svg += '    <path d="' + item.svgPath + '" transform="' + transform + '" />\\n';
  }

  svg += '  </g>\\n</svg>';
  return svg;
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0d0d0d] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#d4ff00]/10 text-[#d4ff00]">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                How to Build 3D Icon Halftone Designs
              </h2>
              <p className="text-xs text-white/50">
                Mathematics, rendering pipeline architecture & production code
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

        {/* Modal Tabs */}
        <div className="flex border-b border-white/10 bg-black/40 px-6 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>5-Step Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('code-canvas')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'code-canvas'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Canvas 2D Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('code-three')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'code-three'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Three.js WebGL Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('code-shader')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'code-shader'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>GLSL Shader Atlas</span>
          </button>

          <button
            onClick={() => setActiveTab('code-svg')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'code-svg'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Vector SVG Exporter</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-white/80">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-[#d4ff00]">Overview:</span> The Creative Concept
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  The visual style seen in your video combines <strong>classical 3D sculpture lighting</strong> with 
                  <strong> Y2K acid-house graphic design</strong> and <strong>optical halftone dithering</strong>. 
                  Instead of standard round raster dots, each cell is mapped to a discrete vector glyph 
                  (8-balls, flowers, lightning, stars, hazard warnings, scissors) whose optical visual mass 
                  corresponds precisely to the shadowed surfaces of the 3D model.
                </p>
              </div>

              {/* 5 Stages Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  The Complete 5-Stage Technical Pipeline:
                </h4>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#d4ff00]">
                      <span className="w-5 h-5 rounded-full bg-[#d4ff00]/20 flex items-center justify-center font-mono">
                        1
                      </span>
                      <span>3D Mesh & Studio Rim Lighting</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Render the 3D sculpture (classical torso, bust, or model) with high-contrast directional 
                      and rim lighting. This creates deep form shadows and crisp silhouette edges.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#d4ff00]">
                      <span className="w-5 h-5 rounded-full bg-[#d4ff00]/20 flex items-center justify-center font-mono">
                        2
                      </span>
                      <span>Spatial Discretization (Grid)</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Partition the viewport into a regular 2D grid of size <code className="text-[#d4ff00]">cellSize</code> 
                      (e.g. 8px for fine micro-halftone like video 00:00, or 32px for large graphic posters like video 00:02).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#d4ff00]">
                      <span className="w-5 h-5 rounded-full bg-[#d4ff00]/20 flex items-center justify-center font-mono">
                        3
                      </span>
                      <span>Photometric Luminance & Inversion</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Extract cell brightness using the standard luminance formula: 
                      <code className="text-[#d4ff00] block mt-1">L = 0.299R + 0.587G + 0.114B</code>
                      Inverting luminance ensures that dark sculpture shadows produce dense symbols, while the bright 
                      neon chartreuse backdrop remains unpopulated.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#d4ff00]">
                      <span className="w-5 h-5 rounded-full bg-[#d4ff00]/20 flex items-center justify-center font-mono">
                        4
                      </span>
                      <span>Symbol Weight Quantization</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Sort glyphs by their visual black fill percentage (from sparse diamonds to dense 8-balls). 
                      Map each cell's density to an index:
                      <code className="text-[#d4ff00] block mt-1">glyphIndex = floor(density * glyphs.length)</code>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#d4ff00]">
                      <span className="w-5 h-5 rounded-full bg-[#d4ff00]/20 flex items-center justify-center font-mono">
                        5
                      </span>
                      <span>High-Performance Instanced Rendering</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Draw instances via HTML5 Canvas <code className="text-[#d4ff00]">Path2D</code> objects or WebGL instanced 
                      quads with optional rotation jitter and kinetic wave pulses. Export to SVG vector paths for print.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code-canvas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">
                  Self-contained HTML5 Canvas 2D implementation (runs in any browser):
                </span>
                <button
                  onClick={() => copyToClipboard(canvasCodeSnippet, 'canvas')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  {copied === 'canvas' ? <Check className="w-3.5 h-3.5 text-[#d4ff00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'canvas' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#d4ff00] overflow-x-auto leading-relaxed">
                {canvasCodeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'code-three' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">
                  Three.js 3D Offscreen Luminance Extraction pipeline:
                </span>
                <button
                  onClick={() => copyToClipboard(threeCodeSnippet, 'three')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  {copied === 'three' ? <Check className="w-3.5 h-3.5 text-[#d4ff00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'three' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#d4ff00] overflow-x-auto leading-relaxed">
                {threeCodeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'code-shader' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">
                  GLSL Fragment Shader approach (Texture Atlas / Pure GPU):
                </span>
                <button
                  onClick={() => copyToClipboard(glslCodeSnippet, 'shader')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  {copied === 'shader' ? <Check className="w-3.5 h-3.5 text-[#d4ff00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'shader' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#d4ff00] overflow-x-auto leading-relaxed">
                {glslCodeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'code-svg' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">
                  Vector SVG Serializer for Adobe Illustrator & Figma:
                </span>
                <button
                  onClick={() => copyToClipboard(svgCodeSnippet, 'svg')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  {copied === 'svg' ? <Check className="w-3.5 h-3.5 text-[#d4ff00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'svg' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#d4ff00] overflow-x-auto leading-relaxed">
                {svgCodeSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between bg-black/60">
          <span className="text-xs text-white/40">
            Use this interactive studio to tweak parameters in real-time or export code directly.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
