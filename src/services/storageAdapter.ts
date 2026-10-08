import type {
  SeedData,
  UserProgress,
  UserSettings,
  ProblemProgress,
  ExportPayload,
} from '../types'
import { initialSeedData } from '../data/seedData'

/**
 * 3 Khóa lưu trữ độc lập theo Mục 6.3 - SRS v1.0
 */
export const STORAGE_KEYS = {
  CONTENT: 'dsa.content.v1',
  PROGRESS: 'dsa.progress.v1',
  SETTINGS: 'dsa.settings.v1',
} as const

/**
 * Cấu hình người dùng mặc định
 */
export const DEFAULT_SETTINGS: UserSettings = {
  language: 'python',
  theme: 'dark',
  editMode: false,
  lineNumbers: true,
  macros: [],
}

export interface ImportResult {
  success: boolean
  message: string
  data?: SeedData
  progress?: UserProgress
  settings?: UserSettings
}

/**
 * StorageAdapter
 * Lớp bọc trung gian quản lý localStorage, xác thực schema,
 * cơ chế Migration nâng cấp phiên bản và fallback an toàn khi gặp lỗi.
 */
export class StorageAdapter {
  private static instance: StorageAdapter

  private constructor() {
    this.ensureInitialized()
  }

  public static getInstance(): StorageAdapter {
    if (!StorageAdapter.instance) {
      StorageAdapter.instance = new StorageAdapter()
    }
    return StorageAdapter.instance
  }

  /**
   * Tự động khởi tạo và nạp seedData nếu người dùng mở trang lần đầu
   */
  public ensureInitialized(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      // 1. Kiểm tra khóa Content
      const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT)
      if (!rawContent) {
        this.saveContent(initialSeedData)
      } else {
        // Kiểm tra tính toàn vẹn và migration nếu cần
        try {
          const parsed = JSON.parse(rawContent)
          if (!this.isValidContentSchema(parsed)) {
            console.warn('[StorageAdapter] Dữ liệu content lỗi schema, đang khôi phục SeedData...')
            const migrated = this.migrateContent(parsed)
            this.saveContent(migrated)
          }
        } catch (e) {
          console.error('[StorageAdapter] Content JSON hỏng, nạp lại SeedData gốc:', e)
          this.saveContent(initialSeedData)
        }
      }

