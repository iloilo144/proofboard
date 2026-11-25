import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { createSeed } from '../data/seed'

const STORAGE_KEY = 'proofboard:v1'
const BoardContext = createContext(null)

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function load() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    /* fall through to a fresh workspace */
  }
  return createSeed()
}

/** Updates one deliverable inside one project, returning a new state tree. */
function updateDeliverable(state, projectId, deliverableId, fn) {
  return {
    ...state,
    projects: state.projects.map((p) =>
      p.id !== projectId ? p : { ...p, deliverables: p.deliverables.map((d) => (d.id === deliverableId ? fn(d) : d)) },
    ),
  }
}

function log(state, entry) {
  return {
    ...state,
    activity: [{ id: uid('a'), at: new Date().toISOString(), read: false, ...entry }, ...state.activity],
  }
}

function findDeliverable(state, projectId, deliverableId) {
  return state.projects.find((p) => p.id === projectId)?.deliverables.find((d) => d.id === deliverableId)
}

function reducer(state, action) {
  const now = new Date().toISOString()
  const { projectId, deliverableId } = action
  const actor = state.role

  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role }

    case 'TOGGLE_MILESTONE': {
      const project = state.projects.find((p) => p.id === projectId)
      const milestone = project.milestones.find((m) => m.id === action.milestoneId)
      const next = {
        ...state,
        projects: state.projects.map((p) =>
          p.id !== projectId
            ? p
            : { ...p, milestones: p.milestones.map((m) => (m.id === milestone.id ? { ...m, done: !m.done } : m)) },
        ),
      }
      return milestone.done
        ? log(next, { projectId, type: 'milestone', actor, text: `reopened the milestone ${milestone.title}` })
        : log(next, { projectId, type: 'milestone', actor, text: `completed the milestone ${milestone.title}` })
    }

    case 'ADD_COMMENT': {
      const d = findDeliverable(state, projectId, deliverableId)
      const next = updateDeliverable(state, projectId, deliverableId, (del) => ({
        ...del,
        comments: [...del.comments, { id: uid('c'), author: actor, text: action.text, at: now }],
      }))
      return log(next, { projectId, deliverableId, type: 'comment', actor, text: `commented on ${d.title}` })
    }

    case 'APPROVE': {
      const d = findDeliverable(state, projectId, deliverableId)
      const next = updateDeliverable(state, projectId, deliverableId, (del) => ({
        ...del,
        status: 'approved',
        updatedAt: now,
      }))
      return log(next, { projectId, deliverableId, type: 'approve', actor, text: `approved ${d.title} (v${d.version})` })
    }

    case 'REQUEST_CHANGES': {
      const d = findDeliverable(state, projectId, deliverableId)
      const next = updateDeliverable(state, projectId, deliverableId, (del) => ({
        ...del,
        status: 'changes',
        updatedAt: now,
        comments: [...del.comments, { id: uid('c'), author: actor, text: action.text, at: now, kind: 'changes' }],
      }))
      return log(next, { projectId, deliverableId, type: 'changes', actor, text: `requested changes on ${d.title}` })
    }

    case 'UPLOAD_VERSION': {
      const d = findDeliverable(state, projectId, deliverableId)
      const isFirstShare = d.status === 'draft'
      const version = isFirstShare ? d.version : d.version + 1
      const next = updateDeliverable(state, projectId, deliverableId, (del) => ({
        ...del,
        version,
        status: 'in-review',
        updatedAt: now,
        comments: action.note
          ? [...del.comments, { id: uid('c'), author: actor, text: action.note, at: now }]
          : del.comments,
      }))
      return log(next, {
        projectId,
        deliverableId,
        type: 'upload',
        actor,
        text: isFirstShare ? `shared ${d.title} for review` : `uploaded v${version} of ${d.title}`,
      })
    }

    case 'MARK_READ':
      return { ...state, activity: state.activity.map((a) => (a.id === action.id ? { ...a, read: true } : a)) }

    case 'MARK_ALL_READ':
      return { ...state, activity: state.activity.map((a) => ({ ...a, read: true })) }

    case 'RESET':
      return createSeed()

    default:
      return state
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors in the demo */
    }
  }, [state])

  const value = useMemo(() => {
    // Notifications are things the *other* side did that you haven't seen.
    const notifications = state.activity.filter((a) => a.actor !== state.role)
    return {
      ...state,
      dispatch,
      notifications,
      unread: notifications.filter((a) => !a.read).length,
      getProject: (id) => state.projects.find((p) => p.id === id),
    }
  }, [state])

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export function useBoard() {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used inside <BoardProvider>')
  return ctx
}
