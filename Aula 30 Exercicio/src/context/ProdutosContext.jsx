import { createContext, useState, useContext } from 'react'

const ProdutosContext = createContext()

export const ProdutosProvider = ({ children }) => {
    const [produtos, setProdutos] = useState([])

    function adicionarProduto(produto) {
        setProdutos(prev => [...prev, { ...produto, id: Date.now() }])
    }

    return (
        <ProdutosContext.Provider value={{ produtos, adicionarProduto }}>
            {children}
        </ProdutosContext.Provider>
    )
}

export const useProdutos = () => useContext(ProdutosContext)
