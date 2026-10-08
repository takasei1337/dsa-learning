import React, { useMemo } from 'react'
import katex from 'katex'

export interface MarkdownViewProps {
  content: string
  className?: string
}

const KATEX_OPTIONS = {
  macros: {
    '\\BigO': 'O',
  },
}

/**
 * Render một đoạn văn bản có chứa inline math $...$
 * C-07: Công thức lỗi cú pháp không làm vỡ trang, hiển thị thông báo lỗi tại chỗ kèm mã gốc.
 */
function renderTextWithInlineMath(text: string): React.ReactNode[] {
  // Regex tách công thức inline $...$ (không phải $$...$$)
  const parts: React.ReactNode[] = []
  const regex = /\$([^$]+?)\$/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderFormatting(text.substring(lastIndex, match.index), `txt-${lastIndex}`))
    }

    const latex = match[1].trim()
    const key = `math-${match.index}`
    try {
      const html = katex.renderToString(latex, {
        ...KATEX_OPTIONS,
        displayMode: false,
        throwOnError: true,
      })
      parts.push(
        <span
          key={key}
          className="inline-math px-0.5"
          dangerouslySetInnerHTML={{ __html: html }}
        />,
      )
    } catch {
      // C-07: Báo lỗi tại chỗ kèm mã gốc
      parts.push(
        <span
          key={key}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono bg-rose-950/60 border border-rose-800 text-rose-300"
          title="Lỗi cú pháp KaTeX"
        >
          ⚠️ ${latex}$
        </span>,
      )
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(renderFormatting(text.substring(lastIndex), `txt-${lastIndex}`))
  }

  return parts
}

/**
 * Xử lý in đậm, in nghiêng, inline code
 */
function renderFormatting(str: string, baseKey: string): React.ReactNode {
  // Tách inline code `...`
  const codeParts = str.split(/(`[^`]+?`)/g)
  return (
    <React.Fragment key={baseKey}>
      {codeParts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          return (
            <code
              key={`${baseKey}-c-${i}`}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[12px] border border-slate-700/60 mx-0.5"
            >
              {part.slice(1, -1)}
            </code>
          )
        }

        // Tách in đậm **...**
        const boldParts = part.split(/(\*\*[^*]+?\*\*)/g)
        return (
          <React.Fragment key={`${baseKey}-p-${i}`}>
            {boldParts.map((bPart, j) => {
              if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length >= 4) {
                return (
                  <strong key={`${baseKey}-b-${j}`} className="font-bold text-white">
                    {bPart.slice(2, -2)}
                  </strong>
                )
              }
              return bPart
            })}
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

/**
 * MarkdownView Component
 * Hỗ trợ: Tiêu đề cấp 3-4, danh sách, khối trích dẫn, khối code,
 * công thức toán inline $...$ và block $$...$$ (C-01, C-02, C-07)
 */
export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []

    let inCodeBlock = false
    let codeBuffer: string[] = []
    let inBlockMath = false
    let mathBuffer: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // 1. Khối mã ```
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`codeblock-${i}`}
              className="my-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto text-cyan-300"
            >
              <code>{codeBuffer.join('\n')}</code>
            </pre>,
          )
          codeBuffer = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        continue
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        continue
      }

      // 2. Khối toán học $$...$$ đa dòng
      if (trimmed === '$$') {
        if (inBlockMath) {
          const latex = mathBuffer.join('\n').trim()
          try {
            const html = katex.renderToString(latex, {
              ...KATEX_OPTIONS,
              displayMode: true,
              throwOnError: true,
            })
            elements.push(
              <div
                key={`blockmath-${i}`}
                className="my-3.5 py-2 px-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center overflow-x-auto text-amber-300"
                dangerouslySetInnerHTML={{ __html: html }}
              />,
            )
          } catch {
            elements.push(
              <div
                key={`blockmath-err-${i}`}
                className="my-3 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono"
              >
                ⚠️ Lỗi công thức LaTeX block: {latex}
              </div>,
            )
          }
          mathBuffer = []
          inBlockMath = false
        } else {
          inBlockMath = true
        }
        continue
      }

      // Khối toán học $$...$$ trên cùng một dòng
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
        const latex = trimmed.slice(2, -2).trim()
        try {
          const html = katex.renderToString(latex, {
            ...KATEX_OPTIONS,
            displayMode: true,
            throwOnError: true,
          })
          elements.push(
            <div
              key={`blockmath-inline-${i}`}
              className="my-3 py-2 px-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center overflow-x-auto text-amber-300"
              dangerouslySetInnerHTML={{ __html: html }}
            />,
          )
        } catch {
          elements.push(
            <div
              key={`blockmath-err-${i}`}
              className="my-3 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono"
            >
              ⚠️ Lỗi công thức LaTeX: {latex}
            </div>,
          )
        }
        continue
      }

      if (inBlockMath) {
        mathBuffer.push(line)
        continue
      }

      // 3. Tiêu đề cấp 3 (###) và cấp 4 (####)
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4
            key={`h3-${i}`}
            className="text-sm font-bold text-white mt-4 mb-2 flex items-center gap-2 border-b border-slate-800/60 pb-1.5"
          >
            {renderTextWithInlineMath(trimmed.slice(4))}
          </h4>,
        )
        continue
      }

      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h5 key={`h4-${i}`} className="text-xs font-bold text-slate-200 mt-3 mb-1.5">
            {renderTextWithInlineMath(trimmed.slice(5))}
          </h5>,
        )
        continue
      }

      // 4. Danh sách gạch đầu dòng (- hoặc *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2.5 my-1 text-xs text-slate-300 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
            <div className="leading-relaxed flex-1">
              {renderTextWithInlineMath(trimmed.slice(2))}
            </div>
          </div>,
        )
        continue
      }

      // 5. Danh sách đánh số (1. 2. ...)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
      if (numMatch) {
        elements.push(
          <div key={`numli-${i}`} className="flex items-start gap-2.5 my-1 text-xs text-slate-300 pl-2">
            <span className="font-mono font-bold text-indigo-400 text-xs shrink-0">
              {numMatch[1]}.
            </span>
            <div className="leading-relaxed flex-1">
              {renderTextWithInlineMath(numMatch[2])}
            </div>
          </div>,
        )
        continue
      }

      // 6. Khối trích dẫn (Blockquote >)
      if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-2.5 pl-3.5 py-1.5 border-l-2 border-indigo-500 bg-indigo-950/20 text-indigo-200 rounded-r-lg text-xs italic"
          >
            {renderTextWithInlineMath(trimmed.slice(2))}
          </blockquote>
        )
        continue
      }

      // 7. Dòng trống
      if (!trimmed) {
        continue
      }

      // 8. Đoạn văn thường
      elements.push(
        <p key={`p-${i}`} className="my-1.5 text-xs text-slate-300 leading-relaxed">
          {renderTextWithInlineMath(line)}
        </p>,
      )
    }

    return elements
  }, [content])

  return <div className={`markdown-body space-y-1 ${className}`}>{renderedElements}</div>
}

export default MarkdownView
