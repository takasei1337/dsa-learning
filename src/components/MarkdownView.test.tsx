import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { MarkdownView, parseInline } from './MarkdownView'

describe('MarkdownView Component', () => {
  it('render in đậm có lồng công thức toán $O(1)$ mà không bị lỗi sao đôi ** hay mất thẻ strong', () => {
    const text = '**Chi phí khấu hao (Amortized $O(1)$)**: Giải thích chi tiết'
    const html = renderToString(<MarkdownView content={text} />)
    expect(html).toContain('<strong')
    expect(html).toContain('Chi phí khấu hao')
    expect(html).toContain('katex')
    expect(html).not.toContain('**')
  })

  it('render in đậm có lồng inline code `std::vector` mà không bị lộ dấu sao đôi **', () => {
    const text = '- **Mảng động (Dynamic Array - `std::vector` trong C++, `list` trong Python)**:'
    const html = renderToString(<MarkdownView content={text} />)
    expect(html).toContain('<strong')
    expect(html).toContain('<code')
    expect(html).toContain('std::vector')
    expect(html).toContain('list')
    expect(html).not.toContain('**')
  })

  it('render bảng Markdown (|...|) thành thẻ <table>, <thead>, <tbody> chuẩn chỉnh', () => {
    const tableMd = `### Bảng Trade-off
| Cấu trúc dữ liệu | Truy cập ngẫu nhiên | Bộ nhớ phụ |
| :--- | :---: | ---: |
| **Mảng tĩnh** | $O(1)$ | $O(1)$ |
| **Mảng động** | $O(1)$ | $O(N)$ |`

    const html = renderToString(<MarkdownView content={tableMd} />)
    expect(html).toContain('<table')
    expect(html).toContain('<thead')
    expect(html).toContain('<tbody')
    expect(html).toContain('Cấu trúc dữ liệu')
    expect(html).toContain('Truy cập ngẫu nhiên')
    expect(html).toContain('text-center')
    expect(html).toContain('text-right')
    expect(html).toContain('katex')
    expect(html).not.toContain('| Cấu trúc dữ liệu |')
  })

  it('render danh sách phân cấp (bullet lồng nhau) với thụt lề thụt dòng', () => {
    const listMd = `- Mục cha 1
  - Mục con 1.1
  - Mục con 1.2
- Mục cha 2`

    const html = renderToString(<MarkdownView content={listMd} />)
    expect(html).toContain('Mục cha 1')
    expect(html).toContain('Mục con 1.1')
    expect(html).toContain('pl-6')
  })

  it('parseInline xử lý an toàn dấu gạch chéo \\$ không coi là công thức toán', () => {
    const text = 'Giá vé là \\$100 cho mỗi người.'
    const html = renderToString(<div>{parseInline(text)}</div>)
    expect(html).toContain('$100')
    expect(html).not.toContain('katex')
  })

  it('render dấu gạch phân cách --- thành thẻ <hr> thay vì dòng chữ thông thường', () => {
    const text = `Phần 1
---
Phần 2
***
Phần 3`
    const html = renderToString(<MarkdownView content={text} />)
    expect(html).toContain('<hr')
    expect(html).toContain('border-t')
    expect(html).not.toContain('<p>---</p>')
    expect(html).not.toContain('<p>***</p>')
  })

  it('render khối trích dẫn > thành thẻ <blockquote> với nội dung được parse', () => {
    const text = '> "Muốn truy cập tức thì theo thứ tự thì dùng **Mảng**."'
    const html = renderToString(<MarkdownView content={text} />)
    expect(html).toContain('<blockquote')
    expect(html).toContain('<strong')
    expect(html).toContain('Mảng')
  })
})
