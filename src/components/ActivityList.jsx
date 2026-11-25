import { VLink as Link } from '../lib/transitions'
import { Check, MessageSquare, Upload, Flag, RotateCcw } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { timeAgo } from '../utils/project'
import './ActivityList.css'

const ICONS = {
  upload: Upload,
  comment: MessageSquare,
  approve: Check,
  changes: RotateCcw,
  milestone: Flag,
}

export default function ActivityList({ items, showProject = true }) {
  const { projects } = useBoard()
  const company = (id) => projects.find((p) => p.id === id)?.client

  if (!items.length) {
    return (
      <p className="empty-state">
        <strong>No activity yet</strong>
        Uploads, comments and approvals will show up here.
      </p>
    )
  }

  return (
    <ol className="feed">
      {items.map((a, i) => {
        const Icon = ICONS[a.type] ?? Flag
        const client = company(a.projectId)
        const actor = a.actor === 'client' ? client?.name ?? 'Client' : 'Jordan Lee'
        return (
          <li key={a.id} className={`feed__item feed__item--${a.type} rise`} style={{ '--i': i }}>
            <span className="feed__icon" aria-hidden="true">
              <Icon size={13} />
            </span>
            <p>
              <strong>{actor}</strong> {a.text}
              {showProject && client && (
                <>
                  {' '}
                  in{' '}
                  <Link to={`/projects/${a.projectId}${a.deliverableId ? `?deliverable=${a.deliverableId}` : ''}`}>
                    {client.company}
                  </Link>
                </>
              )}
            </p>
            <time dateTime={a.at} className="mono">
              {timeAgo(a.at)}
            </time>
          </li>
        )
      })}
    </ol>
  )
}
