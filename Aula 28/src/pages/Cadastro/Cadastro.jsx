import { useState } from 'react'

function Cadastro() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    endereco: '',
    endereco2: '',
    cep: '',
    cidade: '',
    receberInformacoes: false,
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = async (event) => {
    const { name, value, type, checked } = event.target
    let newValue = type === 'checkbox' ? checked : value

    if (name === 'cep') {
      newValue = newValue.replace(/\D/g, '')
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }))

    if (name === 'cep' && newValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${newValue}/json/`)
        if (!response.ok) {
          throw new Error('Erro ao consultar CEP')
        }

        const data = await response.json()
        if (!data.erro) {
          setFormData((prevState) => ({
            ...prevState,
            endereco: data.logradouro || prevState.endereco,
            cidade: data.localidade || prevState.cidade,
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title mb-4">Cadastro</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="endereco" className="form-label">
                    Endereço
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, apartamento"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="endereco2" className="form-label">
                    Endereço 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="endereco2"
                    name="endereco2"
                    value={formData.endereco2}
                    onChange={handleChange}
                    placeholder="Bloco, complemento, bairro"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cep" className="form-label">
                    CEP
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="Digite seu CEP"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cidade" className="form-label">
                    Cidade
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Digite sua cidade"
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="receberInformacoes"
                    name="receberInformacoes"
                    checked={formData.receberInformacoes}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="receberInformacoes">
                    Aceito receber informações e promoções
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submeter
                </button>
              </form>

              {enviado && (
                <div className="alert alert-success mt-4" role="alert">
                  Formulário enviado com sucesso!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
