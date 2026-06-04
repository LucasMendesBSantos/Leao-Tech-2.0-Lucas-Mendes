import React from 'react'
import { Link } from 'react-router-dom'

const CardProduto = ({produto}) => {
    return (
        <>
            <div className="card mt-3 mb-3" style={{ 'width': '18rem' }} >
                <img style={{ 'height': '200px', 'width': '100%' }} src={produto.image} className="card-img-top object-fit-contain" alt="..." />
                <div className="card-body">
                    <h5 className="card-title title-text">{produto.title}</h5>
                    <p className="card-text">{produto.description}</p>
                    <p>Preço: {produto.price}</p>
                    <Link to={`/produto/${produto.id}`} className="btn btn-primary">Ver Detalhes</Link>
                </div>
            </div>

        </>
    )
}

export default CardProduto