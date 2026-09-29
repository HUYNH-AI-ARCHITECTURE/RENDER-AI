import React from 'react';
import { ControlNetConfig, PromptWeights } from '../types/architect';
import { Sliders, ShieldCheck, Crosshair, Box } from 'lucide-react';

interface ControlNetSlidersProps {
  controlNet: ControlNetConfig;
  weights: PromptWeights;
  onControlNetChange: (cfg: ControlNetConfig) => void;
  onWeightsChange: (weights: PromptWeights) => void;
}

export const ControlNetSliders: React.FC<ControlNetSlidersProps> = ({
  controlNet,
  weights,
  onControlNetChange,
  onWeightsChange,
}) => {
  const toggleControl = (key: keyof ControlNetConfig) => {
    onControlNetChange({
      ...controlNet,
      [key]: !controlNet[key],
    });
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
          <Sliders className="h-4 w-4 text-amber-400" />
          <span>Bộ Lọc Giữ Nét & Trọng Số Kiểm Soát AI</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">
          [ControlNet & Prompt Weights]
        </span>
      </div>

      {/* ControlNet Toggles */}
      <div>
        <p className="text-xs font-medium text-slate-300 mb-2">
          Các Bộ Lọc Khóa Hình Khối (ControlNet Models)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Canny / Lineart */}
          <button
            type="button"
            onClick={() => toggleControl('cannyLineart')}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              controlNet.cannyLineart
                ? 'border-amber-400/50 bg-amber-500/10 text-white'
                : 'border-white/[0.08] bg-black/20 text-slate-400 hover:border-white/20 hover:text-slate-300'
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                controlNet.cannyLineart
                  ? 'border-amber-400 bg-amber-400 text-black'
                  : 'border-white/20'
              }`}
            >
              {controlNet.cannyLineart && (
                <span className="text-[10px] font-black">✓</span>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold flex items-center gap-1">
                <span>Canny / Lineart</span>
                {controlNet.cannyLineart && (
                  <span className="text-[10px] font-mono text-amber-300">100%</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Giữ chính xác 100% nét vẽ CAD/3D thô, không đổi hình dáng
              </p>
            </div>
          </button>

          {/* Depth / Mappa */}
          <button
            type="button"
            onClick={() => toggleControl('depthMappa')}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              controlNet.depthMappa
                ? 'border-amber-400/50 bg-amber-500/10 text-white'
                : 'border-white/[0.08] bg-black/20 text-slate-400 hover:border-white/20 hover:text-slate-300'
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                controlNet.depthMappa
                  ? 'border-amber-400 bg-amber-400 text-black'
                  : 'border-white/20'
              }`}
            >
              {controlNet.depthMappa && (
                <span className="text-[10px] font-black">✓</span>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold flex items-center gap-1">
                <span>Depth / Mappa</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Giữ chuẩn khoảng cách xa gần, chiều sâu lớp lang không gian
              </p>
            </div>
          </button>

          {/* MLSD */}
          <button
            type="button"
            onClick={() => toggleControl('mlsdStraight')}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              controlNet.mlsdStraight
                ? 'border-amber-400/50 bg-amber-500/10 text-white'
                : 'border-white/[0.08] bg-black/20 text-slate-400 hover:border-white/20 hover:text-slate-300'
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                controlNet.mlsdStraight
                  ? 'border-amber-400 bg-amber-400 text-black'
                  : 'border-white/20'
              }`}
            >
              {controlNet.mlsdStraight && (
                <span className="text-[10px] font-black">✓</span>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold flex items-center gap-1">
                <span>MLSD Thẳng Tường</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Chuyên bắt các đường thẳng kiến trúc, chống cong vẹo cột vách
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Prompt Weight Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.05]">
        {/* Slider 1: Độ tương đồng với ảnh gốc */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              Độ Tương Đồng Với Ảnh Gốc
            </span>
            <span className="font-mono text-amber-300 font-semibold tabular-nums">
              {weights.similarityToOriginal}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={weights.similarityToOriginal}
            onChange={(e) =>
              onWeightsChange({
                ...weights,
                similarityToOriginal: Number(e.target.value),
              })
            }
            className="w-full accent-amber-400 h-1.5 bg-black/40 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0% (Tự do phóng tác)</span>
            <span>100% (Khóa chặt hình học)</span>
          </div>
        </div>

        {/* Slider 2: Độ sáng tạo của AI */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              Độ Sáng Tạo Của AI (Creativity)
            </span>
            <span className="font-mono text-amber-300 font-semibold tabular-nums">
              {weights.aiCreativity}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={weights.aiCreativity}
            onChange={(e) =>
              onWeightsChange({
                ...weights,
                aiCreativity: Number(e.target.value),
              })
            }
            className="w-full accent-amber-400 h-1.5 bg-black/40 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0% (Bảo thủ vật liệu)</span>
            <span>100% (Giàu chi tiết kiến trúc)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
