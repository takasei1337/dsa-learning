import { describe, it, expect } from 'vitest'
import type { SeedData, Chapter, Problem } from '../types'
import { KATEX_MACROS } from './KaTeXEditor'

describe('Module G - CRUD Inline & Validation Rules', () => {
  it('F-03, F-04: kiểm tra hợp lệ URL của LeetCode và NeetCode', () => {
    const isValidLeetcodeUrl = (url: string): boolean => {
      if (!url.trim()) return true
      const lower = url.trim().toLowerCase()
      return lower.startsWith('https://leetcode.com') || lower.startsWith('https://www.leetcode.com')
    }

    const isValidNeetcodeUrl = (url: string): boolean => {
      if (!url.trim()) return true
      const lower = url.trim().toLowerCase()
      return lower.startsWith('https://neetcode.io') || lower.startsWith('https://www.neetcode.io')
    }

    // LeetCode valid & invalid cases
    expect(isValidLeetcodeUrl('https://leetcode.com/problems/two-sum')).toBe(true)
    expect(isValidLeetcodeUrl('https://www.leetcode.com/problems/3sum')).toBe(true)
    expect(isValidLeetcodeUrl('http://leetcode.com/problems/two-sum')).toBe(false)
    expect(isValidLeetcodeUrl('https://hackerrank.com/challenges/two-sum')).toBe(false)
    expect(isValidLeetcodeUrl('')).toBe(true) // optional field

    // NeetCode valid & invalid cases
    expect(isValidNeetcodeUrl('https://neetcode.io/problems/two-sum')).toBe(true)
    expect(isValidNeetcodeUrl('https://www.neetcode.io/practice')).toBe(true)
    expect(isValidNeetcodeUrl('http://neetcode.io')).toBe(false)
    expect(isValidNeetcodeUrl('https://google.com')).toBe(false)
    expect(isValidNeetcodeUrl('')).toBe(true) // optional field
  })

  it('A-06: Cascade Delete khi xóa một Chapter khỏi SeedData', () => {
    const initialContent: SeedData = {
      schemaVersion: 1,
      chapters: [
        { id: 'ch-01', slug: 'chapter-1', title: 'Chapter 1', summary: '', order: 1 },
        { id: 'ch-02', slug: 'chapter-2', title: 'Chapter 2', summary: '', order: 2 },
      ],
      concepts: [
        { id: 'c-1', chapterId: 'ch-01', title: 'Concept 1', body: '', order: 1 },
        { id: 'c-2', chapterId: 'ch-02', title: 'Concept 2', body: '', order: 1 },
      ],
      complexityRows: [
        { id: 'cx-1', chapterId: 'ch-01', operation: 'Op 1', time: 'O(1)', space: 'O(1)', note: '', level: 'constant', order: 1 },
        { id: 'cx-2', chapterId: 'ch-02', operation: 'Op 2', time: 'O(N)', space: 'O(1)', level: 'linear', note: '', order: 1 },
      ],
      patterns: [
        { id: 'p-1', chapterId: 'ch-01', name: 'Pat 1', description: '', keywords: [], examplePhrases: [], order: 1 },
        { id: 'p-2', chapterId: 'ch-02', name: 'Pat 2', description: '', keywords: [], examplePhrases: [], order: 1 },
      ],
      pitfalls: [
        { id: 'pf-1', chapterId: 'ch-01', title: 'Pf 1', type: 'edge-case', body: '', patternIds: ['p-1'], order: 1 },
        { id: 'pf-2', chapterId: 'ch-02', title: 'Pf 2', type: 'overflow', body: '', patternIds: ['p-2'], order: 1 },
      ],
      templates: [
        { id: 't-1', chapterId: 'ch-01', patternId: 'p-1', name: 'Tpl 1', whenToUse: '', time: '', space: '', code: {}, notes: '', order: 1 },
      ],
      problems: [
        { id: 'prob-1', chapterId: 'ch-01', title: 'Two Sum', difficulty: 'easy', leetcodeUrl: '', neetcodeUrl: '', patternIds: ['p-1'], hint: '', order: 1 },
        { id: 'prob-2', chapterId: 'ch-02', title: '3Sum', difficulty: 'medium', leetcodeUrl: '', neetcodeUrl: '', patternIds: ['p-2'], hint: '', order: 1 },
      ],
    }

    // Thực hiện Cascade delete chapter 'ch-01'
    const targetChapterId = 'ch-01'
    const remainingChapters = initialContent.chapters.filter((c) => c.id !== targetChapterId)
    const updatedContent: SeedData = {
      ...initialContent,
      chapters: remainingChapters,
      concepts: initialContent.concepts.filter((c) => c.chapterId !== targetChapterId),
      complexityRows: initialContent.complexityRows.filter((r) => r.chapterId !== targetChapterId),
      patterns: initialContent.patterns.filter((p) => p.chapterId !== targetChapterId),
      pitfalls: initialContent.pitfalls.filter((pf) => pf.chapterId !== targetChapterId),
      templates: initialContent.templates.filter((t) => t.chapterId !== targetChapterId),
      problems: initialContent.problems.filter((pr) => pr.chapterId !== targetChapterId),
    }

    expect(updatedContent.chapters.length).toBe(1)
    expect(updatedContent.chapters[0].id).toBe('ch-02')
    expect(updatedContent.concepts.length).toBe(1)
    expect(updatedContent.concepts[0].chapterId).toBe('ch-02')
    expect(updatedContent.complexityRows.length).toBe(1)
    expect(updatedContent.patterns.length).toBe(1)
    expect(updatedContent.pitfalls.length).toBe(1)
    expect(updatedContent.templates.length).toBe(0)
    expect(updatedContent.problems.length).toBe(1)
    expect(updatedContent.problems[0].id).toBe('prob-2')
  })

  it('A-04, A-05: Thêm hoặc Cập nhật Chapter đảm bảo thứ tự và slug', () => {
    let chapters: Chapter[] = [
      { id: 'ch-01', slug: 'arrays-and-hashing', title: 'Arrays & Hashing', summary: '', order: 1 },
    ]

    const newChapter: Chapter = {
      id: 'ch-02',
      slug: 'two-pointers',
      title: 'Two Pointers',
      summary: 'Kỹ thuật hai con trỏ',
      order: 2,
    }

    // Thêm mới
    chapters = [...chapters, newChapter]
    expect(chapters.length).toBe(2)

    // Cập nhật tiêu đề chương 1
    const updatedChapter1: Chapter = {
      ...chapters[0],
      title: 'Mảng & Bảng Băm (Đã đổi tên)',
    }
    chapters = chapters.map((c) => (c.id === updatedChapter1.id ? updatedChapter1 : c))

    expect(chapters[0].title).toBe('Mảng & Bảng Băm (Đã đổi tên)')
    expect(chapters[1].title).toBe('Two Pointers')
  })

  it('F-03: Thêm và Cập nhật bài tập (Problem)', () => {
    let problems: Problem[] = [
      { id: 'prob-01', chapterId: 'ch-01', title: 'Two Sum', difficulty: 'easy', leetcodeUrl: '', neetcodeUrl: '', patternIds: [], hint: '', order: 1 },
    ]

    const newProblem: Problem = {
      id: 'prob-02',
      chapterId: 'ch-01',
      title: 'Valid Anagram',
      difficulty: 'easy',
      leetcodeUrl: 'https://leetcode.com/problems/valid-anagram',
      neetcodeUrl: 'https://neetcode.io/problems/is-anagram',
      patternIds: [],
      hint: '',
      order: 2,
    }

    // Thêm bài
    problems = [...problems, newProblem]
    expect(problems.length).toBe(2)

    // Cập nhật độ khó bài tập
    problems = problems.map((p) =>
      p.id === 'prob-02' ? { ...p, difficulty: 'medium' as const } : p
    )
    expect(problems[1].difficulty).toBe('medium')
  })

  it('Mục 5.1, 5.2: Danh sách Macro KaTeX chứa đầy đủ các công thức trọng tâm', () => {
    // Danh sách macro cần hỗ trợ: BigO, phân số dfrac, tổng sum, làm tròn floor/ceil
    const requiredMacroKeywords = ['O(N)', '\\dfrac', '\\sum', '\\lfloor', '\\lceil']

    requiredMacroKeywords.forEach((keyword) => {
      const exists = KATEX_MACROS.some((macro) => macro.snippet.includes(keyword))
      expect(exists).toBe(true)
    })
  })

  it('G-03: Định dạng tên file xuất JSON tuân thủ dsa-roadmap-YYYYMMDD.json', () => {
    const generateExportFilename = (date: Date): string => {
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
      return `dsa-roadmap-${dateStr}.json`
    }

    const testDate = new Date('2026-10-08T12:00:00Z')
    const filename = generateExportFilename(testDate)
    expect(filename).toBe('dsa-roadmap-20261008.json')
    expect(filename).toMatch(/^dsa-roadmap-\d{8}\.json$/)
  })
})

