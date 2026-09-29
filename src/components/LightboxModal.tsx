import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Sparkles, Copy, Check } from 'lucide-react';
import { RenderResultItem } from '../types/architect';

interface LightboxModalProps {
  item: RenderResultItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  const [zoom, setZoom] = useState<number>(100); // 100% - 300%
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset zoom & pan when item changes
  useEffect(() => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  }, [item]);

  if (!item) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 100) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 100) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `huynh_ai_highres_render_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-[#090D16]/90 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white tracking-wide">
            HUỲNH-AI ARCHITECTURE | SOI CHI TIẾT BẢN RENDER
          </span>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Zoom: {zoom}%
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-mono tabular-nums text-slate-300">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Về 100%"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Tải Ảnh 2K</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng (ESC)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Zoomable Image Canvas */}
      <div
        className="relative h-full w-full pt-14 pb-20 overflow-hidden flex items-center justify-center select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="flex items-center justify-center max-w-full max-h-full"
        >
          <img
            src={item.imageUrl}
            alt="Phóng to bản render"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded shadow-2xl pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#090D16]/95 px-4 py-2.5 sm:px-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-hidden text-xs">
            <span className="font-semibold text-white whitespace-nowrap">
              Phong Cách: <span className="text-amber-400 font-normal">{item.params.selectedStyleId}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-slate-400 truncate max-w-md hidden md:inline">
              Prompt: {item.prompt}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-white/[0.05] border border-white/10 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Đã Chép Prompt' : 'Chép Prompt Này'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Model: {item.params.modelType === 'banana_pro' ? 'Banana Pro' : 'Banana Thường'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
