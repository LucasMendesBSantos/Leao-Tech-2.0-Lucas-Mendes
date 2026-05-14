import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import produtos from '../../Dados/produtos'
import './ProdutoDetalhes.css'

const ProdutoDetalhes = () => {
  const { id } = useParams()
  const produto = produtos.find(p => p.id === parseInt(id))
  const [cepData, setCepData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cepInput, setCepInput] = useState('')

  const fetchCepData = async (cep) => {
    if (!cep || cep.length !== 8) {
      setError('Por favor, digite um CEP válido (8 dígitos)')
      return
    }

    setLoading(true)
    setError(null)
    setCepData(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do CEP')
      }
      const data = await response.json()

      if (data.erro) {
        throw new Error('CEP não encontrado')
      }

      setCepData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCepSubmit = (e) => {
    e.preventDefault()
    fetchCepData(cepInput.replace(/\D/g, '')) // Remove caracteres não numéricos
  }

  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Só permite números
    if (value.length <= 8) {
      setCepInput(value)
    }
  }

  if (!produto) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Produto não encontrado
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="row g-0">
              <div className="col-md-6">
                <img
                  src={produto.image}
                  className="img-fluid rounded-start h-100 object-fit-contain"
                  alt={produto.title}
                  style={{ minHeight: '400px' }}
                />
              </div>
              <div className="col-md-6">
                <div className="card-body d-flex flex-column h-100">
                  <h2 className="card-title mb-3">{produto.title}</h2>
                  <p className="card-text mb-3">{produto.description}</p>
                  <div className="mb-3">
                    <h4 className="text-success">Preço: R$ {produto.price}</h4>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">Avaliação:</span>
                      <span className="badge bg-warning text-dark">
                        ⭐ {produto.rating.rate} ({produto.rating.count} avaliações)
                      </span>
                    </div>
                    <p className="text-muted mb-0">Categoria: {produto.category}</p>
                  </div>

                  {/* Div para dados do ViaCEP */}
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5 className="mb-3">Consultar CEP (ViaCEP)</h5>

                    <form onSubmit={handleCepSubmit} className="mb-3">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Digite o CEP (ex: 01001000)"
                          value={cepInput}
                          onChange={handleCepChange}
                          maxLength="8"
                        />
                        <button
                          className="btn btn-outline-primary"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                      </div>
                    </form>

                    {loading && <p className="text-info">Carregando dados do CEP...</p>}
                    {error && <p className="text-danger">Erro: {error}</p>}

                    {cepData && (
                      <div className="mt-3 p-3 bg-white border rounded">
                        <h6 className="mb-2">Resultado da busca:</h6>
                        <p><strong>CEP:</strong> {cepData.cep}</p>
                        <p><strong>Logradouro:</strong> {cepData.logradouro}</p>
                        <p><strong>Bairro:</strong> {cepData.bairro}</p>
                        <p><strong>Cidade:</strong> {cepData.localidade}</p>
                        <p><strong>Estado:</strong> {cepData.uf}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button className="btn btn-primary btn-lg w-100">
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProdutoDetalhes