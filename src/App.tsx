import React, { useState, useEffect, useRef } from 'react'
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
} from 'lucide-react'
import { useStorage } from './hooks/useStorage'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { ChapterNavigation } from './components/ChapterNavigation'
import { CoreConcepts } from './components/CoreConcepts'
import { PatternRecognition } from './components/PatternRecognition'
import { AlgorithmicTemplates } from './components/AlgorithmicTemplates'
import { ProblemList } from './components/ProblemList'
import { MathView } from './components/MathView'
import {
  ChapterModal,
  ConceptModal,
  ComplexityRowModal,
  PatternModal,
  PitfallModal,
  ProblemModal,
  ConfirmDeleteModal,
} from './components/CrudModals'
import type {
  Chapter,
  Concept,
  ComplexityRow,
  Pattern,
  Pitfall,
  Problem,
} from './types'

export const App: React.FC = () => {
  const {
    content,
    progress,
    settings,
    toggleProblemDone,
    updateProblemNote,
    updateSettings,
    resetContent,
    resetProgress,
    saveContent,
    exportJSON,
    importJSON,
    getStats,
  } = useStorage()

  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-01')
  const [highlightedTemplateId, setHighlightedTemplateId] = useState<string | null>(null)
  const [showDataModal, setShowDataModal] = useState<boolean>(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chapterHeadingRef = useRef<HTMLHeadingElement>(null)

  // CRUD Modals state management (Module G)
  const [chapterModalState, setChapterModalState] = useState<{
    isOpen: boolean
    data: Partial<Chapter> | null
  }>({ isOpen: false, data: null })

  const [conceptModalState, setConceptModalState] = useState<{
    isOpen: boolean
    data: Partial<Concept> | null
  }>({ isOpen: false, data: null })

  const [complexityRowModalState, setComplexityRowModalState] = useState<{
    isOpen: boolean
    data: Partial<ComplexityRow> | null
  }>({ isOpen: false, data: null })

  const [patternModalState, setPatternModalState] = useState<{
    isOpen: boolean
    data: Partial<Pattern> | null
  }>({ isOpen: false, data: null })

  const [pitfallModalState, setPitfallModalState] = useState<{
    isOpen: boolean
    data: Partial<Pitfall> | null
  }>({ isOpen: false, data: null })

  const [problemModalState, setProblemModalState] = useState<{
    isOpen: boolean
    data: Partial<Problem> | null
  }>({ isOpen: false, data: null })

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  // A-03: Đồng bộ URL hash và hỗ trợ nút Back/Forward của trình duyệt
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace(/^#\/?(chuong\/)?/, '')
      if (!hash) return

      const matchedChapter = content.chapters.find(
        (c) => c.slug === hash || c.id === hash,
      )
      if (matchedChapter) {
        setSelectedChapterId(matchedChapter.id)
      }
    }

    // Kiểm tra hash ban đầu khi tải trang
    handleHashSync()

    window.addEventListener('hashchange', handleHashSync)
    window.addEventListener('popstate', handleHashSync)
    return () => {
      window.removeEventListener('hashchange', handleHashSync)
      window.removeEventListener('popstate', handleHashSync)
    }
  }, [content.chapters])

  // A-03 & B-04: Chuyển chương không tải lại trang, cuộn mượt về đầu hoặc cuộn tới phần tử được chọn
  const handleSelectChapter = (chapterId: string, targetElementId?: string) => {
    setSelectedChapterId(chapterId)
    const targetChapter = content.chapters.find((c) => c.id === chapterId)
    if (targetChapter) {
      window.history.pushState(null, '', `#/chuong/${targetChapter.slug}`)
    }
    if (targetElementId) {
      setTimeout(() => {
        const el = document.getElementById(targetElementId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('ring-2', 'ring-indigo-500', 'transition-all')
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-indigo-500')
          }, 2000)
        }
      }, 150)
    } else {
      // B-04: Cuộn mượt về đầu trang và focus vào tiêu đề chương
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        chapterHeadingRef.current?.focus()
      }, 100)
    }
  }

  const currentChapter =
    content.chapters.find((c) => c.id === selectedChapterId) ||
    content.chapters[0] || {
      id: 'ch-01',
      slug: 'arrays-and-hashing',
      title: 'Arrays & Hashing',
      summary: '',
      order: 1,
    }

  const currentConcepts = content.concepts.filter((c) => c.chapterId === currentChapter.id)
  const currentComplexities = content.complexityRows.filter(
    (c) => c.chapterId === currentChapter.id,
  )
  const currentPatterns = content.patterns.filter((p) => p.chapterId === currentChapter.id)
  const currentPitfalls = content.pitfalls.filter((p) => p.chapterId === currentChapter.id)
  const currentTemplates = content.templates.filter((t) => t.chapterId === currentChapter.id)
  const currentProblems = content.problems.filter((p) => p.chapterId === currentChapter.id)

  const overallStats = getStats()
  const chapterStats = getStats(currentChapter.id)

  // Điều hướng mượt và highlight template tương ứng khi click từ Pattern (E-03)
  const handleNavigateToTemplate = (patternId: string) => {
    const tpl = currentTemplates.find((t) => t.patternId === patternId) || currentTemplates[0]
    if (tpl) {
      setHighlightedTemplateId(tpl.id)
      const el = document.getElementById(`template-${tpl.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => {
        setHighlightedTemplateId(null)
      }, 2500)
    }
  }

  const handleExport = () => {
    const jsonStr = exportJSON(true)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    a.href = url
    a.download = `dsa-roadmap-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        const res = importJSON(result, importMode)
        setImportStatus(res.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // =========================================================================
  // CRUD HANDLERS (Module G)
  // =========================================================================
  const handleSaveChapter = (chapter: Chapter) => {
    const existingIndex = content.chapters.findIndex((c) => c.id === chapter.id)
    let updatedChapters: Chapter[]
    if (existingIndex >= 0) {
      updatedChapters = content.chapters.map((c) => (c.id === chapter.id ? chapter : c))
    } else {
      updatedChapters = [...content.chapters, chapter]
    }
    saveContent({ ...content, chapters: updatedChapters })
    setSelectedChapterId(chapter.id)
  }

  const handleDeleteChapter = (chapter: Chapter) => {
    setDeleteModalState({
      isOpen: true,
      title: `Xóa chương "${chapter.title}"?`,
      message: `Hành động này sẽ xóa chương và toàn bộ khái niệm, bảng độ phức tạp, dạng bài, bẫy và bài tập thuộc chương này. Thao tác không thể khôi phục.`,
      onConfirm: () => {
        const remainingChapters = content.chapters.filter((c) => c.id !== chapter.id)
        const updatedContent = {
          ...content,
          chapters: remainingChapters,
          concepts: content.concepts.filter((c) => c.chapterId !== chapter.id),
          complexityRows: content.complexityRows.filter((r) => r.chapterId !== chapter.id),
          patterns: content.patterns.filter((p) => p.chapterId !== chapter.id),
          pitfalls: content.pitfalls.filter((pf) => pf.chapterId !== chapter.id),
          templates: content.templates.filter((t) => t.chapterId !== chapter.id),
          problems: content.problems.filter((pr) => pr.chapterId !== chapter.id),
        }
        saveContent(updatedContent)
        if (remainingChapters.length > 0) {
          setSelectedChapterId(remainingChapters[0].id)
        }
      },
    })
  }

  const handleSaveConcept = (concept: Concept) => {
    const existingIndex = content.concepts.findIndex((c) => c.id === concept.id)
    let updatedConcepts: Concept[]
    if (existingIndex >= 0) {
      updatedConcepts = content.concepts.map((c) => (c.id === concept.id ? concept : c))
    } else {
      updatedConcepts = [...content.concepts, concept]
    }
    saveContent({ ...content, concepts: updatedConcepts })
  }

  const handleDeleteConcept = (concept: Concept) => {
    setDeleteModalState({
      isOpen: true,
      title: `Xóa khái niệm "${concept.title}"?`,
      message: `Bạn có chắc muốn xóa mục khái niệm này không?`,
      onConfirm: () => {
        saveContent({
          ...content,
          concepts: content.concepts.filter((c) => c.id !== concept.id),
        })
      },
    })
  }

  const handleSaveComplexityRow = (row: ComplexityRow) => {
    const existingIndex = content.complexityRows.findIndex((r) => r.id === row.id)
    let updatedRows: ComplexityRow[]
    if (existingIndex >= 0) {
      updatedRows = content.complexityRows.map((r) => (r.id === row.id ? row : r))
    } else {
      updatedRows = [...content.complexityRows, row]
    }
    saveContent({ ...content, complexityRows: updatedRows })
  }

  const handleDeleteComplexityRow = (row: ComplexityRow) => {
    setDeleteModalState({
      isOpen: true,
      title: `Xóa dòng độ phức tạp "${row.operation}"?`,
      message: `Bạn có chắc muốn xóa dòng thao tác này khỏi bảng không?`,
      onConfirm: () => {
        saveContent({
          ...content,
          complexityRows: content.complexityRows.filter((r) => r.id !== row.id),
        })
      },
    })
  }

  const handleSavePattern = (pattern: Pattern) => {
    const existingIndex = content.patterns.findIndex((p) => p.id === pattern.id)
    let updatedPatterns: Pattern[]
    if (existingIndex >= 0) {
      updatedPatterns = content.patterns.map((p) => (p.id === pattern.id ? pattern : p))
    } else {
      updatedPatterns = [...content.patterns, pattern]
    }
    saveContent({ ...content, patterns: updatedPatterns })
  }

  const handleDeletePattern = (pattern: Pattern) => {
    setDeleteModalState({
      isOpen: true,
      title: `Xóa dạng bài "${pattern.name}"?`,
      message: `Bạn có chắc muốn xóa dạng bài này không?`,
      onConfirm: () => {
        saveContent({
          ...content,
          patterns: content.patterns.filter((p) => p.id !== pattern.id),
        })
      },
    })
  }

  const handleSavePitfall = (pitfall: Pitfall) => {
    const existingIndex = content.pitfalls.findIndex((pf) => pf.id === pitfall.id)
    let updatedPitfalls: Pitfall[]
    if (existingIndex >= 0) {
      updatedPitfalls = content.pitfalls.map((pf) => (pf.id === pitfall.id ? pitfall : pf))
    } else {
      updatedPitfalls = [...content.pitfalls, pitfall]
    }
    saveContent({ ...content, pitfalls: updatedPitfalls })
  }

  const handleDeletePitfall = (pitfall: Pitfall) => {
    setDeleteModalState({
      isOpen: true,
      title: `Xóa bẫy "${pitfall.title}"?`,
      message: `Bạn có chắc muốn xóa bẫy/thủ thuật này không?`,
      onConfirm: () => {
        saveContent({
          ...content,
          pitfalls: content.pitfalls.filter((pf) => pf.id !== pitfall.id),
        })
      },
    })
  }

  const handleSaveProblem = (problem: Problem) => {
    const existingIndex = content.problems.findIndex((pr) => pr.id === problem.id)
    let updatedProblems: Problem[]
    if (existingIndex >= 0) {
      updatedProblems = content.problems.map((pr) => (pr.id === problem.id ? problem : pr))
    } else {
      updatedProblems = [...content.problems, problem]
    }
    saveContent({ ...content, problems: updatedProblems })
  }

  const handleDeleteProblem = (problem: Problem) => {
    setDeleteModalState({
      isOpen: true,
      title: `Xóa bài tập "${problem.title}"?`,
      message: `Bạn có chắc muốn xóa bài tập này khỏi chương không?`,
      onConfirm: () => {
        saveContent({
          ...content,
          problems: content.problems.filter((pr) => pr.id !== problem.id),
        })
      },
    })
  }



  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* 1. Header (Mục 7.1 & Module A) */}
      <Header
        settings={settings}
        onUpdateSettings={updateSettings}
        content={content}
        progress={progress}
        onSelectChapter={handleSelectChapter}
        onOpenDataModal={() => {
          setImportStatus(null)
          setShowDataModal(true)
        }}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(true)}
        overallStats={overallStats}
      />

      {/* 2. Main Layout với Sidebar (Module A) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Menu (A-01 -> A-10) */}
        <Sidebar
          chapters={content.chapters}
          activeChapterId={currentChapter.id}
          onSelectChapter={handleSelectChapter}
          getChapterStats={(chId) => getStats(chId)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          editMode={settings.editMode}
          onAddChapter={() => setChapterModalState({ isOpen: true, data: null })}
          onEditChapter={(ch) => setChapterModalState({ isOpen: true, data: ch })}
          onDeleteChapter={handleDeleteChapter}
        />

        {/* Vùng nội dung chính */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Banner Thông Tin Chương */}
          <div className="chapter-banner rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-[#0f172a] p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                Chương {currentChapter.order} / {content.chapters.length} • {currentChapter.slug}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">
                  Tiến độ: <strong className="text-emerald-400">{chapterStats.completed}/{chapterStats.total}</strong> ({chapterStats.percentage}%)
                </span>
              </div>
            </div>
            <h2
              ref={chapterHeadingRef}
              tabIndex={-1}
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight focus:outline-none"
            >
              {currentChapter.title}
            </h2>
            <div className="mt-2 text-sm text-slate-300 leading-relaxed">
              <MathView math={currentChapter.summary} />
            </div>
          </div>

          {/* 1. Module C: Khái Niệm Cốt Lõi & Bảng Độ Phức Tạp 5 Cột (C-01 -> C-13) */}
          <CoreConcepts
            concepts={currentConcepts}
            complexityRows={currentComplexities}
            editMode={settings.editMode}
            onAddConcept={() => setConceptModalState({ isOpen: true, data: null })}
            onEditConcept={(c) => setConceptModalState({ isOpen: true, data: c })}
            onDeleteConcept={handleDeleteConcept}
            onAddComplexityRow={() => setComplexityRowModalState({ isOpen: true, data: null })}
            onEditComplexityRow={(r) => setComplexityRowModalState({ isOpen: true, data: r })}
            onDeleteComplexityRow={handleDeleteComplexityRow}
          />

          {/* 2. Module D: Dạng Bài & Bẫy Thường Gặp (Pattern Recognition & Pitfalls D-01 -> D-11) */}
          <PatternRecognition
            patterns={currentPatterns}
            pitfalls={currentPitfalls}
            onNavigateToTemplate={handleNavigateToTemplate}
            editMode={settings.editMode}
            onAddPattern={() => setPatternModalState({ isOpen: true, data: null })}
            onEditPattern={(p) => setPatternModalState({ isOpen: true, data: p })}
            onDeletePattern={handleDeletePattern}
            onAddPitfall={() => setPitfallModalState({ isOpen: true, data: null })}
            onEditPitfall={(pf) => setPitfallModalState({ isOpen: true, data: pf })}
            onDeletePitfall={handleDeletePitfall}
          />

          {/* 3. Module E: Khung Giải Thuật Mẫu (Algorithmic Templates E-01 -> E-32) */}
          <AlgorithmicTemplates
            templates={currentTemplates}
            patterns={currentPatterns}
            globalLanguage={settings.language}
            onLanguageChange={(lang) => updateSettings({ language: lang })}
            highlightedTemplateId={highlightedTemplateId}
          />

          {/* 4. Module F: Bài Tập Trọng Tâm & Checklist (Problems & Progress F-01 -> F-31) */}
          <ProblemList
            problems={currentProblems}
            patterns={currentPatterns}
            progress={progress}
            onToggleProblem={toggleProblemDone}
            onUpdateNote={updateProblemNote}
            editMode={settings.editMode}
            onAddProblem={() => setProblemModalState({ isOpen: true, data: null })}
            onEditProblem={(prob) => setProblemModalState({ isOpen: true, data: prob })}
            onDeleteProblem={handleDeleteProblem}
          />

          {/* Module B: Điều hướng Next / Previous Chapter (B-01, B-02, B-03, B-04, B-05) */}
          <ChapterNavigation
            chapters={content.chapters}
            currentChapter={currentChapter}
            onSelectChapter={handleSelectChapter}
          />
        </main>
      </div>

      {/* Storage Management Modal */}
      {showDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowDataModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Quản lý Dữ liệu Học tập</h3>
                <p className="text-xs text-slate-400">
                  Lưu trữ an toàn trên trình duyệt của bạn (Local Storage)
                </p>
              </div>
            </div>

            {importStatus && (
              <div className="p-3 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="space-y-4 pt-2">
              {/* Sao lưu & Phục hồi dữ liệu */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-200">
                  Sao lưu & Phục hồi dữ liệu
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition cursor-pointer shadow-sm"
                    title="Tải tệp sao lưu dsa-roadmap-YYYYMMDD.json về máy"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Sao lưu ra file (.json)</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition cursor-pointer shadow-sm"
                    title="Chọn tệp sao lưu từ máy để phục hồi"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>Phục hồi từ file backup</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".json,application/json"
                    className="hidden"
                  />
                </div>

                {/* Chế độ nhập dữ liệu: Ghi đè hoặc Gộp */}
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <span className="text-slate-400 text-[11px]">Chế độ nhập khi chọn file:</span>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setImportMode('replace')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        importMode === 'replace'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Ghi đè (Replace)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportMode('merge')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        importMode === 'merge'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Gộp (Merge)
                    </button>
                  </div>
                </div>
              </div>

              {/* Khôi phục & Đặt lại */}
              <div className="border-t border-slate-800/80 pt-3 space-y-2">
                <div className="text-xs font-semibold text-slate-300 px-1">
                  Khôi phục & Đặt lại
                </div>

                <button
                  onClick={() => {
                    setDeleteModalState({
                      isOpen: true,
                      title: 'Khôi phục giáo trình mặc định?',
                      message:
                        'Toàn bộ các chương, khái niệm, bảng độ phức tạp, dạng bài, bẫy và bài tập đã chỉnh sửa sẽ được đặt lại về phiên bản chuẩn của khóa học. Bạn có chắc chắn muốn thực hiện?',
                      onConfirm: () => {
                        resetContent()
                        setImportStatus('Đã khôi phục giáo trình gốc thành công!')
                      },
                    })
                  }}
                  title="Đặt lại toàn bộ nội dung lý thuyết và bài tập về phiên bản chuẩn của khóa học"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-900/40 text-xs text-slate-300 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-indigo-400" />
                    <span>Khôi phục giáo trình gốc</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Giáo trình gốc</span>
                </button>

                <button
                  onClick={() => {
                    setDeleteModalState({
                      isOpen: true,
                      title: 'Xóa toàn bộ tiến độ làm bài?',
                      message:
                        'Toàn bộ đánh dấu hoàn thành bài tập và ghi chú cá nhân của bạn sẽ bị đặt lại về trạng thái ban đầu. Bạn có chắc chắn muốn xóa?',
                      onConfirm: () => {
                        resetProgress()
                        setImportStatus('Đã xóa toàn bộ tiến độ làm bài thành công!')
                      },
                    })
                  }}
                  title="Đặt lại trạng thái chưa hoàn thành cho tất cả bài tập và xóa các ghi chú cá nhân"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/40 text-xs text-slate-300 hover:text-rose-300 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-400" />
                    <span>Xóa toàn bộ tiến độ làm bài</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Xóa tiến độ</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowDataModal(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * CRUD MODALS (Module G - In-line Editing System)
       * ========================================================================= */}
      {/* 1. Modal Chương (A-04, A-05) */}
      <ChapterModal
        isOpen={chapterModalState.isOpen}
        initialData={chapterModalState.data}
        onClose={() => setChapterModalState({ isOpen: false, data: null })}
        onSave={handleSaveChapter}
      />

      {/* 2. Modal Khái niệm (C-03, C-04) */}
      <ConceptModal
        isOpen={conceptModalState.isOpen}
        chapterId={currentChapter.id}
        initialData={conceptModalState.data}
        onClose={() => setConceptModalState({ isOpen: false, data: null })}
        onSave={handleSaveConcept}
      />

      {/* 3. Modal Dòng độ phức tạp (C-03, C-04) */}
      <ComplexityRowModal
        isOpen={complexityRowModalState.isOpen}
        chapterId={currentChapter.id}
        initialData={complexityRowModalState.data}
        onClose={() => setComplexityRowModalState({ isOpen: false, data: null })}
        onSave={handleSaveComplexityRow}
      />

      {/* 4. Modal Dạng bài (D-03) */}
      <PatternModal
        isOpen={patternModalState.isOpen}
        chapterId={currentChapter.id}
        initialData={patternModalState.data}
        onClose={() => setPatternModalState({ isOpen: false, data: null })}
        onSave={handleSavePattern}
      />

      {/* 5. Modal Bẫy & Thủ thuật (D-12) */}
      <PitfallModal
        isOpen={pitfallModalState.isOpen}
        chapterId={currentChapter.id}
        patterns={currentPatterns}
        initialData={pitfallModalState.data}
        onClose={() => setPitfallModalState({ isOpen: false, data: null })}
        onSave={handleSavePitfall}
      />

      {/* 6. Modal Bài tập (F-03, F-04: kèm validate URL LeetCode/NeetCode) */}
      <ProblemModal
        isOpen={problemModalState.isOpen}
        chapterId={currentChapter.id}
        patterns={currentPatterns}
        initialData={problemModalState.data}
        onClose={() => setProblemModalState({ isOpen: false, data: null })}
        onSave={handleSaveProblem}
      />

      {/* 7. Modal Xác nhận xóa an toàn (A-06, C-05, D-12) */}
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteModalState.onConfirm}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-4 text-center text-xs text-slate-500">
        <p>
          Hệ thống Kiến Thức Thuật Toán Ứng Dụng
        </p>
      </footer>
    </div>
  )
}

export default App
