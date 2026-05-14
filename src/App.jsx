import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Overview from './pages/Overview'
import Members from './pages/Members'
import Classes from './pages/Classes'
import Coaches from './pages/Coaches'
import Placeholder from './pages/Placeholder'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="membres" element={<Members />} />
        <Route path="cours" element={<Classes />} />
        <Route path="coachs" element={<Coaches />} />
        <Route
          path="parametres"
          element={<Placeholder title="Paramètres" />}
        />
        <Route path="aide" element={<Placeholder title="Aide" />} />
        <Route
          path="*"
          element={
            <Placeholder
              title="Page introuvable"
              subtitle="Cette page n'existe pas encore."
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
