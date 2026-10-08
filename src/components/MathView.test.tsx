import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { MathView } from './MathView'

describe('MathView Component (Module C & Math Rendering Logic)', () => {
  it('render công thức thuần $O(1)$ sạch sẽ không văng lỗi ParseError', () => {
    const html = renderToString(<MathView math="$O(1)$" />)
    expect(html).toContain('katex')
    expect(html).not.toContain("Can&#x27;t use function &#x27;$&#x27;")
    expect(html).not.toContain("Can't use function '$'")
  })

  it('render công thức thuần không bọc dấu $ như O(\\log N) thành KaTeX', () => {
    const html = renderToString(<MathView math="O(\log N)" />)
    expect(html).toContain('katex')
  })

  it('xử lý chuỗi thuần tiếng Việt như câu văn xuôi mà không bị font nghiêng KaTeX hay dính chữ', () => {
    const noteText = 'Phải dịch chuyển các phần tử phía sau sang phải hoặc trái.'
    const html = renderToString(<MathView math={noteText} />)
    // Không bọc thẻ katex làm hỏng font chữ
    expect(html).not.toContain('class="katex"')
    expect(html).toContain('Phải dịch chuyển các phần tử phía sau sang phải hoặc trái.')
  })

  it('xử lý văn bản hỗn hợp tiếng Việt có chứa $inline$ mà không báo lỗi ParseError', () => {
    const mixedText = 'Nền tảng mảng tĩnh. Tối ưu truy xuất từ $O(N)$ xuống $O(1)$ bằng đánh đổi bộ nhớ.'
    const html = renderToString(<MathView math={mixedText} />)
    // Có thẻ katex cho các công thức inline
    expect(html).toContain('katex')
    // Chứa đầy đủ nội dung chữ tiếng Việt
    expect(html).toContain('Nền tảng mảng tĩnh')
    expect(html).toContain('bằng đánh đổi bộ nhớ')
    expect(html).not.toContain("Can't use function '$'")
  })

  it('xử lý khối toán học $$...$$ đa dòng hoặc một dòng', () => {
    const blockMath = '$$mid = left + \\lfloor \\frac{right - left}{2} \\rfloor$$'
    const html = renderToString(<MathView math={blockMath} block />)
    expect(html).toContain('katex-display')
  })

  it('trả về rỗng an toàn khi math trống hoặc whitespace', () => {
    const html = renderToString(<MathView math="   " />)
    expect(html).toBe('')
  })
})
