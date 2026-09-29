import React from 'react';
import {
  LocationKey,
  LightingKey,
  WeatherKey,
  AspectRatioKey,
  ResolutionKey,
  ModelTypeKey,
} from '../types/architect';
import {
  LOCATION_OPTIONS,
  LIGHTING_OPTIONS,
  WEATHER_OPTIONS,
} from '../data/architectStyles';
import { Sun, CloudRain, MapPin, Monitor, Cpu } from 'lucide-react';

interface EnvironmentControlsProps {
  location: LocationKey;
  lighting: LightingKey;
  weather: WeatherKey;
  aspectRatio: AspectRatioKey;
  resolution: ResolutionKey;
  numOutputs: 1 | 2 | 3 | 4;
  modelType: ModelTypeKey;
  onLocationChange: (loc: LocationKey) => void;
  onLightingChange: (light: LightingKey) => void;
  onWeatherChange: (weath: WeatherKey) => void;
  onAspectRatioChange: (ratio: AspectRatioKey) => void;
  onResolutionChange: (res: ResolutionKey) => void;
  onNumOutputsChange: (num: 1 | 2 | 3 | 4) => void;
  onModelTypeChange: (model: ModelTypeKey) => void;
}

export const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
  location,
  lighting,
  weather,
  aspectRatio,
  resolution,
  numOutputs,
  modelType,
  onLocationChange,
  onLightingChange,
  onWeatherChange,
  onAspectRatioChange,
  onResolutionChange,
  onNumOutputsChange,
  onModelTypeChange,
}) => {
  const aspectRatios: { key: AspectRatioKey; label: string }[] = [
    { key: '16:9', label: '16:9 (Ngang)' },
    { key: '4:3', label: '4:3 (Tiêu chuẩn)' },
    { key: '1:1', label: '1:1 (Vuông)' },
    { key: '3:4', label: '3:4 (Dọc)' },
    { key: '9:16', label: '9:16 (Dọc Story)' },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-amber-400" />
          <span>Bối Cảnh & Thông Số Kỹ Thuật Render</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">
          [Môi trường Việt Nam & AI Model]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Vị trí */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Vị Trí & Không Gian
          </label>
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value as LocationKey)}
            className="w-full rounded-lg border border-white/10 bg-[#090D16] px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none transition-colors"
          >
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.labelVi}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Ánh sáng */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span>Ánh Sáng Khung Cảnh</span>
          </label>
          <select
            value={lighting}
            onChange={(e) => onLightingChange(e.target.value as LightingKey)}
            className="w-full rounded-lg border border-white/10 bg-[#090D16] px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none transition-colors"
          >
            {LIGHTING_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.labelVi}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Thời tiết */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <CloudRain className="h-3.5 w-3.5 text-blue-400" />
            <span>Thời Tiết & Khí Hậu</span>
          </label>
          <select
            value={weather}
            onChange={(e) => onWeatherChange(e.target.value as WeatherKey)}
            className="w-full rounded-lg border border-white/10 bg-[#090D16] px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none transition-colors"
          >
            {WEATHER_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.labelVi}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Model Banana Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            <span>Model AI Banana</span>
          </label>
          <select
            value={modelType}
            onChange={(e) => onModelTypeChange(e.target.value as ModelTypeKey)}
            className="w-full rounded-lg border border-white/10 bg-[#090D16] px-3 py-2 text-xs font-medium text-amber-300 focus:border-amber-400 focus:outline-none transition-colors"
          >
            <option value="banana_standard">
              Banana Thường (gemini-3.1-flash-lite-image) - Tốc độ cao
            </option>
            <option value="banana_pro">
              Banana Pro (gemini-3.1-flash-image) - Chất lượng cao 2K
            </option>
          </select>
        </div>

        {/* 5. Tỉ lệ khung hình */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Monitor className="h-3.5 w-3.5 text-slate-400" />
            <span>Tỉ Lệ Khung Hình</span>
          </label>
          <div className="flex items-center gap-1">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.key}
                type="button"
                onClick={() => onAspectRatioChange(ratio.key)}
                className={`flex-1 py-1.5 text-[11px] font-mono rounded transition-colors ${
                  aspectRatio === ratio.key
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-black/30 text-slate-400 border border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-200'
                }`}
              >
                {ratio.key}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Độ phân giải & Số lượng ảnh */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Độ Phân Giải
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onResolutionChange('1k')}
                className={`flex-1 py-1.5 text-xs font-mono rounded transition-colors ${
                  resolution === '1k'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-black/30 text-slate-400 border border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                1K (Full HD)
              </button>
              <button
                type="button"
                onClick={() => onResolutionChange('2k')}
                className={`flex-1 py-1.5 text-xs font-mono rounded transition-colors ${
                  resolution === '2k'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-black/30 text-slate-400 border border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                2K (Ultra HD)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Số Lượng Ảnh
            </label>
            <div className="flex items-center gap-1">
              {([1, 2, 3, 4] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onNumOutputsChange(num)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded transition-colors ${
                    numOutputs === num
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-black/30 text-slate-400 border border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
