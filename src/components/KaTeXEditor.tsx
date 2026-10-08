import React, { useRef } from 'react'
import { Sparkles, Eye, Edit3, HelpCircle } from 'lucide-react'
import { MarkdownView } from './MarkdownView'

export interface KaTeXEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minRows?: number
  label?: string
  error?: string
}

interface MacroItem {
  label: string
  tooltip: string
  snippet: string
  cursorOffset?: number // vị trí cursor sau khi chèn (tính từ cuối snippet nếu âm)
}

/**
 * Mục 5.1 & 5.2: Thanh nút macro chèn nhanh công thức toán học
 * $\BigO$, phân số \dfrac, tổng \sum, làm tròn \lfloor \rfloor...
 */
export const KATEX_MACROS: MacroItem[] = [
  {
    label: '$O(N)$',
    tooltip: 'Độ phức tạp Big-O: O(N)',
    snippet: '$O(N)$',
  },
  {
    label: '$O(1)$',
    tooltip: 'Độ phức tạp hằng số: O(1)',
    snippet: '$O(1)$',
  },
  {
    label: '$O(\\log N)$',
    tooltip: 'Độ phức tạp logarit: O(\\log N)',
    snippet: '$O(\\log N)$',
  },
  {
    label: '$O(N \\log N)$',
    tooltip: 'Độ phức tạp linearithmic: O(N \\log N)',
    snippet: '$O(N \\log N)$',
  },
  {
    label: '$O(N^2)$',
    tooltip: 'Độ phức tạp bậc hai: O(N^2)',
    snippet: '$O(N^2)$',
  },
  {
    label: '\\dfrac{a}{b}',
    tooltip: 'Phân số: \\dfrac{tử}{mẫu}',
    snippet: '$\\dfrac{a}{b}$',
  },
  {
    label: '\\sum_{i=1}^n',
    tooltip: 'Tổng sigma: \\sum_{i=1}^n',
    snippet: '$\\sum_{i=1}^{n}$',
  },
  {
    label: '\\prod_{i=1}^n',
    tooltip: 'Tích Pi: \\prod_{i=1}^n',
    snippet: '$\\prod_{i=1}^{n}$',
  },
  {
    label: '\\lfloor x \\rfloor',
    tooltip: 'Hàm sàn (làm tròn xuống): \\lfloor x \\rfloor',
    snippet: '$\\lfloor x \\rfloor$',
  },
  {
    label: '\\lceil x \\rceil',
    tooltip: 'Hàm trần (làm tròn lên): \\lceil x \\rceil',
    snippet: '$\\lceil x \\rceil$',
  },
  {
    label: '\\sqrt{n}',
    tooltip: 'Căn bậc hai: \\sqrt{n}',
    snippet: '$\\sqrt{n}$',
  },
  {
    label: '\\le / \\ge',
    tooltip: 'Nhỏ hơn/bằng hoặc Lớn hơn/bằng: \\le, \\ge',
    snippet: '$\\le$',
  },
  {
    label: '\\neq',
    tooltip: 'Khác nhau: \\neq',
    snippet: '$\\neq$',
  },
  {
    label: '\\in',
    tooltip: 'Thuộc tập hợp: \\in',
    snippet: '$\\in$',
  },
  {
    label: '$$ Block $$',
    tooltip: 'Khối công thức toán căn giữa',
    snippet: '\n$$\n\\sum_{i=1}^{n} i = \\dfrac{n(n+1)}{2}\n$$\n',
  },
]

export const KaTeXEditor: React.FC<KaTeXEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung Markdown hoặc ký hiệu KaTeX ($O(N)$ hay $$...$$)...',
  minRows = 6,
  label = 'Nội dung Markdown & KaTeX',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Chèn macro tại vị trí con trỏ trong textarea
  const handleInsertMacro = (snippet: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      onChange(value + snippet)
      return
    }

    const start = textarea.selectionStart ?? value.length
    const end = textarea.selectionEnd ?? value.length
    const before = value.substring(0, start)
    const after = value.substring(end)
    const nextValue = before + snippet + after

    onChange(nextValue)

    // Đặt lại con trỏ chuột ngay sau snippet vừa chèn
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + snippet.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 10)
  }

  return (
    <div className="space-y-2">
      {/* Header nhãn + hướng dẫn */}
      <div className="flex items-center justify-between">
        <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          <span>$inline$ hoặc $$block$$</span>
        </span>
      </div>

      {/* Thanh Macro chèn nhanh công thức (Mục 5.1, 5.2) */}
      <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Macro:</span>
        </span>
        {KATEX_MACROS.map((macro) => (
          <button
            key={macro.label}
            type="button"
            onClick={() => handleInsertMacro(macro.snippet)}
            title={macro.tooltip}
            className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500/50 text-[11px] font-mono transition cursor-pointer active:scale-95 shadow-sm"
          >
            {macro.label}
          </button>
        ))}
      </div>

      {/* 2 Khung nhìn đồng thời: Trái - Soạn thảo, Phải - Preview Trực tiếp (Mục 5.1, 5.2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Khung Trái: Nhập liệu Markdown / LaTeX */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Edit3 className="w-3 h-3 text-indigo-400" />
              <span>1. Soạn thảo</span>
            </span>
            <span>{value.length} ký tự</span>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={minRows}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed placeholder-slate-600 resize-y"
          />
        </div>

        {/* Khung Phải: Xem trước trực tiếp (Live Preview với KaTeX và Markdown) */}
        <div className="space-y-1 flex flex-col">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1 text-cyan-400">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>2. Xem trước trực tiếp</span>
            </span>
            <span className="text-emerald-400">Hiển thị trực tiếp</span>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-xs overflow-y-auto max-h-[360px] min-h-[140px] leading-relaxed">
            {value.trim() ? (
              <MarkdownView content={value} />
            ) : (
              <p className="text-slate-600 italic text-[11px]">
                Nội dung xem trước sẽ hiển thị tức thì tại đây khi bạn nhập liệu...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KaTeXEditor
