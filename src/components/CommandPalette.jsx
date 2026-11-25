import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, FolderKanban, History, LayoutGrid, RefreshCw, Repeat, CheckCheck, FileText } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { useToast } from '../context/ToastContext'
import { useTransitionNavigate } from '../lib/transitions'
import './CommandPalette.css'

/** Simple fuzzy match: every typed character must appear in order. Returns a score (lower is better) or -1. */
function fuzzy(text, query) {
  if (!query) return 0
  const t = text.toLowerCase()
  let pos = -1
  let gaps = 0
  for (const ch of query.toLowerCase().replace(/\s+/g, '')) {
    const next = t.indexOf(ch, pos + 1)
    if (next === -1) return -1
    gaps += next - pos - 1
    pos = next
  }
  return gaps
}

export default function CommandPalette({ open, onClose }) {
  const dialog = useRef(null)
  const input = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const { projects, role, dispatch } = useBoard()
  const go = useTransitionNavigate()
  const toast = useToast()

  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) {
      setQuery('')
      setActive(0)
      d.showModal()
      requestAnimationFrame(() => input.current?.focus())
    } else if (!open && d.open) d.close()
  }, [open])

  const commands = useMemo(() => {
    const nav = [
      { id: 'overview', group: 'Go to', label: 'Overview', icon: LayoutGrid, run: () => go('/') },
      { id: 'projects', group: 'Go to', label: 'Projects', icon: FolderKanban, run: () => go('/projects') },
      { id: 'activity', group: 'Go to', label: 'Activity', icon: History, run: () => go('/activity') },
    ]
    const proj = projects.map((p) => ({
      id: `p-${p.id}`,
      group: 'Projects',
      label: `${p.client.company}`,
      hint: p.name,
      icon: FolderKanban,
      swatch: p.palette[1],
      run: () => go(`/projects/${p.id}`),
    }))
    const review = projects.flatMap((p) =>
      p.deliverables
        .filter((d) => d.status === 'in-review' || d.status === 'changes')
        .map((d) => ({
          id: `d-${d.id}`,
          group: 'Deliverables',
          label: d.title,
          hint: p.client.company,
          icon: FileText,
          run: () => go(`/projects/${p.id}?deliverable=${d.id}`),
        })),
    )
    const actions = [
      {
        id: 'role',
        group: 'Actions',
        label: role === 'freelancer' ? 'Switch to client view' : 'Switch to freelancer view',
        icon: Repeat,
        run: () => {
          dispatch({ type: 'SET_ROLE', role: role === 'freelancer' ? 'client' : 'freelancer' })
          toast(role === 'freelancer' ? 'Viewing as the client' : 'Viewing as the freelancer', { tone: 'info' })
        },
      },
      {
        id: 'read',
        group: 'Actions',
        label: 'Mark all notifications as read',
        icon: CheckCheck,
        run: () => {
          dispatch({ type: 'MARK_ALL_READ' })
          toast('All caught up')
        },
      },
      {
        id: 'reset',
        group: 'Actions',
        label: 'Reset demo data',
        icon: RefreshCw,
        run: () => {
          dispatch({ type: 'RESET' })
          toast('Demo workspace restored', { tone: 'info' })
        },
      },
    ]
    return [...nav, ...proj, ...review, ...actions]
  }, [projects, role, dispatch, go, toast])

  const results = useMemo(
    () =>
      commands
        .map((c) => ({ ...c, score: fuzzy(`${c.label} ${c.hint ?? ''}`, query) }))
        .filter((c) => c.score >= 0)
        .sort((a, b) => (query ? a.score - b.score : 0)),
    [commands, query],
  )

  useEffect(() => setActive(0), [query])

  const run = (cmd) => {
    onClose()
    // let the dialog close before the page transition starts
    requestAnimationFrame(() => cmd.run())
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      run(results[active])
    }
  }

  useEffect(() => {
    dialog.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  let lastGroup = null

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Command menu"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="palette__box" onKeyDown={onKey}>
        <div className="palette__search">
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          />
          <kbd>esc</kbd>
        </div>
        <ul id="palette-list" className="palette__list" role="listbox">
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            const Icon = c.icon
            return (
              <li key={c.id} role="presentation">
                {header && <p className="palette__group">{header}</p>}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  className="palette__item"
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                >
                  {c.swatch ? (
                    <span className="palette__swatch" style={{ background: c.swatch }} />
                  ) : (
                    <Icon size={16} aria-hidden="true" />
                  )}
                  <span className="palette__label">{c.label}</span>
                  {c.hint && <span className="palette__hint">{c.hint}</span>}
                  <ArrowRight size={14} className="palette__go" aria-hidden="true" />
                </div>
              </li>
            )
          })}
          {!results.length && <li className="palette__empty">No results for “{query}”</li>}
        </ul>
        <footer className="palette__foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
        </footer>
      </div>
    </dialog>
  )
}
