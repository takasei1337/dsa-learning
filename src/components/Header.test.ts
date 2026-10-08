import { describe, it, expect } from 'vitest'
import { initialSeedData } from '../data/seedData'
import { matchesSearch, matchesAny, removeVietnameseTones } from '../utils/textUtils'
import type { Pattern, Problem, Chapter } from '../types'

describe('Header Quick Search & Vietnamese Diacritics Removal (D-04, NFR-08)', () => {
  it('tìm kiếm chính xác dạng bài (Pattern) khi gõ keywords bằng tiếng Việt KHÔNG DẤU', () => {
    // Người dùng gõ "hai con tro" (không dấu)
    const query = 'hai con tro'
    const matched = initialSeedData.patterns.filter(
      (p: Pattern) =>
        matchesSearch(p.name, query) ||
        matchesSearch(p.description, query) ||
        matchesAny(p.keywords, query) ||
        matchesAny(p.examplePhrases, query)
    )

    expect(matched.length).toBeGreaterThan(0)
    // Phải khớp với các pattern của Two Pointers (chương 2)
    const hasTwoPointers = matched.some((p) => p.chapterId === 'ch-02')
    expect(hasTwoPointers).toBe(true)
  })

  it('tìm kiếm chính xác dạng bài Sliding Window khi gõ "cua so" hoặc "xau con"', () => {
    const query1 = 'cua so'
    const matched1 = initialSeedData.patterns.filter(
      (p: Pattern) =>
        matchesSearch(p.name, query1) ||
        matchesSearch(p.description, query1) ||
        matchesAny(p.keywords, query1) ||
        matchesAny(p.examplePhrases, query1)
    )
    expect(matched1.some((p) => p.chapterId === 'ch-05')).toBe(true)

    const query2 = 'xau con'
    const matched2 = initialSeedData.patterns.filter(
      (p: Pattern) =>
        matchesSearch(p.name, query2) ||
        matchesSearch(p.description, query2) ||
        matchesAny(p.keywords, query2) ||
        matchesAny(p.examplePhrases, query2)
    )
    expect(matched2.some((p) => p.chapterId === 'ch-05')).toBe(true)
  })

  it('tìm kiếm chính xác bài tập (Problem) theo tên hoặc hint khi gõ có dấu lẫn không dấu', () => {
    // Gõ không dấu "dao nguoc" -> Reverse Linked List
    const queryNoTone = 'dao nguoc'
    const matchedNoTone = initialSeedData.problems.filter(
      (prob: Problem) =>
        matchesSearch(prob.title, queryNoTone) ||
        matchesSearch(prob.hint, queryNoTone)
    )
    expect(matchedNoTone.length).toBeGreaterThan(0)

    // Gõ tiếng Anh "two sum"
    const queryEng = 'two sum'
    const matchedEng = initialSeedData.problems.filter((prob: Problem) =>
      matchesSearch(prob.title, queryEng)
    )
    expect(matchedEng.length).toBeGreaterThanOrEqual(2) // Two Sum, Two Sum II
  })

  it('tìm kiếm chương (Chapter) theo tiêu đề không dấu', () => {
    const query = 'ngan xep' // Ngăn xếp -> Stack
    const matched = initialSeedData.chapters.filter(
      (c: Chapter) =>
        matchesSearch(c.title, query) ||
        matchesSearch(c.summary, query)
    )
    expect(matched.some((c) => c.id === 'ch-03')).toBe(true)
  })

  it('hàm removeVietnameseTones xử lý đúng các ký tự phức tạp trong thuật toán', () => {
    expect(removeVietnameseTones('Cấu trúc dữ liệu & Giải thuật')).toBe(
      'Cau truc du lieu & Giai thuat'
    )
    expect(removeVietnameseTones('Đỉnh, Cạnh, Đồ thị, Hàng đợi ưu tiên')).toBe(
      'Dinh, Canh, Do thi, Hang doi uu tien'
    )
  })
})
