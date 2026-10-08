import React, { useEffect, useState, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import { Check, Copy, Terminal } from 'lucide-react'

export interface CodeViewerProps {
  code: string
  language?: string
  title?: string
  className?: string
  showLineNumbers?: boolean
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = 'javascript',
  title,
  className = '',
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const normalizedLang = language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase()

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, normalizedLang])

  // E-30, E-31, E-32: Nút "Sao chép" (Copy) gọi navigator.clipboard.writeText, đổi nhãn sang "Đã sao chép ✓" trong 2 giây
  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        // Fallback cho môi trường không hỗ trợ navigator.clipboard
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Không thể sao chép code: ', err)
    }
  }

  const lines = code.trim().split('\n')

  return (
    <div
      className={`code-viewer-container rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl text-sm ${className}`}
    >
      {/* Header thanh công cụ code */}
      <div className="code-viewer-header flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs font-mono text-[#8b949e]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="code-viewer-title font-semibold text-[#e6edf3]">
            {title || `${normalizedLang.toUpperCase()} Snippet`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="code-viewer-lang px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d] text-[11px] uppercase tracking-wider font-semibold font-mono">
            {normalizedLang}
          </span>
          {/* Nút Sao chép (E-30, E-31, E-32) */}
          <button
            onClick={handleCopy}
            className={`code-viewer-copy flex items-center gap-1.5 px-3 py-1 rounded transition cursor-pointer text-xs font-medium border ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border-[#30363d]'
            }`}
            title="Sao chép toàn bộ mã nguồn"
            aria-label={copied ? 'Đã sao chép' : 'Sao chép'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Đã sao chép ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8b949e] shrink-0" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vùng hiển thị code với font monospace & line numbers (E-20, E-21) */}
      <div className="code-viewer-body overflow-x-auto text-[13px] leading-relaxed font-mono flex bg-[#0d1117]">
        {showLineNumbers && (
          <div
            aria-hidden="true"
            className="code-viewer-gutter select-none py-4 pl-3.5 pr-2.5 text-right text-[#6e7681] bg-[#161b22] border-r border-[#30363d] font-mono text-xs"
          >
            {lines.map((_, idx) => (
              <div key={idx} className="leading-[1.625rem]">
                {idx + 1}
              </div>
            ))}
          </div>
        )}
        <div className="p-4 flex-1 overflow-x-auto">
          <pre className="!m-0 !p-0 !bg-transparent leading-[1.625rem] font-mono text-[#e6edf3]">
            <code ref={codeRef} className={`language-${normalizedLang} font-mono text-[#e6edf3]`}>
              {code.trim()}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CodeViewer
