import { useState } from 'react'
import { Check, RotateCcw, Upload, Send } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { useToast } from '../context/ToastContext'
import { withViewTransition } from '../lib/transitions'
import DeliverablePreview from './DeliverablePreview'
import { Avatar, StatusBadge } from './Bits'
import { FREELANCER } from '../data/seed'
import { timeAgo } from '../utils/project'
import './ReviewPanel.css'

export default function ReviewPanel({ project, deliverable }) {
  const { role, dispatch } = useBoard()
  const toast = useToast()
  const [mode, setMode] = useState(null) // 'changes' | 'upload' | null
  const [note, setNote] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const ids = { projectId: project.id, deliverableId: deliverable.id }
  const isClient = role === 'client'
  const { status, version } = deliverable

  const done = (message, description, tone = 'success') => {
    setMode(null)
    setNote('')
    setError('')
    toast(message, { description, tone })
  }

  const submitMode = (e) => {
    e.preventDefault()
    if (mode === 'changes') {
      if (note.trim().length < 10) return setError('Tell Jordan what to change (at least 10 characters).')
      withViewTransition(() => dispatch({ type: 'REQUEST_CHANGES', ...ids, text: note.trim() }))
      done('Changes requested', 'Jordan has been notified.', 'warning')
    } else {
      withViewTransition(() => dispatch({ type: 'UPLOAD_VERSION', ...ids, note: note.trim() }))
      done(status === 'draft' ? 'Shared for review' : `Version ${version + 1} uploaded`, `${project.client.name} has been notified.`)
    }
  }

  const submitComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    dispatch({ type: 'ADD_COMMENT', ...ids, text: comment.trim() })
    setComment('')
    toast('Comment posted', { tone: 'info' })
  }

  const person = (author) => (author === 'client' ? project.client : FREELANCER)

  return (
    <article className="review panel" aria-labelledby="review-title">
      <header className="review__head">
        <div>
          <h3 id="review-title">{deliverable.title}</h3>
          <p>
            <span className="mono">v{version}</span> · updated {timeAgo(deliverable.updatedAt)}
          </p>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="review__stage" style={{ viewTransitionName: 'review-stage' }}>
        <DeliverablePreview deliverable={deliverable} project={project} />
      </div>

      {/* Role-aware actions */}
      <div className="review__actions">
        {isClient ? (
          status === 'in-review' ? (
            <>
              <button
                className="btn btn--approve"
                onClick={() => {
                  withViewTransition(() => dispatch({ type: 'APPROVE', ...ids }))
                  done(`Version ${version} approved`, 'Jordan has been notified.')
                }}
              >
                <Check size={16} aria-hidden="true" /> Approve v{version}
              </button>
              <button className="btn" onClick={() => setMode(mode === 'changes' ? null : 'changes')} aria-expanded={mode === 'changes'}>
                <RotateCcw size={15} aria-hidden="true" /> Request changes
              </button>
            </>
          ) : (
            <p className="review__hint">
              {status === 'approved' && 'You approved this version.'}
              {status === 'changes' && 'Jordan is working on your requested changes.'}
              {status === 'draft' && 'Jordan hasn’t shared this deliverable yet.'}
            </p>
          )
        ) : (
          <>
            <button className="btn btn--primary" onClick={() => setMode(mode === 'upload' ? null : 'upload')} aria-expanded={mode === 'upload'}>
              <Upload size={15} aria-hidden="true" /> {status === 'draft' ? 'Share for review' : `Upload v${version + 1}`}
            </button>
            <p className="review__hint">
              {status === 'in-review' && 'Waiting for the client. Switch to client view to approve.'}
              {status === 'changes' && 'The client asked for changes. Upload a new version when it’s ready.'}
              {status === 'approved' && 'Approved by the client.'}
              {status === 'draft' && 'Only you can see this draft.'}
            </p>
          </>
        )}
      </div>

      {mode && (
        <form className="review__form" onSubmit={submitMode} noValidate>
          <label htmlFor="mode-note">
            {mode === 'changes' ? 'What should change?' : 'Note for the client (optional)'}
          </label>
          <textarea
            id="mode-note"
            className="input"
            rows={3}
            value={note}
            autoFocus
            onChange={(e) => {
              setNote(e.target.value)
              setError('')
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'mode-error' : undefined}
            placeholder={mode === 'changes' ? 'e.g. Could the logo work in a single colour for stamps?' : 'e.g. Tightened spacing and swapped the hero photo.'}
          />
          {error && (
            <p className="error" id="mode-error">
              {error}
            </p>
          )}
          <div className="review__form-actions">
            <button type="button" className="btn btn--quiet" onClick={() => setMode(null)}>
              Cancel
            </button>
            <button className="btn btn--primary">{mode === 'changes' ? 'Send request' : 'Upload & notify'}</button>
          </div>
        </form>
      )}


      <section className="thread" aria-label="Feedback">
        <h4>
          Feedback <span className="mono">{deliverable.comments.length}</span>
        </h4>
        {deliverable.comments.length ? (
          <ol>
            {deliverable.comments.map((c) => (
              <li key={c.id} className={`thread__item ${c.kind === 'changes' ? 'is-changes' : ''}`}>
                <Avatar person={person(c.author)} you={c.author === 'freelancer'} />
                <div>
                  <p className="thread__meta">
                    <strong>{person(c.author).name}</strong>
                    {c.kind === 'changes' && <span className="badge badge--amber">Change request</span>}
                    <time className="mono" dateTime={c.at}>
                      {timeAgo(c.at)}
                    </time>
                  </p>
                  <p>{c.text}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="thread__empty">No feedback yet.</p>
        )}

        <form className="thread__form" onSubmit={submitComment}>
          <label htmlFor="comment" className="visually-hidden">
            Add a comment
          </label>
          <input
            id="comment"
            className="input"
            placeholder={isClient ? 'Write a comment to Jordan…' : `Reply to ${project.client.name.split(' ')[0]}…`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn--primary" disabled={!comment.trim()} aria-label="Send comment">
            <Send size={15} />
          </button>
        </form>
      </section>
    </article>
  )
}
