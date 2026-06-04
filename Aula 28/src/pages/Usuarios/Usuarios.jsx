import React, { useState } from 'react';
import { useUsuarios } from '../../context/UsuariosContext';

const Usuarios = () => {
  const { usuarios, adicionarUsuario, removerUsuario } = useUsuarios();
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cep: '',
    foto: '',
    empresa: '',
    cidade: ''
  });
  const [errors, setErrors] = useState({});

  const gerarUsuarioAleatorio = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      const user = data.results[0];

      const novoUsuario = {
        nome: `${user.name.first} ${user.name.last}`,
        telefone: user.phone,
        email: user.email,
        cep: user.location.postcode.toString(),
        foto: user.picture.large,
        empresa: 'Empresa Aleatória',
        cidade: `${user.location.city}, ${user.location.state}`
      };

      adicionarUsuario(novoUsuario);
      alert('Usuário aleatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar usuário aleatório:', error);
      alert('Erro ao gerar usuário aleatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const novoErros = {};
    if (!formData.nome.trim()) novoErros.nome = 'Nome é obrigatório';
    if (!formData.telefone.trim()) novoErros.telefone = 'Telefone é obrigatório';
    if (!formData.email.trim()) novoErros.email = 'Email é obrigatório';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) novoErros.email = 'Email inválido';
    if (!formData.cep.trim()) novoErros.cep = 'CEP é obrigatório';
    if (!formData.foto.trim()) novoErros.foto = 'URL da foto é obrigatória';
    
    setErrors(novoErros);
    return Object.keys(novoErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    adicionarUsuario({
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      cep: formData.cep,
      foto: formData.foto,
      empresa: formData.empresa || 'Não informado',
      cidade: formData.cidade || 'Não informado'
    });

    setFormData({
      nome: '',
      telefone: '',
      email: '',
      cep: '',
      foto: '',
      empresa: '',
      cidade: ''
    });
    
    setMostraFormulario(false);
    alert('Usuário cadastrado com sucesso!');
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5">Gerenciar Usuários</h1>

      {/* Abas */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <button
            className={`btn ${!mostraFormulario ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setMostraFormulario(false)}
          >
            Lista de Usuários
          </button>
          <button
            className={`btn ${mostraFormulario ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setMostraFormulario(true)}
          >
            Cadastrar Usuário
          </button>
        </div>
        <button
          className="btn btn-success"
          onClick={gerarUsuarioAleatorio}
          disabled={loading}
        >
          {loading ? 'Gerando...' : 'Gerar Usuário Aleatório'}
        </button>
      </div>

      {/* Lista de Usuários */}
      {!mostraFormulario && (
        <div>
          <h2 className="mb-4">Lista de Usuários</h2>
          
          {/* Cards de Usuários */}
          <div className="row mb-4">
            {loading && (
              <div className="col-12 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Gerando usuário...</span>
                    </div>
                    <p className="mt-2 mb-0">Gerando usuário aleatório...</p>
                  </div>
                </div>
              </div>
            )}
            {usuarios.map(usuario => (
              <div key={usuario.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {usuario.foto && (
                    <img
                      src={usuario.foto}
                      className="card-img-top"
                      alt={usuario.nome}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{usuario.nome}</h5>
                    <div className="card-text small mb-3">
                      <div className="mb-1">
                        <i className="fas fa-envelope text-muted me-1"></i>
                        <strong>Email:</strong> {usuario.email}
                      </div>
                      <div className="mb-1">
                        <i className="fas fa-phone text-muted me-1"></i>
                        <strong>Telefone:</strong> {usuario.telefone}
                      </div>
                      <div className="mb-1">
                        <i className="fas fa-map-marker-alt text-muted me-1"></i>
                        <strong>CEP:</strong> {usuario.cep}
                      </div>
                      <div className="mb-1">
                        <i className="fas fa-building text-muted me-1"></i>
                        <strong>Empresa:</strong> {usuario.empresa}
                      </div>
                      <div className="mb-1">
                        <i className="fas fa-city text-muted me-1"></i>
                        <strong>Cidade:</strong> {usuario.cidade}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => removerUsuario(usuario.id)}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela de Usuários */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CEP</th>
                  <th>Empresa</th>
                  <th>Cidade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefone}</td>
                    <td>{usuario.cep}</td>
                    <td>{usuario.empresa}</td>
                    <td>{usuario.cidade}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removerUsuario(usuario.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formulário de Cadastro */}
      {mostraFormulario && (
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title mb-4">Cadastrar Novo Usuário</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                    />
                    {errors.nome && <div className="invalid-feedback d-block">{errors.nome}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="telefone" className="form-label">Telefone *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(00) 99999-9999"
                    />
                    {errors.telefone && <div className="invalid-feedback d-block">{errors.telefone}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cep" className="form-label">CEP *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cep ? 'is-invalid' : ''}`}
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                    />
                    {errors.cep && <div className="invalid-feedback d-block">{errors.cep}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="foto" className="form-label">URL da Foto *</label>
                    <input
                      type="url"
                      className={`form-control ${errors.foto ? 'is-invalid' : ''}`}
                      id="foto"
                      name="foto"
                      value={formData.foto}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                    {errors.foto && <div className="invalid-feedback d-block">{errors.foto}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="empresa" className="form-label">Empresa</label>
                    <input
                      type="text"
                      className="form-control"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cidade" className="form-label">Cidade</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success flex-grow-1">
                      Cadastrar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary flex-grow-1"
                      onClick={() => {
                        setFormData({
                          nome: '',
                          telefone: '',
                          email: '',
                          cep: '',
                          foto: '',
                          empresa: '',
                          cidade: ''
                        });
                        setErrors({});
                      }}
                    >
                      Limpar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
