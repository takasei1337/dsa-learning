import { describe, it, expect } from 'vitest'
import { GROWTH_LEVEL_CONFIG } from './CoreConcepts'
import type { ComplexityLevel } from '../types'

describe('CoreConcepts & Growth Levels (Module C)', () => {
  it('định nghĩa đầy đủ 6 mức độ tăng trưởng với cấu hình màu chuẩn C-13', () => {
    const levels: ComplexityLevel[] = [
      'constant',
      'log',
      'linear',
      'linearithmic',
      'quadratic',
      'exponential',
    ]

    levels.forEach((lvl) => {
      const config = GROWTH_LEVEL_CONFIG[lvl]
      expect(config).toBeDefined()
      expect(config.name).toBeTruthy()
      expect(config.notation).toBeTruthy()
      expect(config.badgeClass).toBeTruthy()
      expect(config.dotClass).toBeTruthy()
    })
  })

  it('tô màu xanh lục cho O(1), vàng cho O(log N), cam cho O(N), đỏ cho O(N^2)', () => {
    // Xanh lục cho O(1)
    expect(GROWTH_LEVEL_CONFIG.constant.badgeClass).toContain('emerald')

    // Vàng cho O(log N)
    expect(GROWTH_LEVEL_CONFIG.log.badgeClass).toContain('yellow')

    // Cam cho O(N)
    expect(GROWTH_LEVEL_CONFIG.linear.badgeClass).toContain('orange')

    // Đỏ cho O(N^2)
    expect(GROWTH_LEVEL_CONFIG.quadratic.badgeClass).toContain('rose')
  })
})
