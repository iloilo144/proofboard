import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import { BoardProvider } from './context/BoardContext'
import { ToastProvider } from './context/ToastContext'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BoardProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BoardProvider>
    </BrowserRouter>
  </StrictMode>,
)
