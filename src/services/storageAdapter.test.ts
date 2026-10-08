import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { storageAdapter, STORAGE_KEYS, DEFAULT_SETTINGS } from './storageAdapter'
import { initialSeedData } from '../data/seedData'

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

describe('StorageAdapter', () => {
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
    localStorage.clear()
    storageAdapter.ensureInitialized()
  })

  it('nên tự động nạp initialSeedData vào dsa.content.v1 khi mở trang lần đầu', () => {
    const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT)
    expect(rawContent).not.toBeNull()

    const content = storageAdapter.getContent()
    expect(content.chapters.length).toBe(6)
    expect(content.problems.length).toBe(30)
    expect(content.schemaVersion).toBe(1)
  })

  it('nên khởi tạo khóa dsa.progress.v1 và dsa.settings.v1', () => {
    const rawProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS)

    expect(rawProgress).toBe('{}')
    expect(JSON.parse(rawSettings!)).toEqual(DEFAULT_SETTINGS)
  })

  it('nên ghi nhận và chuyển đổi trạng thái hoàn thành bài tập (toggleProblemDone)', () => {
    const probId = 'prob-01-217' // Contains Duplicate

    // Ban đầu chưa làm
    expect(storageAdapter.getProblemProgress(probId).done).toBe(false)

    // Đánh dấu hoàn thành
    const updated = storageAdapter.toggleProblemDone(probId, 'Đã hiểu thuật toán HashSet')
    expect(updated.done).toBe(true)
    expect(updated.doneAt).toBeDefined()
    expect(updated.note).toBe('Đã hiểu thuật toán HashSet')

    // Kiểm tra trong localStorage
    const savedProgress = storageAdapter.getProgress()
    expect(savedProgress[probId].done).toBe(true)

    // Bỏ đánh dấu
    const undone = storageAdapter.toggleProblemDone(probId)
    expect(undone.done).toBe(false)
  })

  it('nên tính toán thống kê tiến độ chính xác', () => {
    storageAdapter.toggleProblemDone('prob-01-217')
    storageAdapter.toggleProblemDone('prob-01-1')

    const ch1Stats = storageAdapter.getProgressStats('ch-01')
    expect(ch1Stats.total).toBe(5)
    expect(ch1Stats.completed).toBe(2)
    expect(ch1Stats.percentage).toBe(40)

    const allStats = storageAdapter.getProgressStats()
    expect(allStats.total).toBe(30)
    expect(allStats.completed).toBe(2)
    expect(allStats.percentage).toBe(7)
  })

  it('nên cập nhật và lưu trữ cài đặt người dùng (saveSettings)', () => {
    storageAdapter.saveSettings({ language: 'cpp', theme: 'light' })

    const settings = storageAdapter.getSettings()
    expect(settings.language).toBe('cpp')
    expect(settings.theme).toBe('light')
  })

  it('nên xuất và nhập dữ liệu JSON đúng chuẩn Phụ lục A.4', () => {
    storageAdapter.toggleProblemDone('prob-01-217')
    const exportedJson = storageAdapter.exportContent(true)

    const parsed = JSON.parse(exportedJson)
    expect(parsed.schemaVersion).toBe(1)
    expect(parsed.exportedAt).toBeDefined()
    expect(parsed.chapters.length).toBe(6)
    expect(parsed.progress['prob-01-217'].done).toBe(true)

    // Giả lập xóa dữ liệu và nhập lại
    localStorage.clear()
    const importRes = storageAdapter.importContent(exportedJson, 'replace')
    expect(importRes.success).toBe(true)

    const restoredProgress = storageAdapter.getProgress()
    expect(restoredProgress['prob-01-217']?.done).toBe(true)
  })

  it('hàm migration nên tự động chuẩn hóa và khôi phục dữ liệu hợp lệ nếu schema v0', () => {
    const legacyRaw = {
      schemaVersion: 0,
      chapters: [initialSeedData.chapters[0]],
      problems: [initialSeedData.problems[0]],
    }

    const migrated = storageAdapter.migrateContent(legacyRaw)
    expect(migrated.schemaVersion).toBe(1)
    expect(migrated.chapters.length).toBe(1)
    expect(migrated.concepts).toBeDefined()
    expect(migrated.templates).toBeDefined()
  })
})
