import React, { useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
} from 'lucide-react'
import type { Chapter } from '../types'

export interface ChapterNavigationProps {
  chapters: Chapter[]
  currentChapter: Chapter
  onSelectChapter: (chapterId: string) => void
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  currentChapter,
  onSelectChapter,
}) => {
  // B-03: Sắp xếp theo order tăng dần hiện hành của Sidebar
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order)
  const currentIndex = sortedChapters.findIndex((c) => c.id === currentChapter.id)

  const isFirst = currentIndex <= 0
  const isLast = currentIndex === sortedChapters.length - 1

  const prevChapter = !isFirst ? sortedChapters[currentIndex - 1] : null
  const nextChapter = !isLast ? sortedChapters[currentIndex + 1] : null
  const firstChapter = sortedChapters[0]

  // B-05: Phím tắt [ (chương trước) và ] (chương sau) khi không ở ô nhập liệu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase()
      if (
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return
      }

      if (e.key === '[' && prevChapter) {
        e.preventDefault()
        onSelectChapter(prevChapter.id)
      } else if (e.key === ']' && nextChapter) {
        e.preventDefault()
        onSelectChapter(nextChapter.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevChapter, nextChapter, onSelectChapter])

  return (
    <nav
      aria-label="Điều hướng chương tuần tự"
      className="pt-8 border-t border-slate-800/80 my-8 space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Nút "← Chương trước" (B-01, B-02) */}
        <div className="flex-1">
          {prevChapter ? (
            <button
              onClick={() => onSelectChapter(prevChapter.id)}
              className="w-full text-left p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group flex items-center gap-3.5 shadow-lg"
              title={`Phím tắt: [ | Chuyển đến chương: ${prevChapter.title}`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-indigo-600/30 group-hover:border-indigo-500/50 transition shrink-0">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                  <span>Chương trước</span>
                  <kbd className="hidden md:inline px-1 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px]">
                    [
                  </kbd>
                </div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-white truncate">
                  {prevChapter.order}. {prevChapter.title}
                </div>
              </div>
            </button>
          ) : (
            // B-02: Chương đầu tiên ẩn nút Trước (hiển thị placeholder thông tin xuất phát)
            <div className="hidden sm:flex items-center gap-2 p-4 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
              <span>Điểm khởi đầu lộ trình học (Chương 1)</span>
            </div>
          )}
        </div>

        {/* Nút "Chương sau →" hoặc "Về chương đầu" (B-01, B-02) */}
        <div className="flex-1">
          {nextChapter ? (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="w-full text-right p-4 rounded-2xl bg-indigo-950/20 hover:bg-indigo-900/30 border border-indigo-800/40 hover:border-indigo-600/60 transition cursor-pointer group flex items-center justify-end gap-3.5 shadow-lg"
              title={`Phím tắt: ] | Chuyển đến chương: ${nextChapter.title}`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono text-indigo-400/80 flex items-center justify-end gap-1.5">
                  <kbd className="hidden md:inline px-1 py-0.2 rounded bg-indigo-950 border border-indigo-800 text-[10px] text-indigo-300">
                    ]
                  </kbd>
                  <span>Chương tiếp theo</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-200 truncate">
                  {nextChapter.order}. {nextChapter.title}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 group-hover:text-white group-hover:bg-indigo-600 transition shrink-0 shadow-sm">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
              </div>
            </button>
          ) : (
            // B-02: Chương cuối cùng thay nút Sau bằng thông báo hoàn thành + nút "Về chương đầu"
            <div className="space-y-2">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 text-right flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Hoàn thành lộ trình 6 chương!
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Bạn đã duyệt qua toàn bộ giáo trình.
                    </div>
                  </div>
                </div>

                {firstChapter && (
                  <button
                    onClick={() => onSelectChapter(firstChapter.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/50 text-xs font-bold transition cursor-pointer shrink-0"
                    title="Quay lại chương 1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Về chương 1</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default ChapterNavigation
