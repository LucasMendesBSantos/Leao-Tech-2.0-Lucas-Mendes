import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import CadastroProduto from './pages/Admin/CadastroProduto'
import { ProdutosProvider } from './context/ProdutosContext'


const App = () => {
  return (
    <>
      <ProdutosProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/admin/produtos' element={<CadastroProduto />} />
          </Routes>
        </BrowserRouter>
      </ProdutosProvider>
    </>
  )
}

export default App
