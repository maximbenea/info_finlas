import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import DocsPage from './pages/DocsPage'
import SubmitPage from './pages/SubmitPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DocsPage />} />
      <Route path="/submit" element={<SubmitPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
