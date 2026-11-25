import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import ProjectRow from '../components/ProjectRow'
import { PROJECT_STATUS, projectStatus } from '../utils/project'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Projects.css'

const FILTERS = [{ id: 'all', label: 'All' }, ...Object.entries(PROJECT_STATUS).map(([id, s]) => ({ id, label: s.label }))]

const SORTS = {
  due: { label: 'Due date', fn: (a, b) => new Date(a.dueAt) - new Date(b.dueAt) },
  client: { label: 'Client A–Z', fn: (a, b) => a.client.company.localeCompare(b.client.company) },
  value: { label: 'Highest value', fn: (a, b) => b.budget - a.budget },
}

export default function Projects() {
  useDocumentTitle('Projects')
  const { projects } = useBoard()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const filter = FILTERS.some((f) => f.id === params.get('status')) ? params.get('status') : 'all'
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'due'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const counts = useMemo(() => {
    const c = { all: projects.length }
    projects.forEach((p) => {
      const s = projectStatus(p)
      c[s] = (c[s] ?? 0) + 1
    })
    return c
  }, [projects])

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase()
    return projects
      .filter((p) => filter === 'all' || projectStatus(p) === filter)
      .filter(
        (p) =>
          !term ||
          [p.name, p.type, p.client.company, p.client.name, ...p.deliverables.map((d) => d.title)]
            .join(' ')
            .toLowerCase()
            .includes(term),
      )
      .sort(SORTS[sort].fn)
  }, [projects, q, filter, sort])

  return (
    <div className="page">
      <p className="page__eyebrow">Workspace</p>
      <h1 className="page__title">Projects</h1>

      <div className="toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => set('status', f.id)}>
              {f.label}
              <span className="mono">{counts[f.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="toolbar__right">
          <label className="toolbar__search">
            <Search size={15} aria-hidden="true" />
            <span className="visually-hidden">Filter projects</span>
            <input type="search" placeholder="Filter by client or project" value={q} onChange={(e) => set('q', e.target.value)} />
          </label>
          <label>
            <span className="visually-hidden">Sort projects</span>
            <select className="input" value={sort} onChange={(e) => set('sort', e.target.value)}>
              {Object.entries(SORTS).map(([id, s]) => (
                <option key={id} value={id}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="panel">
        {visible.length ? (
          <ul className="prows">
            {visible.map((p) => (
              <ProjectRow key={p.id} project={p} />
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <strong>No projects match</strong>
            {q ? `Nothing found for “${q}”. ` : 'No projects with this status. '}
            <button className="btn btn--quiet" onClick={() => setParams({}, { replace: true })}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
