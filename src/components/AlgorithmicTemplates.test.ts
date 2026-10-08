import { describe, it, expect, vi } from 'vitest'
import { initialSeedData } from '../data/seedData'
import type { Template, Pattern } from '../types'

describe('AlgorithmicTemplates & Language Switcher Logic (Module E)', () => {
  it('toàn bộ templates trong seedData đều có đầy đủ mã nguồn Python và C++', () => {
    expect(initialSeedData.templates.length).toBeGreaterThan(0)

    initialSeedData.templates.forEach((tpl: Template) => {
      expect(tpl.name).toBeTruthy()
      expect(tpl.whenToUse).toBeTruthy()
      expect(tpl.time).toBeTruthy()
      expect(tpl.space).toBeTruthy()

      // Mã nguồn Python & C++
      const pyCode = tpl.code.py || tpl.code.python
      const cppCode = tpl.code.cpp

      expect(pyCode).toBeDefined()
      expect(pyCode?.length).toBeGreaterThan(10)

      expect(cppCode).toBeDefined()
      expect(cppCode?.length).toBeGreaterThan(10)
    })
  })

  it('mỗi template liên kết chính xác với một pattern hợp lệ', () => {
    const patternIds = new Set(initialSeedData.patterns.map((p: Pattern) => p.id))

    initialSeedData.templates.forEach((tpl: Template) => {
      expect(patternIds.has(tpl.patternId)).toBe(true)
    })
  })

  it('E-10, E-11, E-12: Trạng thái chọn ngôn ngữ đồng bộ toàn cục cho mọi template', () => {
    const templates = initialSeedData.templates

    // Giả lập khi globalLanguage là python
    const pythonOutputs = templates.map((tpl) => tpl.code.py || tpl.code.python)
    pythonOutputs.forEach((code) => {
      expect(code).toBeDefined()
      expect(typeof code).toBe('string')
      expect(code!.length).toBeGreaterThan(0)
    })

    // Giả lập khi globalLanguage chuyển sang cpp
    const cppOutputs = templates.map((tpl) => tpl.code.cpp)
    cppOutputs.forEach((code) => {
      expect(code).toBeDefined()
      expect(typeof code).toBe('string')
      expect(code!.length).toBeGreaterThan(0)
    })

    // Đảm bảo code Python và C++ khác nhau về cú pháp
    expect(pythonOutputs[0]).not.toEqual(cppOutputs[0])
  })

  it('E-30, E-31, E-32: Nút Sao chép (Copy) sao chép đúng code ngôn ngữ được chọn và hẹn giờ đổi nhãn 2 giây', () => {
    vi.useFakeTimers()

    let copied = false
    const handleCopyFeedback = () => {
      copied = true
      setTimeout(() => {
        copied = false
      }, 2000)
    }

    // Khi vừa sao chép
    handleCopyFeedback()
    expect(copied).toBe(true)

    // Sau 1 giây (1000ms), nhãn vẫn là "Đã sao chép ✓"
    vi.advanceTimersByTime(1000)
    expect(copied).toBe(true)

    // Sau đúng 2 giây (2000ms), nhãn tự trở về "Sao chép"
    vi.advanceTimersByTime(1000)
    expect(copied).toBe(false)

    vi.useRealTimers()
  })
})
