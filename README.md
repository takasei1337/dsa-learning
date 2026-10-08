# Algo Web SPA - Project & UI Framework

Khung ứng dụng SPA hiện đại xây dựng trên nền tảng **React 19 + TypeScript + Vite + Tailwind CSS**, tích hợp sẵn công cụ render công thức toán học KaTeX, thư viện tô màu cú pháp mã nguồn PrismJS và bộ icon Lucide.

---

## 🛠 Công nghệ & Thư viện tích hợp

- **Core SPA**: React 19 + TypeScript + Vite
- **UI & Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Render toán học**: KaTeX (`katex`, `@types/katex`, `katex/dist/katex.min.css`) để render công thức độ phức tạp $O(N)$, $O(N \log N)$, định lý thợ, v.v.
- **Tô màu cú pháp code**: PrismJS (`prismjs`, `@types/prismjs`, `prism-tomorrow.css`) hỗ trợ C++, Python, TypeScript, JavaScript, Java...
- **Icons**: `lucide-react`

---

## 📁 Cấu trúc thư mục

```text
b26101201/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Header cố định (Search Ctrl+K, theme Sáng/Tối, Editor mode)
│   │   ├── Sidebar.tsx          # Sidebar 6 chương (Roadmap, x/y tiến độ, Drawer mobile, thu gọn)
│   │   ├── ChapterNavigation.tsx # Điều hướng cuối trang B-01 -> B-05 (Next/Prev, Scroll top, phím tắt)
│   │   ├── CoreConcepts.tsx     # Module C: Khái niệm (C-01, C-02, C-07, C-08) & Bảng 5 cột (C-10, C-11, C-13)
│   │   ├── MarkdownView.tsx     # Trình render Markdown + KaTeX an toàn (inline & block math)
│   │   ├── MathView.tsx         # Component render công thức KaTeX
│   │   └── CodeViewer.tsx       # Component hiển thị code PrismJS + copy button
│   ├── data/
│   │   ├── seedData.ts          # Dữ liệu 6 chương Phụ lục A (30 bài tập, templates, pitfalls...)
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useStorage.ts        # Custom hook phản ứng thay đổi localStorage đa tab/sự kiện
│   │   └── index.ts
│   ├── services/
│   │   ├── storageAdapter.ts    # Lớp StorageAdapter quản lý 3 khóa độc lập & migration
│   │   ├── storageAdapter.test.ts # Bộ unit tests cho StorageAdapter (Vitest)
│   │   └── index.ts
│   ├── types/
│   │   ├── schema.ts            # Interface TypeScript chuẩn Mục 6.2
│   │   └── index.ts
│   ├── App.tsx                  # Giao diện chính tương tác Roadmap & Checklist
│   ├── index.css                # Cấu hình Tailwind CSS v4 & theme
│   └── main.tsx                 # Entry point nạp KaTeX & Prism CSS
├── index.html                   # Trang HTML gốc
├── vite.config.ts               # Cấu hình Vite tích hợp Tailwind CSS
├── tsconfig.json                # Cấu hình TypeScript
└── package.json                 # Danh sách gói phụ thuộc và scripts
```

---

## 🗄 Storage Adapter (Mục 6.3 - SRS v1.0)

Hệ thống lưu trữ trên trình duyệt tách biệt thành 3 khóa độc lập:
1. `dsa.content.v1`: Lưu toàn bộ nội dung học (hỗ trợ Import / Export / Reset Seed Data).
2. `dsa.progress.v1`: Lưu trạng thái checklist bài tập (`done`, `doneAt`, `note`).
3. `dsa.settings.v1`: Lưu tùy chọn người dùng (`language: 'python' | 'cpp'`, `theme`, `editMode`, `lineNumbers`).

**Cơ chế hoạt động:**
- **Auto-seeding**: Khi người dùng mở trang lần đầu, hệ thống tự động nạp `initialSeedData` vào `dsa.content.v1`, đồng thời khởi tạo `dsa.progress.v1` và `dsa.settings.v1`.
- **Migration & Schema Validation**: Tự động kiểm tra tính toàn vẹn của dữ liệu và nâng cấp schema nếu phát hiện phiên bản cũ, fallback an toàn về `seedData` khi dữ liệu bị hỏng mà không làm sập ứng dụng.
- **Export / Import**: Xuất và nhập tệp JSON theo chuẩn Phụ lục A.4 (hỗ trợ tùy chọn kèm tiến độ làm bài).

---

## 🚀 Cách chạy dự án

### 1. Khởi chạy môi trường phát triển (Dev server)
```bash
npm run dev
```

### 2. Chạy kiểm thử đơn vị (Unit Tests với Vitest)
```bash
npm test
```

### 3. Build kiểm tra sản phẩm (Production build)
```bash
npm run build
```

---

## 💡 Hướng dẫn sử dụng các thành phần

### 1. KaTeX MathView (`src/components/MathView.tsx`)
```tsx
import { MathView } from './components/MathView'

// Inline mode
<p>Độ phức tạp thuật toán là <MathView math="O(N \log N)" /></p>

// Block / Display mode
<MathView math="T(n) = 2T(n/2) + O(n)" block={true} />
```

### 2. CodeViewer (`src/components/CodeViewer.tsx`)
```tsx
import { CodeViewer } from './components/CodeViewer'

<CodeViewer
  language="cpp"
  title="Binary Search C++"
  code={`int binarySearch(int arr[], int n, int x) { ... }`}
/>
```

### 3. Lucide Icons (`lucide-react`)
```tsx
import { Code2, Calculator, Zap, Copy, Check } from 'lucide-react'

<Code2 className="w-5 h-5 text-indigo-400" />
```
