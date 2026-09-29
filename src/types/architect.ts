export type ModuleType = 'exterior' | 'interior';

export interface ArchitectStyle {
  id: string;
  nameVi: string;
  nameEn: string;
  category: string;
  descriptionVi: string;
  keywordsEn: string;
  paletteVi: string;
  iconName?: string;
}

export type LocationKey = 'vietnam_street' | 'vietnam_countryside' | 'junction_3' | 'junction_4';

export interface LocationOption {
  key: LocationKey;
  labelVi: string;
  labelEn: string;
  promptPhrase: string;
}

export type LightingKey = 'morning' | 'noon' | 'afternoon' | 'night';

export interface LightingOption {
  key: LightingKey;
  labelVi: string;
  labelEn: string;
  promptPhrase: string;
}

export type WeatherKey = 'clear_sky' | 'overcast' | 'light_rain';

export interface WeatherOption {
  key: WeatherKey;
  labelVi: string;
  labelEn: string;
  promptPhrase: string;
}

export type AspectRatioKey = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type ResolutionKey = '1k' | '2k';
export type ModelTypeKey = 'banana_standard' | 'banana_pro';

export interface ControlNetConfig {
  cannyLineart: boolean; // Giữ nguyên chính xác 100% nét vẽ CAD/3D thô
  depthMappa: boolean;   // Giữ khoảng cách xa gần, chiều sâu không gian
  mlsdStraight: boolean; // Chuyên bắt các đường thẳng kiến trúc, tránh méo tường
}

export interface PromptWeights {
  similarityToOriginal: number; // 0% -> 100% (Độ tương đồng với ảnh gốc)
  aiCreativity: number;         // 0% -> 100% (Độ sáng tạo của AI)
}

export interface RenderParams {
  module: ModuleType;
  selectedStyleId: string;
  location: LocationKey;
  lighting: LightingKey;
  weather: WeatherKey;
  aspectRatio: AspectRatioKey;
  resolution: ResolutionKey;
  numOutputs: 1 | 2 | 3 | 4;
  modelType: ModelTypeKey;
  controlNet: ControlNetConfig;
  weights: PromptWeights;
  customDetails: string;
}

export interface RenderResultItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  originalImageUrl?: string;
  referenceImageUrl?: string;
  prompt: string;
  params: RenderParams;
}

export interface PresetDemo {
  id: string;
  titleVi: string;
  module: ModuleType;
  styleId: string;
  originalImage: string;
  referenceImage: string;
  renderedImage: string;
  location: LocationKey;
  lighting: LightingKey;
  weather: WeatherKey;
  aspectRatio: AspectRatioKey;
  descriptionVi: string;
}
