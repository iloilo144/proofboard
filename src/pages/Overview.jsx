import { ArrowUpRight, CalendarClock, CircleDot, FolderOpen, RotateCcw } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import ProjectRow from '../components/ProjectRow'
import ActivityList from '../components/ActivityList'
import DeliverablePreview from '../components/DeliverablePreview'
import { StatusBadge } from '../components/Bits'
import { NumberTicker, Sparkline } from '../components/Metrics'
import { VLink } from '../lib/transitions'
import { daysUntil, money, projectStatus, timeAgo } from '../utils/project'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Overview.css'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/** Activity per day for the last 14 days, oldest first, for the sparklines. */
function perDay(activity, filter = () => true) {
  const days = Array(14).fill(0)
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  activity.filter(filter).forEach((a) => {
    const d = Math.floor((start - new Date(a.at)) / 86400000) + 1
    const idx = 13 - Math.max(0, d)
    if (idx >= 0 && idx < 14) days[idx] += 1
  })
  // running total reads better than spiky daily counts at this size
  return days.map((_, i) => days.slice(0, i + 1).reduce((s, v) => s + v, 0))
}

export default function Overview() {
  useDocumentTitle('Overview')
  const { projects, activity, role } = useBoard()
  const isClient = role === 'client'

  const open = projects.filter((p) => projectStatus(p) !== 'completed')
  const deliverables = projects.flatMap((p) => p.deliverables.map((d) => ({ ...d, project: p })))
  const inReview = deliverables.filter((d) => d.status === 'in-review')
  const changes = deliverables.filter((d) => d.status === 'changes')
  const upcoming = open
    .flatMap((p) => p.milestones.filter((m) => !m.done).map((m) => ({ ...m, project: p })))
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
  const dueThisWeek = upcoming.filter((m) => daysUntil(m.dueAt) <= 7)
  const booked = open.reduce((sum, p) => sum + p.budget, 0)

  const attention = (isClient ? inReview : [...changes, ...inReview]).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const stats = [
    { label: 'Active projects', value: open.length, icon: FolderOpen, spark: perDay(activity, (a) => a.type === 'milestone') },
    { label: 'In client review', value: inReview.length, icon: CircleDot, spark: perDay(activity, (a) => a.type === 'upload'), tone: 'blue' },
    { label: 'Changes requested', value: changes.length, icon: RotateCcw, spark: perDay(activity, (a) => a.type === 'changes'), tone: changes.length ? 'amber' : '' },
    { label: 'Open project value', value: booked, icon: CalendarClock, spark: perDay(activity), format: money },
  ]

  return (
    <div className="page overview">
      <header className="overview__head rise">
        <p className="page__eyebrow">{today}</p>
        <h1 className="page__title">{isClient ? 'Client preview' : `${greeting()}, Jordan`}</h1>
        <p className="overview__summary">
          {isClient ? (
            <>
              <span className="chip chip--blue">{plural(inReview.length, 'deliverable is', 'deliverables are')}</span> ready
              for your review. Approve them or leave a note, and Jordan is notified either way.
            </>
          ) : (
            <>
              <span className="chip chip--blue">{plural(inReview.length, 'deliverable', 'deliverables')}</span> waiting on
              clients, <span className="chip chip--amber">{plural(changes.length, 'revision', 'revisions')}</span> to make,
              and <span className="chip">{plural(dueThisWeek.length, 'milestone', 'milestones')}</span> due this week.
            </>
          )}
        </p>
      </header>

      <dl className="stats">
        {stats.map((s, i) => (
          <div key={s.label} className={`stat rise stat--${s.tone ?? ''}`} style={{ '--i': i + 1 }}>
            <dt>
              <s.icon size={14} aria-hidden="true" /> {s.label}
            </dt>
            <dd>
              <NumberTicker value={s.value} format={s.format} />
            </dd>
            <Sparkline points={s.spark} />
          </div>
        ))}
      </dl>

      <div className="overview__grid">
        <div className="overview__main">
          <section aria-labelledby="attention-title" className="rise" style={{ '--i': 5 }}>
            <h2 className="section-title" id="attention-title">
              {isClient ? 'Waiting for your review' : 'Needs attention'}
              <span className="mono overview__count">{attention.length}</span>
            </h2>
            <div className="panel">
              {attention.length ? (
                <ul className="attention">
                  {attention.map((d) => (
                    <li key={d.id}>
                      <div className="attention__thumb">
                        <DeliverablePreview deliverable={d} project={d.project} size="small" />
                      </div>
                      <div className="attention__body">
                        <VLink to={`/projects/${d.project.id}?deliverable=${d.id}`}>
                          {d.title} <span className="mono">v{d.version}</span>
                        </VLink>
                        <span>
                          {d.project.client.company} · updated {timeAgo(d.updatedAt)}
                        </span>
                      </div>
                      <StatusBadge status={d.status} />
                      <span className="attention__open" aria-hidden="true">
                        Open <ArrowUpRight size={13} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">
                  <strong>Nothing waiting</strong>
                  Every deliverable is either approved or still in progress.
                </p>
              )}
            </div>
          </section>

          <section aria-labelledby="projects-title" className="rise" style={{ '--i': 6 }}>
            <h2 className="section-title" id="projects-title">
              Open projects{' '}
              <VLink to="/projects">
                All projects <ArrowUpRight size={13} aria-hidden="true" />
              </VLink>
            </h2>
            <div className="panel">
              <ul className="prows">
                {open.map((p, i) => (
                  <ProjectRow key={p.id} project={p} index={i} />
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="overview__side">
          <section aria-labelledby="upcoming-title" className="rise" style={{ '--i': 6 }}>
            <h2 className="section-title" id="upcoming-title">
              Upcoming milestones
            </h2>
            <ol className="upcoming panel">
              {upcoming.slice(0, 5).map((m) => {
                const d = daysUntil(m.dueAt)
                return (
                  <li key={`${m.project.id}-${m.id}`}>
                    <span className={`upcoming__date ${d <= 7 ? 'is-soon' : ''}`}>
                      <strong>{new Date(m.dueAt).getDate()}</strong>
                      <span>{new Date(m.dueAt).toLocaleDateString('en-GB', { month: 'short' })}</span>
                    </span>
                    <div>
                      <VLink to={`/projects/${m.project.id}`}>{m.title}</VLink>
                      <span>
                        {m.project.client.company} · {d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          <section aria-labelledby="activity-title" className="rise" style={{ '--i': 7 }}>
            <h2 className="section-title" id="activity-title">
              Recent activity
              <VLink to="/activity">
                View all <ArrowUpRight size={13} aria-hidden="true" />
              </VLink>
            </h2>
            <ActivityList items={activity.slice(0, 6)} />
          </section>
        </aside>
      </div>
    </div>
  )
}

