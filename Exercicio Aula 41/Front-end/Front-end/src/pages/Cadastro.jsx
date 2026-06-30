import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const API_URL = '/api'

const FORM_VAZIO = {
  nome: '', cpf: '', senha: '', confirmarSenha: '', tipo: 'cliente',
  email: '', telefone: '', endereco: '',
}

export default function Cadastro() {
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login, usuario } = useAuth()
  const navigate = useNavigate()

  if (usuario) {
    return <Navigate to={usuario.tipo === 'cliente' ? '/cliente' : '/funcionario'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setCarregando(true)
    try {
      const resp = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const dados = await resp.json()

      if (!resp.ok || dados.erro) {
        setErro(dados.erro || 'Erro ao cadastrar')
        return
      }

      login(dados.usuario, dados.token)
      navigate(dados.usuario.tipo === 'cliente' ? '/cliente' : '/funcionario', { replace: true })
    } catch {
      setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card cadastro-card">
        <div className="login-header">
          <div className="login-logo">🏦</div>
          <h1>Criar Conta</h1>
          <p>Preencha os dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="tipo">Tipo de conta</label>
            <select id="tipo" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="cliente">Cliente</option>
              <option value="funcionario">Funcionário</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              type="text"
              value={form.cpf}
              onChange={e => setForm({ ...form, cpf: e.target.value })}
              placeholder="000.000.000-00"
              required
            />
          </div>

          {form.tipo === 'cliente' && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  type="text"
                  value={form.telefone}
                  onChange={e => setForm({ ...form, telefone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input
                  id="endereco"
                  type="text"
                  value={form.endereco}
                  onChange={e => setForm({ ...form, endereco: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <input
              id="confirmarSenha"
              type="password"
              value={form.confirmarSenha}
              onChange={e => setForm({ ...form, confirmarSenha: e.target.value })}
              required
            />
          </div>

          {erro && <div className="alerta alerta-erro">{erro}</div>}

          <button type="submit" disabled={carregando} className="btn-primary btn-block">
            {carregando ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="login-footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
