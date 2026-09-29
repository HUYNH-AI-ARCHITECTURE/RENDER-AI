import React from 'react';
import { X, Sparkles, ArrowRight, Check } from 'lucide-react';
import { PRESET_DEMOS } from '../data/architectStyles';
import { PresetDemo } from '../types/architect';

interface PresetGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (preset: PresetDemo) => void;
}

export const PresetGalleryModal: React.FC<PresetGalleryModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#090D16]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Thư Viện Phối Cảnh Mẫu Kiến Trúc (Presets)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chọn một bộ mẫu dựng sẵn để trải nghiệm ngay quy trình render đa phong cách
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Cards List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRESET_DEMOS.map((preset) => (
              <div
                key={preset.id}
                className="flex flex-col rounded-xl border border-white/10 bg-[#111827]/80 overflow-hidden hover:border-amber-400/40 transition-all group"
              >
                {/* Images side-by-side: Raw CAD vs Rendered */}
                <div className="grid grid-cols-2 h-44 bg-black/50 border-b border-white/[0.06] relative">
                  <div className="relative border-r border-white/10 overflow-hidden">
                    <img
                      src={preset.originalImage}
                      alt="Bản vẽ thô"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
                      Ảnh Gốc (CAD/3D)
                    </span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src={preset.renderedImage}
                      alt="Render hoàn thiện"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-mono text-black font-semibold">
                      Render Hoàn Thiện
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {preset.module === 'exterior' ? 'Ngoại Thất' : 'Nội Thất'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {preset.styleId}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {preset.titleVi}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {preset.descriptionVi}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyPreset(preset);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500/15 border border-amber-500/30 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition-all"
                  >
                    <span>Nạp Bộ Mẫu Này Vào Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
