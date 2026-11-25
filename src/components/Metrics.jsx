import { useEffect, useRef, useState } from 'react'

/** Counts from the previous value to the new one with an ease-out curve. */
export function NumberTicker({ value, format = (n) => n.toLocaleString('en-GB') }) {
  const [shown, setShown] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    const reduced = document.documentElement.dataset.motion === 'calm'
    const start = from.current
    if (reduced || start === value) {
      setShown(value)
      from.current = value
      return
    }
    const duration = 900
    const t0 = performance.now()
    let raf
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setShown(Math.round(start + (value - start) * eased))
      if (p < 1) raf = requestAnimationFrame(step)
      else from.current = value
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <span className="ticker">{format(shown)}</span>
}

/** A tiny line chart. `points` is an array of numbers; it draws itself on mount. */
export function Sparkline({ points, width = 96, height = 28 }) {
  const max = Math.max(1, ...points)
  const step = width / Math.max(1, points.length - 1)
  const coords = points.map((p, i) => [i * step, height - 3 - (p / max) * (height - 6)])
  const d = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${d} L${width},${height} L0,${height} Z`
  const [lx, ly] = coords.at(-1)
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path className="spark__area" d={area} />
      <path className="spark__line" d={d} pathLength="1" />
      <circle className="spark__dot" cx={lx} cy={ly} r="2.5" />
    </svg>
  )
}
