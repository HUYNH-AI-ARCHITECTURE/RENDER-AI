import React, { useState } from 'react';
import { ModuleType, ArchitectStyle } from '../types/architect';
import { EXTERIOR_STYLES, INTERIOR_STYLES } from '../data/architectStyles';
import { Check, Sparkles } from 'lucide-react';

interface StyleSelectorProps {
  module: ModuleType;
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  module,
  selectedStyleId,
  onSelectStyle,
}) => {
  const currentStylesList = module === 'exterior' ? EXTERIOR_STYLES : INTERIOR_STYLES;

  // Extract unique categories
  const categories = Array.from(new Set(currentStylesList.map((s) => s.category)));
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredStyles =
    activeCategory === 'all'
      ? currentStylesList
      : currentStylesList.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            <span>Trường Phái Kiến Trúc</span>
            <span className="text-xs text-amber-400 font-mono">
              ({currentStylesList.length} phong cách)
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Chọn ngôn ngữ thiết kế để AI áp dụng vật liệu, hình khối và ánh sáng chuẩn xác
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            Tất Cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredStyles.map((style) => {
          const isSelected = style.id === selectedStyleId;

          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`relative flex flex-col justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-amber-400/50 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                  : 'border-white/[0.06] bg-[#111827]/50 hover:border-white/20 hover:bg-[#111827]/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <h4 className="text-xs font-semibold text-white leading-tight">
                    {style.nameVi}
                  </h4>
                  {isSelected && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400 text-black">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                  {style.descriptionVi}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate max-w-[70%] text-slate-400">
                  {style.paletteVi}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-amber-400/80">
                  {style.category.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
