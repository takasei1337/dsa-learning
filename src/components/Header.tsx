import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Moon,
  Sun,
  Edit3,
  CheckCircle2,
  Menu,
  Database,
  BookOpen,
  Code2,
  ListTodo,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import type { UserSettings, SeedData, UserProgress } from '../types'
import { matchesSearch, matchesAny } from '../utils/textUtils'

export interface HeaderProps {
  settings: UserSettings
  onUpdateSettings: (partial: Partial<UserSettings>) => void
  content: SeedData
  progress: UserProgress
  onSelectChapter: (chapterId: string, targetElementId?: string) => void
  onOpenDataModal: () => void
  onToggleSidebarMobile: () => void
  overallStats: { total: number; completed: number; percentage: number }
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  content,
  onSelectChapter,
  onOpenDataModal,
  onToggleSidebarMobile,
  overallStats,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Bắt phím tắt Ctrl+K, Cmd+K hoặc phím '/' để mở ô tìm kiếm nhanh (D-04, NFR-08)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable)

      // 1. Phím tắt Ctrl+K hoặc Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (window.innerWidth < 640) {
          setIsMobileSearchActive(true)
          setTimeout(() => mobileSearchInputRef.current?.focus(), 50)
        } else {
          searchInputRef.current?.focus()
          setIsSearchOpen(true)
        }
        return
      }

      // 2. Phím tắt '/' (Slash) khi không gõ text ở input/textarea khác
      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        if (window.innerWidth < 640) {
          setIsMobileSearchActive(true)
          setTimeout(() => mobileSearchInputRef.current?.focus(), 50)
        } else {
          searchInputRef.current?.focus()
          setIsSearchOpen(true)
        }
        return
      }

      // 3. Phím Escape để thoát tìm kiếm
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileSearchActive(false)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lọc kết quả tìm kiếm thông minh: Tự động loại bỏ dấu tiếng Việt (D-04, NFR-08)
  const trimmed = searchQuery.trim()

  // 1. Tìm theo Chương (title, slug, summary)
  const matchingChapters = trimmed
    ? content.chapters.filter(
        (c) =>
          matchesSearch(c.title, trimmed) ||
          matchesSearch(c.slug, trimmed) ||
          matchesSearch(c.summary, trimmed)
      )
    : []

  // 2. Tìm theo Dạng bài (Pattern): name, description, keywords, examplePhrases
  const matchingPatterns = trimmed
    ? content.patterns.filter(
        (p) =>
          matchesSearch(p.name, trimmed) ||
          matchesSearch(p.description, trimmed) ||
          matchesAny(p.keywords, trimmed) ||
          matchesAny(p.examplePhrases, trimmed)
      )
    : []

  // 3. Tìm theo Bài tập (Problem): title, hint, difficulty
  const matchingProblems = trimmed
    ? content.problems.filter(
        (p) =>
          matchesSearch(p.title, trimmed) ||
          matchesSearch(p.hint, trimmed) ||
          matchesSearch(p.difficulty, trimmed)
      )
    : []

  const totalResults =
    matchingChapters.length + matchingPatterns.length + matchingProblems.length

  const handleSelectResult = (chapterId: string, targetElementId?: string) => {
    onSelectChapter(chapterId, targetElementId)
    setIsSearchOpen(false)
    setIsMobileSearchActive(false)
    setSearchQuery('')
  }

  // Đổi theme Sáng / Tối với GPU View Transitions mượt mà 60fps
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark'

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      ;(document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        if (nextTheme === 'light') {
          document.documentElement.classList.add('light')
          document.documentElement.classList.remove('dark')
        } else {
          document.documentElement.classList.add('dark')
          document.documentElement.classList.remove('light')
        }
        onUpdateSettings({ theme: nextTheme })
      })
    } else {
      onUpdateSettings({ theme: nextTheme })
    }
  }

  // Áp dụng class theme vào thẻ html
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [settings.theme])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + App Branding */}
        <div className="flex items-center gap-3">
          {/* Nút mở Drawer Menu trên Mobile / Tablet (A-09) */}
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Mở danh sách chương"
            aria-label="Mở Sidebar danh sách chương"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Tên website */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 select-none">
              <span className="font-black text-lg text-white font-mono leading-none">D</span>
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                DSA Learning
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Search với phím tắt Ctrl+K hoặc '/' (D-04, NFR-08) */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Tìm theo keywords, dạng bài, tên bài... (Ctrl+K hoặc /)"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-20 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {/* Phím tắt visual badges (Ctrl+K và /) */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd
                className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono select-none"
                title="Phím tắt Ctrl+K"
              >
                Ctrl+K
              </kbd>
              <kbd
                className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono select-none"
                title="Phím tắt /"
              >
                /
              </kbd>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && trimmed && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto space-y-2 text-xs">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span>
                  Tìm thấy <strong className="text-white">{totalResults}</strong> kết quả cho &quot;{searchQuery}&quot;
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Hỗ trợ không dấu</span>
              </div>

              {totalResults === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs space-y-1">
                  <p>Không tìm thấy kết quả nào phù hợp.</p>
                  <p className="text-[11px] text-slate-600">
                    Thử tìm bằng từ khóa nhận dạng: "2 con trỏ", "cửa sổ", "ngăn xếp", "mảng con"...
                  </p>
                </div>
              ) : (
                <>
                  {/* Nhóm 1: Matching Chapters */}
                  {matchingChapters.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" /> Chương ({matchingChapters.length})
                      </span>
                      {matchingChapters.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => handleSelectResult(ch.id)}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between text-slate-200 cursor-pointer transition group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-white group-hover:text-cyan-300 block truncate">
                              {ch.title}
                            </span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {ch.summary}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">Chương {ch.order}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Nhóm 2: Matching Patterns (theo keywords, name, description) */}
                  {matchingPatterns.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 flex items-center gap-1.5">
                        <Code2 className="w-3 h-3" /> Dạng bài ({matchingPatterns.length})
                      </span>
                      {matchingPatterns.map((pat) => {
                        const parentChapter = content.chapters.find((c) => c.id === pat.chapterId)
                        return (
                          <button
                            key={pat.id}
                            onClick={() => handleSelectResult(pat.chapterId, `pattern-${pat.id}`)}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 flex flex-col gap-1 text-slate-200 cursor-pointer transition group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-white group-hover:text-indigo-300 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                                {pat.name}
                              </span>
                              {parentChapter && (
                                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                                  Chương {parentChapter.order}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              <span className="text-slate-500">Từ khóa: </span>
                              {pat.keywords.join(', ')}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Nhóm 3: Matching Problems */}
                  {matchingProblems.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 flex items-center gap-1.5">
                        <ListTodo className="w-3 h-3" /> Bài tập ({matchingProblems.length})
                      </span>
                      {matchingProblems.map((prob) => {
                        const parentChapter = content.chapters.find((c) => c.id === prob.chapterId)
                        return (
                          <button
                            key={prob.id}
                            onClick={() => handleSelectResult(prob.chapterId, `problem-${prob.id}`)}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between text-slate-200 cursor-pointer transition group"
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <span className="font-medium group-hover:text-emerald-300 truncate">
                                {prob.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 shrink-0">
                                {prob.difficulty === 'easy' ? 'Dễ' : prob.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                              </span>
                            </div>
                            {parentChapter && (
                              <span className="text-[10px] text-slate-500 font-mono shrink-0">
                                Chương {parentChapter.order}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions, Search on Mobile, Overall Progress, Editor Mode, Theme Toggle */}
        <div className="flex items-center gap-2 text-xs">
          {/* Nút tìm kiếm trên Mobile */}
          <button
            onClick={() => {
              setIsMobileSearchActive(true)
              setTimeout(() => mobileSearchInputRef.current?.focus(), 50)
            }}
            className="sm:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Tìm kiếm (Ctrl+K hoặc /)"
            aria-label="Mở tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Tiến độ tổng thể (A-08) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {overallStats.completed}/{overallStats.total} bài ({overallStats.percentage}%)
            </span>
          </div>

          {/* Toggle Chế độ biên tập (Editor Mode) */}
          <button
            onClick={() => onUpdateSettings({ editMode: !settings.editMode })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              settings.editMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Bật/Tắt Chế độ biên tập (CRUD & Chỉnh sửa nội dung)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              Biên tập: <strong className={settings.editMode ? 'text-amber-300' : 'text-slate-500'}>
                {settings.editMode ? 'BẬT' : 'TẮT'}
              </strong>
            </span>
          </button>

          {/* Nút Đổi theme Sáng / Tối */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={`Đổi sang giao diện ${settings.theme === 'dark' ? 'Sáng' : 'Tối'}`}
            aria-label="Đổi theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Nút Quản lý dữ liệu (Storage Modal) */}
          <button
            onClick={onOpenDataModal}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Quản lý dữ liệu học tập"
            aria-label="Quản lý dữ liệu học tập"
          >
            <Database className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Mobile Search Modal Overlay */}
      {isMobileSearchActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm sm:hidden p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm keywords, bài tập, pattern..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setIsMobileSearchActive(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results list on mobile */}
          <div className="flex-1 overflow-y-auto space-y-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-3">
            {trimmed ? (
              totalResults === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs">
                  Không tìm thấy kết quả nào phù hợp.
                </div>
              ) : (
                <div className="space-y-3">
                  {matchingChapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectResult(ch.id)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-white"
                    >
                      <span className="font-semibold text-xs">{ch.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}

                  {matchingPatterns.map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => handleSelectResult(pat.chapterId, `pattern-${pat.id}`)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-white"
                    >
                      <div className="font-semibold text-xs text-indigo-300">{pat.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Từ khóa: {pat.keywords.join(', ')}
                      </div>
                    </button>
                  ))}

                  {matchingProblems.map((prob) => (
                    <button
                      key={prob.id}
                      onClick={() => handleSelectResult(prob.chapterId, `problem-${prob.id}`)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-white"
                    >
                      <span className="text-xs">{prob.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {prob.difficulty === 'easy' ? 'Dễ' : prob.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs">
                Gõ từ khóa để bắt đầu tìm kiếm (hỗ trợ cả có dấu lẫn không dấu).
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
