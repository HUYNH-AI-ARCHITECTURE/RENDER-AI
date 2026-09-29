import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadZoneProps {
  originalImage: string | null;
  referenceImage: string | null;
  onOriginalChange: (imgUrl: string | null, meta?: { width: number; height: number; aspect: string }) => void;
  onReferenceChange: (imgUrl: string | null) => void;
  onLoadPreset: (presetId: string) => void;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  originalImage,
  referenceImage,
  onOriginalChange,
  onReferenceChange,
  onLoadPreset,
}) => {
  const originalInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const [originalMeta, setOriginalMeta] = useState<{ width: number; height: number; aspect: string } | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'original' | 'reference'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'original') {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const ratio = (w / h).toFixed(2);
          const meta = { width: w, height: h, aspect: ratio };
          setOriginalMeta(meta);
          onOriginalChange(dataUrl, meta);
        };
        img.src = dataUrl;
      } else {
        onReferenceChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'original' | 'reference') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'original') {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const ratio = (w / h).toFixed(2);
          const meta = { width: w, height: h, aspect: ratio };
          setOriginalMeta(meta);
          onOriginalChange(dataUrl, meta);
        };
        img.src = dataUrl;
      } else {
        onReferenceChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            <span>Dữ Liệu Hình Ảnh Đầu Vào</span>
            <span className="text-[11px] font-normal text-amber-400/90 font-mono">
              [Ảnh Gốc & Tham Chiếu]
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI sẽ khóa kích thước theo Ảnh 1 và học màu sắc/vật liệu từ Ảnh 2
          </p>
        </div>

        {/* Quick sample loader buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onLoadPreset('exterior_vietnam_indochine')}
            className="text-[11px] px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 border border-white/[0.08] transition-colors"
          >
            Mẫu Nhà Phố VN
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('interior_japandi_living')}
            className="text-[11px] px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 border border-white/[0.08] transition-colors"
          >
            Mẫu Japandi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Slot 1: Ảnh Gốc */}
        <div className="flex flex-col rounded-xl border border-white/[0.08] bg-[#111827]/70 p-3 relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/20 text-[11px] font-bold text-amber-400">
                1
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Ảnh Gốc (Bản vẽ CAD / 3D thô)
              </span>
            </div>
            {originalMeta && (
              <span className="text-[10px] font-mono tabular-nums text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {originalMeta.width}×{originalMeta.height}px
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'original')}
            onClick={() => !originalImage && originalInputRef.current?.click()}
            className={`relative flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed transition-all overflow-hidden ${
              originalImage
                ? 'border-white/10 bg-black/40'
                : 'border-white/15 bg-white/[0.02] hover:border-amber-400/40 hover:bg-white/[0.04] cursor-pointer'
            }`}
          >
            {originalImage ? (
              <div className="relative w-full h-full min-h-[160px] flex items-center justify-center group/preview">
                <img
                  src={originalImage}
                  alt="Ảnh Gốc 1"
                  className="max-h-[220px] w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      originalInputRef.current?.click();
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    Thay Đổi
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOriginalChange(null);
                      setOriginalMeta(null);
                    }}
                    className="p-1 rounded bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 group-hover:text-amber-400 transition-colors">
                  <Upload className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-slate-300">
                  Tải lên hoặc kéo thả Ảnh Gốc
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Bản vẽ CAD, Sketchup thô, Revit khối, hình chụp hiện trạng
                </p>
              </div>
            )}
            <input
              ref={originalInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'original')}
            />
          </div>

          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
            <span>Đầu ra sẽ khóa đúng tỉ lệ và chi tiết cấu trúc từ ảnh này.</span>
          </div>
        </div>

        {/* Slot 2: Ảnh Tham Chiếu */}
        <div className="flex flex-col rounded-xl border border-white/[0.08] bg-[#111827]/70 p-3 relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-[11px] font-bold text-blue-400">
                2
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Ảnh Tham Chiếu (Học Phong Cách)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
              Tùy chọn
            </span>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'reference')}
            onClick={() => !referenceImage && referenceInputRef.current?.click()}
            className={`relative flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed transition-all overflow-hidden ${
              referenceImage
                ? 'border-white/10 bg-black/40'
                : 'border-white/15 bg-white/[0.02] hover:border-blue-400/40 hover:bg-white/[0.04] cursor-pointer'
            }`}
          >
            {referenceImage ? (
              <div className="relative w-full h-full min-h-[160px] flex items-center justify-center group/preview">
                <img
                  src={referenceImage}
                  alt="Ảnh Tham Chiếu 2"
                  className="max-h-[220px] w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      referenceInputRef.current?.click();
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    Thay Đổi
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReferenceChange(null);
                    }}
                    className="p-1 rounded bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-slate-300">
                  Tải lên Ảnh Mẫu Vật Liệu / Màu Sắc
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  AI trích xuất màu sắc, chất cảm vật liệu và mood ánh sáng
                </p>
              </div>
            )}
            <input
              ref={referenceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'reference')}
            />
          </div>

          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-400">
            <AlertCircle className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
            <span>Không lấy kích thước hay tỉ lệ của ảnh này (Chỉ học style).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
