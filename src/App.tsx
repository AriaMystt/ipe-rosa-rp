import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Lore from './pages/lore';

function App() {
  return (
    <HashRouter>
      <div className="bg-background min-h-screen font-body">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lore" element={<Lore />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  )
}

export default App