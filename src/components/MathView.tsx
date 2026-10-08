import React from 'react'
import katex from 'katex'

export interface MathViewProps {
  math: string
  block?: boolean
  className?: string
}

const VIETNAMESE_REGEX =
  /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/

const KATEX_OPTIONS = {
  throwOnError: false,
  macros: {
    '\\BigO': 'O',
  },
}

function renderKaTeXHtml(formula: string, isBlock: boolean): string {
  try {
    return katex.renderToString(formula, {
      ...KATEX_OPTIONS,
      displayMode: isBlock,
    })
  } catch (err) {
    console.error('KaTeX rendering error:', err)
    return `<span class="font-mono text-xs">${formula}</span>`
  }
}

/**
 * Xử lý chuỗi hỗn hợp văn bản + $inline math$
 */
function renderMixedContent(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /\$([^$]+?)\$/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`txt-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>,
      )
    }

    const latex = match[1].trim()
    const key = `math-${match.index}`
    const html = renderKaTeXHtml(latex, false)

    parts.push(
      <span
        key={key}
        className="inline-math px-0.5"
        dangerouslySetInnerHTML={{ __html: html }}
      />,
    )

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`txt-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>,
    )
  }

  return <>{parts}</>
}

/**
 * Kiểm tra xem chuỗi có phải là văn bản thường (prose) thay vì công thức toán không
 */
function isProseText(str: string): boolean {
  // Có chứa ký tự tiếng Việt có dấu -> chắc chắn là prose
  if (VIETNAMESE_REGEX.test(str)) {
    return true
  }

  // Nếu có chứa macro LaTeX thì là math
  if (str.includes('\\')) {
    return false
  }

  // Nếu bắt đầu bằng ký hiệu Big-O như O(...), Θ(...), Ω(...)
  if (/^[OoΘΩ]\s*\(/.test(str)) {
    return false
  }

  // Nếu chứa nhiều từ ngữ ngăn cách bằng khoảng trắng (câu văn xuôi)
  const words = str.trim().split(/\s+/)
  if (words.length > 2) {
    return true
  }

  return false
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
}) => {
  if (!math || !math.trim()) {
    return null
  }

  const trimmed = math.trim()

  // 1. Khối toán học $$...$$
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) {
    const inner = trimmed.slice(2, -2).trim()
    const html = renderKaTeXHtml(inner, true)
    return (
      <div
        className={`inline-math block text-center my-2 overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  // 2. Công thức inline đơn $...$
  if (
    trimmed.startsWith('$') &&
    trimmed.endsWith('$') &&
    trimmed.length >= 2 &&
    !trimmed.slice(1, -1).includes('$')
  ) {
    const inner = trimmed.slice(1, -1).trim()
    const html = renderKaTeXHtml(inner, block)
    return (
      <span
        className={`inline-math ${block ? 'block text-center my-2 overflow-x-auto' : 'inline'} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  // 3. Chuỗi hỗn hợp chứa các đoạn $inline math$
  if (trimmed.includes('$')) {
    return (
      <span className={`inline-math-mixed ${block ? 'block my-1' : 'inline'} ${className}`}>
        {renderMixedContent(trimmed)}
      </span>
    )
  }

  // 4. Chuỗi không có dấu $
  // Nếu là câu văn xuôi tiếng Việt hoặc văn bản thường -> KHÔNG đưa vào KaTeX để tránh lỗi font chữ nghiêng
  if (isProseText(trimmed)) {
    return <span className={className}>{trimmed}</span>
  }

  // 5. Công thức toán thuần không bọc dấu $ (VD: O(1), O(N), \sum...)
  const html = renderKaTeXHtml(trimmed, block)
  return (
    <span
      className={`inline-math ${block ? 'block text-center my-2 overflow-x-auto' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default MathView
