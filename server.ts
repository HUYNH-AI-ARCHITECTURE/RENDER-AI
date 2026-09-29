import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to initialize GoogleGenAI with proper User-Agent header
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now(),
  });
});

// API Prompt Enhancer for Architecture
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { rawPrompt, styleTitle, moduleType, location, lighting, weather } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        enhancedPrompt: rawPrompt,
        note: 'Dùng prompt gốc (Chưa cấu hình API Key)',
      });
    }

    const systemPrompt = `Bạn là chuyên gia diễn họa kiến trúc (Architectural Visualizer) hàng đầu thế giới.
Nhiệm vụ của bạn là nhận thông số kiến trúc và viết một prompt chi tiết bằng tiếng Việt và tiếng Anh kỹ thuật để đưa vào bộ sinh ảnh AI kiến trúc.
Nhấn mạnh vào:
- Độ chính xác hình học, giữ nguyên kết cấu bản vẽ gốc
- Vật liệu siêu thực (vân đá tự nhiên, gạch hoa Indochine, bê tông mài thô, kính low-E phản chiếu, gỗ tếch chịu thời tiết)
- Ánh sáng tự nhiên, góc phản xạ, bóng đổ chân thực
- Bối cảnh đặc trưng của Việt Nam (dây điện gọn gàng, cây hoa giấy, vỉa hè lát đá, ánh nắng nhiệt đới)
- Tránh: chữ méo, mờ nhòe, biến dạng kết cấu.
Chỉ trả về đoạn văn prompt hoàn chỉnh, không thêm lời chào mở đầu hay kết luận.`;

    const userMessage = `Thông số:
- Phân hệ: ${moduleType === 'interior' ? 'Nội thất' : 'Ngoại thất'}
- Phong cách: ${styleTitle}
- Vị trí: ${location}
- Ánh sáng: ${lighting}
- Thời tiết: ${weather}
- Mô tả gốc: ${rawPrompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
      ],
    });

    const enhanced = response.text?.trim() || rawPrompt;
    return res.json({ enhancedPrompt: enhanced });
  } catch (err: any) {
    console.error('Error enhancing prompt:', err);
    return res.status(200).json({
      enhancedPrompt: req.body.rawPrompt || '',
      error: err?.message || 'Enhancement failed',
    });
  }
});

// Helper to parse base64 data URL
function parseBase64Image(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

// API Render Architecture
app.post('/api/render', async (req, res) => {
  try {
    const {
      originalImage,
      referenceImage,
      prompt,
      modelType = 'banana_standard',
      aspectRatio = '1:1',
      resolution = '1k',
      numOutputs = 1,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Thiếu nội dung prompt kiến trúc' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: 'Chưa tìm thấy GEMINI_API_KEY trong hệ thống. Vui lòng thiết lập khóa API.',
      });
    }

    // Determine model
    // Banana Thường: 'gemini-3.1-flash-lite-image'
    // Banana Pro: 'gemini-3.1-flash-image' or 'gemini-3-pro-image'
    const targetModel =
      modelType === 'banana_pro'
        ? 'gemini-3.1-flash-image'
        : 'gemini-3.1-flash-lite-image';

    const validAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    const chosenAspect = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    const chosenSize = resolution === '2k' ? '2K' : '1K';

    const results: string[] = [];
    const count = Math.min(Math.max(Number(numOutputs) || 1, 1), 4);

    for (let i = 0; i < count; i++) {
      const parts: any[] = [];

      // Add original image (Image 1)
      if (originalImage) {
        const parsedOriginal = parseBase64Image(originalImage);
        if (parsedOriginal) {
          parts.push({
            inlineData: {
              mimeType: parsedOriginal.mimeType,
              data: parsedOriginal.data,
            },
          });
        }
      }

      // Add reference image (Image 2)
      if (referenceImage) {
        const parsedRef = parseBase64Image(referenceImage);
        if (parsedRef) {
          parts.push({
            inlineData: {
              mimeType: parsedRef.mimeType,
              data: parsedRef.data,
            },
          });
        }
      }

      // Add instruction text
      parts.push({
        text: prompt,
      });

      const config: any = {
        imageConfig: {
          aspectRatio: chosenAspect,
        },
      };

      if (targetModel === 'gemini-3.1-flash-image') {
        config.imageConfig.imageSize = chosenSize;
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts,
        },
        config,
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            results.push(`data:${mime};base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        const textFallback = response.text || '';
        console.warn(`Attempt ${i + 1} did not return inlineData image. Text: ${textFallback}`);
      }
    }

    if (results.length === 0) {
      return res.status(500).json({
        error: 'Mô hình AI không trả về dữ liệu hình ảnh. Vui lòng kiểm tra lại prompt hoặc thử lại với model Banana Pro.',
      });
    }

    return res.json({
      success: true,
      images: results,
      modelUsed: targetModel,
      aspectRatio: chosenAspect,
      resolution: chosenSize,
    });
  } catch (error: any) {
    console.error('Render error:', error);
    return res.status(500).json({
      error: error?.message || 'Lỗi khi thực hiện render kiến trúc',
    });
  }
});

// Setup Vite middlewares in dev or serve static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HUỲNH-AI ARCHITECTURE Studio server running on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
