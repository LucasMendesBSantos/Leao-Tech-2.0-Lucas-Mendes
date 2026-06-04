import Home from './pages/Home/Home'
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Sobre from './pages/Sobre/Sobre'
import ProdutoDetalhes from './pages/ProdutoDetalhes/ProdutoDetalhes'
import Carrinho from './pages/Carrinho/Carrinho'
import Usuarios from './pages/Usuarios/Usuarios'
//npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Sobre" element={<Sobre />} />
          <Route path="/produto/:id" element={<ProdutoDetalhes />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/usuarios" element={<Usuarios />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App