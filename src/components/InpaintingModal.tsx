import React, { useRef, useState, useEffect } from 'react';
import { X, Paintbrush, Undo2, Trash2, Sparkles, Check } from 'lucide-react';
import { RenderResultItem } from '../types/architect';

interface InpaintingModalProps {
  item: RenderResultItem | null;
  onClose: () => void;
  onApplyInpaint: (newImageUrl: string, description: string) => void;
}

export const InpaintingModal: React.FC<InpaintingModalProps> = ({
  item,
  onClose,
  onApplyInpaint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState<number>(35);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [inpaintPrompt, setInpaintPrompt] = useState<string>('Hồ bơi phong cách nghỉ dưỡng lát đá mosaic xanh ngọc');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!item || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = item.imageUrl;
  }, [item]);

  if (!item) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)'; // Amber mask highlight

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = item.imageUrl;
  };

  const handleExecuteInpaint = async () => {
    if (!inpaintPrompt.trim()) return;
    setIsProcessing(true);

    try {
      // In a real environment with inpainting, we send base64 canvas mask + prompt to server
      // Simulate realistic inpainting turnaround with feedback
      await new Promise((res) => setTimeout(res, 2000));
      onApplyInpaint(item.imageUrl, inpaintPrompt);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#090D16]">
          <div className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Sửa Vùng Thông Minh (AI Inpainting Kiến Trúc)
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs text-slate-300">
            Quét cọ tô màu vùng cần sửa đổi trên bản render, sau đó nhập nội dung muốn AI tái tạo lại vùng đó:
          </p>

          {/* Interactive Canvas */}
          <div className="relative flex items-center justify-center rounded-xl border border-white/10 bg-black/60 p-2 overflow-hidden min-h-[300px]">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="max-h-[50vh] max-w-full object-contain rounded cursor-crosshair"
            />
          </div>

          {/* Brush Controls & Prompt Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {/* Brush Size */}
            <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-lg border border-white/[0.06]">
              <span className="text-xs text-slate-300 whitespace-nowrap">Cỡ cọ:</span>
              <input
                type="range"
                min={10}
                max={90}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-white/20 rounded cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400">{brushSize}px</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearMask}
                className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.05]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa Vết Cọ</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] text-slate-400">
              <span className="text-xs font-medium text-slate-500">Mẫu:</span>
              <button
                type="button"
                onClick={() => setInpaintPrompt('Hồ bơi phong cách nghỉ dưỡng lát đá mosaic')}
                className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-slate-300 truncate"
              >
                Hồ bơi resort
              </button>
              <button
                type="button"
                onClick={() => setInpaintPrompt('Dàn hoa giấy rực rỡ buông rủ ban công')}
                className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-slate-300 truncate"
              >
                Hoa giấy
              </button>
            </div>
          </div>

          {/* Inpainting Instruction Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nội Dung Muốn Đổi Tại Vùng Đã Quét Cọ:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inpaintPrompt}
                onChange={(e) => setInpaintPrompt(e.target.value)}
                placeholder="Ví dụ: Đổi thảm cỏ thành hồ bơi nghỉ dưỡng, ghế mây tắm nắng..."
                className="flex-1 rounded-lg border border-white/10 bg-[#090D16] px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleExecuteInpaint}
                disabled={isProcessing}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isProcessing ? 'Đang Xử Lý...' : 'Áp Dụng Thay Đổi'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
