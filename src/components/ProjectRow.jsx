import { ArrowUpRight } from 'lucide-react'
import { Avatar, MilestoneBar, ProjectBadge } from './Bits'
import { VLink } from '../lib/transitions'
import { daysUntil, projectStatus, relativeDue, shortDate } from '../utils/project'
import './ProjectRow.css'

export default function ProjectRow({ project, index = 0 }) {
  const status = projectStatus(project)
  const days = daysUntil(project.dueAt)
  const urgent = status !== 'completed' && days <= 7

  return (
    <li className="prow rise" style={{ '--i': index }}>
      {/* the swatch shares a view-transition name with the project page header, so it morphs into it */}
      <span className="prow__swatch" style={{ background: project.palette[1], viewTransitionName: `swatch-${project.id}` }} aria-hidden="true" />
      <div className="prow__name">
        <VLink to={`/projects/${project.id}`}>{project.client.company}</VLink>
        <span>{project.name}</span>
      </div>
      <div className="prow__client">
        <Avatar person={project.client} />
        <span>{project.client.name}</span>
      </div>
      <MilestoneBar project={project} />
      <div className={`prow__due ${urgent ? 'is-urgent' : ''}`}>
        <span className="mono">{shortDate(project.dueAt)}</span>
        <small>{status === 'completed' ? 'Delivered' : relativeDue(project.dueAt)}</small>
      </div>
      <ProjectBadge status={status} />
      <ArrowUpRight size={16} className="prow__chev" aria-hidden="true" />
    </li>
  )
}
