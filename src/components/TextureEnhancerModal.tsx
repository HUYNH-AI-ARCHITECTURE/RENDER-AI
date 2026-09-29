import React, { useState } from 'react';
import { X, Sparkles, Check, Layers, Eye } from 'lucide-react';
import { RenderResultItem } from '../types/architect';

interface TextureEnhancerModalProps {
  item: RenderResultItem | null;
  onClose: () => void;
  onApplyEnhanced: (newImageUrl: string) => void;
}

export const TextureEnhancerModal: React.FC<TextureEnhancerModalProps> = ({
  item,
  onClose,
  onApplyEnhanced,
}) => {
  const [woodGrain, setWoodGrain] = useState<number>(80);
  const [naturalStone, setNaturalStone] = useState<number>(85);
  const [roughConcrete, setRoughConcrete] = useState<number>(75);
  const [glassReflection, setGlassReflection] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!item) return null;

  const handleEnhance = async () => {
    setIsProcessing(true);
    try {
      // Texture sharpening algorithm simulation
      await new Promise((res) => setTimeout(res, 1800));
      onApplyEnhanced(item.imageUrl);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#090D16]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Vật Liệu Hóa Bề Mặt (Texture Upscaling & Refinement)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sliders */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Thuật toán tự động phát hiện và làm sắc nét các bề mặt vật liệu đặc thù kiến trúc:
          </p>

          <div className="space-y-3.5 bg-black/30 p-4 rounded-xl border border-white/[0.06]">
            {/* 1. Vân gỗ */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Vân Gỗ Tự Nhiên (Wood Grain)</span>
                <span className="font-mono text-amber-400">{woodGrain}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={woodGrain}
                onChange={(e) => setWoodGrain(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-white/10 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Tăng độ gân nổi của thớ gỗ sồi, gỗ gụ, teak ngoài trời</span>
            </div>

            {/* 2. Thớ đá tự nhiên */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Thớ Đá & Vân Mây Tự Nhiên (Marble / Slate)</span>
                <span className="font-mono text-amber-400">{naturalStone}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={naturalStone}
                onChange={(e) => setNaturalStone(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-white/10 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Làm nổi vân mây Calacatta, độ rạn tự nhiên của đá travertine</span>
            </div>

            {/* 3. Độ nhám bê tông & xi măng */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Độ Nhám Bê Tông & Vữa Trát (Raw Concrete / Stucco)</span>
                <span className="font-mono text-amber-400">{roughConcrete}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={roughConcrete}
                onChange={(e) => setRoughConcrete(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-white/10 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Khôi phục hạt cát li ti, vân cốt pha và độ nhám vữa mộc</span>
            </div>

            {/* 4. Độ phản xạ kính */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Độ Phản Xạ Kính Hộp (Glass Glazing Reflection)</span>
                <span className="font-mono text-amber-400">{glassReflection}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={glassReflection}
                onChange={(e) => setGlassReflection(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-white/10 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Tăng độ bóng trong và phản chiếu bầu trời xanh trên vách kính lớn</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleEnhance}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isProcessing ? 'Đang Tăng Nét Bề Mặt...' : 'Kích Hoạt Làm Nét 2K'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
