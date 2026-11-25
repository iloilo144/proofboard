import { PROJECT_STATUS, STATUS, progress } from '../utils/project'

export function StatusBadge({ status }) {
  const s = STATUS[status]
  return <span className={`badge badge--${s.tone}`}>{s.label}</span>
}

export function ProjectBadge({ status }) {
  const s = PROJECT_STATUS[status]
  return <span className={`badge badge--${s.tone}`}>{s.label}</span>
}

/** One segment per milestone; completed segments fill in one after another on mount. */
export function MilestoneBar({ project, showLabel = true }) {
  const { done, total } = progress(project)
  const nextIndex = project.milestones.findIndex((m) => !m.done)
  return (
    <div className="mbar">
      <div className="mbar__track" role="img" aria-label={`${done} of ${total} milestones complete`}>
        {project.milestones.map((m, i) => (
          <span key={m.id} title={m.title} className={`mbar__seg ${i === nextIndex ? 'is-next' : ''}`}>
            <span className={`mbar__fill ${m.done ? 'is-done' : ''}`} style={{ '--i': i }} />
          </span>
        ))}
      </div>
      {showLabel && (
        <span className="mbar__label">
          <span className="mono">
            {done}/{total}
          </span>{' '}
          {nextIndex >= 0 ? project.milestones[nextIndex].title : 'All milestones done'}
        </span>
      )}
    </div>
  )
}

export function Avatar({ person, you = false }) {
  return (
    <span className={`avatar ${you ? 'avatar--you' : ''}`} aria-hidden="true">
      {person.initials}
    </span>
  )
}
