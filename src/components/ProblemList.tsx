import React, { useState } from 'react'
import {
  ListTodo,
  CheckCircle2,
  Circle,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileEdit,
  Save,
  Filter,
  Search,
  Sparkles,
  Check,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react'
import type { Problem, Difficulty, Pattern, ProblemProgress } from '../types'
import { MathView } from './MathView'

export interface ProblemListProps {
  problems: Problem[]
  patterns?: Pattern[]
  progress: Record<string, ProblemProgress>
  onToggleProblem: (problemId: string) => void
  onUpdateNote: (problemId: string, note: string) => void
  editMode?: boolean
  onAddProblem?: () => void
  onEditProblem?: (problem: Problem) => void
  onDeleteProblem?: (problem: Problem) => void
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  patterns = [],
  progress,
  onToggleProblem,
  onUpdateNote,
  editMode = false,
  onAddProblem,
  onEditProblem,
  onDeleteProblem,
}) => {
  // F-05: Bộ lọc nhanh bài tập: Tất cả / Chưa làm / Đã làm
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Accordion gợi ý (Hint) & trình soạn thảo ghi chú (Notes)
  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>({})
  const [activeNoteEditors, setActiveNoteEditors] = useState<Record<string, boolean>>({})
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [saveSuccessMap, setSaveSuccessMap] = useState<Record<string, boolean>>({})

  // Tính toán số lượng và tiến độ hoàn thành bài tập của chương
  const totalCount = problems.length
  const completedCount = problems.filter((p) => progress[p.id]?.done).length
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const toggleHint = (problemId: string) => {
    setExpandedHints((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }))
  }

  const toggleNoteEditor = (problemId: string, currentNote = '') => {
    const isOpening = !activeNoteEditors[problemId]
    setActiveNoteEditors((prev) => ({
      ...prev,
      [problemId]: isOpening,
    }))
    if (isOpening && !(problemId in editingNotes)) {
      setEditingNotes((prev) => ({
        ...prev,
        [problemId]: currentNote,
      }))
    }
  }

  const handleSaveNote = (problemId: string) => {
    const noteText = editingNotes[problemId] ?? ''
    onUpdateNote(problemId, noteText)
    setSaveSuccessMap((prev) => ({ ...prev, [problemId]: true }))
    setTimeout(() => {
      setSaveSuccessMap((prev) => ({ ...prev, [problemId]: false }))
    }, 2000)
  }

  // F-01: Nhãn độ khó (Easy: Xanh lục, Medium: Vàng, Hard: Đỏ)
  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
      case 'medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40'
      case 'hard':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40'
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-700'
    }
  }

  const difficultyLabels: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  }

  // Lọc bài tập theo trạng thái, độ khó, và từ khóa tìm kiếm
  const filteredProblems = problems.filter((prob) => {
    const isDone = Boolean(progress[prob.id]?.done)

    // F-05: Lọc nhanh theo trạng thái: Tất cả / Chưa làm / Đã làm
    if (statusFilter === 'todo' && isDone) return false
    if (statusFilter === 'done' && !isDone) return false

    // Lọc theo cấp độ
    if (difficultyFilter !== 'all' && prob.difficulty !== difficultyFilter) return false

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = prob.title.toLowerCase().includes(q)
      const hintMatch = prob.hint ? prob.hint.toLowerCase().includes(q) : false
      const patternMatch = patterns.some(
        (pat) => prob.patternIds?.includes(pat.id) && pat.name.toLowerCase().includes(q)
      )
      if (!titleMatch && !hintMatch && !patternMatch) return false
    }

    return true
  })

  return (
    <section id="problems-section" className="space-y-6">
      {/* Module F Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Bài Tập Trọng Tâm & Checklist
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {completedCount}/{totalCount} hoàn thành ({percentComplete}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                5 bài tập then chốt chọn lọc từ LeetCode & NeetCode 150 để rèn luyện phản xạ dạng bài
              </p>
            </div>
          </div>
        </div>

        {/* Thanh tiến độ chương & Nút thêm bài tập (F-03, F-20, F-21) */}
        <div className="flex items-center gap-3">
          {editMode && onAddProblem && (
            <button
              onClick={onAddProblem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Thêm bài tập mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm bài tập</span>
            </button>
          )}
          <div className="w-32 sm:w-44 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
            {percentComplete}%
          </span>
        </div>
      </div>

      {/* F-05: Thanh công cụ lọc nhanh bài tập (Tất cả / Chưa làm / Đã làm) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        {/* Bộ lọc nhanh F-05 */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            Lọc bài tập:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Tất cả</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-700/80">
              {totalCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('todo')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'todo'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Chưa làm</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-700/80">
              {totalCount - completedCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'done'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Đã làm</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-700/80">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Lọc theo độ khó & ô tìm kiếm */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Nút lọc độ khó */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2 py-0.5 rounded transition cursor-pointer font-medium uppercase text-[10px] ${
                  difficultyFilter === diff
                    ? 'bg-slate-800 text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {diff === 'all' ? 'Mọi cấp độ' : difficultyLabels[diff]}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài tập, hint..."
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-36 sm:w-48 placeholder-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Danh sách bài tập (F-01, F-10, F-11, F-20, F-21, F-22) */}
      {filteredProblems.length === 0 ? (
        <div className="problem-empty-state rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center space-y-2">
          <ListTodo className="w-9 h-9 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">Không có bài tập phù hợp</h4>
          <p className="text-xs text-slate-500">
            Thử chuyển lại bộ lọc "Tất cả" hoặc xóa từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 divide-y divide-slate-800/70 overflow-hidden shadow-xl">
          {filteredProblems.map((prob) => {
            const probProgress = progress[prob.id] || { done: false }
            const isDone = Boolean(probProgress.done)
            const isHintOpen = expandedHints[prob.id]
            const isEditingNote = activeNoteEditors[prob.id]
            const currentNote = probProgress.note || ''
            const activeNoteValue =
              editingNotes[prob.id] !== undefined ? editingNotes[prob.id] : currentNote
            const isSaveSuccess = saveSuccessMap[prob.id]

            // Tìm pattern liên kết
            const linkedPatterns = patterns.filter((p) => prob.patternIds?.includes(p.id))

            return (
              <div
                key={prob.id}
                id={`problem-${prob.id}`}
                className={`p-4 sm:p-5 transition-colors duration-200 space-y-3.5 ${
                  isDone ? 'bg-emerald-950/15' : 'hover:bg-slate-800/20'
                }`}
              >
                {/* Hàng chính: Checkbox "Đã làm xong", Số thứ tự, Tiêu đề, Badge độ khó, Link LeetCode/NeetCode */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Cột trái: Hộp kiểm Checkbox + Tiêu đề bài tập (F-20, F-21) */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* F-20, F-21: Checkbox "Đã làm xong" - Tích chọn lập tức gạch ngang tiêu đề bài, tự cập nhật tiến độ */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      onClick={() => onToggleProblem(prob.id)}
                      className={`group mt-0.5 sm:mt-0 p-1 -m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer transition flex items-center ${
                        isDone ? 'text-emerald-400' : 'text-slate-600 hover:text-emerald-400'
                      }`}
                      title={isDone ? 'Đã làm xong (Bấm để hủy hoàn thành)' : 'Đánh dấu đã làm xong'}
                      aria-label={`Đánh dấu hoàn thành bài ${prob.title}`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>

                    {/* Số thứ tự bài tập (#1 -> #5) */}
                    <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
                      #{prob.order}
                    </span>

                    {/* Tiêu đề bài tập & Nhãn hoàn thành */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* F-20: Gạch ngang tiêu đề bài khi tích chọn */}
                        <h4
                          className={`text-sm sm:text-base font-semibold transition ${
                            isDone
                              ? 'line-through text-slate-400 decoration-slate-500 decoration-2'
                              : 'text-white'
                          }`}
                        >
                          {prob.title}
                        </h4>

                        {/* F-01: Nhãn độ khó (Easy: Xanh lục, Medium: Vàng, Hard: Đỏ) */}
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm ${getDifficultyBadge(
                            prob.difficulty
                          )}`}
                        >
                          {difficultyLabels[prob.difficulty]}
                        </span>

                        {/* Nhãn "Đã làm xong" & thời điểm hoàn thành */}
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>Đã làm xong</span>
                            {probProgress.doneAt && (
                              <span className="text-emerald-400/80 hidden sm:inline">
                                • {new Date(probProgress.doneAt).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Các thẻ Pattern liên kết */}
                      {linkedPatterns.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {linkedPatterns.map((pat) => (
                            <span
                              key={pat.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              {pat.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cột phải: Link LeetCode/NeetCode trực tiếp (F-10, F-11), Xem gợi ý, Ghi chú */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pl-8 md:pl-0">
                    {/* F-10: Link trực tiếp ra LeetCode (target="_blank") */}
                    {prob.leetcodeUrl && (
                      <a
                        href={prob.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        title="Mở bài tập trực tiếp trên LeetCode trong tab mới"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* F-11: Link trực tiếp ra NeetCode (target="_blank") */}
                    {prob.neetcodeUrl && (
                      <a
                        href={prob.neetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        title="Mở hướng dẫn giải trực tiếp trên NeetCode trong tab mới"
                      >
                        <span>NeetCode</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* Nút Xem gợi ý giải (Hint toggle) */}
                    {prob.hint && (
                      <button
                        onClick={() => toggleHint(prob.id)}
                        className={`prob-hint-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          isHintOpen
                            ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
                        }`}
                        title="Xem gợi ý hướng giải"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Gợi ý</span>
                        {isHintOpen ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    {/* F-22: Nút Ghi chú cá nhân */}
                    <button
                      onClick={() => toggleNoteEditor(prob.id, currentNote)}
                      className={`prob-note-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        currentNote || isEditingNote
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700/80 hover:text-white'
                      }`}
                      title="Ghi chú cá nhân"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>{currentNote ? 'Đã có note' : 'Ghi chú'}</span>
                    </button>

                    {/* F-03, F-04: Nút Sửa / Xóa bài tập khi editMode bật */}
                    {editMode && (
                      <div className="flex items-center gap-1 border-l border-slate-800 prob-crud-divider pl-2 ml-1">
                        {onEditProblem && (
                          <button
                            type="button"
                            onClick={() => onEditProblem(prob)}
                            className="prob-edit-btn crud-edit-btn p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Chỉnh sửa bài tập"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                        )}
                        {onDeleteProblem && (
                          <button
                            type="button"
                            onClick={() => onDeleteProblem(prob)}
                            className="prob-delete-btn crud-delete-btn p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Xóa bài tập"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Khối gợi ý giải thuật (Accordion) */}
                {prob.hint && isHintOpen && (
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-xs text-indigo-200 leading-relaxed flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="text-indigo-300 font-semibold block">Gợi ý thuật toán:</strong>
                      <div className="text-slate-300">
                        <MathView math={prob.hint} />
                      </div>
                    </div>
                  </div>
                )}

                {/* F-22: Trình soạn thảo ghi chú cá nhân */}
                {isEditingNote && (
                  <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                      <span className="flex items-center gap-1.5">
                        <FileEdit className="w-3.5 h-3.5" />
                        Ghi chú cá nhân (lưu vào trình duyệt của bạn)
                      </span>
                      {isSaveSuccess && (
                        <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-mono">
                          <Check className="w-3.5 h-3.5" />
                          Đã lưu thành công!
                        </span>
                      )}
                    </div>
                    <textarea
                      value={activeNoteValue}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({
                          ...prev,
                          [prob.id]: e.target.value,
                        }))
                      }
                      placeholder="Ghi lại lưu ý: corner cases, mẹo tối ưu, biến thể cần nhớ..."
                      rows={2}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed placeholder-slate-600 resize-y"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSaveNote(prob.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu ghi chú</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Xem trước ghi chú nếu đang đóng trình soạn thảo */}
                {!isEditingNote && currentNote && (
                  <div
                    onClick={() => toggleNoteEditor(prob.id, currentNote)}
                    className="cursor-pointer group rounded-lg bg-slate-950/80 border border-slate-800/80 p-2.5 text-xs text-slate-400 hover:border-purple-500/40 transition flex items-start gap-2"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 italic flex-1 truncate">"{currentNote}"</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-purple-300 font-medium">
                      Sửa
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default ProblemList
