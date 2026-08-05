import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home'
import Lore from './pages/lore'
import Entrar from './pages/entrar'
import Perfil from './pages/perfil'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background min-h-screen font-body">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lore" element={<Lore />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App