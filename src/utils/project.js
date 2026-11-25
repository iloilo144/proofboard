export const STATUS = {
  draft: { label: 'Draft', tone: 'neutral' },
  'in-review': { label: 'In review', tone: 'blue' },
  changes: { label: 'Changes requested', tone: 'amber' },
  approved: { label: 'Approved', tone: 'green' },
}

export const PROJECT_STATUS = {
  active: { label: 'In progress', tone: 'neutral' },
  review: { label: 'Awaiting client', tone: 'blue' },
  revisions: { label: 'Revisions', tone: 'amber' },
  completed: { label: 'Completed', tone: 'green' },
}

export function progress(project) {
  const done = project.milestones.filter((m) => m.done).length
  return { done, total: project.milestones.length, pct: Math.round((done / project.milestones.length) * 100) }
}

export function projectStatus(project) {
  if (project.milestones.every((m) => m.done)) return 'completed'
  if (project.deliverables.some((d) => d.status === 'changes')) return 'revisions'
  if (project.deliverables.some((d) => d.status === 'in-review')) return 'review'
  return 'active'
}

export function nextMilestone(project) {
  return project.milestones.find((m) => !m.done)
}

const DAY = 86400000

export function daysUntil(iso) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const target = new Date(iso)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - start) / DAY)
}

export function relativeDue(iso) {
  const d = daysUntil(iso)
  if (d === 0) return 'Due today'
  if (d === 1) return 'Due tomorrow'
  if (d > 1) return `Due in ${d} days`
  if (d === -1) return 'Was due yesterday'
  return `${Math.abs(d)} days overdue`
}

export function shortDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return shortDate(iso)
}

export const money = (n) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
