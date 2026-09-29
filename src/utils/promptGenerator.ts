import {
  RenderParams,
  ArchitectStyle,
} from '../types/architect';
import {
  EXTERIOR_STYLES,
  INTERIOR_STYLES,
  LOCATION_OPTIONS,
  LIGHTING_OPTIONS,
  WEATHER_OPTIONS,
} from '../data/architectStyles';

export function buildArchitecturalPrompt(
  params: RenderParams,
  hasOriginal: boolean,
  hasReference: boolean
): string {
  const stylesList = params.module === 'exterior' ? EXTERIOR_STYLES : INTERIOR_STYLES;
  const currentStyle: ArchitectStyle | undefined = stylesList.find(
    (s) => s.id === params.selectedStyleId
  ) || stylesList[0];

  const loc = LOCATION_OPTIONS.find((l) => l.key === params.location) || LOCATION_OPTIONS[0];
  const light = LIGHTING_OPTIONS.find((li) => li.key === params.lighting) || LIGHTING_OPTIONS[0];
  const weath = WEATHER_OPTIONS.find((w) => w.key === params.weather) || WEATHER_OPTIONS[0];

  // Base prompt template strictly matching user request specification
  let prompt = `Tạo một bản render kiến trúc chân thực dựa trên Ảnh Gốc (Ảnh 1).`;

  prompt += ` LƯU Ý QUAN TRỌNG: Hình ảnh đầu ra PHẢI có kích thước pixel và tỉ lệ khung hình GIỐNG Y HỆT so với Ảnh Gốc (Ảnh 1), chi tiết bám theo ảnh 1. KHÔNG được lấy kích thước hoặc tỉ lệ khung hình của Ảnh Tham Chiếu (Ảnh 2).`;

  if (hasReference) {
    prompt += ` Hãy học hỏi và áp dụng phong cách vật liệu, màu sắc và ngôn ngữ hoàn thiện bề mặt từ Ảnh Tham Chiếu (Ảnh 2) vào hình khối kết cấu của Ảnh Gốc (Ảnh 1).`;
  }

  prompt += ` Hướng dẫn sáng tạo chính là: một bản render chân thực như ảnh chụp chuyên nghiệp bằng máy ảnh Hasselblad kiến trúc, ${loc.promptPhrase}, ${light.promptPhrase}, ${weath.promptPhrase}.`;

  if (currentStyle) {
    prompt += ` Phong cách thiết kế: ${currentStyle.nameVi} (${currentStyle.nameEn}), với các đặc trưng cốt lõi: ${currentStyle.descriptionVi}. Vật liệu tiêu biểu: ${currentStyle.keywordsEn}. Tone màu chủ đạo: ${currentStyle.paletteVi}.`;
  }

  // ControlNet instructions
  const controlInstructions: string[] = [];
  if (params.controlNet.cannyLineart) {
    controlInstructions.push('Giữ nguyên chính xác 100% các nét vẽ hình học và kết cấu tường từ bản vẽ 3D/CAD thô');
  }
  if (params.controlNet.depthMappa) {
    controlInstructions.push('Bảo tồn chuẩn xác chiều sâu không gian, lớp lang tiền cảnh - trung cảnh - hậu cảnh');
  }
  if (params.controlNet.mlsdStraight) {
    controlInstructions.push('Bắt thẳng tuyệt đối các đường gióng cột tường thẳng đứng của kiến trúc, triệt tiêu hiện tượng méo góc phối cảnh');
  }

  if (controlInstructions.length > 0) {
    prompt += ` Yêu cầu kiểm soát nét (ControlNet): ${controlInstructions.join('; ')}.`;
  }

  // Weights
  prompt += ` Mức độ bám sát kết cấu ảnh gốc: ${params.weights.similarityToOriginal}%, Mức độ sáng tạo chi tiết vật liệu AI: ${params.weights.aiCreativity}%.`;

  // Custom details if user entered any
  if (params.customDetails && params.customDetails.trim()) {
    prompt += ` Chi tiết bổ sung: ${params.customDetails.trim()}.`;
  }

  // Strict negative prompt instructions
  prompt += ` Hãy tránh triệt để các yếu tố sau: chữ, logo, watermark, dầu mỡ, nhòe mờ, biến dạng kết cấu, chất lượng thấp, tranh vẽ tay phi thực tế.`;

  return prompt;
}
