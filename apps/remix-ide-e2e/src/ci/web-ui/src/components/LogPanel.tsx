import { useRef, useEffect, useState } from 'react'
import './LogPanel.css'

interface LogPanelProps {
  content: string
  collapsed: boolean
  onToggle: () => void
}

export function LogPanel({ content, collapsed, onToggle }: LogPanelProps) {
  const logRef = useRef<HTMLPreElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (logRef.current && !collapsed) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [content, collapsed])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight
      const newHeight = Math.max(15, Math.min(80, ((windowHeight - e.clientY) / windowHeight) * 100))
      document.documentElement.style.setProperty('--log-height', `${newHeight}vh`)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  return (
    <>
      {!collapsed && (
        <div
          className={`log-resizer ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          title="Drag to resize log panel"
        />
      )}
      <pre ref={logRef} className={`log-panel ${collapsed ? 'collapsed' : ''}`}>
        <div className="log-header">Log</div>
        {content}
      </pre>
      {collapsed && (
        <button className="log-fab" onClick={onToggle} title="Show log">
          Log
        </button>
      )}
    </>
  )
}
