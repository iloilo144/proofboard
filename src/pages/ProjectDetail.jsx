import { useParams, useSearchParams } from 'react-router-dom'
import { VLink as Link, withViewTransition } from '../lib/transitions'
import { ArrowLeft, Check } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { useToast } from '../context/ToastContext'
import ActivityList from '../components/ActivityList'
import ReviewPanel from '../components/ReviewPanel'
import DeliverablePreview from '../components/DeliverablePreview'
import { Avatar, MilestoneBar, ProjectBadge, StatusBadge } from '../components/Bits'
import { daysUntil, money, projectStatus, relativeDue, shortDate } from '../utils/project'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import NotFound from './NotFound'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { getProject, activity, role, dispatch } = useBoard()
  const toast = useToast()
  const project = getProject(id)
  useDocumentTitle(project ? project.client.company : 'Not found')

  if (!project) return <NotFound what="project" />

  const status = projectStatus(project)
  const requested = project.deliverables.find((d) => d.id === params.get('deliverable'))
  const fallback =
    project.deliverables.find((d) => d.status === 'in-review' || d.status === 'changes') ?? project.deliverables[0]
  const selected = requested ?? fallback
  const projectActivity = activity.filter((a) => a.projectId === project.id)
  const canEditMilestones = role === 'freelancer'

  return (
    <div className="page detail">
      <Link to="/projects" className="detail__back">
        <ArrowLeft size={15} aria-hidden="true" /> Projects
      </Link>

      <header className="detail__head">
        <div>
          <p className="page__eyebrow">
            {project.type} · <span className="mono">#{project.id.slice(0, 8)}</span>
          </p>
          <h1 className="page__title">
            <span className="detail__swatch" style={{ background: project.palette[1], viewTransitionName: `swatch-${project.id}` }} aria-hidden="true" />
            {project.client.company} <span>{project.name}</span>
          </h1>
          <p className="detail__summary">{project.summary}</p>
        </div>
        <ProjectBadge status={status} />
      </header>

      <dl className="meta">
        <div>
          <dt>Client</dt>
          <dd className="meta__client">
            <Avatar person={project.client} /> {project.client.name}
          </dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{money(project.budget)}</dd>
        </div>
        <div>
          <dt>Started</dt>
          <dd>{shortDate(project.startedAt)}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>
            {shortDate(project.dueAt)}{' '}
            <small className={status !== 'completed' && daysUntil(project.dueAt) <= 7 ? 'is-urgent' : ''}>
              {status === 'completed' ? 'Delivered' : relativeDue(project.dueAt)}
            </small>
          </dd>
        </div>
      </dl>

      <div className="detail__grid">
        <section className="detail__review" aria-labelledby="deliverables-title">
          <h2 className="section-title" id="deliverables-title">
            Deliverables <span className="mono">{project.deliverables.length}</span>
          </h2>

          <div className="dlist" role="tablist" aria-label="Deliverables">
            {project.deliverables.map((d) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={d.id === selected.id}
                className="dlist__item"
                onClick={() => withViewTransition(() => setParams({ deliverable: d.id }, { replace: true }))}
              >
                <span className="dlist__thumb">
                  <DeliverablePreview deliverable={d} project={project} size="small" />
                </span>
                <span className="dlist__text">
                  <strong>{d.title}</strong>
                  <span className="mono">v{d.version}</span>
                </span>
                <StatusBadge status={d.status} />
              </button>
            ))}
          </div>

          <ReviewPanel key={selected.id} project={project} deliverable={selected} />
        </section>

        <aside className="detail__side">
          <section aria-labelledby="milestones-title">
            <h2 className="section-title" id="milestones-title">
              Milestones
            </h2>
            <div className="panel milestones">
              <MilestoneBar project={project} />
              <ul>
                {project.milestones.map((m) => (
                  <li key={m.id} className={m.done ? 'is-done' : ''}>
                    <label>
                      <input
                        type="checkbox"
                        checked={m.done}
                        disabled={!canEditMilestones}
                        onChange={() => {
                          dispatch({ type: 'TOGGLE_MILESTONE', projectId: project.id, milestoneId: m.id })
                          toast(m.done ? `Reopened “${m.title}”` : `Milestone “${m.title}” completed`, { tone: m.done ? 'info' : 'success' })
                        }}
                      />
                      <span className="milestones__box" aria-hidden="true">
                        {m.done && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span className="milestones__title">{m.title}</span>
                    </label>
                    <span className="mono milestones__date">{shortDate(m.dueAt)}</span>
                  </li>
                ))}
              </ul>
              {!canEditMilestones && <p className="milestones__note">Only the freelancer can update milestones.</p>}
            </div>
          </section>

          <section aria-labelledby="p-activity-title">
            <h2 className="section-title" id="p-activity-title">
              Project activity
            </h2>
            <ActivityList items={projectActivity.slice(0, 8)} showProject={false} />
          </section>
        </aside>
      </div>
    </div>
  )
}
