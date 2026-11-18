import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Docs from './pages/Docs'
import Home from './pages/Home'
import Playground from './pages/Playground'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<Docs />} />
        <Route path="playground" element={<Playground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
