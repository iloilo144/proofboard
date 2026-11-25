import { useLocation } from 'react-router-dom'
import { LayoutGrid, FolderKanban, History, RotateCcw, Search } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { useToast } from '../context/ToastContext'
import { projectStatus, progress } from '../utils/project'
import { VLink } from '../lib/transitions'
import RoleSwitch from './RoleSwitch'
import './Sidebar.css'

/** A sidebar link that navigates through a view transition and highlights itself when active. */
function SideLink({ to, end, children }) {
  const { pathname } = useLocation()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  return (
    <VLink to={to} className={`side-link ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined}>
      {children}
    </VLink>
  )
}

export default function Sidebar({ onSearch }) {
  const { projects, dispatch } = useBoard()
  const toast = useToast()
  const open = projects.filter((p) => projectStatus(p) !== 'completed')
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)

  const reset = () => {
    if (window.confirm('Reset the demo workspace? Your comments and approvals in this browser will be cleared.')) {
      dispatch({ type: 'RESET' })
      toast('Demo workspace restored', { tone: 'info' })
    }
  }

  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <div className="sidebar__inner">
        <div className="sidebar__brand">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <rect width="24" height="24" rx="7" fill="#0F1012" />
            <path d="M8 6.5h5.2a4 4 0 0 1 0 8H8z M8 6.5v11" fill="none" stroke="#fff" strokeWidth="2.2" />
            <circle cx="17.5" cy="17.5" r="2.3" fill="#4353FF" />
          </svg>
          <span>Proofboard</span>
          <span className="sidebar__plan">Studio</span>
        </div>

        <button className="sidebar__search" onClick={onSearch}>
          <Search size={15} aria-hidden="true" />
          <span className="sidebar__search-label">Search…</span>
          <span className="sidebar__keys" aria-hidden="true">
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </span>
        </button>

        <nav className="sidebar__nav" aria-label="Main">
          <SideLink to="/" end>
            <LayoutGrid size={16} aria-hidden="true" /> Overview
          </SideLink>
          <SideLink to="/projects" end>
            <FolderKanban size={16} aria-hidden="true" /> Projects
            <span className="sidebar__count mono">{projects.length}</span>
          </SideLink>
          <SideLink to="/activity">
            <History size={16} aria-hidden="true" /> Activity
          </SideLink>
        </nav>

        <div className="sidebar__group">
          <p className="sidebar__label">Open projects</p>
          <ul>
            {open.map((p) => {
              const { pct } = progress(p)
              return (
                <li key={p.id}>
                  <SideLink to={`/projects/${p.id}`}>
                    <span className="sidebar__swatch" style={{ background: p.palette[1] }} aria-hidden="true" />
                    <span className="sidebar__project-name">{p.client.company}</span>
                    <span
                      className="sidebar__ring"
                      style={{ '--p': pct }}
                      role="img"
                      aria-label={`${pct}% complete`}
                    />
                  </SideLink>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="sidebar__foot">
          <RoleSwitch />
          <div className="sidebar__me">
            <span className="avatar avatar--you" aria-hidden="true">
              JL
            </span>
            <span>
              Jordan Lee
              <small>Freelance design & development</small>
            </span>
            <button className="btn btn--quiet sidebar__reset" onClick={reset} title="Reset demo data" aria-label="Reset demo data">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
