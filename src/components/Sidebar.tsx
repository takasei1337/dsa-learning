import React, { useState, useEffect } from 'react'
import {
  Layers,
  ChevronRight,
  CheckCircle2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react'
import type { Chapter } from '../types'

export interface SidebarProps {
  chapters: Chapter[]
  activeChapterId: string
  onSelectChapter: (chapterId: string) => void
  getChapterStats: (chapterId: string) => { total: number; completed: number; percentage: number }
  isMobileOpen: boolean
  onCloseMobile: () => void
  editMode?: boolean
  onAddChapter?: () => void
  onEditChapter?: (chapter: Chapter) => void
  onDeleteChapter?: (chapter: Chapter) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  getChapterStats,
  isMobileOpen,
  onCloseMobile,
  editMode = false,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
}) => {
  // A-10: Nút thu gọn / mở rộng Sidebar trên máy tính (lưu trạng thái vào localStorage)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dsa.sidebar.collapsed') === 'true'
    }
    return false
  })

  // Sắp xếp các chương theo order tăng dần (A-01)
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order)

  const toggleCollapsed = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('dsa.sidebar.collapsed', String(next))
  }

  // Đóng Drawer khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen, onCloseMobile])

  // A-03: Click chọn chương không reload trang, tự đóng mobile drawer nếu đang mở
  const handleChapterClick = (chapterId: string) => {
    onSelectChapter(chapterId)
    if (isMobileOpen) {
      onCloseMobile()
    }
  }

  const renderChapterList = (collapsedMode: boolean = false) => (
    <nav className="space-y-1.5" role="list">
      {sortedChapters.map((ch) => {
        const isActive = ch.id === activeChapterId
        const stats = getChapterStats(ch.id)
        const isCompleted = stats.total > 0 && stats.completed === stats.total

        if (collapsedMode) {
          // Giao diện mini-rail thu gọn trên desktop
          return (
            <button
              key={ch.id}
              onClick={() => handleChapterClick(ch.id)}
              aria-current={isActive ? 'page' : undefined}
              title={`${ch.order}. ${ch.title} (${stats.completed}/${stats.total} bài)`}
              className={`w-full py-2.5 flex flex-col items-center justify-center rounded-xl transition cursor-pointer border relative ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span
                className={`text-xs font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                }`}
              >
                {ch.order}
              </span>
              {isCompleted && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
              )}
            </button>
          )
        }

        // Giao diện đầy đủ
        return (
          <button
            key={ch.id}
            onClick={() => handleChapterClick(ch.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
              isActive
                ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-sm'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/80'
            }`}
          >
            <div className="min-w-0 pr-2 flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow'
                      : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {ch.order}
                </span>
                <span
                  className={`text-xs font-semibold truncate ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {ch.title}
                </span>
              </div>

              {/* A-08: Tiến độ x/y bài đã làm và dấu check xanh nếu 100% */}
              <div className="text-[11px] mt-2 flex items-center justify-between pl-8.5">
                <span
                  className={`font-mono flex items-center gap-1 ${
                    isCompleted
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {stats.completed}/{stats.total} bài xong
                      </span>
                    </>
                  ) : (
                    <span>
                      {stats.completed}/{stats.total} bài
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {stats.percentage}%
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-1 mt-1.5 ml-8.5 max-w-[calc(100%-2.125rem)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-400'
                      : isActive
                        ? 'bg-indigo-500'
                        : 'bg-slate-600'
                  }`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

            {editMode && !collapsedMode ? (
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {onEditChapter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditChapter(ch)
                    }}
                    className="p-1 rounded-lg hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-300 transition cursor-pointer"
                    title="Sửa chương"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDeleteChapter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChapter(ch)
                    }}
                    className="p-1 rounded-lg hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Xóa chương"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition ${
                  isActive
                    ? 'text-indigo-400 translate-x-0.5'
                    : 'text-slate-600 group-hover:text-slate-400'
                }`}
              />
            )}
          </button>
        )
      })}

      {editMode && !collapsedMode && onAddChapter && (
        <button
          onClick={onAddChapter}
          className="w-full mt-2 py-2.5 px-3 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chương mới</span>
        </button>
      )}
    </nav>
  )

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (>= 1024px) */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-72'
        }`}
      >
        <div className="sticky top-20 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 space-y-4 shadow-xl">
          {/* Header Sidebar với nút thu gọn / mở rộng (A-10) */}
          <div className="flex items-center justify-between px-1">
            {!isCollapsed && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Lộ Trình Học
              </span>
            )}
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer ml-auto"
              title={isCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
              aria-label={isCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {renderChapterList(isCollapsed)}
        </div>
      </aside>

      {/* 2. MOBILE & TABLET DRAWER (< 1024px) (A-09) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop mờ che phủ toàn màn hình */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer trượt từ bên trái */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#090d16] border-r border-slate-800 p-5 shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>6 Chương Thuật Toán</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
                aria-label="Đóng Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Danh sách 6 chương */}
            <div className="flex-1 overflow-y-auto">
              {renderChapterList(false)}
            </div>

            {/* Footer Drawer */}
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
              Chạm vào chương để xem nội dung
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
