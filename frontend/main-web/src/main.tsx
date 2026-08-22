import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { HackathonProvider } from './contexts/HackathonContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <HackathonProvider>
        <App />
      </HackathonProvider>
    </AuthProvider>
  </StrictMode>,
)
