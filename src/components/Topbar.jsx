import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, ChevronRight, Menu, Search } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { VLink } from '../lib/transitions'
import { timeAgo } from '../utils/project'
import './Topbar.css'

function useCrumbs() {
  const { pathname } = useLocation()
  const { getProject } = useBoard()
  if (pathname === '/') return [{ label: 'Overview' }]
  if (pathname === '/projects') return [{ label: 'Projects' }]
  if (pathname === '/activity') return [{ label: 'Activity' }]
  const id = pathname.match(/^\/projects\/(.+)$/)?.[1]
  if (id) return [{ label: 'Projects', to: '/projects' }, { label: getProject(id)?.client.company ?? 'Not found' }]
  return [{ label: 'Not found' }]
}

export default function Topbar({ onMenu, navOpen, onSearch }) {
  const { role, projects, notifications, unread, dispatch } = useBoard()
  const [open, setOpen] = useState(false)
  const popRef = useRef(null)
  const crumbs = useCrumbs()

  // close the notifications popover on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onClick = (e) => !popRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const projectName = (id) => projects.find((p) => p.id === id)?.client.company ?? ''
  const who = (actor) => (actor === 'client' ? 'Client' : 'Jordan')

  return (
    <header className="topbar">
      <button className="btn btn--quiet topbar__menu" onClick={onMenu} aria-expanded={navOpen} aria-label="Toggle navigation">
        <Menu size={18} />
      </button>

      <nav className="crumbs" aria-label="Breadcrumb">
        <span className="crumbs__root">Jordan Lee Studio</span>
        {crumbs.map((c) => (
          <span key={c.label} className="crumbs__item">
            <ChevronRight size={14} aria-hidden="true" />
            {c.to ? <VLink to={c.to}>{c.label}</VLink> : <span aria-current="page">{c.label}</span>}
          </span>
        ))}
      </nav>

      <div className="topbar__right">
        <button className="btn btn--quiet topbar__search" onClick={onSearch} aria-label="Open command menu">
          <Search size={16} />
        </button>
        <span className={`topbar__role topbar__role--${role}`}>
          <span aria-hidden="true" />
          {role === 'freelancer' ? 'Freelancer view' : 'Client view'}
        </span>

        <div className="notif" ref={popRef}>
          <button
            className={`btn btn--quiet notif__btn ${unread ? 'has-unread' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="true"
            aria-label={`Notifications, ${unread} unread`}
          >
            <Bell size={17} />
            {unread > 0 && <span key={unread} className="notif__dot mono">{unread}</span>}
          </button>

          {open && (
            <div className="notif__panel" role="dialog" aria-label="Notifications">
              <div className="notif__head">
                <strong>Inbox</strong>
                <button className="btn btn--quiet" onClick={() => dispatch({ type: 'MARK_ALL_READ' })} disabled={!unread}>
                  Mark all read
                </button>
              </div>
              {notifications.length ? (
                <ul className="notif__list">
                  {notifications.slice(0, 7).map((n, i) => (
                    <li key={n.id} className={n.read ? '' : 'is-unread'} style={{ '--i': i }}>
                      <VLink
                        to={`/projects/${n.projectId}${n.deliverableId ? `?deliverable=${n.deliverableId}` : ''}`}
                        onClick={() => {
                          dispatch({ type: 'MARK_READ', id: n.id })
                          setOpen(false)
                        }}
                      >
                        <span>
                          <strong>{who(n.actor)}</strong> {n.text}
                        </span>
                        <small>
                          {projectName(n.projectId)} · {timeAgo(n.at)}
                        </small>
                      </VLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">You’re all caught up.</p>
              )}
              <VLink to="/activity" className="notif__all" onClick={() => setOpen(false)}>
                View all activity
              </VLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
