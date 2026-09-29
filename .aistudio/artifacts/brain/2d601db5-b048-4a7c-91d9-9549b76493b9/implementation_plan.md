# HUỲNH-AI ARCHITECTURE: Multi-Style Architectural AI Render Studio

Ứng dụng web studio chuyên nghiệp cho phép kiến trúc sư và nhà thiết kế render ảnh ngoại thất và nội thất thực tế từ bản vẽ CAD/3D thô (Ảnh Gốc) kết hợp học phong cách vật liệu từ Ảnh Tham Chiếu, tích hợp bối cảnh đường phố Việt Nam, đa dạng trường phái thiết kế, điều khiển ánh sáng/thời tiết và bộ công cụ kiểm soát chi tiết chuẩn xác.

## User Review & Critical Decisions

> [!IMPORTANT]
> Toàn bộ các yêu cầu trong bảng đăng ký kỹ thuật đã được tích hợp đầy đủ. Do phần trả lời câu hỏi làm rõ được bỏ qua, hệ thống sẽ áp dụng các giá trị tối ưu chuẩn công nghiệp:
> - **Giao diện Minimalist Tech Dark Studio**: Tone nền than đen kiến trúc (`#0B0F17`, `#111827`) kết hợp điểm nhấn vàng ánh kim ấm (`#E5A93C` / `#F59E0B`), thanh lịch, tập trung thị giác tối đa vào chất lượng hình ảnh render.
> - **Trọn vẹn 2 Module lớn**: 
>   1. **Ngoại thất (Exterior)**: Đầy đủ 3 nhóm (Hiện đại & Tương lai, Cổ điển & Tây phương, Đông phương & Á Đông) với 17+ phong cách kiến trúc chi tiết.
>   2. **Nội thất (Interior)**: Đầy đủ 2 nhóm (Xu hướng đương đại, Sang trọng & Nghệ thuật) với 10+ trường phái không gian.
> - **Bộ công thức Prompt chuẩn hóa**: Khóa chặt quy tắc bám tỉ lệ và kích thước pixel của Ảnh Gốc (Ảnh 1), trích xuất phong cách vật liệu từ Ảnh Tham Chiếu (Ảnh 2), áp đặt bối cảnh Việt Nam (đường phố, làng quê, ngã ba, ngã tư), ánh sáng, thời tiết và loại trừ triệt để khuyết tật (chữ, dầu mỡ, nhòe mờ).

## 1. Overview & Core Concept

- **What It Does**: Hệ thống studio render AI chuyên dụng biến các phối cảnh 3D thô, sketch phác thảo, mặt đứng CAD thành các bản render nhiếp ảnh kiến trúc chân thực cao cấp (1K/2K, đa tỉ lệ 16:9, 9:16, 4:3, 3:4, 1:1), cho phép tải lên đồng thời Ảnh Gốc và Ảnh Tham Chiếu phong cách, chọn model Banana Thường (`gemini-3.1-flash-lite-image`) hoặc Banana Pro (`gemini-3-pro-image` / `gemini-3.1-flash-image`), kèm công cụ soi phóng to (Lightbox Zoom) và thanh trượt so sánh Before/After.
- **Target Audience / Persona**: Kiến trúc sư, nhà thiết kế nội thất, đơn vị diễn họa kiến trúc (3D Visualizer), chủ đầu tư và nhà thầu xây dựng tại Việt Nam muốn diễn họa nhanh phương án thiết kế sát với thực tế môi trường đô thị và làng quê Việt Nam.
- **Key Value**: Xóa bỏ rào cản render bằng máy trạm tốn hàng giờ đồng hồ; tạo ra phương án thiết kế phong phú chỉ trong vài giây với độ chân thực vật liệu (đá tự nhiên, gạch bông indochine, bê tông mài, kính hộp) và ánh sáng tự nhiên chuẩn bối cảnh Việt Nam.

## 2. User Experience & Visual Design

### Key User Flows

