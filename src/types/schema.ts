/**
 * Schema Types theo chuẩn Mục 6.2 - SRS v1.0
 * Website kiến thức nền tảng Thuật Toán Ứng Dụng
 */

export type ComplexityLevel =
  | 'constant'
  | 'log'
  | 'linear'
  | 'linearithmic'
  | 'quadratic'
  | 'exponential'

export type PitfallType = 'edge-case' | 'overflow' | 'memory' | 'other'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TemplateCode {
  py?: string
  cpp?: string
  python?: string
}

export interface PitfallCode {
  py?: string
  cpp?: string
  python?: string
}

/**
 * Chapter — Chương
 * Một mục trong Sidebar Roadmap
 */
export interface Chapter {
  id: string
  slug: string // Duy nhất; chỉ gồm a-z, 0-9, dấu gạch ngang
  title: string // 1-80 ký tự
  summary: string // Mô tả ngắn, tối đa 200 ký tự
  order: number // Thứ tự hiển thị và Next/Previous
  createdAt?: string
  updatedAt?: string
}

/**
 * Concept — Mục khái niệm
 * Nội dung định nghĩa và cấu trúc dữ liệu (C1)
 */
export interface Concept {
  id: string
  chapterId: string // Khóa ngoại tới Chapter
  title: string // 1-120 ký tự
  body: string // Nội dung chính; Markdown + LaTeX
  order: number // Thứ tự trong chương
  createdAt?: string
  updatedAt?: string
}

/**
 * ComplexityRow — Dòng độ phức tạp
 * Một dòng của bảng so sánh Time/Space (C2)
 */
export interface ComplexityRow {
  id: string
  chapterId: string // Khóa ngoại tới Chapter
  operation: string // Cấu trúc hoặc thao tác (LaTeX), ví dụ "push / pop"
  time: string // Time Complexity (LaTeX), ví dụ "$O(1)$"
  space: string // Space Complexity (LaTeX)
  note: string // Ghi chú ngắn (LaTeX)
  level: ComplexityLevel // Mức độ phục vụ tô màu
  order: number // Thứ tự dòng
  createdAt?: string
  updatedAt?: string
}

/**
 * Pattern — Dạng bài
 * Thẻ nhận dạng đề bài (D1)
 */
export interface Pattern {
  id: string
  chapterId: string // Khóa ngoại tới Chapter
  name: string // Tên pattern, giữ nguyên tiếng Anh
  description: string // 1-2 câu mô tả (LaTeX)
  keywords: string[] // Từ khóa nhận diện, không trùng nhau
  examplePhrases: string[] // Câu ví dụ tự viết nhận diện đề bài
  order: number // Thứ tự trong chương
  createdAt?: string
  updatedAt?: string
}

/**
 * Pitfall — Bẫy
 * Thủ thuật né bẫy (D2)
 */
export interface Pitfall {
  id: string
  chapterId: string // Khóa ngoại tới Chapter
  title: string // 1-120 ký tự
  type: PitfallType // Phân loại bẫy
  body: string // Sai ở đâu và cách né (Markdown + LaTeX)
  code?: PitfallCode // Đoạn code minh họa ngắn { py?, cpp? }
  patternIds: string[] // Pattern liên quan
  order: number // Thứ tự trong chương
  createdAt?: string
  updatedAt?: string
}

/**
 * Template — Khung giải thuật mẫu
 * Khung code theo Pattern (Module E)
 */
export interface Template {
  id: string
  chapterId: string // Khóa ngoại tới Chapter
  patternId: string // Pattern áp dụng
  name: string // Tên template
  whenToUse: string // "Khi nào dùng", 1-2 câu (LaTeX)
  time: string // Time Complexity (LaTeX)
  space: string // Space Complexity (LaTeX)
  code: TemplateCode // { py?: string; cpp?: string } - Chú thích tiếng Việt
  notes: string // Cách điều chỉnh khi gặp biến thể (Markdown)
  order: number // Thứ tự trong chương
  createdAt?: string
  updatedAt?: string
}

/**
 * Problem — Bài tập
 * Dòng trong bảng danh sách bài tập (Module F)
 */
export interface Problem {
  id: string
  chapterId: string // Khóa ngoại tới Chapter
  title: string // Tên bài tiếng Anh nguyên bản
  difficulty: Difficulty // 'easy' | 'medium' | 'hard'
  leetcodeUrl: string | null // Bắt đầu bằng https:// hoặc null
  neetcodeUrl: string | null // Bắt đầu bằng https:// hoặc null
  patternIds: string[] // Ít nhất 1 Pattern của cùng chương
  hint: string // Gợi ý ngắn do biên tập viên tự viết
  order: number // Thứ tự trong chương
  createdAt?: string
  updatedAt?: string
}

/**
 * SeedData — Cấu trúc dữ liệu khởi tạo toàn bộ ứng dụng
 */
export interface SeedData {
  schemaVersion: number
  exportedAt?: string
  chapters: Chapter[]
  concepts: Concept[]
  complexityRows: ComplexityRow[]
  patterns: Pattern[]
  pitfalls: Pitfall[]
  templates: Template[]
  problems: Problem[]
}

/**
 * ProblemProgress — Trạng thái làm bài từng câu
 * Module F3 - Done Toggle & Note
 */
export interface ProblemProgress {
  done: boolean
  doneAt?: string // ISO 8601 string
  note?: string
}

export type UserProgress = Record<string, ProblemProgress>

/**
 * Macro công thức toán tùy chỉnh (Mục 5.2 & 6.2)
 */
export interface LaTeXMacro {
  id: string
  label: string
  latex: string
  order: number
}

/**
 * UserSettings — Tùy chọn cá nhân người dùng (Mục 6.2)
 */
export interface UserSettings {
  language: 'python' | 'cpp' // Ngôn ngữ code đang chọn (mặc định 'python')
  theme: 'light' | 'dark' | 'system' // Giao diện (mặc định 'light')
  editMode: boolean // Trạng thái Chế độ biên tập
  lineNumbers: boolean // Bật/tắt số dòng code
  macros?: LaTeXMacro[] // Macro tùy chỉnh
}

/**
 * ExportPayload — Cấu trúc tệp xuất JSON (Phụ lục A.4)
 */
export interface ExportPayload extends SeedData {
  progress?: UserProgress
  settings?: UserSettings
}

