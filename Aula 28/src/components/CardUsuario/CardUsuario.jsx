import React from 'react'

const CardUsuario = ({ usuario }) => {
  return (
    <div className="card h-100 border-primary mb-3">
      <div className="card-body">
        <h5 className="card-title">{usuario.nome}</h5>
        <p className="card-text mb-1"><strong>Email:</strong> {usuario.email}</p>
        <p className="card-text mb-1"><strong>Telefone:</strong> {usuario.telefone}</p>
        <p className="card-text mb-1"><strong>Empresa:</strong> {usuario.empresa}</p>
        <p className="card-text mb-0"><strong>Cidade:</strong> {usuario.cidade}</p>
      </div>
    </div>
  )
}

export default CardUsuario
