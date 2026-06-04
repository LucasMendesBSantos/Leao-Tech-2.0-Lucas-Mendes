import React from 'react'
import usuarios from '../../Dados/usuarios'
import CardUsuario from '../CardUsuario/CardUsuario'

const ListaUsuarios = () => {
  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Lista de Usuários</h2>

      <div className="row">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="col-md-4">
            <CardUsuario usuario={usuario} />
          </div>
        ))}
      </div>

      <div className="table-responsive mt-5">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Empresa</th>
              <th>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefone}</td>
                <td>{usuario.empresa}</td>
                <td>{usuario.cidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ListaUsuarios
