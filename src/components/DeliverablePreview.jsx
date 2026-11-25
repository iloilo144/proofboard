import './DeliverablePreview.css'

/**
 * Lightweight, code-drawn previews of design deliverables. Each project palette
 * ([dark, accent, light]) is passed in as CSS variables so every client looks different.
 */
export default function DeliverablePreview({ deliverable, project, size = 'large' }) {
  const [dark, accent, light] = project.palette
  const style = { '--d': dark, '--a': accent, '--l': light }
  const brand = project.client.company.split(' ')[0]
  const Kind = KINDS[deliverable.kind] ?? Web

  return (
    <div className={`dp dp--${size} dp--${deliverable.kind}`} style={style} role="img" aria-label={`Preview of ${deliverable.title}, version ${deliverable.version}`}>
      <Kind brand={brand} version={deliverable.version} />
    </div>
  )
}

function Browser({ children }) {
  return (
    <div className="dp__browser">
      <div className="dp__chrome">
        <i />
        <i />
        <i />
      </div>
      <div className="dp__page">{children}</div>
    </div>
  )
}

function Nav({ brand }) {
  return (
    <div className="dp__nav">
      <b>{brand}</b>
      <span />
      <span />
      <span />
    </div>
  )
}

function Web({ brand, version }) {
  return (
    <Browser>
      <Nav brand={brand} />
      <div className={`dp__hero ${version >= 3 ? 'is-bright' : ''}`}>
        <div>
          <strong>Fresh roasts, every other Friday.</strong>
          <em />
          <em className="short" />
          <button tabIndex={-1}>Start a subscription</button>
        </div>
        <div className="dp__photo" />
      </div>
      <div className="dp__row">
        <span />
        <span />
        <span />
      </div>
    </Browser>
  )
}

function Shop({ brand }) {
  return (
    <Browser>
      <Nav brand={brand} />
      <div className="dp__shop">
        <div className="dp__filters">
          <em />
          <em />
          <em />
          <em className="short" />
        </div>
        <div className="dp__products">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="dp__product">
              <div className="dp__thumb" />
              <em />
              <em className="short" />
            </div>
          ))}
        </div>
      </div>
    </Browser>
  )
}

function Landing({ brand }) {
  return (
    <Browser>
      <Nav brand={brand} />
      <div className="dp__landing">
        <strong>Notes that survive the field.</strong>
        <em />
        <div className="dp__waitlist">
          <span />
          <button tabIndex={-1}>Join waitlist</button>
        </div>
        <div className="dp__row">
          <span />
          <span />
          <span />
        </div>
      </div>
    </Browser>
  )
}

function Wireframe() {
  return (
    <div className="dp__wire">
      {['Bag', 'Details', 'Payment'].map((step, i) => (
        <div key={step} className="dp__screen">
          <small>
            {i + 1} · {step}
          </small>
          <em />
          <em />
          <em className="short" />
          <div className="dp__box" />
          <span className="dp__wbtn" />
        </div>
      ))}
    </div>
  )
}

function Sitemap() {
  return (
    <div className="dp__sitemap">
      <span className="node root">Home</span>
      <div className="dp__level">
        {['Shop', 'Subscriptions', 'Cafés', 'Our story'].map((n) => (
          <div key={n} className="dp__branch">
            <span className="node">{n}</span>
            <span className="node sub" />
            <span className="node sub" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Brand({ brand, version }) {
  return (
    <div className="dp__brand">
      <div className="dp__mark">
        <span className={version >= 2 ? 'heavy' : ''}>{brand[0]}</span>
      </div>
      <div className="dp__wordmark">
        <strong className={version >= 2 ? 'heavy' : ''}>{brand}</strong>
        <small>Joinery · Est. 1987</small>
      </div>
      <div className="dp__swatches">
        <span style={{ background: 'var(--d)' }} />
        <span style={{ background: 'var(--a)' }} />
        <span style={{ background: 'var(--l)' }} />
      </div>
    </div>
  )
}

function Moodboard() {
  return (
    <div className="dp__mood">
      <span className="t1" />
      <span className="t2" />
      <span className="t3" />
      <span className="t4" />
      <span className="t5">Aa</span>
    </div>
  )
}

function Doc({ brand }) {
  return (
    <div className="dp__doc">
      {['Logo', 'Colour', 'Type'].map((title, i) => (
        <div key={title} className="dp__sheet">
          <small>
            0{i + 1} — {title}
          </small>
          {i === 0 && <b>{brand[0]}</b>}
          {i === 1 && (
            <div className="dp__swatches">
              <span style={{ background: 'var(--d)' }} />
              <span style={{ background: 'var(--a)' }} />
            </div>
          )}
          {i === 2 && <b className="serif">Aa</b>}
          <em />
          <em className="short" />
        </div>
      ))}
    </div>
  )
}

const KINDS = {
  web: Web,
  shop: Shop,
  landing: Landing,
  wireframe: Wireframe,
  sitemap: Sitemap,
  brand: Brand,
  moodboard: Moodboard,
  doc: Doc,
}
