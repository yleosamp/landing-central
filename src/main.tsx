import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // Alterado Switch para Routes
import PageHome from './pages/pageHome.tsx'
import BusinessManagement from './pages/businessManagement.tsx'
import Login from './pages/login.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/empresa" element={<BusinessManagement />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </StrictMode>,
)
