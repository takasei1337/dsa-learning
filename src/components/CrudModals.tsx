import React, { useState, useEffect } from 'react'
import { X, AlertTriangle, Link2, Plus, Edit3, Trash2 } from 'lucide-react'
import type {
  Chapter,
  Concept,
  ComplexityRow,
  ComplexityLevel,
  Pattern,
  Pitfall,
  PitfallType,
  Problem,
  Difficulty,
} from '../types'
import { KaTeXEditor } from './KaTeXEditor'

/* =====================================================================
 * 1. MODAL CHƯƠNG (ChapterModal: A-04, A-05)
 * ===================================================================== */
export interface ChapterModalProps {
  isOpen: boolean
  initialData?: Partial<Chapter> | null
  onClose: () => void
  onSave: (chapter: Chapter) => void
}

export const ChapterModal: React.FC<ChapterModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setSlug(initialData.slug || '')
      setSummary(initialData.summary || '')
      setOrder(initialData.order || 1)
    } else {
      setTitle('')
      setSlug('')
      setSummary('')
      setOrder(1)
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!initialData?.slug) {
      // Auto-generate slug from title
      const autoSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(autoSlug)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tên chương không được để trống.')
      return
    }
    if (!slug.trim()) {
      setError('Slug không được để trống.')
      return
    }

    const chapter: Chapter = {
      id: initialData?.id || `ch-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      summary: summary.trim(),
      order: Number(order) || 1,
    }

    onSave(chapter)
    onClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {initialData?.id ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
          {initialData?.id ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên chương *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="VD: Binary Search, Graph..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Slug URL *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="VD: binary-search"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tóm tắt chương (LaTeX / Markdown)</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="Mô tả nội dung trọng tâm của chương..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ tự hiển thị (Order)</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md"
            >
              Lưu chương
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =====================================================================
 * 2. MODAL KHÁI NIỆM (ConceptModal: C-03, C-04)
 * ===================================================================== */
export interface ConceptModalProps {
  isOpen: boolean
  chapterId: string
  initialData?: Partial<Concept> | null
  onClose: () => void
  onSave: (concept: Concept) => void
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  isOpen,
  chapterId,
  initialData,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setBody(initialData.body || '')
      setOrder(initialData.order || 1)
    } else {
      setTitle('')
      setBody('')
      setOrder(1)
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tiêu đề khái niệm không được để trống.')
      return
    }
    if (!body.trim()) {
      setError('Nội dung khái niệm không được để trống.')
      return
    }

    const concept: Concept = {
      id: initialData?.id || `concept-${Date.now()}`,
      chapterId: initialData?.chapterId || chapterId,
      title: title.trim(),
      body: body.trim(),
      order: Number(order) || 1,
    }

    onSave(concept)
    onClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {initialData?.id ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
          {initialData?.id ? 'Chỉnh sửa khái niệm (Mục 5 & C-03)' : 'Thêm khái niệm mới (Mục 5 & C-03)'}
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tiêu đề khái niệm *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cấu trúc bộ nhớ của Dynamic Array"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Mục 5.1 & 5.2: Soạn thảo KaTeX với 2 khung nhìn và thanh nút macro */}
          <KaTeXEditor
            value={body}
            onChange={setBody}
            minRows={7}
            label="Nội dung chi tiết (Mục 5: 2 khung nhìn & Thanh Macro công thức)"
            placeholder="Giải thích nguyên lý hoạt động, định lý, công thức..."
          />

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md"
            >
              Lưu khái niệm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =====================================================================
 * 3. MODAL DÒNG ĐỘ PHỨC TẠP (ComplexityRowModal: C-03, C-04)
 * ===================================================================== */
export interface ComplexityRowModalProps {
  isOpen: boolean
  chapterId: string
  initialData?: Partial<ComplexityRow> | null
  onClose: () => void
  onSave: (row: ComplexityRow) => void
}

export const ComplexityRowModal: React.FC<ComplexityRowModalProps> = ({
  isOpen,
  chapterId,
  initialData,
  onClose,
  onSave,
}) => {
  const [operation, setOperation] = useState('')
  const [time, setTime] = useState('$O(1)$')
  const [space, setSpace] = useState('$O(1)$')
  const [note, setNote] = useState('')
  const [level, setLevel] = useState<ComplexityLevel>('constant')
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setOperation(initialData.operation || '')
      setTime(initialData.time || '$O(1)$')
      setSpace(initialData.space || '$O(1)$')
      setNote(initialData.note || '')
      setLevel(initialData.level || 'constant')
      setOrder(initialData.order || 1)
    } else {
      setOperation('')
      setTime('$O(1)$')
      setSpace('$O(1)$')
      setNote('')
      setLevel('constant')
      setOrder(1)
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!operation.trim()) {
      setError('Thao tác / Cấu trúc không được để trống.')
      return
    }

    const row: ComplexityRow = {
      id: initialData?.id || `cx-${Date.now()}`,
      chapterId: initialData?.chapterId || chapterId,
      operation: operation.trim(),
      time: time.trim(),
      space: space.trim(),
      note: note.trim(),
      level,
      order: Number(order) || 1,
    }

    onSave(row)
    onClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {initialData?.id ? <Edit3 className="w-5 h-5 text-cyan-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
          {initialData?.id ? 'Chỉnh sửa dòng độ phức tạp' : 'Thêm dòng độ phức tạp mới'}
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cấu trúc / Thao tác *</label>
            <input
              type="text"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              placeholder="VD: Push / Pop đỉnh Stack"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Thời gian (LaTeX)</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="$O(1)$"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Không gian (LaTeX)</label>
              <input
                type="text"
                value={space}
                onChange={(e) => setSpace(e.target.value)}
                placeholder="$O(1)$"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mức độ tăng trưởng (Màu sắc)</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ComplexityLevel)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="constant">Hằng số - O(1) [Xanh lục]</option>
              <option value="log">Logarit - O(log N) [Vàng]</option>
              <option value="linear">Tuyến tính - O(N) [Cam]</option>
              <option value="linearithmic">Tuyến tính-log - O(N log N) [Xanh tím]</option>
              <option value="quadratic">Bậc hai - O(N^2) [Đỏ]</option>
              <option value="exponential">Hàm mũ - O(2^N) / O(N!) [Đỏ đậm]</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Ghi chú ngắn</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Worst-case khi mảng đầy cần resize"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md"
            >
              Lưu dòng
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =====================================================================
 * 4. MODAL DẠNG BÀI (PatternModal: D-03)
 * ===================================================================== */
export interface PatternModalProps {
  isOpen: boolean
  chapterId: string
  initialData?: Partial<Pattern> | null
  onClose: () => void
  onSave: (pattern: Pattern) => void
}

export const PatternModal: React.FC<PatternModalProps> = ({
  isOpen,
  chapterId,
  initialData,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [keywordsStr, setKeywordsStr] = useState('')
  const [examplePhrasesStr, setExamplePhrasesStr] = useState('')
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      setKeywordsStr((initialData.keywords || []).join(', '))
      setExamplePhrasesStr((initialData.examplePhrases || []).join('\n'))
      setOrder(initialData.order || 1)
    } else {
      setName('')
      setDescription('')
      setKeywordsStr('')
      setExamplePhrasesStr('')
      setOrder(1)
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tên dạng bài không được để trống.')
      return
    }

    const keywords = keywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    const examplePhrases = examplePhrasesStr
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)

    const pattern: Pattern = {
      id: initialData?.id || `pt-${Date.now()}`,
      chapterId: initialData?.chapterId || chapterId,
      name: name.trim(),
      description: description.trim(),
      keywords,
      examplePhrases,
      order: Number(order) || 1,
    }

    onSave(pattern)
    onClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {initialData?.id ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
          {initialData?.id ? 'Chỉnh sửa dạng bài (Pattern)' : 'Thêm dạng bài mới'}
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên dạng bài (Tiếng Anh) *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Fixed-size Sliding Window, Fast & Slow Pointers"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mô tả phản xạ nhận diện</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Khi gặp... hãy nghĩ ngay đến..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Từ khóa nhận diện (Keywords, cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={keywordsStr}
              onChange={(e) => setKeywordsStr(e.target.value)}
              placeholder="VD: xâu con liên tục, đoạn con độ dài k, mảng sắp xếp"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Câu ví dụ trong đề bài (Mỗi câu 1 dòng)
            </label>
            <textarea
              value={examplePhrasesStr}
              onChange={(e) => setExamplePhrasesStr(e.target.value)}
              rows={2}
              placeholder="Tìm chuỗi con liên tục dài nhất..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md"
            >
              Lưu Pattern
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =====================================================================
 * 5. MODAL BẪY & THỦ THUẬT (PitfallModal: D-12)
 * ===================================================================== */
export interface PitfallModalProps {
  isOpen: boolean
  chapterId: string
  patterns: Pattern[]
  initialData?: Partial<Pitfall> | null
  onClose: () => void
  onSave: (pitfall: Pitfall) => void
}

export const PitfallModal: React.FC<PitfallModalProps> = ({
  isOpen,
  chapterId,
  patterns,
  initialData,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<PitfallType>('edge-case')
  const [body, setBody] = useState('')
  const [pyCode, setPyCode] = useState('')
  const [cppCode, setCppCode] = useState('')
  const [selectedPatternIds, setSelectedPatternIds] = useState<string[]>([])
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setType(initialData.type || 'edge-case')
      setBody(initialData.body || '')
      setPyCode(initialData.code?.py || initialData.code?.python || '')
      setCppCode(initialData.code?.cpp || '')
      setSelectedPatternIds(initialData.patternIds || [])
      setOrder(initialData.order || 1)
    } else {
      setTitle('')
      setType('edge-case')
      setBody('')
      setPyCode('')
      setCppCode('')
      setSelectedPatternIds([])
      setOrder(1)
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleTogglePattern = (patId: string) => {
    setSelectedPatternIds((prev) =>
      prev.includes(patId) ? prev.filter((id) => id !== patId) : [...prev, patId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tiêu đề bẫy không được để trống.')
      return
    }
    if (!body.trim()) {
      setError('Nội dung cảnh báo không được để trống.')
      return
    }

    const pitfall: Pitfall = {
      id: initialData?.id || `pf-${Date.now()}`,
      chapterId: initialData?.chapterId || chapterId,
      title: title.trim(),
      type,
      body: body.trim(),
      code: {
        py: pyCode.trim() || undefined,
        cpp: cppCode.trim() || undefined,
      },
      patternIds: selectedPatternIds,
      order: Number(order) || 1,
    }

    onSave(pitfall)
    onClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {initialData?.id ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-amber-400" />}
          {initialData?.id ? 'Chỉnh sửa bẫy thường gặp' : 'Thêm bẫy thường gặp mới'}
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tiêu đề bẫy *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Quên thu hẹp cửa sổ khi vi phạm"
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Phân loại bẫy</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PitfallType)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="edge-case">Edge Case (Trường hợp biên / Rỗng / 1 phần tử)</option>
              <option value="overflow">Tràn số (Integer Overflow)</option>
              <option value="memory">Tối ưu bộ nhớ / Con trỏ rác</option>
              <option value="other">Lưu ý khác</option>
            </select>
          </div>

          {/* Mục 5.1 & 5.2: Soạn thảo KaTeX với 2 khung nhìn và thanh nút macro */}
          <KaTeXEditor
            value={body}
            onChange={setBody}
            minRows={5}
            label="Nội dung giải thích & Cách né tránh (Mục 5: Markdown & KaTeX) *"
            placeholder="Sai lầm thường gặp ở đâu và cách khắc phục..."
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Code né bẫy (Python)</label>
              <textarea
                value={pyCode}
                onChange={(e) => setPyCode(e.target.value)}
                rows={3}
                placeholder="# Đoạn code ngắn..."
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Code né bẫy (C++)</label>
              <textarea
                value={cppCode}
                onChange={(e) => setCppCode(e.target.value)}
                rows={3}
                placeholder="// Đoạn code ngắn..."
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>
          </div>

          {patterns.length > 0 && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Liên kết với Pattern</label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 max-h-24 overflow-y-auto">
                {patterns.map((pat) => (
                  <button
                    type="button"
                    key={pat.id}
                    onClick={() => handleTogglePattern(pat.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer border ${
                      selectedPatternIds.includes(pat.id)
                        ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {pat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer shadow-md"
            >
              Lưu bẫy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =====================================================================
 * 6. MODAL BÀI TẬP (ProblemModal: F-03, F-04 với Validate URL)
 * ===================================================================== */
export interface ProblemModalProps {
  isOpen: boolean
  chapterId: string
  patterns: Pattern[]
  initialData?: Partial<Problem> | null
  onClose: () => void
  onSave: (problem: Problem) => void
}

export const ProblemModal: React.FC<ProblemModalProps> = ({
  isOpen,
  chapterId,
  patterns,
  initialData,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [leetcodeUrl, setLeetcodeUrl] = useState('')
  const [neetcodeUrl, setNeetcodeUrl] = useState('')
  const [hint, setHint] = useState('')
  const [selectedPatternIds, setSelectedPatternIds] = useState<string[]>([])
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDifficulty(initialData.difficulty || 'medium')
      setLeetcodeUrl(initialData.leetcodeUrl || '')
      setNeetcodeUrl(initialData.neetcodeUrl || '')
      setHint(initialData.hint || '')
      setSelectedPatternIds(initialData.patternIds || [])
      setOrder(initialData.order || 1)
    } else {
      setTitle('')
      setDifficulty('medium')
      setLeetcodeUrl('')
      setNeetcodeUrl('')
      setHint('')
      setSelectedPatternIds([])
      setOrder(1)
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  // F-03, F-04: Validate URL LeetCode & NeetCode
  const validateUrls = (): boolean => {
    if (leetcodeUrl.trim()) {
      const url = leetcodeUrl.trim().toLowerCase()
      if (!url.startsWith('https://leetcode.com') && !url.startsWith('https://www.leetcode.com')) {
        setError('URL LeetCode không hợp lệ! URL phải bắt đầu bằng https://leetcode.com')
        return false
      }
    }

    if (neetcodeUrl.trim()) {
      const url = neetcodeUrl.trim().toLowerCase()
      if (!url.startsWith('https://neetcode.io') && !url.startsWith('https://www.neetcode.io')) {
        setError('URL NeetCode không hợp lệ! URL phải bắt đầu bằng https://neetcode.io')
        return false
      }
    }

    return true
  }

  const handleTogglePattern = (patId: string) => {
    setSelectedPatternIds((prev) =>
      prev.includes(patId) ? prev.filter((id) => id !== patId) : [...prev, patId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tên bài tập không được để trống.')
      return
    }

    if (!validateUrls()) {
      return
    }

    const problem: Problem = {
      id: initialData?.id || `prob-${Date.now()}`,
      chapterId: initialData?.chapterId || chapterId,
      title: title.trim(),
      difficulty,
      leetcodeUrl: leetcodeUrl.trim() || null,
      neetcodeUrl: neetcodeUrl.trim() || null,
      patternIds: selectedPatternIds,
      hint: hint.trim(),
      order: Number(order) || 1,
    }

    onSave(problem)
    onClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {initialData?.id ? <Edit3 className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
          {initialData?.id ? 'Chỉnh sửa bài tập' : 'Thêm bài tập mới'}
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên bài tập (Tiếng Anh) *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Two Sum, Trapping Rain Water..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Độ khó (Difficulty)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-lg font-bold uppercase text-[11px] border transition cursor-pointer ${
                    difficulty === diff
                      ? diff === 'easy'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow'
                        : diff === 'medium'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-amber-400" />
              <span>LeetCode URL (Phải bắt đầu bằng https://leetcode.com)</span>
            </label>
            <input
              type="url"
              value={leetcodeUrl}
              onChange={(e) => {
                setLeetcodeUrl(e.target.value)
                setError('')
              }}
              placeholder="https://leetcode.com/problems/..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono focus:outline-none focus:border-amber-500 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>NeetCode URL (Phải bắt đầu bằng https://neetcode.io)</span>
            </label>
            <input
              type="url"
              value={neetcodeUrl}
              onChange={(e) => {
                setNeetcodeUrl(e.target.value)
                setError('')
              }}
              placeholder="https://neetcode.io/problems/..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Gợi ý thuật toán (Hint)</label>
            <textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              rows={2}
              placeholder="Gợi ý hướng giải ngắn gọn..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {patterns.length > 0 && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Liên kết dạng bài (Pattern)</label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 max-h-24 overflow-y-auto">
                {patterns.map((pat) => (
                  <button
                    type="button"
                    key={pat.id}
                    onClick={() => handleTogglePattern(pat.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer border ${
                      selectedPatternIds.includes(pat.id)
                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {pat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ tự hiển thị (#1 &rarr; #5)</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-md"
            >
              Lưu bài tập
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =====================================================================
 * 7. MODAL XÁC NHẬN XÓA (ConfirmDeleteModal: A-06, C-05, D-12)
 * ===================================================================== */
export interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start"
    >
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 my-6 sm:my-10 space-y-4 shadow-2xl relative">
        <div className="flex items-center gap-3 text-rose-400">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-2 pt-2 text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer shadow-md"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  )
}
