import { useBoard } from '../context/BoardContext'
import { useToast } from '../context/ToastContext'
import { withViewTransition } from '../lib/transitions'

const ROLES = [
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'client', label: 'Client' },
]

export default function RoleSwitch() {
  const { role, dispatch } = useBoard()
  const toast = useToast()

  const change = (id) => {
    withViewTransition(() => dispatch({ type: 'SET_ROLE', role: id }))
    toast(id === 'client' ? 'Viewing as the client' : 'Viewing as the freelancer', {
      tone: 'info',
      description: id === 'client' ? 'You can approve work or request changes.' : 'You can upload versions and tick off milestones.',
    })
  }

  return (
    <fieldset className="role-switch">
      <legend>Viewing as</legend>
      <div className="role-switch__track" data-role={role}>
        <span className="role-switch__thumb" aria-hidden="true" />
        {ROLES.map((r) => (
          <label key={r.id}>
            <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => change(r.id)} />
            <span>{r.label}</span>
          </label>
        ))}
      </div>
      <p className="role-switch__hint">
        {role === 'freelancer' ? 'Upload versions and tick off milestones.' : 'Approve work or request changes.'}
      </p>
    </fieldset>
  )
}
