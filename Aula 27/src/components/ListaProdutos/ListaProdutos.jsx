import React from 'react'
import produtosObj from '../../Dados/produtos'
import './ListarProdutos.css'
import CardProduto from '../CardProduto/CardProduto'


const ListarProdutos = () => {
    console.log(produtosObj)

    return (
        <>
            <div className='container'>
                <div className='row'>
                    {produtosObj.map((produto) => (
                        <div key={produto.id} className='col-4'>
                            <CardProduto produto={produto}/>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}

export default ListarProdutos