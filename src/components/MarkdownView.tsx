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
 * Phân tích và render một đoạn văn bản có chứa inline formatting lồng nhau:
 * - Inline Code: `...`
 * - Inline Math: $...$ (KaTeX)
 * - Bold: **...** (hỗ trợ lồng `code` và $math$ bên trong)
 * - Italic: *...*
 * - Link: [text](url)
 */
export function parseInline(text: string, baseKey: string = 'inline'): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let i = 0
  let textBuffer = ''

  const flushText = () => {
    if (textBuffer) {
      nodes.push(textBuffer)
      textBuffer = ''
    }
  }

  while (i < text.length) {
    // 1. Escaped dollar: \$
    if (text[i] === '\\' && i + 1 < text.length && text[i + 1] === '$') {
      textBuffer += '$'
      i += 2
      continue
    }

    // 2. Inline Code: `...`
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        flushText()
        const codeContent = text.slice(i + 1, end)
        nodes.push(
          <code
            key={`${baseKey}-c-${i}`}
            className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-200 font-mono text-[12px] font-medium border border-slate-700 mx-0.5 shadow-xs"
          >
            {codeContent}
          </code>,
        )
        i = end + 1
        continue
      }
    }

    // 3. Inline Math: $...$ (chỉ khi không phải $$)
    if (text[i] === '$' && (i + 1 >= text.length || text[i + 1] !== '$')) {
      // Tìm closing $ (không bị escape bởi \)
      let end = -1
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === '$' && text[j - 1] !== '\\') {
          end = j
          break
        }
      }

      if (end !== -1 && end > i + 1) {
        flushText()
        const latex = text.slice(i + 1, end).trim()
        const key = `${baseKey}-m-${i}`
        try {
          const html = katex.renderToString(latex, {
            ...KATEX_OPTIONS,
            displayMode: false,
            throwOnError: true,
          })
          nodes.push(
            <span
              key={key}
              className="inline-math px-0.5 font-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            />,
          )
        } catch {
          nodes.push(
            <span
              key={key}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono bg-rose-950/80 border border-rose-700 text-rose-200"
              title="Lỗi cú pháp KaTeX"
            >
              ⚠️ ${latex}$
            </span>,
          )
        }
        i = end + 1
        continue
      }
    }

    // 4. Bold: **...** (Hỗ trợ lồng code và math bên trong với độ tương phản tuyệt đối)
    if (text.startsWith('**', i)) {
      let end = -1
      for (let j = i + 2; j < text.length - 1; j++) {
        if (text[j] === '*' && text[j + 1] === '*') {
          end = j
          break
        }
      }

      if (end !== -1 && end > i + 2) {
        flushText()
        const boldInner = text.slice(i + 2, end)
        nodes.push(
          <strong key={`${baseKey}-b-${i}`} className="font-bold text-white tracking-wide">
            {parseInline(boldInner, `${baseKey}-bi-${i}`)}
          </strong>,
        )
        i = end + 2
        continue
      }
    }

    // 5. Link: [text](url)
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1)
      if (closeBracket !== -1 && closeBracket + 1 < text.length && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2)
        if (closeParen !== -1) {
          flushText()
          const linkText = text.slice(i + 1, closeBracket)
          const linkUrl = text.slice(closeBracket + 2, closeParen)
          nodes.push(
            <a
              key={`${baseKey}-a-${i}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold"
            >
              {parseInline(linkText, `${baseKey}-at-${i}`)}
            </a>,
          )
          i = closeParen + 1
          continue
        }
      }
    }

    // 6. Italic: *...* (dấu sao đơn, không thuộc **)
    if (text[i] === '*' && (i + 1 >= text.length || text[i + 1] !== '*')) {
      let end = -1
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === '*' && (j + 1 >= text.length || text[j + 1] !== '*') && text[j - 1] !== '*') {
          end = j
          break
        }
      }
      if (end !== -1 && end > i + 1) {
        flushText()
        const italicInner = text.slice(i + 1, end)
        nodes.push(
          <em key={`${baseKey}-em-${i}`} className="italic text-slate-200">
            {parseInline(italicInner, `${baseKey}-emi-${i}`)}
          </em>,
        )
        i = end + 1
        continue
      }
    }

    // Tích lũy ký tự vào buffer
    textBuffer += text[i]
    i++
  }

  flushText()
  return nodes
}

export const renderTextWithInlineMath = parseInline

/**
 * MarkdownView Component
 * Tối ưu độ tương phản tối đa (WCAG AAA) cho Dark Mode và Light Mode:
 * - Text mặc định: text-slate-100 (rõ ràng, không mờ)
 * - In đậm: text-white font-bold
 * - Tiêu đề: text-white font-bold
 * - Bảng Markdown: Viền sắc nét, tiêu đề đen tuyền, ô sáng rõ
 */
export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []

    let inCodeBlock = false
    let codeBuffer: string[] = []
    let inBlockMath = false
    let mathBuffer: string[] = []

    const isTableLine = (l: string): boolean => {
      const t = l.trim()
      return t.startsWith('|') && t.endsWith('|') && t.split('|').length >= 3
    }

    const isTableSeparator = (l: string): boolean => {
      const t = l.trim()
      return t.startsWith('|') && t.endsWith('|') && /^\|(\s*:?-+:?\s*\|)+$/.test(t)
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // 1. Khối mã ```
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`codeblock-${i}`}
              className="my-3 p-3.5 rounded-xl bg-[#0d1117] border border-slate-700/80 font-mono text-xs overflow-x-auto text-cyan-300 shadow-md"
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
                className="my-3.5 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-center overflow-x-auto text-amber-200 shadow-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />,
            )
          } catch {
            elements.push(
              <div
                key={`blockmath-err-${i}`}
                className="my-3 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-mono"
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
              className="my-3 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-center overflow-x-auto text-amber-200 shadow-sm"
              dangerouslySetInnerHTML={{ __html: html }}
            />,
          )
        } catch {
          elements.push(
            <div
              key={`blockmath-err-${i}`}
              className="my-3 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-mono"
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

      // 3. Đường kẻ ngang phân cách (Horizontal Rule: ---, ***, ___ hoặc - - -)
      if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
        elements.push(
          <hr
            key={`hr-${i}`}
            className="my-5 border-0 border-t border-slate-700/80"
          />,
        )
        continue
      }

      // 4. Tiêu đề cấp 2 (##), cấp 3 (###) và cấp 4 (####)
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3
            key={`h2-${i}`}
            className="text-base font-bold text-white mt-5 mb-2.5 flex items-center gap-2 border-b border-slate-800/90 pb-2"
          >
            {parseInline(trimmed.slice(3), `h2-${i}`)}
          </h3>,
        )
        continue
      }

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4
            key={`h3-${i}`}
            className="text-sm font-bold text-white mt-4 mb-2 flex items-center gap-2 border-b border-slate-800/90 pb-2"
          >
            {parseInline(trimmed.slice(4), `h3-${i}`)}
          </h4>,
        )
        continue
      }

      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h5 key={`h4-${i}`} className="text-xs font-bold text-slate-100 mt-3 mb-1.5">
            {parseInline(trimmed.slice(5), `h4-${i}`)}
          </h5>,
        )
        continue
      }

      // 4. Bảng Markdown (| Thao tác | Time | Space |)
      if (isTableLine(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        const headerCells = line
          .trim()
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim())

        const sepCells = lines[i + 1]
          .trim()
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim())

        const alignments = sepCells.map((s) => {
          if (s.startsWith(':') && s.endsWith(':')) return 'text-center'
          if (s.endsWith(':')) return 'text-right'
          return 'text-left'
        })

        const rows: string[][] = []
        let j = i + 2
        while (j < lines.length && isTableLine(lines[j])) {
          const rowCells = lines[j]
            .trim()
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim())
          rows.push(rowCells)
          j++
        }

        elements.push(
          <div
            key={`table-${i}`}
            className="my-3.5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-100 border-b border-slate-800">
                  {headerCells.map((h, colIdx) => (
                    <th
                      key={colIdx}
                      className={`px-3.5 py-2.5 font-bold text-white tracking-wide ${alignments[colIdx] || 'text-left'}`}
                    >
                      {parseInline(h, `th-${i}-${colIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-sans">
                {rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-800/60 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3.5 py-2 text-slate-100 font-normal ${alignments[cIdx] || 'text-left'}`}
                      >
                        {parseInline(cell, `td-${i}-${rIdx}-${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )

        i = j - 1
        continue
      }

      // 5. Danh sách gạch đầu dòng (- hoặc * hoặc •) với hỗ trợ phân cấp
      const bulletMatch = line.match(/^(\s*)([-*•])\s+(.*)$/)
      if (bulletMatch) {
        const indentLevel = bulletMatch[1].length
        const isNested = indentLevel >= 2
        const content = bulletMatch[3]

        elements.push(
          <div
            key={`li-${i}`}
            className={`flex items-start gap-2.5 my-1 text-xs text-slate-100 ${isNested ? 'pl-6' : 'pl-2'}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                isNested
                  ? 'border border-indigo-400 bg-transparent'
                  : 'bg-indigo-400'
              }`}
            />
            <div className="leading-relaxed flex-1">
              {parseInline(content, `li-c-${i}`)}
            </div>
          </div>,
        )
        continue
      }

      // 6. Danh sách đánh số (1. 2. ...)
      const numMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
      if (numMatch) {
        const indentLevel = numMatch[1].length
        const isNested = indentLevel >= 2
        const num = numMatch[2]
        const content = numMatch[3]

        elements.push(
          <div
            key={`numli-${i}`}
            className={`flex items-start gap-2.5 my-1 text-xs text-slate-100 ${isNested ? 'pl-6' : 'pl-2'}`}
          >
            <span className="font-mono font-bold text-indigo-400 text-xs shrink-0">
              {num}.
            </span>
            <div className="leading-relaxed flex-1">
              {parseInline(content, `numli-c-${i}`)}
            </div>
          </div>,
        )
        continue
      }

      // 7. Khối trích dẫn (Blockquote >)
      if (trimmed.startsWith('>')) {
        const quoteContent = trimmed.replace(/^>\s?/, '')
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-2.5 pl-3.5 py-1.5 border-l-4 border-indigo-400 bg-indigo-950/40 text-indigo-100 rounded-r-lg text-xs italic"
          >
            {parseInline(quoteContent, `quote-c-${i}`)}
          </blockquote>,
        )
        continue
      }

      // 8. Dòng trống
      if (!trimmed) {
        continue
      }

      // 9. Đoạn văn thường
      elements.push(
        <p key={`p-${i}`} className="my-1.5 text-xs text-slate-100 leading-relaxed">
          {parseInline(line, `p-c-${i}`)}
        </p>,
      )
    }

    return elements
  }, [content])

  return <div className={`markdown-body space-y-1.5 ${className}`}>{renderedElements}</div>
}

export default MarkdownView
