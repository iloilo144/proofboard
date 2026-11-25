import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CommandPalette from './components/CommandPalette'
import Overview from './pages/Overview'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Activity from './pages/Activity'
import NotFound from './pages/NotFound'
import './App.css'

const typing = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setNavOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  // ⌘K / Ctrl+K anywhere, or "/" when not typing, opens the command menu
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (e.key === '/' && !typing(document.activeElement)) {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openPalette = () => setPaletteOpen(true)

  return (
    <div className={`app ${navOpen ? 'nav-open' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar onSearch={openPalette} />
      <div className="app__scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />
      <div className="app__main">
        <Topbar onMenu={() => setNavOpen((o) => !o)} navOpen={navOpen} onSearch={openPalette} />
        <main id="main">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
