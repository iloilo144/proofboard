import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'

const reduced = () => document.documentElement.dataset.motion === 'calm'

/**
 * Runs a React state update inside the browser's native View Transitions API,
 * so the old and new UI cross-fade (and named elements morph). Falls back to a
 * plain update in browsers without support or when reduced motion is preferred.
 */
export function withViewTransition(update) {
  if (!document.startViewTransition || reduced()) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}

export function useTransitionNavigate() {
  const navigate = useNavigate()
  return (to, options) => withViewTransition(() => navigate(to, options))
}

/** A <Link> that navigates through a view transition (modifier-clicks still open new tabs). */
export function VLink({ to, onClick, replace, ...props }) {
  const go = useTransitionNavigate()
  return (
    <Link
      to={to}
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        go(to, { replace })
      }}
    />
  )
}
