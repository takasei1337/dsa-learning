import React, { useState } from 'react'
import {
  Code2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Cpu,
  ArrowRight,
  Filter,
  FileCode2,
  AlertCircle,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react'
import type { Pattern, Pitfall, PitfallType } from '../types'
import { MathView } from './MathView'
import { MarkdownView } from './MarkdownView'
import { CodeViewer } from './CodeViewer'

export interface PatternRecognitionProps {
  patterns: Pattern[]
  pitfalls: Pitfall[]
  onNavigateToTemplate?: (patternId: string) => void
  editMode?: boolean
  onAddPattern?: () => void
  onEditPattern?: (pattern: Pattern) => void
  onDeletePattern?: (pattern: Pattern) => void
  onAddPitfall?: () => void
  onEditPitfall?: (pitfall: Pitfall) => void
  onDeletePitfall?: (pitfall: Pitfall) => void
}

/**
 * Cấu hình hiển thị theo loại Bẫy (D-11): Biểu tượng, nhãn chữ, màu sắc cảnh báo
 */
export const PITFALL_CONFIG: Record<
  PitfallType,
  {
    label: string
    shortLabel: string
    badgeClass: string
    cardBorderClass: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  'edge-case': {
    label: 'Edge Case (Trường hợp biên)',
    shortLabel: 'Edge Case',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    cardBorderClass: 'border-amber-500/30 bg-amber-950/10',
    icon: AlertTriangle,
  },
  overflow: {
    label: 'Tràn số (Overflow)',
    shortLabel: 'Tràn số',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    cardBorderClass: 'border-rose-500/30 bg-rose-950/10',
    icon: ShieldAlert,
  },
  memory: {
    label: 'Tối ưu bộ nhớ (Memory / O(1))',
    shortLabel: 'Bộ nhớ',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    cardBorderClass: 'border-purple-500/30 bg-purple-950/10',
    icon: Cpu,
  },
  other: {
    label: 'Bẫy khác (Khác)',
    shortLabel: 'Khác',
    badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    cardBorderClass: 'border-slate-800 bg-slate-900/40',
    icon: AlertCircle,
  },
}

export const PatternRecognition: React.FC<PatternRecognitionProps> = ({
  patterns,
  pitfalls,
  onNavigateToTemplate,
  editMode = false,
  onAddPattern,
  onEditPattern,
  onDeletePattern,
  onAddPitfall,
  onEditPitfall,
  onDeletePitfall,
}) => {
  // D-11: Bộ lọc theo loại bẫy (All / Edge case / Overflow / Memory / Other)
  const [selectedPitfallType, setSelectedPitfallType] = useState<PitfallType | 'all'>('all')

  const sortedPatterns = [...patterns].sort((a, b) => a.order - b.order)
  const sortedPitfalls = [...pitfalls].sort((a, b) => a.order - b.order)

  // Lọc danh sách bẫy theo loại đã chọn (D-11)
  const filteredPitfalls =
    selectedPitfallType === 'all'
      ? sortedPitfalls
      : sortedPitfalls.filter((pf) => pf.type === selectedPitfallType)

  const handleJumpToTemplate = (patternId: string) => {
    if (onNavigateToTemplate) {
      onNavigateToTemplate(patternId)
    } else {
      // Scroll tới vị trí Module E
      const el = document.getElementById(`template-${patternId}`) || document.getElementById('templates-heading')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="space-y-8" aria-labelledby="pattern-recognition-heading">
      {/* Tiêu đề Section Module D */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5 text-base font-bold text-white">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <h3 id="pattern-recognition-heading">
            Dạng Bài & Bẫy Thường Gặp (Pattern Recognition)
          </h3>
        </div>
        <span className="pattern-recognition-badge text-[11px] font-mono text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/50 border border-indigo-800/50">
          Pattern Recognition
        </span>
      </div>

      {/* ===================================================================
       * D1. KEYWORDS & NHẬN DIỆN DẠNG BÀI (D-01, D-02, D-05)
       * =================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Thẻ Dạng Bài & Quy Tắc Nhận Diện
            </h4>
          </div>
          <div className="flex items-center gap-2">
            {editMode && onAddPattern && (
              <button
                onClick={onAddPattern}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Thêm dạng bài mới"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Pattern</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-slate-400">
              {sortedPatterns.length} Patterns
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedPatterns.map((pat) => (
            <div
              key={pat.id}
              id={`pattern-${pat.id}`}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 flex flex-col justify-between shadow-xl space-y-4 hover:border-slate-700 transition group"
            >
              {/* Header của thẻ Pattern */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {pat.order}
                    </span>
                    <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition truncate">
                      {pat.name}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {editMode && (
                      <div className="flex items-center gap-1">
                        {onEditPattern && (
                          <button
                            type="button"
                            onClick={() => onEditPattern(pat)}
                            className="crud-edit-btn p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Chỉnh sửa dạng bài"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                        )}
                        {onDeletePattern && (
                          <button
                            type="button"
                            onClick={() => onDeletePattern(pat)}
                            className="crud-delete-btn p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Xóa dạng bài"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        )}
                      </div>
                    )}
                    <span className="text-[10px] font-mono text-slate-500">Dạng #{pat.order}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed">
                  <MathView math={pat.description} />
                </div>
              </div>

              {/* Các nhãn Keywords & Quy tắc phản xạ nhận diện */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div>
                  <span className="pattern-keywords-title text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Keywords nhận diện:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pat.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="pattern-keyword-tag px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-200 text-[11px] font-medium shadow-sm"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bí quyết tư duy nhanh: Gặp [keyword] -> nghĩ đến [pattern] */}
                <div className="pattern-reflex-box p-3 rounded-xl bg-slate-950/70 border border-indigo-900/30 text-xs space-y-1">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block">
                    Bí quyết tư duy nhanh:
                  </span>
                  <div className="flex items-center gap-2 text-slate-200 flex-wrap">
                    <span className="text-amber-300 font-semibold italic">
                      &quot;Gặp {pat.keywords[0] || 'dấu hiệu trên'}&quot;
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-indigo-300 font-bold">
                      Nghĩ đến {pat.name}
                    </span>
                  </div>
                </div>

                {/* Câu ví dụ tự viết */}
                {pat.examplePhrases.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Câu ví dụ trong đề bài:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                      {pat.examplePhrases.map((phrase, i) => (
                        <li key={i} className="truncate" title={phrase}>
                          {phrase}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* D-05: Nút nhảy tới Template tương ứng */}
                <div className="pt-1">
                  <button
                    onClick={() => handleJumpToTemplate(pat.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Xem Template mẫu của Pattern này</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================
       * D2. THỦ THUẬT NÉ BẪY (D-10, D-11: Cảnh báo Edge case / Tràn số / Bộ nhớ)
       * =================================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Bẫy Thường Gặp & Thủ Thuật Né Tránh
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {editMode && onAddPitfall && (
              <button
                onClick={onAddPitfall}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Thêm bẫy / thủ thuật mới"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Bẫy</span>
              </button>
            )}

            {/* Bộ lọc theo loại bẫy */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5 shrink-0" />
              <button
                onClick={() => setSelectedPitfallType('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-xs shrink-0 ${
                  selectedPitfallType === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tất cả ({sortedPitfalls.length})
              </button>
              {(['edge-case', 'overflow', 'memory', 'other'] as const).map((type) => {
                const count = sortedPitfalls.filter((p) => p.type === type).length
                if (count === 0) return null
                const conf = PITFALL_CONFIG[type]
                const isSelected = selectedPitfallType === type

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedPitfallType(type)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-xs shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{conf.shortLabel}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Danh sách thẻ cảnh báo Bẫy */}
        <div className="space-y-4">
          {filteredPitfalls.map((pf) => {
            const conf = PITFALL_CONFIG[pf.type] || PITFALL_CONFIG.other
            const IconComponent = conf.icon

            return (
              <div
                key={pf.id}
                className={`rounded-2xl border p-5 space-y-4 shadow-xl transition ${conf.cardBorderClass}`}
              >
                {/* Header thẻ cảnh báo */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-amber-400 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h5 className="text-sm font-bold text-white tracking-tight">
                      {pf.title}
                    </h5>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nút Sửa / Xóa khi editMode bật */}
                    {editMode && (
                      <div className="flex items-center gap-1">
                        {onEditPitfall && (
                          <button
                            type="button"
                            onClick={() => onEditPitfall(pf)}
                            className="crud-edit-btn p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Chỉnh sửa bẫy thường gặp"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                        )}
                        {onDeletePitfall && (
                          <button
                            type="button"
                            onClick={() => onDeletePitfall(pf)}
                            className="crud-delete-btn p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Xóa bẫy thường gặp"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* D-11: Nhãn màu và chữ rõ ràng */}
                    <div
                      className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm ${conf.badgeClass}`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{conf.label}</span>
                    </div>
                  </div>
                </div>

                {/* Nội dung: "Sai ở đâu" & "Cách né" (D-10: Markdown + LaTeX) */}
                <div className="text-xs text-slate-100 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                  <MarkdownView content={pf.body} />
                </div>

                {/* Đoạn code minh họa ngắn né bẫy (D-10: Python / C++) */}
                {pf.code && (pf.code.python || pf.code.cpp) && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                      Đoạn mã minh họa cách né:
                    </span>
                    {pf.code.python && (
                      <CodeViewer
                        code={pf.code.python}
                        language="python"
                        title="Cách né bẫy (Python)"
                      />
                    )}
                    {pf.code.cpp && (
                      <div className="mt-2">
                        <CodeViewer
                          code={pf.code.cpp}
                          language="cpp"
                          title="Cách né bẫy (C++)"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PatternRecognition
