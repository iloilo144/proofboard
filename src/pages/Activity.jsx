import { useState } from 'react'
import { useBoard } from '../context/BoardContext'
import ActivityList from '../components/ActivityList'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Projects.css'

const TYPES = [
  { id: 'all', label: 'Everything' },
  { id: 'upload', label: 'Uploads' },
  { id: 'comment', label: 'Comments' },
  { id: 'approve', label: 'Approvals' },
  { id: 'changes', label: 'Change requests' },
  { id: 'milestone', label: 'Milestones' },
]

function dayLabel(iso) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(Date.now() - 86400000)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Activity() {
  useDocumentTitle('Activity')
  const { activity, projects, unread, dispatch } = useBoard()
  const [type, setType] = useState('all')
  const [project, setProject] = useState('all')

  const filtered = activity
    .filter((a) => type === 'all' || a.type === type)
    .filter((a) => project === 'all' || a.projectId === project)

  const groups = filtered.reduce((acc, a) => {
    const key = dayLabel(a.at)
    ;(acc[key] ??= []).push(a)
    return acc
  }, {})

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <p className="page__eyebrow">Everything that happened</p>
      <h1 className="page__title">Activity</h1>

      <div className="toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Filter by type">
          {TYPES.map((t) => (
            <button key={t.id} role="tab" aria-selected={type === t.id} onClick={() => setType(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="toolbar__right">
          <label>
            <span className="visually-hidden">Filter by project</span>
            <select className="input" value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.client.company}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" onClick={() => dispatch({ type: 'MARK_ALL_READ' })} disabled={!unread}>
            Mark all read
          </button>
        </div>
      </div>

      {Object.keys(groups).length ? (
        Object.entries(groups).map(([day, items]) => (
          <section key={day} className="activity-day">
            <h2 className="section-title">{day}</h2>
            <div className="panel" style={{ padding: '1.1rem 1.25rem 0.1rem' }}>
              <ActivityList items={items} />
            </div>
          </section>
        ))
      ) : (
        <div className="panel">
          <ActivityList items={[]} />
        </div>
      )}
    </div>
  )
}
