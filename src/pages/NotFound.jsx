import { Link } from 'react-router-dom'

export default function NotFound({ what = 'page' }) {
  return (
    <div className="page">
      <p className="page__eyebrow">404</p>
      <h1 className="page__title">We couldn’t find that {what}.</h1>
      <p style={{ margin: '0.75rem 0 1.5rem', color: 'var(--ink-3)' }}>
        It may have been archived, or the link is mistyped.
      </p>
      <Link to="/projects" className="btn btn--primary">
        Go to projects
      </Link>
    </div>
  )
}