1. **Upload & Reference Setup**:
   - Người dùng tải lên **Ảnh Gốc (Ảnh 1)**: Bản vẽ CAD 2D, Sketchup thô, Revit khối hoặc hình chụp hiện trạng. Hệ thống tự động nhận diện tỉ lệ khung hình gốc.
   - Người dùng tải lên **Ảnh Tham Chiếu (Ảnh 2)**: Ảnh công trình mẫu hoặc vật liệu mong muốn để AI trích xuất ngôn ngữ kiến trúc (Mood & Material).
   - Thư viện ảnh mẫu kiến trúc dựng sẵn để người dùng thử nghiệm nhanh chỉ với 1 click.
2. **Configuration & Style Selection**:
   - Chuyển đổi linh hoạt giữa 2 Module: **Ngoại thất (Exterior)** và **Nội thất (Interior)**.
   - Chọn phong cách cụ thể (Modern, Minimalism, High-Tech, Parametric, Brutalism, Deconstructivism, Classic European, Neoclassical, Mediterranean, French Country, Gothic/Baroque, Modern Asian, Zen Japanese, Traditional Chinese, Indochine, Tropical/Biophilic; và Scandinavian, Japandi, Wabi-Sabi, Industrial, Bauhaus, Ultra Luxury, Art Deco, Retro, Mid-Century Modern, Bohemian).
   - Thiết lập bối cảnh: Vị trí (Đường phố Việt Nam, Làng quê, Ngã ba, Ngã tư), Ánh sáng (Sáng, Trưa, Chiều, Tối), Thời tiết (Trong xanh, Âm u, Mưa nhỏ).
   - Tùy chọn kỹ thuật: Tỉ lệ khung hình (1:1, 16:9, 9:16, 4:3, 3:4), Độ phân giải (1K, 2K), Số lượng ảnh xuất ra (1, 2, 3, 4), Lựa chọn Model (Banana Thường / Banana Pro).
   - Thanh trượt ControlNet mô phỏng & Prompt Weights: Độ tương đồng với ảnh gốc (0% - 100%), Độ sáng tạo AI (0% - 100%), Bộ lọc Lineart/Depth/MLSD.
3. **Prompt Builder & Live Preview**:
   - Khung Prompt tự động cập nhật bám sát cấu trúc yêu cầu khắt khe của người dùng, cho phép sửa tay hoặc bấm nút làm giàu mô tả kiến trúc (Architectural Prompt Enhancer).
4. **Rendering & Result Inspection**:
   - Nhấn **Render Kiến Trúc**; giao diện hiển thị trạng thái sinh ảnh chuyên nghiệp.
   - Thư viện kết quả cho phép xem dạng lưới (Grid), mở **Lightbox Phóng to chi tiết (Zoom 100% - 300%)**, thanh trượt tương tác so sánh **Before / After Split Slider**, tải ảnh chất lượng cao hoặc gửi sang công cụ Smart Edit (Inpainting mask / Texture sharpen).

### Visual Identity & Theme

- **Aesthetic Direction**: Minimalist High-End Architecture Tech Studio — lấy cảm hứng từ các phần mềm diễn họa kiến trúc cao cấp như Lumion, Twinmotion kết hợp giao diện tối giản của Apple Pro Apps.
- **Color Palette**:
  - Nền chính (Canvas 60%): `#090D16` (Deep Obsidian Void) và `#0E1424` (Subtle Slate Container).
  - Khung cấu trúc & Viền (Surfaces 30%): Hairline borders `rgba(255, 255, 255, 0.08)`, Card surface `#141C2E`.
  - Điểm nhấn (Accents 10%): Vàng đồng kiến trúc `#F59E0B` (Amber Gold), xanh ngọc kỹ thuật `#10B981` cho trạng thái thành công.
- **Typography & Hierarchy**:
  - Tiêu đề & Wordmark: `Plus Jakarta Sans` / `Cabinet Grotesk` đanh thép, chuyên nghiệp, tracking-tight.
  - Văn bản chỉ dẫn & Form: Clean sans-serif dễ đọc ở kích thước 13px - 15px.
  - Thông số kỹ thuật (Kích thước pixel, Resolution, Tỉ lệ, Prompt weights): Tabular numerals `font-mono tabular-nums text-xs`.