      // 2. Kiểm tra khóa Progress
      const rawProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS)
      if (!rawProgress) {
        this.saveProgress({})
      }

      // 3. Kiểm tra khóa Settings
      const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (!rawSettings) {
        this.saveSettings(DEFAULT_SETTINGS)
      }
    } catch (err) {
      console.error('[StorageAdapter] Lỗi khởi tạo localStorage:', err)
    }
  }

  /* =====================================================================
   * 1. CONTENT APIs (dsa.content.v1)
   * ===================================================================== */

  public getContent(): SeedData {
    if (typeof window === 'undefined' || !window.localStorage) {
      return initialSeedData
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONTENT)
      if (!raw) {
        this.saveContent(initialSeedData)
        return initialSeedData
      }

      const parsed = JSON.parse(raw)
      if (!this.isValidContentSchema(parsed)) {
        return this.migrateContent(parsed)
      }

      return parsed as SeedData
    } catch (err) {
      console.error('[StorageAdapter] Không thể đọc content, sử dụng initialSeedData:', err)
      return initialSeedData
    }
  }

  public saveContent(data: SeedData): void {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data))
      this.notifyChange('content', data)
    } catch (err) {
      console.error('[StorageAdapter] Không thể lưu content vào localStorage:', err)
    }
  }

  public resetContent(): SeedData {
    this.saveContent(initialSeedData)
    return initialSeedData
  }

  /**
   * Xuất toàn bộ dữ liệu ra JSON (Phụ lục A.4)
   * Có tùy chọn xuất kèm tiến độ học (progress) và cấu hình (settings)
   */
  public exportContent(includeProgress: boolean = true): string {
    const content = this.getContent()
    const payload: ExportPayload = {
      ...content,
      exportedAt: new Date().toISOString(),
    }

    if (includeProgress) {
      payload.progress = this.getProgress()
      payload.settings = this.getSettings()
    }

    return JSON.stringify(payload, null, 2)
  }

  /**
   * Nhập dữ liệu từ chuỗi JSON với kiểm tra schema và migration
   */
  public importContent(
    jsonString: string,
    mode: 'replace' | 'merge' = 'replace',
  ): ImportResult {
    try {
      const parsed = JSON.parse(jsonString)
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Tệp JSON không hợp lệ hoặc rỗng.' }
      }

      // Xử lý migration nếu phiên bản cũ
      const migrated = this.migrateContent(parsed)

      let finalData: SeedData = migrated
      if (mode === 'merge') {
        const current = this.getContent()
        finalData = this.mergeSeedData(current, migrated)
      }

      this.saveContent(finalData)

      // Nếu tệp có chứa progress và người dùng nhập vào
      let importedProgress: UserProgress | undefined
      if (parsed.progress && typeof parsed.progress === 'object') {
        importedProgress = parsed.progress as UserProgress
        if (mode === 'merge') {
          const currentProgress = this.getProgress()
          this.saveProgress({ ...currentProgress, ...importedProgress })
        } else {
          this.saveProgress(importedProgress)
        }
      }

      // Nếu tệp có chứa settings
      let importedSettings: UserSettings | undefined
      if (parsed.settings && typeof parsed.settings === 'object') {
        const nextSettings: UserSettings = { ...DEFAULT_SETTINGS, ...parsed.settings }
        importedSettings = nextSettings
        this.saveSettings(nextSettings)
      }

      return {
        success: true,
        message: `Đã nạp thành công dữ liệu (${finalData.chapters.length} chương, ${finalData.problems.length} bài tập).`,
        data: finalData,
        progress: importedProgress,
        settings: importedSettings,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        message: `Lỗi đọc tệp JSON: ${message}`,
      }
    }
  }

  /* =====================================================================
   * 2. PROGRESS APIs (dsa.progress.v1)
   * ===================================================================== */

  public getProgress(): UserProgress {
    if (typeof window === 'undefined' || !window.localStorage) return {}
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS)
      if (!raw) return {}
      return JSON.parse(raw) as UserProgress
    } catch (err) {
      console.error('[StorageAdapter] Lỗi đọc progress:', err)
      return {}
    }
  }

  public saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
      this.notifyChange('progress', progress)
    } catch (err) {
      console.error('[StorageAdapter] Không thể lưu progress:', err)
    }
  }

  public getProblemProgress(problemId: string): ProblemProgress {
    const progress = this.getProgress()
    return progress[problemId] || { done: false }
  }

  /**
   * Đánh dấu hoặc bỏ đánh dấu bài tập đã hoàn thành (Module F3)
   */
  public toggleProblemDone(problemId: string, note?: string): ProblemProgress {
    const progress = this.getProgress()
    const current = progress[problemId] || { done: false }
    const updated: ProblemProgress = {
      done: !current.done,
      doneAt: !current.done ? new Date().toISOString() : undefined,
      note: note !== undefined ? note : current.note,
    }

    progress[problemId] = updated
    this.saveProgress(progress)
    return updated
  }

  public updateProblemNote(problemId: string, note: string): void {
    const progress = this.getProgress()
    const current = progress[problemId] || { done: false }
    progress[problemId] = {
      ...current,
      note,
    }
    this.saveProgress(progress)
  }

  public resetProgress(): void {
    this.saveProgress({})
  }

  public getProgressStats(chapterId?: string): {
    total: number
    completed: number
    percentage: number
  } {
    const content = this.getContent()
    const progress = this.getProgress()

    const targetProblems = chapterId
      ? content.problems.filter((p) => p.chapterId === chapterId)
      : content.problems

    const total = targetProblems.length
    if (total === 0) return { total: 0, completed: 0, percentage: 0 }

    const completed = targetProblems.filter((p) => progress[p.id]?.done).length
    const percentage = Math.round((completed / total) * 100)

    return { total, completed, percentage }
  }

  /* =====================================================================
   * 3. SETTINGS APIs (dsa.settings.v1)
   * ===================================================================== */

  public getSettings(): UserSettings {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_SETTINGS
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (!raw) return DEFAULT_SETTINGS
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    } catch (err) {
      console.error('[StorageAdapter] Lỗi đọc settings:', err)
      return DEFAULT_SETTINGS
    }
  }

  public saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings()
    const updated: UserSettings = {
      ...current,
      ...settings,
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated))
        this.notifyChange('settings', updated)
      } catch (err) {
        console.error('[StorageAdapter] Lỗi lưu settings:', err)
      }
    }
    return updated
  }

  public resetSettings(): UserSettings {
    return this.saveSettings(DEFAULT_SETTINGS)
  }

  /* =====================================================================
   * 4. SCHEMA VALIDATION & MIGRATION LOGIC (Mục 6.3)
   * ===================================================================== */

  /**
   * Kiểm tra tính hợp lệ cơ bản của dữ liệu Content
   */
  private isValidContentSchema(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false
    const d = data as Partial<SeedData>
    return (
      typeof d.schemaVersion === 'number' &&
      Array.isArray(d.chapters) &&
      d.chapters.length > 0 &&
      Array.isArray(d.problems)
    )
  }

  /**
   * Nâng cấp / Chuẩn hóa cấu trúc dữ liệu theo schema mới nhất
   */
  public migrateContent(raw: unknown): SeedData {
    if (!raw || typeof raw !== 'object') {
      console.warn('[StorageAdapter] Dữ liệu không hợp lệ, chuyển về initialSeedData.')
      return initialSeedData
    }

    const d = raw as Record<string, unknown>
    const currentVersion = typeof d.schemaVersion === 'number' ? d.schemaVersion : 0

    // Clone hoặc tạo khung cơ sở
    const migrated: SeedData = {
      schemaVersion: 1,
      exportedAt: typeof d.exportedAt === 'string' ? d.exportedAt : new Date().toISOString(),
      chapters: Array.isArray(d.chapters) ? (d.chapters as SeedData['chapters']) : initialSeedData.chapters,
      concepts: Array.isArray(d.concepts) ? (d.concepts as SeedData['concepts']) : initialSeedData.concepts,
      complexityRows: Array.isArray(d.complexityRows)
        ? (d.complexityRows as SeedData['complexityRows'])
        : initialSeedData.complexityRows,
      patterns: Array.isArray(d.patterns) ? (d.patterns as SeedData['patterns']) : initialSeedData.patterns,
      pitfalls: Array.isArray(d.pitfalls) ? (d.pitfalls as SeedData['pitfalls']) : initialSeedData.pitfalls,
      templates: Array.isArray(d.templates) ? (d.templates as SeedData['templates']) : initialSeedData.templates,
      problems: Array.isArray(d.problems) ? (d.problems as SeedData['problems']) : initialSeedData.problems,
    }

    if (currentVersion < 1) {
      console.info(`[StorageAdapter] Đã migrate schema từ phiên bản v${currentVersion} lên v1.`)
    }

    return migrated
  }

  /**
   * Hợp nhất dữ liệu hiện tại với dữ liệu nhập mới (Merge mode)
   */
  private mergeSeedData(base: SeedData, incoming: SeedData): SeedData {
    const mergeById = <T extends { id: string }>(baseList: T[], incomingList: T[]): T[] => {
      const map = new Map<string, T>()
      baseList.forEach((item) => map.set(item.id, item))
      incomingList.forEach((item) => map.set(item.id, item))
      return Array.from(map.values())
    }

    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      chapters: mergeById(base.chapters, incoming.chapters),
      concepts: mergeById(base.concepts, incoming.concepts),
      complexityRows: mergeById(base.complexityRows, incoming.complexityRows),
      patterns: mergeById(base.patterns, incoming.patterns),
      pitfalls: mergeById(base.pitfalls, incoming.pitfalls),
      templates: mergeById(base.templates, incoming.templates),
      problems: mergeById(base.problems, incoming.problems),
    }
  }

  /**
   * Phát sự kiện CustomEvent khi localStorage thay đổi để UI phản ứng ngay
   */
  private notifyChange(key: 'content' | 'progress' | 'settings', payload: unknown): void {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return
    try {
      const event = new CustomEvent('dsa-storage-changed', {
        detail: { key, payload },
      })
      window.dispatchEvent(event)
    } catch {
      // Bỏ qua nếu môi trường không hỗ trợ CustomEvent
    }
  }
}

export const storageAdapter = StorageAdapter.getInstance()
export default storageAdapter
