import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Check, Info, RotateCcw, X } from 'lucide-react'
import './Toaster.css'

const ToastContext = createContext(() => {})

const ICONS = { success: Check, info: Info, warning: RotateCcw }

/** Stacked toasts in the corner: newest in front, older ones tucked behind. Hover to fan them out. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const id = useRef(0)

  const dismiss = useCallback((key) => {
    setToasts((list) => list.map((t) => (t.key === key ? { ...t, leaving: true } : t)))
    setTimeout(() => setToasts((list) => list.filter((t) => t.key !== key)), 220)
  }, [])

  const toast = useCallback(
    (title, { description, tone = 'success' } = {}) => {
      const key = ++id.current
      setToasts((list) => [...list.slice(-3), { key, title, description, tone }])
      setTimeout(() => dismiss(key), 4200)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ol className="toaster" aria-live="polite" aria-label="Notifications">
        {toasts.map((t, i) => {
          const Icon = ICONS[t.tone] ?? Check
          const depth = toasts.length - 1 - i
          return (
            <li key={t.key} className={`toast toast--${t.tone} ${t.leaving ? 'is-leaving' : ''}`} style={{ '--depth': depth }}>
              <span className="toast__icon" aria-hidden="true">
                <Icon size={14} strokeWidth={2.5} />
              </span>
              <div>
                <p className="toast__title">{t.title}</p>
                {t.description && <p className="toast__desc">{t.description}</p>}
              </div>
              <button className="toast__close" onClick={() => dismiss(t.key)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </li>
          )
        })}
      </ol>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
