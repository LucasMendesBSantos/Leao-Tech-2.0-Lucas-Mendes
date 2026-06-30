import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const API_URL = '/api'

function formatarValor(valor) {
  return Number(valor || 0).toFixed(2).replace('.', ',')
}

function formatarData(data) {
  if (!data) return '-'
  return new Date(data).toLocaleDateString('pt-BR')
}

export default function PaginaCliente() {
  const { usuario, token, logout } = useAuth()
  const navigate = useNavigate()
  const [aba, setAba] = useState('perfil')
  const [dados, setDados] = useState({ perfil: null, contas: [], transacoes: [], servicos: [], servicosContratados: [] })
  const [carregando, setCarregando] = useState(true)

  async function apiFetch(endpoint, options = {}) {
    const resp = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
    })
    return resp.json()
  }

  async function carregarDados() {
    setCarregando(true)
    try {
      const [perfil, contas, transacoes, servicos, servicosContratados] = await Promise.all([
        apiFetch('/clientes'),
        apiFetch('/contas'),
        apiFetch('/transacoes'),
        apiFetch('/servicos'),
        apiFetch('/servicos-contratados'),
      ])
      setDados({ perfil, contas: contas || [], transacoes: transacoes || [], servicos: servicos || [], servicosContratados: servicosContratados || [] })
    } catch {
      console.error('Erro ao carregar dados')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarDados() }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (carregando) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: 'perfil', icon: '👤', label: 'Meu Perfil' },
    { id: 'contas', icon: '💳', label: 'Minhas Contas' },
    { id: 'transacoes', icon: '📊', label: 'Transações' },
    { id: 'servicos', icon: '🛠️', label: 'Serviços' },
  ]

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🏦</span>
          <span className="brand-name">Banco Digital</span>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <p className="user-name">{usuario?.nome}</p>
            <span className="user-badge badge-cliente">Cliente</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${aba === item.id ? 'active' : ''}`}
              onClick={() => setAba(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Sair
        </button>
      </aside>

      <main className="main-content">
        {aba === 'perfil' && <SecaoPerfil perfil={dados.perfil} />}
        {aba === 'contas' && <SecaoContas contas={dados.contas} />}
        {aba === 'transacoes' && (
          <SecaoTransacoes
            transacoes={dados.transacoes}
            contas={dados.contas}
            apiFetch={apiFetch}
            onAtualizar={carregarDados}
          />
        )}
        {aba === 'servicos' && (
          <SecaoServicos
            servicos={dados.servicos}
            contratados={dados.servicosContratados}
            apiFetch={apiFetch}
            onAtualizar={carregarDados}
          />
        )}
      </main>
    </div>
  )
}

function SecaoPerfil({ perfil }) {
  if (!perfil || perfil.erro) {
    return (
      <div className="secao">
        <h2 className="secao-titulo">Meu Perfil</h2>
        <div className="card">
          <p className="texto-muted">Nenhum registro de cliente encontrado para este CPF.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="secao">
      <h2 className="secao-titulo">Meu Perfil</h2>
      <div className="card">
        <div className="info-grid">
          <div className="info-item"><span className="info-label">Nome</span><strong>{perfil.nome}</strong></div>
          <div className="info-item"><span className="info-label">CPF</span><strong>{perfil.cpf}</strong></div>
          <div className="info-item"><span className="info-label">Email</span><strong>{perfil.email}</strong></div>
          <div className="info-item"><span className="info-label">Telefone</span><strong>{perfil.telefone || '-'}</strong></div>
          <div className="info-item info-item-full"><span className="info-label">Endereço</span><strong>{perfil.endereco || '-'}</strong></div>
        </div>
      </div>
    </div>
  )
}

function SecaoContas({ contas }) {
  return (
    <div className="secao">
      <h2 className="secao-titulo">Minhas Contas</h2>
      {contas.length === 0 ? (
        <div className="empty-state">Nenhuma conta encontrada.</div>
      ) : (
        <div className="contas-grid">
          {contas.map(conta => (
            <div key={conta.id} className={`conta-card conta-${conta.tipo}`}>
              <div className="conta-header">
                <span className="conta-icon">{conta.tipo === 'poupança' ? '💰' : '💳'}</span>
                <span className="conta-tipo">{conta.tipo}</span>
              </div>
              <div className="conta-numero">Ag. 0001 — C. {conta.numero}</div>
              <div className="conta-saldo">R$ {formatarValor(conta.saldo)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SecaoTransacoes({ transacoes, contas, apiFetch, onAtualizar }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ conta_id: '', tipo: 'deposito', valor: '', descricao: '' })
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroOperador, setFiltroOperador] = useState('todos')
  const [filtroValor, setFiltroValor] = useState('')

  const operadores = {
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    gte: (a, b) => a >= b,
    lte: (a, b) => a <= b,
  }

  const transacoesFiltradas = transacoes.filter(t => {
    if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) return false
    if (filtroOperador !== 'todos' && filtroValor !== '') {
      if (!operadores[filtroOperador](Number(t.valor), Number(filtroValor))) return false
    }
    return true
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMsg(null)
    try {
      const dados = await apiFetch('/transacoes', {
        method: 'POST',
        body: JSON.stringify({ ...form, valor: Number(form.valor) }),
      })
      if (dados.erro) {
        setMsg({ tipo: 'erro', texto: dados.erro })
      } else {
        setMsg({ tipo: 'sucesso', texto: 'Transação registrada com sucesso!' })
        setForm({ conta_id: '', tipo: 'deposito', valor: '', descricao: '' })
        setShowForm(false)
        onAtualizar()
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao registrar transação' })
    } finally {
      setEnviando(false)
    }
  }

  const tipoClasses = { deposito: 'badge-sucesso', saque: 'badge-perigo', transferencia: 'badge-aviso' }

  return (
    <div className="secao">
      <div className="secao-header">
        <h2 className="secao-titulo">Transações</h2>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setMsg(null) }}>
          {showForm ? '✕ Cancelar' : '+ Nova Transação'}
        </button>
      </div>

      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>Nova Transação</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Conta</label>
                <select value={form.conta_id} onChange={e => setForm({ ...form, conta_id: e.target.value })} required>
                  <option value="">Selecione a conta...</option>
                  {contas.map(c => (
                    <option key={c.id} value={c.id}>{c.numero} ({c.tipo})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="deposito">Depósito</option>
                  <option value="saque">Saque</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
              <div className="form-group">
                <label>Valor (R$)</label>
                <input type="number" step="0.01" min="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="0,00" required />
              </div>
              <div className="form-group form-group-wide">
                <label>Descrição</label>
                <input type="text" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Opcional" />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={enviando}>{enviando ? 'Registrando...' : 'Registrar'}</button>
          </form>
        </div>
      )}

      <div className="filtros-bar">
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos os tipos</option>
          <option value="deposito">Depósito</option>
          <option value="saque">Saque</option>
          <option value="transferencia">Transferência</option>
        </select>
        <select value={filtroOperador} onChange={e => setFiltroOperador(e.target.value)}>
          <option value="todos">Qualquer valor</option>
          <option value="eq">Igual a</option>
          <option value="gt">Maior que</option>
          <option value="lt">Menor que</option>
          <option value="gte">Maior ou igual a</option>
          <option value="lte">Menor ou igual a</option>
        </select>
        {filtroOperador !== 'todos' && (
          <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={filtroValor}
            onChange={e => setFiltroValor(e.target.value)}
          />
        )}
      </div>

      {transacoesFiltradas.length === 0 ? (
        <div className="empty-state">Nenhuma transação encontrada para o filtro.</div>
      ) : (
        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Conta</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map(t => (
                <tr key={t.id}>
                  <td>{formatarData(t.data)}</td>
                  <td>{t.conta?.numero || t.conta_id}</td>
                  <td><span className={`badge ${tipoClasses[t.tipo]}`}>{t.tipo}</span></td>
                  <td className="valor-cell">R$ {formatarValor(t.valor)}</td>
                  <td>{t.descricao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SecaoServicos({ servicos, contratados, apiFetch, onAtualizar }) {
  const [msg, setMsg] = useState(null)

  async function contratar(servicoId) {
    setMsg(null)
    const dados = await apiFetch('/servicos-contratados', {
      method: 'POST',
      body: JSON.stringify({ servico_id: servicoId }),
    })
    if (dados.erro) {
      setMsg({ tipo: 'erro', texto: dados.erro })
    } else {
      setMsg({ tipo: 'sucesso', texto: 'Serviço contratado com sucesso!' })
      onAtualizar()
    }
  }

  const contratadosIds = contratados.map(c => c.servico_id)

  return (
    <div className="secao">
      <h2 className="secao-titulo">Serviços</h2>
      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}

      <h3 className="subsecao-titulo">Serviços Disponíveis</h3>
      {servicos.length === 0 ? (
        <div className="empty-state">Nenhum serviço disponível.</div>
      ) : (
        <div className="servicos-grid">
          {servicos.map(s => (
            <div key={s.id} className="servico-card">
              <div className="servico-nome">{s.nome}</div>
              <div className="servico-descricao">{s.descricao || 'Sem descrição'}</div>
              <div className="servico-preco">R$ {formatarValor(s.preco)}<span>/mês</span></div>
              {contratadosIds.includes(s.id) ? (
                <span className="badge badge-sucesso">✓ Contratado</span>
              ) : (
                <button className="btn-primary btn-sm" onClick={() => contratar(s.id)}>Contratar</button>
              )}
            </div>
          ))}
        </div>
      )}

      {contratados.length > 0 && (
        <>
          <h3 className="subsecao-titulo">Meus Serviços Contratados</h3>
          <div className="table-wrapper">
            <table className="tabela">
              <thead>
                <tr><th>Serviço</th><th>Preço</th><th>Data de Contratação</th></tr>
              </thead>
              <tbody>
                {contratados.map(c => (
                  <tr key={c.id}>
                    <td>{c.servico?.nome || '-'}</td>
                    <td>R$ {formatarValor(c.servico?.preco)}</td>
                    <td>{formatarData(c.data_contratacao)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