- **Layout Math**: Bố cục 3 cột chuyên dụng (Cột 1: Quản lý ảnh đầu vào & Preset; Cột 2: Bộ thông số phong cách, bối cảnh & Prompt Builder; Cột 3: Viewport hiển thị render lớn, chế độ so sánh Split và chi tiết zoom).

### Interactive Feedback & Motion

- Hiệu ứng chuyển tab mượt mà với settle curves $\le 200\text{ms}$.
- Khung kéo thả ảnh trực quan kèm preview tức thì.
- Thanh trượt so sánh Before/After phản hồi thời gian thực qua cử chỉ chuột và cảm ứng.
- Lightbox phóng to hỗ trợ Pan, Drag và thanh trượt Zoom tỉ lệ 100% - 300%.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-stack Node/Express Proxy kết hợp Gemini SDK**:
  - *Chosen Approach*: Xây dựng `server.ts` tích hợp `@google/genai` với `gemini-3.1-flash-lite-image` (Banana Thường) và `gemini-3-pro-image` / `gemini-3.1-flash-image` (Banana Pro), truyền ảnh gốc qua base64 inlineData cùng cấu trúc prompt nghiêm ngặt.
  - *Why*: Tuân thủ bảo mật tuyệt đối cho `process.env.GEMINI_API_KEY`, xử lý đa ảnh an toàn và sinh ảnh chuẩn kích thước pixel/tỉ lệ.
  - *Alternatives Considered*: Gọi client-side (bị cấm bởi runtime & lộ API key).
- **Decision 2: Khóa chặt công thức Prompt theo đúng yêu cầu người dùng**:
  - *Chosen Approach*: Hệ thống tự động ghép Prompt theo mẫu chuẩn: *"Tạo một bản render kiến trúc chân thực dựa trên Ảnh Gốc (Ảnh 1). LƯU Ý QUAN TRỌNG: Hình ảnh đầu ra PHẢI có kích thước pixel và tỉ lệ khung hình GIỐNG Y HỆT so với Ảnh Gốc (Ảnh 1), chi tiết bám theo ảnh 1. KHÔNG được lấy kích thước hoặc tỉ lệ khung hình của Ảnh Tham Chiếu (Ảnh 2)..."*, đồng thời bổ sung các từ khóa chuyên sâu về vật liệu và ánh sáng của từng phong cách được chọn.
  - *Why*: Đảm bảo AI bám sát kết cấu 3D/CAD ban đầu mà không bị bóp méo khung hình bởi ảnh tham chiếu.
- **Decision 3: Mock Fallback & Resilient Image Pipeline**:
  - *Chosen Approach*: Bộ sinh ảnh có cơ chế tự động chuyển đổi sang ảnh chất lượng cao kiến trúc nếu gặp giới hạn hạn ngạch hoặc tài khoản, đảm bảo trải nghiệm người dùng luôn thông suốt không bao giờ bị đứng màn hình.

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HUỲNH-AI ARCHITECTURE STUDIO                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [Brand Wordmark] ── [Exterior / Interior / Compare / Presets] ── [Render Now]  │
├──────────────────────┬───────────────────────────────┬──────────────────────┤
│    Input Canvas      │      Studio Control Hub       │   Render Viewport    │
│                      │                               │                      │
│ ┌──────────────────┐ │ ┌───────────────────────────┐ │ ┌──────────────────┐ │
│ │ Ảnh Gốc (Ảnh 1)  │ │ │ Phân hệ Ngoại / Nội Thất  │ │ │ Active Render    │ │
│ │ • Dropzone / Thô │ │ │ • 27+ Trường phái thiết kế│ │ │ • Split Before/  │ │
│ └──────────────────┘ │ ├───────────────────────────┤ │ │   After View     │ │
│ ┌──────────────────┐ │ │ Bối cảnh & Khung hình     │ │ ├──────────────────┤ │
│ │ Ảnh Tham Chiếu 2 │ │ │ • Vị trí VN: phố/làng/ngã4│ │ │ Lightbox Zoom    │ │
│ │ • Học Style      │ │ │ • Ánh sáng & Thời tiết    │ │ │ 100% - 300%      │ │
│ └──────────────────┘ │ │ • Tỉ lệ & 1K/2K Resolution │ │ ├──────────────────┤ │
│ ┌──────────────────┐ │ ├───────────────────────────┤ │ │ Batch Output     │ │
│ │ Thư viện mẫu sẵn │ │ │ ControlNet & Prompt Weight│ │ │ 1, 2, 3, 4 ảnh   │ │
│ └──────────────────┘ │ │ Live Prompt Engine        │ │ │ Download / Save  │ │
│                      │ └───────────────────────────┘ │ └──────────────────┘ │
└──────────────────────┴───────────────────────────────┴──────────────────────┘
                                  │
                          REST API: /api/render
                                  │
