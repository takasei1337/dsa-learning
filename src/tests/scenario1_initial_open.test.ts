import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { storageAdapter, STORAGE_KEYS } from '../services/storageAdapter'
import type { Chapter } from '../types'

// In-memory localStorage mock cho môi trường Node / Vitest
const createLocalStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
}

describe('Kiểm thử Kịch bản 1: Mở trang lần đầu -> Thấy đủ 6 chương đúng thứ tự Roadmap', () => {
  beforeAll(() => {
    const mock = createLocalStorageMock()
    Object.defineProperty(globalThis, 'localStorage', {
      value: mock,
      writable: true,
    })
    Object.defineProperty(globalThis, 'window', {
      value: globalThis,
      writable: true,
    })
  })

  beforeEach(() => {
    // Giả lập mở trang lần đầu: localStorage hoàn toàn rỗng
    localStorage.clear()
    storageAdapter.ensureInitialized()
  })

  it('Bước 1: Khi localStorage rỗng, hệ thống tự động khởi tạo dữ liệu Roadmap trong dsa.content.v1', () => {
    const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT)
    expect(rawContent).not.toBeNull()

    const content = storageAdapter.getContent()
    expect(content).toBeDefined()
    expect(content.chapters).toBeDefined()
  })

  it('Bước 2: Hệ thống nạp đủ đúng 6 chương cốt lõi theo Phụ lục A', () => {
    const content = storageAdapter.getContent()
    expect(content.chapters.length).toBe(6)
  })

  it('Bước 3: 6 chương được sắp xếp đúng thứ tự Roadmap (order 1 đến 6)', () => {
    const content = storageAdapter.getContent()
    const sortedChapters = [...content.chapters].sort((a: Chapter, b: Chapter) => a.order - b.order)

    // Thứ tự lộ trình học tiêu chuẩn
    const expectedRoadmap = [
      { order: 1, id: 'ch-01', slug: 'arrays-and-hashing', title: 'Arrays & Hashing' },
      { order: 2, id: 'ch-02', slug: 'two-pointers', title: 'Two Pointers' },
      { order: 3, id: 'ch-03', slug: 'stack', title: 'Stack' },
      { order: 4, id: 'ch-04', slug: 'binary-search', title: 'Binary Search' },
      { order: 5, id: 'ch-05', slug: 'sliding-window', title: 'Sliding Window' },
      { order: 6, id: 'ch-06', slug: 'linked-list', title: 'Linked List' },
    ]

    expectedRoadmap.forEach((expected, index) => {
      const actual = sortedChapters[index]
      expect(actual.order).toBe(expected.order)
      expect(actual.id).toBe(expected.id)
      expect(actual.slug).toBe(expected.slug)
      expect(actual.title).toBe(expected.title)
    })
  })

  it('Bước 4: Chương mặc định được chọn ban đầu là chương đầu tiên (Arrays & Hashing)', () => {
    const content = storageAdapter.getContent()
    const firstChapter = [...content.chapters].sort((a, b) => a.order - b.order)[0]

    expect(firstChapter.id).toBe('ch-01')
    expect(firstChapter.title).toBe('Arrays & Hashing')
    expect(firstChapter.order).toBe(1)
  })

  it('Bước 5: Mỗi chương đều có đầy đủ dữ liệu đi kèm (Concepts, Complexities, Patterns, Pitfalls, Problems)', () => {
    const content = storageAdapter.getContent()

    content.chapters.forEach((chapter) => {
      const concepts = content.concepts.filter((c) => c.chapterId === chapter.id)
      const complexities = content.complexityRows.filter((c) => c.chapterId === chapter.id)
      const patterns = content.patterns.filter((p) => p.chapterId === chapter.id)
      const pitfalls = content.pitfalls.filter((p) => p.chapterId === chapter.id)
      const problems = content.problems.filter((p) => p.chapterId === chapter.id)

      expect(concepts.length).toBeGreaterThan(0)
      expect(complexities.length).toBeGreaterThan(0)
      expect(patterns.length).toBeGreaterThan(0)
      expect(pitfalls.length).toBeGreaterThan(0)
      expect(problems.length).toBe(5) // Mỗi chương có 5 bài tập trọng tâm
    })

    // Tổng cộng 30 bài tập trên 6 chương
    expect(content.problems.length).toBe(30)
  })
})
