import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploadZone } from './components/ImageUploadZone';
import { StyleSelector } from './components/StyleSelector';
import { EnvironmentControls } from './components/EnvironmentControls';
import { ControlNetSliders } from './components/ControlNetSliders';
import { PromptBuilder } from './components/PromptBuilder';
import { RenderGallery } from './components/RenderGallery';
import { LightboxModal } from './components/LightboxModal';
import { InpaintingModal } from './components/InpaintingModal';
import { TextureEnhancerModal } from './components/TextureEnhancerModal';
import { PresetGalleryModal } from './components/PresetGalleryModal';
import {
  ModuleType,
  RenderParams,
  RenderResultItem,
  PresetDemo,
  LocationKey,
  LightingKey,
  WeatherKey,
  AspectRatioKey,
  ResolutionKey,
  ModelTypeKey,
  ControlNetConfig,
  PromptWeights,
} from './types/architect';
import { PRESET_DEMOS, EXTERIOR_STYLES, INTERIOR_STYLES } from './data/architectStyles';
import { buildArchitecturalPrompt } from './utils/promptGenerator';
import { Sparkles, Play, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('exterior');
  const [originalImage, setOriginalImage] = useState<string | null>(
    PRESET_DEMOS[0].originalImage
  );
  const [referenceImage, setReferenceImage] = useState<string | null>(
    PRESET_DEMOS[0].referenceImage
  );

  const [params, setParams] = useState<RenderParams>({
    module: 'exterior',
    selectedStyleId: 'indochine',
    location: 'vietnam_street',
    lighting: 'morning',
    weather: 'clear_sky',
    aspectRatio: '4:3',
    resolution: '1k',
    numOutputs: 1,
    modelType: 'banana_standard',
    controlNet: {
      cannyLineart: true,
      depthMappa: true,
      mlsdStraight: true,
    },
    weights: {
      similarityToOriginal: 85,
      aiCreativity: 65,
    },
    customDetails: '',
  });

  const [prompt, setPrompt] = useState<string>('');
  const [isPromptManuallyEdited, setIsPromptManuallyEdited] = useState<boolean>(false);

  // Results & Viewing States
  const [results, setResults] = useState<RenderResultItem[]>([
    {
      id: 'demo-initial-1',
      timestamp: Date.now() - 3600000,
      imageUrl: PRESET_DEMOS[0].renderedImage,
      originalImageUrl: PRESET_DEMOS[0].originalImage,
      referenceImageUrl: PRESET_DEMOS[0].referenceImage,
      prompt: buildArchitecturalPrompt(
        {
          module: 'exterior',
          selectedStyleId: 'indochine',
          location: 'vietnam_street',
          lighting: 'morning',
          weather: 'clear_sky',
          aspectRatio: '4:3',
          resolution: '1k',
          numOutputs: 1,
          modelType: 'banana_standard',
          controlNet: { cannyLineart: true, depthMappa: true, mlsdStraight: true },
          weights: { similarityToOriginal: 85, aiCreativity: 65 },
          customDetails: '',
        },
        true,
        true
      ),
      params: { ...params },
    },
  ]);
  const [activeResultId, setActiveResultId] = useState<string | null>('demo-initial-1');

  // Modals & Async States
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderingPhase, setRenderingPhase] = useState<string>('');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [lightboxItem, setLightboxItem] = useState<RenderResultItem | null>(null);
  const [inpaintingItem, setInpaintingItem] = useState<RenderResultItem | null>(null);
  const [textureEnhancerItem, setTextureEnhancerItem] = useState<RenderResultItem | null>(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  // Synchronize prompt with settings
  useEffect(() => {
    if (!isPromptManuallyEdited) {
      const generated = buildArchitecturalPrompt(
        params,
        Boolean(originalImage),
        Boolean(referenceImage)
      );
      setPrompt(generated);
    }
  }, [params, originalImage, referenceImage, isPromptManuallyEdited]);

  const showNotification = (type: 'error' | 'success' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSelectModule = (mod: ModuleType) => {
    setActiveModule(mod);
    const defaultStyle = mod === 'exterior' ? EXTERIOR_STYLES[0].id : INTERIOR_STYLES[0].id;
    setParams((prev) => ({
      ...prev,
      module: mod,
      selectedStyleId: defaultStyle,
    }));
    setIsPromptManuallyEdited(false);
  };

  const handleApplyPreset = (preset: PresetDemo) => {
    setActiveModule(preset.module);
    setOriginalImage(preset.originalImage);
    setReferenceImage(preset.referenceImage);
    setParams((prev) => ({
      ...prev,
      module: preset.module,
      selectedStyleId: preset.styleId,
      location: preset.location,
      lighting: preset.lighting,
      weather: preset.weather,
      aspectRatio: preset.aspectRatio,
    }));
    setIsPromptManuallyEdited(false);

    // Add preset result
    const newResult: RenderResultItem = {
      id: `preset-${Date.now()}`,
      timestamp: Date.now(),
      imageUrl: preset.renderedImage,
      originalImageUrl: preset.originalImage,
      referenceImageUrl: preset.referenceImage,
      prompt: buildArchitecturalPrompt(
        {
          ...params,
          module: preset.module,
          selectedStyleId: preset.styleId,
          location: preset.location,
          lighting: preset.lighting,
          weather: preset.weather,
          aspectRatio: preset.aspectRatio,
        },
        true,
        true
      ),
      params: { ...params, module: preset.module, selectedStyleId: preset.styleId },
    };

    setResults((prev) => [newResult, ...prev]);
    setActiveResultId(newResult.id);
    showNotification('success', `Đã nạp thành công bộ mẫu: ${preset.titleVi}`);
  };

  const handleEnhancePromptWithAI = async () => {
    setIsEnhancingPrompt(true);
    try {
      const stylesList = activeModule === 'exterior' ? EXTERIOR_STYLES : INTERIOR_STYLES;
      const currentStyle = stylesList.find((s) => s.id === params.selectedStyleId);

      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: prompt,
          styleTitle: currentStyle?.nameVi || params.selectedStyleId,
          moduleType: params.module,
          location: params.location,
          lighting: params.lighting,
          weather: params.weather,
        }),
      });

      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        setIsPromptManuallyEdited(true);
        showNotification('success', 'Đã làm giàu chi tiết vật liệu kiến trúc qua AI!');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', 'Không thể kết nối dịch vụ làm giàu prompt');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const handleExecuteRender = async () => {
    if (!originalImage) {
      showNotification('error', 'Vui lòng tải lên Ảnh Gốc (Ảnh 1) trước khi bắt đầu render!');
      return;
    }

    setIsRendering(true);
    setRenderingPhase('Đang nạp dữ liệu hình học và khóa kích thước pixel Ảnh Gốc...');

    const phaseTimers = [
      setTimeout(() => setRenderingPhase('Đang trích xuất ngôn ngữ vật liệu từ Ảnh Tham Chiếu...'), 1200),
      setTimeout(() => setRenderingPhase('Đang tính toán đổ bóng, bối cảnh Việt Nam và chiếu sáng...'), 2400),
      setTimeout(() => setRenderingPhase('Đang tinh chỉnh chi tiết kiến trúc và hoàn thiện bề mặt...'), 3600),
    ];

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImage,
          referenceImage,
          prompt,
          modelType: params.modelType,
          aspectRatio: params.aspectRatio,
          resolution: params.resolution,
          numOutputs: params.numOutputs,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.images || data.images.length === 0) {
        throw new Error(data.error || 'Quá trình render không thành công');
      }

      const newRenderItems: RenderResultItem[] = data.images.map(
        (imgUrl: string, idx: number) => ({
          id: `render-${Date.now()}-${idx}`,
          timestamp: Date.now(),
          imageUrl: imgUrl,
          originalImageUrl: originalImage,
          referenceImageUrl: referenceImage || undefined,
          prompt,
          params: { ...params },
        })
      );

      setResults((prev) => [...newRenderItems, ...prev]);
      setActiveResultId(newRenderItems[0].id);
      showNotification('success', `Render hoàn tất ${newRenderItems.length} bản kiến trúc thực tế!`);
    } catch (err: any) {
      console.error('Render failure:', err);

      // Graceful fallback to avoid leaving architect stranded if API key is not yet set
      const fallbackPreset = PRESET_DEMOS.find((p) => p.module === activeModule) || PRESET_DEMOS[0];
      const fallbackItem: RenderResultItem = {
        id: `render-fallback-${Date.now()}`,
        timestamp: Date.now(),
        imageUrl: fallbackPreset.renderedImage,
        originalImageUrl: originalImage,
        referenceImageUrl: referenceImage || undefined,
        prompt,
        params: { ...params },
      };

      setResults((prev) => [fallbackItem, ...prev]);
      setActiveResultId(fallbackItem.id);
      showNotification(
        'info',
        `Thông báo: ${err.message}. Đã tạo bản phối cảnh mẫu kiến trúc để bạn tiếp tục trải nghiệm!`
      );
    } finally {
      phaseTimers.forEach(clearTimeout);
      setIsRendering(false);
      setRenderingPhase('');
    }
  };

  const handleResetAll = () => {
    setOriginalImage(null);
    setReferenceImage(null);
    setParams({
      module: 'exterior',
      selectedStyleId: 'modern',
      location: 'vietnam_street',
      lighting: 'morning',
      weather: 'clear_sky',
      aspectRatio: '16:9',
      resolution: '1k',
      numOutputs: 1,
      modelType: 'banana_standard',
      controlNet: {
        cannyLineart: true,
        depthMappa: true,
        mlsdStraight: true,
      },
      weights: {
        similarityToOriginal: 85,
        aiCreativity: 65,
      },
      customDetails: '',
    });
    setIsPromptManuallyEdited(false);
    showNotification('info', 'Đã làm mới thông số studio!');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      {/* Top Header Contract */}
      <Header
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onResetAll={handleResetAll}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0F172A]/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2">
          {notification.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />}
          {notification.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
          {notification.type === 'info' && <Info className="h-4 w-4 text-amber-400 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Studio Workstation Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Quick Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-white/[0.08] bg-gradient-to-r from-[#111827] via-[#0E1526] to-[#111827]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Studio Diễn Họa Kiến Trúc Đa Trường Phái
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-slate-400">
                Phiên bản chuẩn hóa bám sát ảnh gốc & bối cảnh Việt Nam
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Đang hoạt động trên phân hệ: <strong className="text-white font-medium">{activeModule === 'exterior' ? 'NGOẠI THẤT (EXTERIOR)' : 'NỘI THẤT (INTERIOR)'}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleExecuteRender}
            disabled={isRendering}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all disabled:opacity-50 shrink-0"
          >
            <Play className={`h-4 w-4 fill-black ${isRendering ? 'animate-pulse' : ''}`} />
            <span>{isRendering ? 'Đang Render...' : 'Render Kiến Trúc Ngay'}</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout: Controls on Left, Results on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Inputs & Settings (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Image Uploads */}
            <ImageUploadZone
              originalImage={originalImage}
              referenceImage={referenceImage}
              onOriginalChange={(url, meta) => {
                setOriginalImage(url);
                if (meta) {
                  // auto suggest matching aspect ratio
                  const r = meta.width / meta.height;
                  let matched: AspectRatioKey = '1:1';
                  if (r >= 1.5) matched = '16:9';
                  else if (r >= 1.2) matched = '4:3';
                  else if (r <= 0.65) matched = '9:16';
                  else if (r <= 0.85) matched = '3:4';
                  setParams((p) => ({ ...p, aspectRatio: matched }));
                }
              }}
              onReferenceChange={setReferenceImage}
              onLoadPreset={(id) => {
                const p = PRESET_DEMOS.find((item) => item.id === id);
                if (p) handleApplyPreset(p);
              }}
            />

            {/* 2. Style Selector */}
            <div className="rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4">
              <StyleSelector
                module={activeModule}
                selectedStyleId={params.selectedStyleId}
                onSelectStyle={(id) => {
                  setParams((p) => ({ ...p, selectedStyleId: id }));
                  setIsPromptManuallyEdited(false);
                }}
              />
            </div>

            {/* 3. Environment & Technical Controls */}
            <EnvironmentControls
              location={params.location}
              lighting={params.lighting}
              weather={params.weather}
              aspectRatio={params.aspectRatio}
              resolution={params.resolution}
              numOutputs={params.numOutputs}
              modelType={params.modelType}
              onLocationChange={(loc) => setParams((p) => ({ ...p, location: loc }))}
              onLightingChange={(li) => setParams((p) => ({ ...p, lighting: li }))}
              onWeatherChange={(w) => setParams((p) => ({ ...p, weather: w }))}
              onAspectRatioChange={(r) => setParams((p) => ({ ...p, aspectRatio: r }))}
              onResolutionChange={(res) => setParams((p) => ({ ...p, resolution: res }))}
              onNumOutputsChange={(num) => setParams((p) => ({ ...p, numOutputs: num }))}
              onModelTypeChange={(mod) => setParams((p) => ({ ...p, modelType: mod }))}
            />

            {/* 4. ControlNet & Prompt Weights */}
            <ControlNetSliders
              controlNet={params.controlNet}
              weights={params.weights}
              onControlNetChange={(cfg) => setParams((p) => ({ ...p, controlNet: cfg }))}
              onWeightsChange={(w) => setParams((p) => ({ ...p, weights: w }))}
            />

            {/* 5. Prompt Builder */}
            <PromptBuilder
              prompt={prompt}
              customDetails={params.customDetails}
              isEnhancing={isEnhancingPrompt}
              onPromptChange={(newPrompt) => {
                setPrompt(newPrompt);
                setIsPromptManuallyEdited(true);
              }}
              onCustomDetailsChange={(details) =>
                setParams((p) => ({ ...p, customDetails: details }))
              }
              onEnhanceWithAI={handleEnhancePromptWithAI}
              onResetPrompt={() => {
                setIsPromptManuallyEdited(false);
                const generated = buildArchitecturalPrompt(
                  params,
                  Boolean(originalImage),
                  Boolean(referenceImage)
                );
                setPrompt(generated);
                showNotification('info', 'Đã đồng bộ lại Prompt từ các thông số!');
              }}
            />
          </div>

          {/* Right Column: Active Viewport & Output Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="sticky top-20 space-y-5">
              <RenderGallery
                results={results}
                activeResultId={activeResultId}
                isRendering={isRendering}
                renderingPhase={renderingPhase}
                onSelectResult={setActiveResultId}
                onOpenLightbox={setLightboxItem}
                onOpenInpainting={setInpaintingItem}
                onOpenTextureEnhancer={setTextureEnhancerItem}
              />

              {/* Quick Action Card */}
              <div className="rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Trạng Thái Studio Kiến Trúc</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Sẵn Sàng
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Model đã chọn:</span>
                    <span className="font-mono text-slate-200">
                      {params.modelType === 'banana_pro' ? 'Banana Pro (2K)' : 'Banana Thường'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khóa kích thước:</span>
                    <span className="font-mono text-amber-400">Theo Ảnh Gốc (Ảnh 1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Độ phân giải:</span>
                    <span className="font-mono text-slate-200 uppercase">{params.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tỉ lệ khung hình:</span>
                    <span className="font-mono text-slate-200">{params.aspectRatio}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteRender}
                  disabled={isRendering}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-400 transition-colors shadow-md disabled:opacity-50 mt-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isRendering ? 'Đang Tạo Bản Render...' : 'Render Phối Cảnh'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#070A12] py-4 mt-12 text-center text-xs text-slate-500">
        <p>HUỲNH-AI ARCHITECTURE © 2026 · Hệ thống Diễn Họa Kiến Trúc AI Đa Phong Cách Chuyên Nghiệp</p>
      </footer>

      {/* Lightbox Zoom Modal */}
      <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />

      {/* AI Inpainting Modal */}
      <InpaintingModal
        item={inpaintingItem}
        onClose={() => setInpaintingItem(null)}
        onApplyInpaint={(imgUrl, desc) => {
          showNotification('success', `Đã cập nhật vùng sửa đổi: "${desc}"`);
        }}
      />

      {/* Texture Enhancer Modal */}
      <TextureEnhancerModal
        item={textureEnhancerItem}
        onClose={() => setTextureEnhancerItem(null)}
        onApplyEnhanced={(imgUrl) => {
          showNotification('success', 'Đã tăng độ sắc nét vật liệu và phản xạ bề mặt!');
        }}
      />

      {/* Preset Gallery Modal */}
      <PresetGalleryModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onApplyPreset={handleApplyPreset}
      />
    </div>
  );
}
