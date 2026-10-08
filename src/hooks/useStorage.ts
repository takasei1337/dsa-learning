import { useState, useEffect, useCallback } from 'react'
import { storageAdapter, type ImportResult } from '../services/storageAdapter'
import type { SeedData, UserProgress, UserSettings, ProblemProgress } from '../types'

export function useStorage() {
  const [content, setContent] = useState<SeedData>(() => storageAdapter.getContent())
  const [progress, setProgress] = useState<UserProgress>(() => storageAdapter.getProgress())
  const [settings, setSettings] = useState<UserSettings>(() => storageAdapter.getSettings())

  useEffect(() => {
    // Đảm bảo dữ liệu khởi tạo
    storageAdapter.ensureInitialized()

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; payload: unknown }>
      if (customEvent.detail) {
        const { key } = customEvent.detail
        if (key === 'content') setContent(storageAdapter.getContent())
        if (key === 'progress') setProgress(storageAdapter.getProgress())
        if (key === 'settings') setSettings(storageAdapter.getSettings())
      } else {
        // Tab khác thay đổi
        setContent(storageAdapter.getContent())
        setProgress(storageAdapter.getProgress())
        setSettings(storageAdapter.getSettings())
      }
    }

    window.addEventListener('dsa-storage-changed', handleStorageChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('dsa-storage-changed', handleStorageChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const toggleProblemDone = useCallback((problemId: string, note?: string): ProblemProgress => {
    const updated = storageAdapter.toggleProblemDone(problemId, note)
    setProgress(storageAdapter.getProgress())
    return updated
  }, [])

  const updateProblemNote = useCallback((problemId: string, note: string) => {
    storageAdapter.updateProblemNote(problemId, note)
    setProgress(storageAdapter.getProgress())
  }, [])

  const resetProgress = useCallback(() => {
    storageAdapter.resetProgress()
    setProgress({})
  }, [])

  const resetContent = useCallback((): SeedData => {
    const res = storageAdapter.resetContent()
    setContent(res)
    return res
  }, [])

  const saveContent = useCallback((newContent: SeedData) => {
    storageAdapter.saveContent(newContent)
    setContent(newContent)
  }, [])

  const updateSettings = useCallback((partial: Partial<UserSettings>): UserSettings => {
    const updated = storageAdapter.saveSettings(partial)
    setSettings(updated)
    return updated
  }, [])

  const exportJSON = useCallback((includeProgress: boolean = true): string => {
    return storageAdapter.exportContent(includeProgress)
  }, [])

  const importJSON = useCallback(
    (jsonString: string, mode: 'replace' | 'merge' = 'replace'): ImportResult => {
      const res = storageAdapter.importContent(jsonString, mode)
      if (res.success) {
        if (res.data) setContent(res.data)
        if (res.progress) setProgress(res.progress)
        if (res.settings) setSettings(res.settings)
      }
      return res
    },
    [],
  )

  const getStats = useCallback(
    (chapterId?: string) => {
      return storageAdapter.getProgressStats(chapterId)
    },
    [content, progress], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return {
    content,
    progress,
    settings,
    toggleProblemDone,
    updateProblemNote,
    resetProgress,
    resetContent,
    saveContent,
    updateSettings,
    exportJSON,
    importJSON,
    getStats,
  }
}

export default useStorage
