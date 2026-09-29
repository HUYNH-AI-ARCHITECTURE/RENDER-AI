import React, { useState } from 'react';
import {
  Maximize2,
  Download,
  SplitSquareVertical,
  Sparkles,
  Paintbrush,
  Layers,
  Check,
  Clock,
  Eye,
} from 'lucide-react';
import { RenderResultItem } from '../types/architect';

interface RenderGalleryProps {
  results: RenderResultItem[];
  activeResultId: string | null;
  isRendering: boolean;
  renderingPhase: string;
  onSelectResult: (id: string) => void;
  onOpenLightbox: (item: RenderResultItem) => void;
  onOpenInpainting: (item: RenderResultItem) => void;
  onOpenTextureEnhancer: (item: RenderResultItem) => void;
}

export const RenderGallery: React.FC<RenderGalleryProps> = ({
  results,
  activeResultId,
  isRendering,
  renderingPhase,
  onSelectResult,
  onOpenLightbox,
  onOpenInpainting,
  onOpenTextureEnhancer,
}) => {
  const [splitPosition, setSplitPosition] = useState<number>(50); // 0 - 100%
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

  const activeResult = results.find((r) => r.id === activeResultId) || results[0];

  const handleDownload = (item: RenderResultItem) => {
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `huynh_ai_render_${item.params.module}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4 space-y-4">
      {/* Top Header of Viewport */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-amber-400" />
            <span>Khu Vực Hiển Thị Kết Quả Render</span>
          </h3>
          {results.length > 0 && (
            <span className="text-xs text-slate-400 font-mono">
              ({results.length} bản render)
            </span>
          )}
        </div>

        {activeResult && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeResult.originalImageUrl && (
              <button
                type="button"
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                  isCompareMode
                    ? 'border-amber-400/50 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
                }`}
              >
                <SplitSquareVertical className="h-3.5 w-3.5" />
                <span>{isCompareMode ? 'Tắt So Sánh' : 'So Sánh Before/After'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenInpainting(activeResult)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] transition-colors"
            >
              <Paintbrush className="h-3.5 w-3.5 text-blue-400" />
              <span>Sửa Vùng AI</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenTextureEnhancer(activeResult)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Làm Sắc Nét Vật Liệu</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenLightbox(activeResult)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Phóng To Chi Tiết</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload(activeResult)}
              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
              title="Tải ảnh về máy"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport */}
      <div className="relative min-h-[380px] w-full rounded-lg border border-white/[0.08] bg-[#090D16] flex items-center justify-center overflow-hidden">
        {/* Loading Overlay */}
        {isRendering && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-6 text-center">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
              <div className="h-10 w-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm font-medium text-white tracking-wide">
              {renderingPhase || 'Đang thực hiện render kiến trúc...'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Đang tính toán tia sáng, khử răng cưa và đồng bộ tỉ lệ chuẩn xác của Ảnh Gốc
            </p>
          </div>
        )}

        {/* Display Active Render */}
        {activeResult ? (
          isCompareMode && activeResult.originalImageUrl ? (
            /* Split Before / After Slider */
            <div
              className="relative w-full h-[460px] overflow-hidden select-none cursor-ew-resize"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSplitPosition(Math.max(0, Math.min(100, pos)));
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((touch.clientX - rect.left) / rect.width) * 100;
                setSplitPosition(Math.max(0, Math.min(100, pos)));
              }}
            >
              {/* After: Rendered Result (Underneath full width) */}
              <img
                src={activeResult.imageUrl}
                alt="Rendered Output"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Before: Original Image (Clipped by splitPosition) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${splitPosition}%` }}
              >
                <img
                  src={activeResult.originalImageUrl}
                  alt="Original Raw Model"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none"
                  style={{ width: '100%', height: '100%' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] z-10 flex items-center justify-center pointer-events-none"
                style={{ left: `${splitPosition}%` }}
              >
                <div className="h-8 w-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-lg">
                  ↔
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 z-20 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10">
                BẢN VẼ GỐC (BEFORE)
              </div>
              <div className="absolute top-3 right-3 z-20 rounded bg-amber-500/80 px-2 py-0.5 text-[10px] font-mono text-black font-semibold backdrop-blur-sm shadow">
                RENDER AI (AFTER)
              </div>
            </div>
          ) : (
            /* Normal Image View */
            <div
              className="relative w-full h-full min-h-[420px] max-h-[540px] flex items-center justify-center p-2 group cursor-pointer"
              onClick={() => onOpenLightbox(activeResult)}
            >
              <img
                src={activeResult.imageUrl}
                alt="Kết Quả Render"
                className="max-h-[500px] w-auto max-w-full object-contain rounded transition-transform duration-200 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white">
                <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Bấm vào để phóng to xem chi tiết</span>
              </div>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="p-8 text-center max-w-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500 border border-white/[0.06]">
              <Layers className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              Chưa Có Bản Render Nào Được Tạo
            </h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Tải lên Ảnh Gốc, chọn trường phái thiết kế và thông số môi trường, sau đó nhấn nút 
              <span className="text-amber-400 font-medium"> "Render Kiến Trúc"</span> hoặc thử nhanh các mẫu có sẵn.
            </p>
          </div>
        )}
      </div>

      {/* Thumbnails of All Rendered Outputs */}
      {results.length > 1 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-medium text-slate-400">
            Các Phiên Bản Render:
          </span>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {results.map((item, idx) => {
              const isSelected = item.id === activeResult?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectResult(item.id)}
                  className={`relative h-20 w-28 shrink-0 rounded-lg border overflow-hidden cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                      : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={`Render #${idx + 1}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 py-0.2 text-[9px] font-mono text-white">
                    #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
