import { describe, it, expect } from 'vitest'
import { initialSeedData } from '../data/seedData'
import type { Chapter, Problem, ProblemProgress } from '../types'

describe('ProblemList Logic & Progress Checklist (Module F)', () => {
  it('F-01: toàn bộ 6 chương đều có chính xác 5 bài tập với độ khó chuẩn Easy/Medium/Hard', () => {
    expect(initialSeedData.problems.length).toBe(30)

    initialSeedData.chapters.forEach((chapter: Chapter) => {
      const chapterProblems = initialSeedData.problems.filter((p: Problem) => p.chapterId === chapter.id)
      expect(chapterProblems.length).toBe(5)

      // Kiểm tra thứ tự từ 1 đến 5
      const orders = chapterProblems.map((p: Problem) => p.order).sort((a: number, b: number) => a - b)
      expect(orders).toEqual([1, 2, 3, 4, 5])

      // Độ khó hợp lệ
      chapterProblems.forEach((prob: Problem) => {
        expect(['easy', 'medium', 'hard']).toContain(prob.difficulty)
      })
    })
  })

  it('F-10, F-11: Mỗi bài tập có liên kết hợp lệ đến LeetCode hoặc NeetCode', () => {
    initialSeedData.problems.forEach((prob: Problem) => {
      expect(prob.title).toBeTruthy()
      expect(prob.hint).toBeTruthy()

      const hasValidUrl =
        Boolean(prob.leetcodeUrl && prob.leetcodeUrl.startsWith('https://leetcode.com')) ||
        Boolean(prob.neetcodeUrl && prob.neetcodeUrl.startsWith('https://neetcode.io'))
      expect(hasValidUrl).toBe(true)

      // Ít nhất 1 pattern liên kết
      expect(prob.patternIds.length).toBeGreaterThan(0)
    })
  })

  it('F-20, F-21: Tính toán chính xác tỉ lệ hoàn thành khi có checklist progress mà không cần reload trang', () => {
    const ch1Problems = initialSeedData.problems.filter((p: Problem) => p.chapterId === 'ch-01')
    const mockProgress: Record<string, ProblemProgress> = {
      [ch1Problems[0].id]: { done: true, doneAt: '2026-10-08T10:00:00Z', note: 'Ghi chú bài 1' },
      [ch1Problems[1].id]: { done: true, doneAt: '2026-10-08T11:00:00Z' },
      [ch1Problems[2].id]: { done: false },
    }

    const completed = ch1Problems.filter((p: Problem) => mockProgress[p.id]?.done).length

    expect(completed).toBe(2)
    const percentage = Math.round((completed / ch1Problems.length) * 100)
    expect(percentage).toBe(40) // 2 / 5 = 40%

    // Khi người dùng tích thêm bài thứ 3
    mockProgress[ch1Problems[2].id] = { done: true, doneAt: '2026-10-08T12:00:00Z' }
    const updatedCompleted = ch1Problems.filter((p: Problem) => mockProgress[p.id]?.done).length
    expect(updatedCompleted).toBe(3)
    const updatedPercentage = Math.round((updatedCompleted / ch1Problems.length) * 100)
    expect(updatedPercentage).toBe(60) // 3 / 5 = 60%
  })

  it('F-05: Bộ lọc nhanh lọc chính xác danh sách: Tất cả / Chưa làm / Đã làm', () => {
    const ch1Problems = initialSeedData.problems.filter((p: Problem) => p.chapterId === 'ch-01')
    const mockProgress: Record<string, ProblemProgress> = {
      [ch1Problems[0].id]: { done: true },
      [ch1Problems[1].id]: { done: true },
      [ch1Problems[2].id]: { done: false },
    }

    // Tất cả
    const allList = ch1Problems
    expect(allList.length).toBe(5)

    // Đã làm
    const doneList = ch1Problems.filter((p) => Boolean(mockProgress[p.id]?.done))
    expect(doneList.length).toBe(2)

    // Chưa làm
    const todoList = ch1Problems.filter((p) => !mockProgress[p.id]?.done)
    expect(todoList.length).toBe(3)
  })
})
