import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Wand2 } from 'lucide-react';

interface PromptBuilderProps {
  prompt: string;
  customDetails: string;
  isEnhancing: boolean;
  onPromptChange: (newPrompt: string) => void;
  onCustomDetailsChange: (details: string) => void;
  onEnhanceWithAI: () => void;
  onResetPrompt: () => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  prompt,
  customDetails,
  isEnhancing,
  onPromptChange,
  onCustomDetailsChange,
  onEnhanceWithAI,
  onResetPrompt,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4 space-y-3.5">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            <Wand2 className="h-4 w-4 text-amber-400" />
            <span>Prompt Kỹ Thuật Diễn Họa Kiến Trúc</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Khung prompt tự động đồng bộ theo chuẩn mẫu kiến trúc nghiêm ngặt
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEnhanceWithAI}
            disabled={isEnhancing}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Đang Tối Ưu...' : 'Làm Giàu Vật Liệu AI'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Đã Chép' : 'Sao Chép'}</span>
          </button>

          <button
            type="button"
            onClick={onResetPrompt}
            title="Đồng bộ lại theo các nút chọn"
            className="p-1 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Prompt Textarea */}
      <div>
        <label className="block text-[11px] font-mono text-slate-400 mb-1">
          NỘI DUNG PROMPT HOÀN CHỈNH GỬI ĐẾN MODEL AI BANANA:
        </label>
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[#090D16] p-3 text-xs leading-relaxed text-slate-200 focus:border-amber-400 focus:outline-none transition-colors font-sans selection:bg-amber-500/30"
          placeholder="Nội dung prompt tự động..."
        />
      </div>

      {/* Optional Custom Details input */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Mô Tả Chi Tiết Bổ Sung <span className="text-[11px] font-normal text-slate-500">(Tùy chọn)</span>
        </label>
        <input
          type="text"
          value={customDetails}
          onChange={(e) => onCustomDetailsChange(e.target.value)}
          placeholder="Ví dụ: Thêm dàn hoa giấy nở rực rỡ ở ban công tầng 2, xe ô tô sang đỗ trước cửa nhà..."
          className="w-full rounded-lg border border-white/10 bg-[#090D16] px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};