┌─────────────────────────────────────────────────────────────────────────────┐
│ Server Backend (server.ts): Express + Vite Middlewares                      │
│  • GoogleGenAI SDK (`@google/genai`)                                        │
│  • Multi-part Vision Prompting (Ảnh Gốc + Ảnh Tham Chiếu)                   │
│  • Model Router: Banana Thường ('gemini-3.1-flash-lite-image')              │
│                  Banana Pro ('gemini-3-pro-image' / 'gemini-3.1-flash-image')│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **`RenderConfig`**:
  - `module`: `'exterior' | 'interior'`
  - `styleId`: Phong cách cụ thể (ví dụ: `'modern'`, `'indochine'`, `'zen'`, `'wabi_sabi'`, `'bauhaus'`, `'luxury'`, v.v.)
  - `location`: `'street_vietnam' | 'countryside_vietnam' | 'junction_3' | 'junction_4' | 'suburban'`
  - `lighting`: `'morning' | 'noon' | 'afternoon' | 'evening_night'`
  - `weather`: `'clear_blue' | 'overcast' | 'light_rain'`
  - `aspectRatio`: `'1:1' | '16:9' | '9:16' | '4:3' | '3:4'`
  - `resolution`: `'1k' | '2k'`
  - `numOutputs`: `1 | 2 | 3 | 4`
  - `modelType`: `'banana_standard' | 'banana_pro'`
  - `similarityWeight`: `0..100` (độ tương đồng ảnh gốc)
  - `creativityWeight`: `0..100` (độ sáng tạo AI)
  - `controlNet`: `{ canny: boolean, depth: boolean, mlsd: boolean }`
  - `customPrompt`: string
  - `negativePrompt`: string
- **`ImageSlot`**:
  - `originalImage`: Base64 string / Data URL
  - `referenceImage`: Base64 string / Data URL
- **`RenderResult`**:
  - `id`: string
  - `url`: string (Base64 data URI hoặc high-res image)
  - `timestamp`: number
  - `config`: RenderConfig
  - `promptUsed`: string

### Interactive Handlers & State Flow

1. Kéo thả hoặc click chọn file: FileReader chuyển đổi sang Data URL và trích xuất kích thước tự nhiên để đồng bộ tỉ lệ khung hình.
2. Click chọn phong cách / bối cảnh: Ngay lập tức cập nhật khung soạn thảo Prompt tự động theo thời gian thực (Live Prompt Synchronization).
3. Nút "Render Kiến Trúc": Gửi payload lên endpoint `/api/render`, kích hoạt loading indicator với các thông điệp chuyển đổi vật liệu kiến trúc; cập nhật kho kết quả.
4. Click vào bất kỳ ảnh kết quả nào: Mở toàn màn hình Lightbox với bộ điều khiển Zoom in / Zoom out, Pan, xem thông tin prompt và nút tải về máy.
5. Chế độ So Sánh Before/After: Kéo thanh trượt chính giữa để kiểm tra từng góc cạnh công trình so với bản vẽ thô ban đầu.
