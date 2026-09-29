import React from 'react';
import { Layers, Sparkles, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { ModuleType } from '../types/architect';

interface HeaderProps {
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  onOpenPresets: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onOpenPresets,
  onResetAll,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090D16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold tracking-tight text-white">
              HUỲNH-AI <span className="text-amber-400">ARCHITECTURE</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Multi-Style Architectural Render Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation links / Module switcher */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectModule('exterior')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeModule === 'exterior'
                ? 'border border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
            }`}
          >
            <span>Ngoại Thất (Exterior)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectModule('interior')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeModule === 'interior'
                ? 'border border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
            }`}
          >
            <span>Nội Thất (Interior)</span>
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />

          <button
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Thư Viện Mẫu</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onResetAll}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >
            Làm Mới
          </button>
        </div>
      </div>
    </header>
  );
};
