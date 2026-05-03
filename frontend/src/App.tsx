import { Navigate, Route, Routes } from 'react-router-dom'
import DocsPage from './pages/DocsPage'
import LaboratorPage from './pages/LaboratorPage'
import MediaPage from './pages/MediaPage'
import SubmitPage from './pages/SubmitPage'
import TabelePage from './pages/TabelePage'

function App() {
  // o rută = o pagină. /resurse redirecționează spre /media.
  return (
    <Routes>
      <Route path="/" element={<DocsPage />} />
      <Route path="/submit" element={<SubmitPage />} />
      <Route path="/tabele" element={<TabelePage />} />
      <Route path="/media" element={<MediaPage />} />
      <Route path="/resurse" element={<Navigate to="/media" replace />} />
      <Route path="/laborator" element={<LaboratorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
