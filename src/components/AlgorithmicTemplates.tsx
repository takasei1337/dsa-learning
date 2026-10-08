import React, { useState } from 'react'
import {
  FileCode2,
  Clock,
  HardDrive,
  Lightbulb,
  Info,
  Hash,
  Sparkles,
} from 'lucide-react'
import type { Template, Pattern } from '../types'
import { MathView } from './MathView'
import { MarkdownView } from './MarkdownView'
import { CodeViewer } from './CodeViewer'

export interface AlgorithmicTemplatesProps {
  templates: Template[]
  patterns?: Pattern[]
  globalLanguage?: 'python' | 'cpp'
  onLanguageChange?: (language: 'python' | 'cpp') => void
  highlightedTemplateId?: string | null
}

export const AlgorithmicTemplates: React.FC<AlgorithmicTemplatesProps> = ({
  templates,
  patterns = [],
  globalLanguage = 'python',
  onLanguageChange,
  highlightedTemplateId = null,
}) => {
  // Toggle hiển thị số dòng
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  // Tìm kiếm / lọc template theo từ khóa
  const [filterQuery, setFilterQuery] = useState('')

  // E-10, E-11, E-12: Chuyển đổi ngôn ngữ lưu toàn cục - đổi 1 nơi, tất cả các khối tự đổi theo
  const handleSelectLanguage = (lang: 'python' | 'cpp') => {
    if (onLanguageChange) {
      onLanguageChange(lang)
    }
  }

  // Lọc template nếu có từ khóa tìm kiếm
  const filteredTemplates = templates.filter((tpl) => {
    if (!filterQuery.trim()) return true
    const q = filterQuery.toLowerCase()
    const pat = patterns.find((p) => p.id === tpl.patternId)
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.whenToUse.toLowerCase().includes(q) ||
      (tpl.notes && tpl.notes.toLowerCase().includes(q)) ||
      (pat && pat.name.toLowerCase().includes(q))
    )
  })

  return (
    <section id="templates-section" className="space-y-6">
      {/* Module E Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Khung Giải Thuật Mẫu (Algorithmic Templates)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  {templates.length} templates
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Mẫu mã nguồn chuẩn hóa (C++ & Python), chỉ số độ phức tạp và hướng dẫn biến thể
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: Bộ chuyển ngôn ngữ toàn cục (E-10, E-11, E-12) & Bật/tắt số dòng (E-21) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút bật/tắt số dòng */}
          <button
            onClick={() => setShowLineNumbers((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              showLineNumbers
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
            title="Bật / tắt số dòng mã nguồn"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Số dòng:</span>
            <span className="font-semibold">{showLineNumbers ? 'Bật' : 'Tắt'}</span>
          </button>

          {/* Bộ chuyển ngôn ngữ toàn cục: Đổi ở đây, tất cả các khối code tự đổi theo (E-10, E-11, E-12) */}
          <div
            role="tablist"
            aria-label="Chọn ngôn ngữ lập trình toàn cục"
            className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs shadow-inner"
          >
            <button
              role="tab"
              aria-selected={globalLanguage === 'python'}
              onClick={() => handleSelectLanguage('python')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                globalLanguage === 'python'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Python</span>
            </button>
            <button
              role="tab"
              aria-selected={globalLanguage === 'cpp'}
              onClick={() => handleSelectLanguage('cpp')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                globalLanguage === 'cpp'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>C++</span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Empty State */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center space-y-3">
          <FileCode2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">
            {filterQuery ? 'Không tìm thấy template phù hợp' : 'Chưa có template cho chương này'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterQuery
              ? `Thử xóa từ khóa "${filterQuery}" để hiển thị tất cả các template.`
              : 'Hãy sử dụng Chế độ biên tập để bổ sung khung code mẫu cho chương hiện tại.'}
          </p>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="text-xs text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        /* Template Cards List */
        <div className="space-y-6">
          {filteredTemplates.map((tpl) => {
            // E-12: Trạng thái chọn ngôn ngữ lưu toàn cục (đồng bộ globalLanguage cho mọi khối code)
            const codeString =
              globalLanguage === 'python'
                ? tpl.code.py || tpl.code.python || '# Chưa có code Python'
                : tpl.code.cpp || '// Chưa có code C++'

            const linkedPattern = patterns.find((p) => p.id === tpl.patternId)
            const isHighlighted = highlightedTemplateId === tpl.id

            return (
              <div
                key={tpl.id}
                id={`template-${tpl.id}`}
                data-pattern-id={tpl.patternId}
                className={`rounded-2xl border transition-all duration-300 bg-slate-900/80 p-5 sm:p-6 space-y-5 shadow-xl ${
                  isHighlighted
                    ? 'border-violet-500 ring-2 ring-violet-500/50 shadow-violet-500/20'
                    : 'border-slate-800/90 hover:border-slate-700/80'
                }`}
              >
                {/* 1. Header & Metadata Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/70">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="p-1 rounded-md bg-violet-500/10 text-violet-400">
                        <FileCode2 className="w-4 h-4" />
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {tpl.name}
                      </h4>
                      {linkedPattern && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                          <Sparkles className="w-3 h-3" />
                          Pattern: {linkedPattern.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Complexity Badges (KaTeX E-01) */}
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Time:</span>
                      <MathView math={tpl.time} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold shadow-sm">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Space:</span>
                      <MathView math={tpl.space} />
                    </div>
                  </div>
                </div>

                {/* 2. When to Use Callout (E-01, E-02) */}
                <div className="template-when-callout rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-amber-300 font-semibold uppercase tracking-wider text-[11px] block">
                      Khi nào nên áp dụng:
                    </strong>
                    <div className="text-slate-300">
                      <MathView math={tpl.whenToUse} />
                    </div>
                  </div>
                </div>

                {/* 3. Code Block Container with Tab Bar (E-10 -> E-32) */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                    {/* Tab ARIA Language Switcher (E-10, E-11, E-12: Đổi ở bất kỳ card nào cũng tự đổi toàn cục) */}
                    <div
                      role="tablist"
                      aria-label={`Ngôn ngữ cho template ${tpl.name}`}
                      className="inline-flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono shadow-inner"
                    >
                      <button
                        role="tab"
                        aria-selected={globalLanguage === 'python'}
                        onClick={() => handleSelectLanguage('python')}
                        className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                          globalLanguage === 'python'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Python
                      </button>
                      <button
                        role="tab"
                        aria-selected={globalLanguage === 'cpp'}
                        onClick={() => handleSelectLanguage('cpp')}
                        className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                          globalLanguage === 'cpp'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        C++
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                      Mẫu triển khai chuẩn LeetCode / Competitive Programming
                    </span>
                  </div>

                  {/* Enhanced CodeViewer Component (E-20, E-21, E-30, E-31, E-32) */}
                  <CodeViewer
                    code={codeString}
                    language={globalLanguage === 'python' ? 'python' : 'cpp'}
                    title={`${tpl.name} • ${globalLanguage === 'python' ? 'Python' : 'C++'}`}
                    showLineNumbers={showLineNumbers}
                  />
                </div>

                {/* 4. Notes & Variants Callout (E-01, E-02) */}
                {tpl.notes && (
                  <div className="template-notes-callout rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 flex gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="text-indigo-300 font-semibold uppercase tracking-wider text-[11px] block">
                        Điều chỉnh biến thể & Lưu ý cài đặt:
                      </strong>
                      <div className="text-slate-300">
                        <MarkdownView content={tpl.notes} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default AlgorithmicTemplates
