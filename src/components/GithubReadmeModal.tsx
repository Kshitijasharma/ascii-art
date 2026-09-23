import React, { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Download,
  Copy,
  Check,
  Github,
  Sparkles,
  User,
  Activity,
  Code,
  Smile,
  RefreshCw,
  Layout,
  FileCode,
  ZoomIn,
  ZoomOut,
  Sliders,
  Type,
  MapPin,
  Briefcase,
  Palette,
  QrCode as QrIcon,
  Linkedin,
  ExternalLink,
  Shield,
  Terminal,
} from 'lucide-react';
import { GlyphItem, RenderSettings } from '../types';

interface GithubReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sourceImageData: ImageData | null;
  glyphs: GlyphItem[];
  settings: RenderSettings;
  bgColor: string;
  fgColor: string;
}

export type HeadingFontId =
  | 'system'
  | 'syne'
  | 'space-grotesk'
  | 'orbitron'
  | 'jetbrains'
  | 'playfair'
  | 'inter';

export type BodyFontId =
  | 'system'
  | 'jetbrains'
  | 'fira-code'
  | 'inter'
  | 'plus-jakarta';

export interface FontOption {
  id: string;
  name: string;
  cssFamily: string;
  canvasFont: string;
}

export const HEADING_FONTS: Record<HeadingFontId, FontOption> = {
  system: {
    id: 'system',
    name: 'Modern Sans (System)',
    cssFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    canvasFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  syne: {
    id: 'syne',
    name: 'Syne (Geometric Brutalist)',
    cssFamily: '"Syne", sans-serif',
    canvasFont: '"Syne", sans-serif',
  },
  'space-grotesk': {
    id: 'space-grotesk',
    name: 'Space Grotesk (Tech Neo)',
    cssFamily: '"Space Grotesk", sans-serif',
    canvasFont: '"Space Grotesk", sans-serif',
  },
  orbitron: {
    id: 'orbitron',
    name: 'Orbitron (Futuristic Cyber)',
    cssFamily: '"Orbitron", sans-serif',
    canvasFont: '"Orbitron", sans-serif',
  },
  jetbrains: {
    id: 'jetbrains',
    name: 'JetBrains Mono (Developer)',
    cssFamily: '"JetBrains Mono", monospace',
    canvasFont: '"JetBrains Mono", monospace',
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Display (Editorial Serif)',
    cssFamily: '"Playfair Display", serif',
    canvasFont: '"Playfair Display", serif',
  },
  inter: {
    id: 'inter',
    name: 'Inter (Clean & Legible)',
    cssFamily: '"Inter", sans-serif',
    canvasFont: '"Inter", sans-serif',
  },
};

export const BODY_FONTS: Record<BodyFontId, FontOption> = {
  system: {
    id: 'system',
    name: 'Modern Sans (System)',
    cssFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    canvasFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  inter: {
    id: 'inter',
    name: 'Inter (Clean & Legible)',
    cssFamily: '"Inter", sans-serif',
    canvasFont: '"Inter", sans-serif',
  },
  'plus-jakarta': {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    cssFamily: '"Plus Jakarta Sans", sans-serif',
    canvasFont: '"Plus Jakarta Sans", sans-serif',
  },
  jetbrains: {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    cssFamily: '"JetBrains Mono", monospace',
    canvasFont: '"JetBrains Mono", monospace',
  },
  'fira-code': {
    id: 'fira-code',
    name: 'Fira Code',
    cssFamily: '"Fira Code", monospace',
    canvasFont: '"Fira Code", monospace',
  },
};

export interface ColorPreset {
  id: string;
  name: string;
  value: string;
}

export const FONT_COLOR_PRESETS: ColorPreset[] = [
  { id: 'white', name: 'Clean White', value: '#ffffff' },
  { id: 'green-volt', name: 'Acid Volt', value: '#d4ff00' },
  { id: 'green-emerald', name: 'Emerald', value: '#86efac' },
  { id: 'green-sage', name: 'Sage Green', value: '#a7f3d0' },
  { id: 'cyan', name: 'Sky Cyan', value: '#7dd3fc' },
  { id: 'peach', name: 'Soft Peach', value: '#fed7aa' },
  { id: 'rose', name: 'Muted Rose', value: '#fecdd3' },
  { id: 'silver', name: 'Soft Silver', value: '#cbd5e1' },
];

export const ACCENT_COLOR_PRESETS: ColorPreset[] = [
  { id: 'green-volt', name: 'Volt Green (#d4ff00)', value: '#d4ff00' },
  { id: 'green-emerald', name: 'Emerald (#86efac)', value: '#86efac' },
  { id: 'green-sage', name: 'Sage Green (#a7f3d0)', value: '#a7f3d0' },
  { id: 'cyan', name: 'Ice Cyan', value: '#38bdf8' },
  { id: 'gold', name: 'Amber Gold', value: '#fcd34d' },
  { id: 'pink', name: 'Neon Pink', value: '#f472b6' },
  { id: 'white', name: 'Pure White', value: '#ffffff' },
];

export type HeaderStyleOption = 'minimal-bar' | 'compact-inline' | 'none';

interface ProfileData {
  name: string;
  role: string;
  location: string;
  status: string;
  skills: string;
  funPart: string;
  linkedinUrl: string;
  headerStyle: HeaderStyleOption;
  showMicroGrid: boolean;

  // Typography options
  headingFont: HeadingFontId;
  bodyFont: BodyFontId;

  // Font Colors - Defaults to Theme Green
  primaryTextColor: string;
  accentColor: string;

  // Zoom: extended scale from 0.5x up to 5.0x
  imageZoom: number;
  imageBorderRadius: number;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Alex Rivera',
  role: 'Systems Architect & Creative Technologist',
  location: 'India',
  status: '🚀 Researching real-time icon halftone shaders & kinetic ASCII toolkits',
  skills: 'TypeScript, Three.js, React, GLSL, WebAssembly, Node.js, Rust',
  funPart: 'Collects 90s acid-house vinyl records and fixes analog synthesizers 🎹⚡',
  linkedinUrl: 'https://linkedin.com/in/alex-rivera-dev',
  headerStyle: 'minimal-bar',
  showMicroGrid: true,
  headingFont: 'space-grotesk',
  bodyFont: 'jetbrains',
  primaryTextColor: '#ffffff',
  accentColor: '#d4ff00',
  imageZoom: 1.0,
  imageBorderRadius: 10,
};

export const GithubReadmeModal: React.FC<GithubReadmeModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  bgColor,
}) => {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [previewCanvasDataUrl, setPreviewCanvasDataUrl] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'markdown'>('editor');
  const [activeSettingsSection, setActiveSettingsSection] = useState<'profile' | 'fonts' | 'layout'>('profile');
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Generate pure, scan-tested standard QR Code (no text labels anywhere)
  useEffect(() => {
    let isSubscribed = true;
    const targetUrl = profile.linkedinUrl.trim() || 'https://www.linkedin.com';
    const fullUrl =
      targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
        ? targetUrl
        : `https://${targetUrl}`;

    QRCode.toDataURL(fullUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#ffffff',
        light: '#00000000', // Crisp transparent background
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isSubscribed) {
          setQrCodeDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [profile.linkedinUrl]);

  // Capture current dither portrait with passport proportion (4:5 aspect ratio)
  const refreshPortrait = useCallback(() => {
    const mainCanvas = canvasRef.current;
    if (mainCanvas) {
      try {
        const frameW = 420;
        const frameH = 500;
        const squareCanvas = document.createElement('canvas');
        squareCanvas.width = frameW;
        squareCanvas.height = frameH;
        const sCtx = squareCanvas.getContext('2d');
        if (sCtx) {
          sCtx.fillStyle = bgColor;
          sCtx.fillRect(0, 0, frameW, frameH);

          const { imageZoom } = profile;
          const aspect = mainCanvas.width / mainCanvas.height;

          let drawW = frameW;
          let drawH = frameH;

          if (aspect > frameW / frameH) {
            drawW = frameH * aspect;
            drawH = frameH;
          } else {
            drawW = frameW;
            drawH = frameW / aspect;
          }

          // Apply extended scale zoom centered
          const finalW = drawW * imageZoom;
          const finalH = drawH * imageZoom;
          const centerX = frameW / 2;
          const centerY = frameH / 2;

          sCtx.save();
          sCtx.drawImage(
            mainCanvas,
            centerX - finalW / 2,
            centerY - finalH / 2,
            finalW,
            finalH
          );
          sCtx.restore();

          setPreviewCanvasDataUrl(squareCanvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Error capturing portrait canvas:', err);
      }
    }
  }, [canvasRef, bgColor, profile.imageZoom]);

  useEffect(() => {
    if (isOpen) {
      refreshPortrait();
    }
  }, [isOpen, refreshPortrait]);

  if (!isOpen) return null;

  // Selected fonts
  const activeHeadingFont = HEADING_FONTS[profile.headingFont] || HEADING_FONTS.system;
  const activeBodyFont = BODY_FONTS[profile.bodyFont] || BODY_FONTS.jetbrains;

  // Format LinkedIn link safely
  const formattedLinkedinUrl = profile.linkedinUrl.startsWith('http')
    ? profile.linkedinUrl
    : `https://${profile.linkedinUrl}`;

  // Parse skills into tag array
  const skillTags = profile.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Generate GitHub Markdown snippet with green theme and LinkedIn profile link
  const generateMarkdown = () => {
    return `<div align="center">

# ${profile.name}
### ${profile.role} 📍 ${profile.location}

[![LinkedIn Profile](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](${formattedLinkedinUrl})

---

<table>
  <tr>
    <td width="30%" align="center" valign="top">
      <img src="./github-profile-card.png" width="100%" alt="${profile.name} Profile Photo" style="border-radius: ${profile.imageBorderRadius}px; border: 2px solid ${profile.accentColor};" />
    </td>
    <td width="70%" valign="top">
      <h2>${profile.name}</h2>
      <p><strong>💼 Title:</strong> ${profile.role}</p>
      <p><strong>📍 Location:</strong> ${profile.location}</p>
      <p><strong>🔗 LinkedIn:</strong> <a href="${formattedLinkedinUrl}">${profile.linkedinUrl}</a></p>
      
      <hr/>
      
      <p><strong>⚡ Status:</strong> ${profile.status}</p>
      <p><strong>🛠️ Skills:</strong> ${skillTags.map((s) => `<code>${s}</code>`).join(' · ')}</p>
      <p><strong>✨ Fun Part:</strong> ${profile.funPart}</p>
    </td>
  </tr>
</table>

</div>`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Helper for multi-line text wrapping on canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  // Helper to draw tech corner brackets
  const drawCornerBrackets = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    len: number,
    color: string
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(x, y + len);
    ctx.lineTo(x, y);
    ctx.lineTo(x + len, y);
    // Top-right
    ctx.moveTo(x + w - len, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + len);
    // Bottom-left
    ctx.moveTo(x, y + h - len);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + len, y + h);
    // Bottom-right
    ctx.moveTo(x + w - len, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - len);
    ctx.stroke();
    ctx.restore();
  };

  // Export Combined Profile ID Card with customizable Top Strip & Pure QR Code
  const handleExportProfileImage = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        const width = 1200;
        const height = 600; // Sleek identification card standard
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = width;
        exportCanvas.height = height;
        const ctx = exportCanvas.getContext('2d');

        if (!ctx) return;

        const cardBg = '#0a0d0a';
        const textPrimary = profile.primaryTextColor || '#ffffff';
        const textSecondary = '#cbd5e1';
        const accent = profile.accentColor || '#d4ff00';

        // 1. Base Dark Background
        ctx.fillStyle = cardBg;
        ctx.fillRect(0, 0, width, height);

        // Subtle tech grid pattern
        if (profile.showMicroGrid) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255,255,255,0.022)';
          ctx.lineWidth = 1;
          const gridSize = 40;
          for (let x = 24; x < width - 24; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 24);
            ctx.lineTo(x, height - 24);
            ctx.stroke();
          }
          for (let y = 24; y < height - 24; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(24, y);
            ctx.lineTo(width - 24, y);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Outer Card Border with rounded corners in theme green
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `${accent}66`;
        ctx.lineWidth = 2.5;
        if (ctx.roundRect) {
          ctx.roundRect(24, 24, width - 48, height - 48, 20);
        } else {
          ctx.rect(24, 24, width - 48, height - 48);
        }
        ctx.stroke();
        ctx.restore();

        const hFont = activeHeadingFont.canvasFont;
        const bFont = activeBodyFont.canvasFont;

        // TOP HEADER STRIP - Based on chosen style
        let contentStartY = 110;

        if (profile.headerStyle === 'minimal-bar') {
          // Minimal top bar with clean typography
          ctx.save();
          ctx.fillStyle = `${accent}14`;
          ctx.fillRect(34, 34, width - 68, 52);

          // Top accent line
          ctx.fillStyle = `${accent}88`;
          ctx.fillRect(34, 34, width - 68, 2);

          // Left Label: GITHUB DEVELOPER CARD
          ctx.fillStyle = accent;
          ctx.font = `bold 13px ${bFont}`;
          ctx.fillText('GITHUB DEVELOPER CARD', 56, 66);

          // Right Label: LOCATION: INDIA
          ctx.fillStyle = textSecondary;
          ctx.font = `500 12px ${bFont}`;
          const locText = `LOCATION: ${profile.location.toUpperCase()}`;
          const locWidth = ctx.measureText(locText).width;
          ctx.fillText(locText, width - 56 - locWidth, 66);
          ctx.restore();

          contentStartY = 110;
        } else if (profile.headerStyle === 'compact-inline') {
          // Subtle inline line without filled bar
          ctx.save();
          ctx.fillStyle = `${accent}bb`;
          ctx.font = `bold 12px ${bFont}`;
          ctx.fillText('GITHUB DEVELOPER CARD', 56, 58);

          ctx.fillStyle = textSecondary;
          ctx.font = `500 11px ${bFont}`;
          const locText = `LOCATION: ${profile.location.toUpperCase()}`;
          const locWidth = ctx.measureText(locText).width;
          ctx.fillText(locText, width - 56 - locWidth, 58);

          ctx.strokeStyle = `${accent}33`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(56, 72);
          ctx.lineTo(width - 56, 72);
          ctx.stroke();
          ctx.restore();

          contentStartY = 96;
        } else {
          // Header Style: None -> Maximized vertical content area
          contentStartY = 58;
        }

        // 2. LEFT: Photo Box (4:5 passport standard)
        const photoX = 56;
        const photoY = contentStartY;
        const photoW = 290;
        const photoH = profile.headerStyle === 'none' ? 480 : 430;
        const borderRadius = profile.imageBorderRadius;

        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(photoX, photoY, photoW, photoH, borderRadius);
        } else {
          ctx.rect(photoX, photoY, photoW, photoH);
        }
        ctx.clip();

        // Background of photo frame
        ctx.fillStyle = bgColor;
        ctx.fillRect(photoX, photoY, photoW, photoH);

        // Draw portrait fitted proportionally with extended zoom
        const mainCanvas = canvasRef.current;
        if (mainCanvas) {
          const { imageZoom } = profile;
          const aspect = mainCanvas.width / mainCanvas.height;
          let drawW = photoW;
          let drawH = photoH;

          if (aspect > photoW / photoH) {
            drawW = photoH * aspect;
            drawH = photoH;
          } else {
            drawW = photoW;
            drawH = photoW / aspect;
          }

          const finalW = drawW * imageZoom;
          const finalH = drawH * imageZoom;
          const centerX = photoX + photoW / 2;
          const centerY = photoY + photoH / 2;

          ctx.drawImage(
            mainCanvas,
            centerX - finalW / 2,
            centerY - finalH / 2,
            finalW,
            finalH
          );
        }
        ctx.restore();

        // Photo Frame Border
        ctx.save();
        ctx.strokeStyle = `${accent}88`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(photoX, photoY, photoW, photoH, borderRadius);
        } else {
          ctx.rect(photoX, photoY, photoW, photoH);
        }
        ctx.stroke();
        ctx.restore();

        // Corner accents on portrait frame
        drawCornerBrackets(ctx, photoX - 3, photoY - 3, photoW + 6, photoH + 6, 12, `${accent}aa`);

        // 3. RIGHT: Identity Data Fields
        const textX = 380;
        let curY = contentStartY + 26;

        // NAME
        ctx.fillStyle = accent;
        ctx.font = `bold 11px ${bFont}`;
        ctx.fillText('NAME', textX, curY);

        curY += 34;
        ctx.fillStyle = textPrimary;
        ctx.font = `bold 38px ${hFont}`;
        ctx.fillText(profile.name, textX, curY);

        curY += 30;

        // TITLE & LOCATION
        ctx.fillStyle = accent;
        ctx.font = `bold 11px ${bFont}`;
        ctx.fillText('TITLE & LOCATION', textX, curY);

        curY += 22;
        ctx.fillStyle = textPrimary;
        ctx.font = `600 16px ${bFont}`;
        ctx.fillText(`${profile.role} · ${profile.location}`, textX, curY);

        curY += 20;
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(textX, curY);
        ctx.lineTo(width - 56, curY);
        ctx.stroke();

        curY += 26;

        // CURRENT STATUS
        ctx.fillStyle = accent;
        ctx.font = `bold 11px ${bFont}`;
        ctx.fillText('CURRENT STATUS', textX, curY);

        curY += 20;
        ctx.fillStyle = textPrimary;
        ctx.font = `400 14px ${bFont}`;
        curY = wrapText(ctx, profile.status, textX, curY, 740, 20);

        curY += 16;

        // SKILLS (Rendered as clean tags)
        ctx.fillStyle = accent;
        ctx.font = `bold 11px ${bFont}`;
        ctx.fillText('CORE SKILLS & TECHNOLOGIES', textX, curY);

        curY += 22;

        // Draw skill badges on canvas
        ctx.font = `500 12px ${bFont}`;
        let tagX = textX;
        let tagY = curY;
        const tagHeight = 26;
        const tagPadding = 12;

        skillTags.forEach((skill) => {
          const tagWidth = ctx.measureText(skill).width + tagPadding * 2;
          if (tagX + tagWidth > width - 60) {
            tagX = textX;
            tagY += tagHeight + 8;
          }

          // Badge background
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.strokeStyle = `${accent}40`;
          ctx.lineWidth = 1;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(tagX, tagY - 16, tagWidth, tagHeight, 6);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillRect(tagX, tagY - 16, tagWidth, tagHeight);
            ctx.strokeRect(tagX, tagY - 16, tagWidth, tagHeight);
          }

          ctx.fillStyle = textPrimary;
          ctx.fillText(skill, tagX + tagPadding, tagY);
          ctx.restore();

          tagX += tagWidth + 8;
        });

        curY = tagY + 28;

        // FUN PART
        ctx.fillStyle = accent;
        ctx.font = `bold 11px ${bFont}`;
        ctx.fillText('FUN PART', textX, curY);

        curY += 20;
        ctx.fillStyle = textPrimary;
        ctx.font = `400 14px ${bFont}`;
        wrapText(ctx, profile.funPart, textX, curY, 520, 20);

        // 4. PURE QR CODE AT BOTTOM-RIGHT DOWN (NO TEXT LIKE LINKEDIN OR SCAN)
        const qrBoxSize = 82;
        const qrBoxX = width - qrBoxSize - 56;
        const qrBoxY = height - qrBoxSize - 44;

        // Sleek container box for QR code (without corner brackets)
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeStyle = `${accent}66`;
        ctx.lineWidth = 1.5;
        if (ctx.roundRect) {
          ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 12);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
          ctx.strokeRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
        }
        ctx.restore();

        const executeDownload = () => {
          const link = document.createElement('a');
          link.download = `github-readme-card-${profile.name.toLowerCase().replace(/\s+/g, '-')}.png`;
          link.href = exportCanvas.toDataURL('image/png');
          link.click();
          setIsExporting(false);
        };

        if (qrCodeDataUrl) {
          const qrImg = new Image();
          qrImg.onload = () => {
            const pad = 8;
            ctx.drawImage(
              qrImg,
              qrBoxX + pad,
              qrBoxY + pad,
              qrBoxSize - pad * 2,
              qrBoxSize - pad * 2
            );
            executeDownload();
          };
          qrImg.onerror = () => {
            executeDownload();
          };
          qrImg.src = qrCodeDataUrl;
          return;
        }

        executeDownload();
      } catch (err) {
        console.error('Error exporting profile card:', err);
        setIsExporting(false);
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#0c100d] border border-[#d4ff00]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header with theme green accent */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#d4ff00]/15 text-[#d4ff00]">
              <Github className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Github Readme Builder
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4ff00]/15 text-[#d4ff00] font-mono">
                  DEV CARD
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Refined developer identification card with customizable header & scannable QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs with green highlights */}
        <div className="flex border-b border-white/10 bg-black/40 px-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Interactive Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'markdown'
                ? 'border-[#d4ff00] text-[#d4ff00]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>README.md Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'editor' ? (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-5 space-y-4 text-xs">
                {/* Secondary navigation for settings */}
                <div className="grid grid-cols-3 gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSection('profile')}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeSettingsSection === 'profile'
                        ? 'bg-[#d4ff00] text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSettingsSection('fonts')}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeSettingsSection === 'fonts'
                        ? 'bg-[#d4ff00] text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Style</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSettingsSection('layout')}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeSettingsSection === 'layout'
                        ? 'bg-[#d4ff00] text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Header</span>
                  </button>
                </div>

                {/* SECTION 1: PROFILE FIELDS */}
                {activeSettingsSection === 'profile' && (
                  <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Name</span>
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none"
                        placeholder="Your Full Name"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Title</span>
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none"
                        placeholder="e.g. Systems Architect & Creative Technologist"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Location</span>
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none"
                        placeholder="e.g. India"
                      />
                    </div>

                    {/* LinkedIn URL Input Field */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>LinkedIn Profile URL</span>
                        </span>
                        <span className="text-[10px] text-white/50 font-normal">
                          Live Scannable QR
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={profile.linkedinUrl}
                          onChange={(e) =>
                            setProfile({ ...profile, linkedinUrl: e.target.value })
                          }
                          className="w-full pl-2.5 pr-8 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none font-mono"
                          placeholder="https://linkedin.com/in/username"
                        />
                        {profile.linkedinUrl && (
                          <a
                            href={formattedLinkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-2 top-2 text-white/40 hover:text-[#d4ff00] transition-colors"
                            title="Open link in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Status</span>
                      </label>
                      <textarea
                        rows={2}
                        value={profile.status}
                        onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none resize-none leading-relaxed"
                        placeholder="What are you currently building or learning?"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5" />
                        <span>Skills (Comma separated)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={profile.skills}
                        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none resize-none leading-relaxed"
                        placeholder="e.g. TypeScript, React, Three.js, Python, Node.js"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#d4ff00] block mb-1 flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5" />
                        <span>Fun Part</span>
                      </label>
                      <textarea
                        rows={2}
                        value={profile.funPart}
                        onChange={(e) => setProfile({ ...profile, funPart: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-[#d4ff00] focus:outline-none resize-none leading-relaxed"
                        placeholder="Hobbies, quirks, favorite music, or fun facts..."
                      />
                    </div>
                  </div>
                )}

                {/* SECTION 2: FONTS & STYLE */}
                {activeSettingsSection === 'fonts' && (
                  <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                      Typography & Palette
                    </span>

                    {/* FONT COLOR CONTROLS */}
                    <div className="space-y-3 p-3 rounded-lg bg-black/40 border border-white/10">
                      {/* 1. Main Text Font Color */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-white/90 flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-[#d4ff00]" />
                            <span>Font Color (Main Text)</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-white/30"
                              style={{ backgroundColor: profile.primaryTextColor }}
                            />
                            <span className="font-mono text-[10px] text-white/60">
                              {profile.primaryTextColor}
                            </span>
                          </div>
                        </div>

                        {/* Swatches for Main Text Color */}
                        <div className="grid grid-cols-4 gap-1.5">
                          {FONT_COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() =>
                                setProfile({ ...profile, primaryTextColor: preset.value })
                              }
                              className={`py-1 px-1.5 rounded-md border text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                profile.primaryTextColor.toLowerCase() === preset.value.toLowerCase()
                                  ? 'border-[#d4ff00] bg-white/10 font-bold text-white'
                                  : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                                style={{ backgroundColor: preset.value }}
                              />
                              <span className="truncate">{preset.name.split(' ')[1] || preset.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Custom Color Input for Main Text */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-white/50">Custom:</span>
                          <input
                            type="color"
                            value={profile.primaryTextColor}
                            onChange={(e) =>
                              setProfile({ ...profile, primaryTextColor: e.target.value })
                            }
                            className="w-6 h-6 rounded cursor-pointer border border-white/20 bg-transparent p-0"
                            title="Pick custom font color"
                          />
                          <input
                            type="text"
                            value={profile.primaryTextColor}
                            onChange={(e) =>
                              setProfile({ ...profile, primaryTextColor: e.target.value })
                            }
                            className="flex-1 px-2 py-0.5 rounded bg-black/60 border border-white/15 text-[11px] font-mono text-white focus:outline-none focus:border-[#d4ff00]"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      {/* 2. Accent Color */}
                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-white/90 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                            <span>Theme Accent Color</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-white/30"
                              style={{ backgroundColor: profile.accentColor }}
                            />
                            <span className="font-mono text-[10px] text-white/60">
                              {profile.accentColor}
                            </span>
                          </div>
                        </div>

                        {/* Swatches for Accent Color */}
                        <div className="grid grid-cols-4 gap-1.5">
                          {ACCENT_COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() =>
                                setProfile({ ...profile, accentColor: preset.value })
                              }
                              className={`py-1 px-1.5 rounded-md border text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                profile.accentColor.toLowerCase() === preset.value.toLowerCase()
                                  ? 'border-[#d4ff00] bg-white/10 font-bold text-white'
                                  : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                                style={{ backgroundColor: preset.value }}
                              />
                              <span className="truncate">{preset.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>

                        {/* Custom Color Input for Accent */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-white/50">Custom:</span>
                          <input
                            type="color"
                            value={profile.accentColor}
                            onChange={(e) =>
                              setProfile({ ...profile, accentColor: e.target.value })
                            }
                            className="w-6 h-6 rounded cursor-pointer border border-white/20 bg-transparent p-0"
                            title="Pick custom accent color"
                          />
                          <input
                            type="text"
                            value={profile.accentColor}
                            onChange={(e) =>
                              setProfile({ ...profile, accentColor: e.target.value })
                            }
                            className="flex-1 px-2 py-0.5 rounded bg-black/60 border border-white/15 text-[11px] font-mono text-white focus:outline-none focus:border-[#d4ff00]"
                            placeholder="#d4ff00"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Heading Font */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[11px] font-medium text-[#d4ff00] block flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5" />
                        <span>Name Font Family</span>
                      </label>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {Object.values(HEADING_FONTS).map((font) => (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() =>
                              setProfile({ ...profile, headingFont: font.id as HeadingFontId })
                            }
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              profile.headingFont === font.id
                                ? 'border-[#d4ff00] bg-[#d4ff00]/15 text-white font-semibold'
                                : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                            }`}
                          >
                            <span style={{ fontFamily: font.cssFamily }}>{font.name}</span>
                            {profile.headingFont === font.id && (
                              <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body Font */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-medium text-[#d4ff00] block flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5" />
                        <span>Details Font Family</span>
                      </label>
                      <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                        {Object.values(BODY_FONTS).map((font) => (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() =>
                              setProfile({ ...profile, bodyFont: font.id as BodyFontId })
                            }
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              profile.bodyFont === font.id
                                ? 'border-[#d4ff00] bg-[#d4ff00]/15 text-white font-semibold'
                                : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                            }`}
                          >
                            <span style={{ fontFamily: font.cssFamily }}>{font.name}</span>
                            {profile.bodyFont === font.id && (
                              <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: HEADER & CARD LAYOUT */}
                {activeSettingsSection === 'layout' && (
                  <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                      Card Header & Visuals
                    </span>

                    {/* Top Bar Style Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-[#d4ff00] block flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5" />
                        <span>Top Header Strip Display</span>
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, headerStyle: 'minimal-bar' })}
                          className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                            profile.headerStyle === 'minimal-bar'
                              ? 'border-[#d4ff00] bg-[#d4ff00]/15 text-white font-semibold'
                              : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-medium">Minimal Top Bar (Default)</div>
                            <div className="text-[10px] text-white/50">
                              Clean header strip with "GITHUB DEVELOPER CARD" & "LOCATION: {profile.location.toUpperCase()}"
                            </div>
                          </div>
                          {profile.headerStyle === 'minimal-bar' && (
                            <Check className="w-4 h-4 text-[#d4ff00] shrink-0" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, headerStyle: 'compact-inline' })}
                          className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                            profile.headerStyle === 'compact-inline'
                              ? 'border-[#d4ff00] bg-[#d4ff00]/15 text-white font-semibold'
                              : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-medium">Compact Inline Divider</div>
                            <div className="text-[10px] text-white/50">
                              Lightweight thin divider line without background fill box
                            </div>
                          </div>
                          {profile.headerStyle === 'compact-inline' && (
                            <Check className="w-4 h-4 text-[#d4ff00] shrink-0" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, headerStyle: 'none' })}
                          className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                            profile.headerStyle === 'none'
                              ? 'border-[#d4ff00] bg-[#d4ff00]/15 text-white font-semibold'
                              : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-medium">Hide Top Header Strip</div>
                            <div className="text-[10px] text-white/50">
                              Maximizes content space, purely identity data and portrait
                            </div>
                          </div>
                          {profile.headerStyle === 'none' && (
                            <Check className="w-4 h-4 text-[#d4ff00] shrink-0" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Background Dot Grid Toggle */}
                    <div className="pt-2 border-t border-white/10">
                      <label className="text-[11px] font-medium text-white/90 flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-[#d4ff00]" />
                          <span>Subtle Tech Dot Grid</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={profile.showMicroGrid}
                          onChange={(e) =>
                            setProfile({ ...profile, showMicroGrid: e.target.checked })
                          }
                          className="accent-[#d4ff00] w-4 h-4 rounded"
                        />
                      </label>
                      <p className="text-[10px] text-white/50 mt-1">
                        Adds a micro cyber-matrix grid pattern across the card surface
                      </p>
                    </div>

                    {/* Portrait Corner Rounding */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-[#d4ff00]">
                          Portrait Corner Radius
                        </label>
                        <span className="text-[10px] font-mono text-white/60">
                          {profile.imageBorderRadius}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={profile.imageBorderRadius}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            imageBorderRadius: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-[#d4ff00] cursor-pointer"
                      />
                    </div>

                    {/* Portrait Zoom Scale in Sidebar */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-[#d4ff00] flex items-center gap-1">
                          <ZoomIn className="w-3 h-3" />
                          <span>Portrait Zoom Scale</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setProfile((prev) => ({ ...prev, imageZoom: 1.0 }))}
                          className="text-[10px] font-mono text-[#d4ff00] hover:underline cursor-pointer"
                          title="Reset to 1.0x"
                        >
                          {profile.imageZoom.toFixed(1)}x (reset)
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="4.0"
                        step="0.05"
                        value={profile.imageZoom}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            imageZoom: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-[#d4ff00] cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Card Preview & Portrait Control */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                    <span>Card Live Preview</span>
                  </span>

                  <button
                    onClick={refreshPortrait}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-colors cursor-pointer"
                    title="Sync current 3D dither camera angle"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Angle</span>
                  </button>
                </div>

                {/* THE CARD PREVIEW CONTAINER */}
                <div
                  className="rounded-2xl p-5 md:p-7 shadow-2xl relative transition-all select-none border overflow-hidden"
                  style={{
                    backgroundColor: '#0a0d0a',
                    borderColor: `${profile.accentColor}55`,
                    backgroundImage: profile.showMicroGrid
                      ? 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)'
                      : 'none',
                    backgroundSize: '24px 24px',
                  }}
                >
                  {/* Outer glow corner accents */}
                  <div
                    className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 pointer-events-none"
                    style={{ borderColor: profile.accentColor }}
                  />
                  <div
                    className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 pointer-events-none"
                    style={{ borderColor: profile.accentColor }}
                  />
                  <div
                    className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 pointer-events-none"
                    style={{ borderColor: profile.accentColor }}
                  />
                  <div
                    className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 pointer-events-none"
                    style={{ borderColor: profile.accentColor }}
                  />

                  {/* Header Strip Based on Selected Option */}
                  {profile.headerStyle === 'minimal-bar' && (
                    <div
                      className="mb-5 pb-2.5 px-3 pt-2.5 rounded-lg flex items-center justify-between border-t border-b"
                      style={{
                        backgroundColor: `${profile.accentColor}0f`,
                        borderColor: `${profile.accentColor}33`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: profile.accentColor }}
                        />
                        <span
                          className="text-[11px] font-bold tracking-wider font-mono"
                          style={{ color: profile.accentColor }}
                        >
                          GITHUB DEVELOPER CARD
                        </span>
                      </div>
                      <span className="text-[11px] text-white/50 font-mono">
                        LOCATION: {profile.location.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {profile.headerStyle === 'compact-inline' && (
                    <div
                      className="mb-5 pb-2 flex items-center justify-between border-b"
                      style={{ borderColor: `${profile.accentColor}33` }}
                    >
                      <span
                        className="text-[10px] font-bold tracking-wider font-mono"
                        style={{ color: profile.accentColor }}
                      >
                        GITHUB DEVELOPER CARD
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">
                        LOCATION: {profile.location.toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-5 items-stretch">
                    {/* LEFT: 4:5 Passport Photo Frame with Zoom Slider and Corner Brackets */}
                    <div className="col-span-12 sm:col-span-4 flex flex-col items-center">
                      <div className="w-full relative group">
                        {/* Outer Tech Corner Brackets */}
                        <div
                          className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 pointer-events-none z-10"
                          style={{ borderColor: profile.accentColor }}
                        />
                        <div
                          className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 pointer-events-none z-10"
                          style={{ borderColor: profile.accentColor }}
                        />
                        <div
                          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 pointer-events-none z-10"
                          style={{ borderColor: profile.accentColor }}
                        />
                        <div
                          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 pointer-events-none z-10"
                          style={{ borderColor: profile.accentColor }}
                        />

                        {/* Portrait Frame Box */}
                        <div
                          className="w-full aspect-[4/5] relative flex items-center justify-center overflow-hidden transition-all shadow-lg"
                          style={{
                            backgroundColor: bgColor,
                            borderRadius: `${profile.imageBorderRadius}px`,
                            border: `2px solid ${profile.accentColor}88`,
                          }}
                        >
                          {previewCanvasDataUrl ? (
                            <img
                              src={previewCanvasDataUrl}
                              alt="Dither Portrait"
                              className="w-full h-full object-cover select-none"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-3 text-center">
                              <User className="w-8 h-8 text-white/30 mb-1" />
                              <span className="text-[10px] text-white/40 font-mono">
                                Loading Portrait...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extended Zoom Slider */}
                      <div className="w-full max-w-full mt-3 p-2 rounded-xl bg-black/60 border border-white/10 space-y-1.5 overflow-hidden box-border">
                        <div className="flex items-center justify-between text-[10px] text-white/60">
                          <span className="flex items-center gap-1 font-mono">
                            <ZoomIn className="w-3 h-3 text-[#d4ff00]" />
                            <span className="text-white/80">Zoom Scale</span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                imageZoom: 1.0,
                              }))
                            }
                            className="font-mono text-[#d4ff00] hover:underline cursor-pointer text-[10px]"
                            title="Reset to 1.0x"
                          >
                            {profile.imageZoom.toFixed(1)}x
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 w-full min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                imageZoom: Math.max(0.5, parseFloat((prev.imageZoom - 0.1).toFixed(1))),
                              }))
                            }
                            className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
                            title="Zoom Out (-0.1x)"
                          >
                            <ZoomOut className="w-3 h-3" />
                          </button>

                          <div className="flex-1 min-w-0 flex items-center">
                            <input
                              type="range"
                              min="0.5"
                              max="4.0"
                              step="0.05"
                              value={profile.imageZoom}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  imageZoom: parseFloat(e.target.value),
                                })
                              }
                              className="w-full min-w-0 accent-[#d4ff00] cursor-pointer"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                imageZoom: Math.min(4.0, parseFloat((prev.imageZoom + 0.1).toFixed(1))),
                              }))
                            }
                            className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
                            title="Zoom In (+0.1x)"
                          >
                            <ZoomIn className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Profile Identity & Details */}
                    <div className="col-span-12 sm:col-span-8 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-3">
                        {/* NAME */}
                        <div>
                          <span
                            className="text-[10px] uppercase font-bold tracking-wider font-mono block mb-0.5"
                            style={{ color: profile.accentColor }}
                          >
                            NAME
                          </span>
                          <h1
                            className="text-2xl md:text-3xl font-bold tracking-tight leading-tight"
                            style={{
                              fontFamily: activeHeadingFont.cssFamily,
                              color: profile.primaryTextColor,
                            }}
                          >
                            {profile.name}
                          </h1>
                        </div>

                        {/* TITLE & LOCATION */}
                        <div className="border-b border-white/10 pb-2.5">
                          <span
                            className="text-[10px] uppercase font-bold tracking-wider font-mono block mb-0.5"
                            style={{ color: profile.accentColor }}
                          >
                            TITLE & LOCATION
                          </span>
                          <p
                            className="text-sm font-semibold tracking-wide"
                            style={{
                              fontFamily: activeBodyFont.cssFamily,
                              color: profile.primaryTextColor,
                            }}
                          >
                            {profile.role} · {profile.location}
                          </p>
                        </div>

                        {/* STATUS */}
                        <div>
                          <span
                            className="text-[10px] uppercase font-bold tracking-wider font-mono block mb-0.5"
                            style={{ color: profile.accentColor }}
                          >
                            CURRENT STATUS
                          </span>
                          <p
                            className="text-xs leading-relaxed"
                            style={{
                              fontFamily: activeBodyFont.cssFamily,
                              color: profile.primaryTextColor,
                            }}
                          >
                            {profile.status}
                          </p>
                        </div>

                        {/* SKILLS */}
                        <div>
                          <span
                            className="text-[10px] uppercase font-bold tracking-wider font-mono block mb-1"
                            style={{ color: profile.accentColor }}
                          >
                            CORE SKILLS & TECHNOLOGIES
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {skillTags.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[11px] border"
                                style={{
                                  fontFamily: activeBodyFont.cssFamily,
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  borderColor: `${profile.accentColor}40`,
                                  color: profile.primaryTextColor,
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* FUN PART */}
                        <div>
                          <span
                            className="text-[10px] uppercase font-bold tracking-wider font-mono block mb-0.5"
                            style={{ color: profile.accentColor }}
                          >
                            FUN PART
                          </span>
                          <p
                            className="text-xs leading-relaxed opacity-95"
                            style={{
                              fontFamily: activeBodyFont.cssFamily,
                              color: profile.primaryTextColor,
                            }}
                          >
                            {profile.funPart}
                          </p>
                        </div>
                      </div>

                      {/* BOTTOM ROW: Pure Scannable QR Code */}
                      <div className="pt-2 flex items-center justify-end">
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-lg bg-black/80 flex items-center justify-center p-1 border shadow-inner"
                            style={{ borderColor: `${profile.accentColor}66` }}
                          >
                            {qrCodeDataUrl ? (
                              <img
                                src={qrCodeDataUrl}
                                alt="Profile QR Code"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <QrIcon className="w-6 h-6 text-white/30" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Export Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleExportProfileImage}
                    disabled={isExporting}
                    className="w-full py-3 px-5 rounded-xl bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4ff00]/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isExporting ? 'Generating High-Res Card...' : 'Save Card As Image (1200×600 PNG)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Markdown Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">README.md Markdown Snippet</h3>
                  <p className="text-xs text-white/50">
                    Copy and paste this markdown directly into your GitHub profile README.md
                  </p>
                </div>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2 rounded-xl bg-[#d4ff00] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#c2eb00] transition-colors cursor-pointer"
                >
                  {copiedMd ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-white/80 overflow-x-auto whitespace-pre leading-relaxed max-h-[500px]">
                {generateMarkdown()}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />
            <span>Ready for GitHub Profile README</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">1200 × 600 PX</span>
          </div>
        </div>
      </div>
    </div>
  );
};
