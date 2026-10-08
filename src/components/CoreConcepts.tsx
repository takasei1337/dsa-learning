import React, { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  Sparkles,
  Info,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react'
import type { Concept, ComplexityRow, ComplexityLevel } from '../types'
import { MarkdownView } from './MarkdownView'
import { MathView } from './MathView'

export interface CoreConceptsProps {
  concepts: Concept[]
  complexityRows: ComplexityRow[]
  editMode?: boolean
  onAddConcept?: () => void
  onEditConcept?: (concept: Concept) => void
  onDeleteConcept?: (concept: Concept) => void
  onAddComplexityRow?: () => void
  onEditComplexityRow?: (row: ComplexityRow) => void
  onDeleteComplexityRow?: (row: ComplexityRow) => void
}

/**
 * Định nghĩa màu sắc và nhãn hiển thị cho 5 mức độ tăng trưởng (C-13)
 * Xanh lục cho O(1), Vàng cho O(log N), Cam cho O(N), Đỏ cho O(N^2)...
 */
export const GROWTH_LEVEL_CONFIG: Record<
  ComplexityLevel,
  {
    name: string
    notation: string
    badgeClass: string
    dotClass: string
    bgClass: string
  }
> = {
  constant: {
    name: 'Hằng số',
    notation: 'O(1)',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    bgClass: 'hover:bg-emerald-950/10',
  },
  log: {
    name: 'Logarit',
    notation: 'O(\\log N)',
    badgeClass: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    dotClass: 'bg-yellow-400',
    bgClass: 'hover:bg-yellow-950/10',
  },
  linear: {
    name: 'Tuyến tính',
    notation: 'O(N)',
    badgeClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    dotClass: 'bg-orange-400',
    bgClass: 'hover:bg-orange-950/10',
  },
  linearithmic: {
    name: 'Tuyến tính Logarit',
    notation: 'O(N \\log N)',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    dotClass: 'bg-indigo-400',
    bgClass: 'hover:bg-indigo-950/10',
  },
  quadratic: {
    name: 'Bậc hai (Bình phương)',
    notation: 'O(N^2)',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    bgClass: 'hover:bg-rose-950/10',
  },
  exponential: {
    name: 'Hàm mũ',
    notation: 'O(2^N)',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
    dotClass: 'bg-red-500',
    bgClass: 'hover:bg-red-950/10',
  },
}

export const CoreConcepts: React.FC<CoreConceptsProps> = ({
  concepts,
  complexityRows,
  editMode = false,
  onAddConcept,
  onEditConcept,
  onDeleteConcept,
  onAddComplexityRow,
  onEditComplexityRow,
  onDeleteComplexityRow,
}) => {
  // C-08: Trạng thái thu gọn / mở rộng cho từng mục Concept
  const [collapsedConcepts, setCollapsedConcepts] = useState<Record<string, boolean>>({})

  const toggleCollapse = (conceptId: string) => {
    setCollapsedConcepts((prev) => ({
      ...prev,
      [conceptId]: !prev[conceptId],
    }))
  }

  // C-01: Sắp xếp theo order tăng dần
  const sortedConcepts = [...concepts].sort((a, b) => a.order - b.order)
  const sortedComplexities = [...complexityRows].sort((a, b) => a.order - b.order)

  return (
    <section className="space-y-6" aria-labelledby="core-concepts-heading">
      {/* Tiêu đề Section Module C */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5 text-base font-bold text-white">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 id="core-concepts-heading">Khái Niệm Cốt Lõi & Bảng Độ Phức Tạp</h3>
        </div>
        <div className="flex items-center gap-2">
          {editMode && onAddConcept && (
            <button
              onClick={onAddConcept}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Thêm khái niệm mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm khái niệm</span>
            </button>
          )}
          <span className="core-concepts-badge text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-800/50">
            Core Concepts
          </span>
        </div>
      </div>

      {/* ===================================================================
       * C1. DANH SÁCH KHÁI NIỆM & CẤU TRÚC DỮ LIỆU (C-01, C-02, C-07, C-08)
       * =================================================================== */}
      <div className="space-y-4">
        {sortedConcepts.map((concept) => {
          const isCollapsed = !!collapsedConcepts[concept.id]

          return (
            <article
              key={concept.id}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/50 shadow-xl overflow-hidden transition-all"
            >
              {/* Header của Concept với nút Thu gọn / Mở rộng (C-08) */}
              <div
                className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between select-none"
              >
                <div
                  onClick={() => toggleCollapse(concept.id)}
                  className="flex items-center gap-3 min-w-0 pr-2 cursor-pointer flex-1"
                >
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {concept.order}
                  </span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 truncate">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{concept.title}</span>
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* C-03, C-05: Nút Sửa / Xóa khi bật chế độ biên tập */}
                  {editMode && (
                    <div className="flex items-center gap-1 mr-2">
                      {onEditConcept && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditConcept(concept)
                          }}
                          className="crud-edit-btn p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                          title="Chỉnh sửa khái niệm"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      )}
                      {onDeleteConcept && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteConcept(concept)
                          }}
                          className="crud-delete-btn p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-800/40 transition cursor-pointer"
                          title="Xóa khái niệm"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      )}
                    </div>
                  )}

                  <span
                    onClick={() => toggleCollapse(concept.id)}
                    className="text-[11px] text-slate-400 hidden sm:inline cursor-pointer"
                  >
                    {isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleCollapse(concept.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                    aria-label={isCollapsed ? 'Mở rộng mục khái niệm' : 'Thu gọn mục khái niệm'}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Nội dung Concept (C-02: Markdown + KaTeX, C-07: Error isolation) */}
              {!isCollapsed && (
                <div className="p-5 text-xs text-slate-300 leading-relaxed bg-slate-950/40">
                  <MarkdownView content={concept.body} />
                </div>
              )}
            </article>
          )
        })}
      </div>

      {/* ===================================================================
       * C2. BẢNG SO SÁNH ĐỘ PHỨC TẠP 5 CỘT (C-10, C-11, C-13)
       * =================================================================== */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-xl overflow-hidden">
        {/* Table Header Caption */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Bảng Độ Phức Tạp Thuật Toán (Time & Space Complexity)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            {editMode && onAddComplexityRow && (
              <button
                onClick={onAddComplexityRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm mr-1"
                title="Thêm thao tác mới vào bảng"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm dòng</span>
              </button>
            )}
            <span>{sortedComplexities.length} thao tác</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Tô màu theo mức độ
            </span>
          </div>
        </div>

        {/* Khung cuộn ngang độc lập cho bảng (C-11: không làm tràn trang ở 360px) */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs min-w-[620px]">
            {/* Hàng tiêu đề cố định (C-11) */}
            <thead className="bg-slate-950/95 text-slate-400 uppercase text-[11px] border-b border-slate-800 sticky top-0 backdrop-blur z-10 font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">1. Cấu trúc / Thao tác</th>
                <th className="py-3 px-4 font-semibold text-center w-28">2. Thời gian (Time)</th>
                <th className="py-3 px-4 font-semibold text-center w-24">3. Bộ nhớ (Space)</th>
                <th className="py-3 px-4 font-semibold">4. Ghi chú</th>
                <th className="py-3 px-4 font-semibold text-center w-36">5. Mức độ tăng trưởng</th>
                {editMode && (
                  <th className="py-3 px-3 font-semibold text-center w-20">Thao tác</th>
                )}
              </tr>
            </thead>

            {/* Thân bảng với 5 cột chuẩn hóa */}
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {sortedComplexities.map((row) => {
                const growth = GROWTH_LEVEL_CONFIG[row.level] || GROWTH_LEVEL_CONFIG.constant

                return (
                  <tr
                    key={row.id}
                    className={`transition ${growth.bgClass} hover:bg-slate-800/20`}
                  >
                    {/* Cột 1: Cấu trúc / Thao tác */}
                    <td className="py-3.5 px-4 font-medium text-slate-100 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${growth.dotClass}`} />
                      <span>{row.operation}</span>
                    </td>

                    {/* Cột 2: Time Complexity (LaTeX) */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-semibold ${growth.badgeClass}`}
                      >
                        <MathView math={row.time} />
                      </span>
                    </td>

                    {/* Cột 3: Space Complexity (LaTeX) */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 inline-block text-xs">
                        <MathView math={row.space} />
                      </span>
                    </td>

                    {/* Cột 4: Ghi chú ngắn */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] leading-relaxed">
                      <MathView math={row.note} />
                    </td>

                    {/* Cột 5: Mức độ tăng trưởng (C-13: Tô màu trực quan) */}
                    <td className="py-3.5 px-4 text-center">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium ${growth.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${growth.dotClass}`} />
                        <span>{growth.name}</span>
                      </div>
                    </td>

                    {/* Cột 6: Thao tác CRUD khi editMode bật (C-04, C-05) */}
                    {editMode && (
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {onEditComplexityRow && (
                            <button
                              type="button"
                              onClick={() => onEditComplexityRow(row)}
                              className="crud-edit-btn p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                              title="Chỉnh sửa thao tác"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                          )}
                          {onDeleteComplexityRow && (
                            <button
                              type="button"
                              onClick={() => onDeleteComplexityRow(row)}
                              className="crud-delete-btn p-1 rounded-md bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                              title="Xóa thao tác"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Chú giải bảng màu tăng trưởng */}
        <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-slate-300">Chú giải độ phức tạp:</span>
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> O(1) Hằng số
            </span>
            <span className="inline-flex items-center gap-1 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-400" /> O(log N) Logarit
            </span>
            <span className="inline-flex items-center gap-1 text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-400" /> O(N) Tuyến tính
            </span>
            <span className="inline-flex items-center gap-1 text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400" /> O(N log N) Linearithmic
            </span>
            <span className="inline-flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> O(N^2) Bậc hai
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoreConcepts
