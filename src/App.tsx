import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import ScrollToTop from './components/ScrollToTop'
import ResumeDownloadFAB from './components/ResumeDownloadFAB'
import ScrollToTopButton from './components/ScrollToTopButton'
import ScrollProgress from './components/ScrollProgress'
import './App.css'

// Set initial theme before first paint
const saved = (() => { try { return localStorage.getItem('theme') } catch { return null } })()
document.documentElement.setAttribute('data-theme', saved || 'dark')

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollProgress />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
        <ResumeDownloadFAB />
        <ScrollToTopButton />
      </BrowserRouter>
    </ThemeProvider>
  )
}
