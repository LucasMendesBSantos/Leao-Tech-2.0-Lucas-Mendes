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

export default function PaginaFuncionario() {
  const { usuario, token, logout } = useAuth()
  const navigate = useNavigate()
  const [aba, setAba] = useState('clientes')
  const [dados, setDados] = useState({ clientes: [], contas: [], transacoes: [], servicos: [], servicosContratados: [] })
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
      const [clientes, contas, transacoes, servicos, servicosContratados] = await Promise.all([
        apiFetch('/clientes'),
        apiFetch('/contas'),
        apiFetch('/transacoes'),
        apiFetch('/servicos'),
        apiFetch('/servicos-contratados'),
      ])
      setDados({
        clientes: clientes || [],
        contas: contas || [],
        transacoes: transacoes || [],
        servicos: servicos || [],
        servicosContratados: servicosContratados || [],
      })
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
    { id: 'clientes', icon: '👥', label: 'Clientes' },
    { id: 'contas', icon: '💳', label: 'Contas' },
    { id: 'transacoes', icon: '📊', label: 'Transações' },
    { id: 'servicos', icon: '🛠️', label: 'Serviços' },
    { id: 'servicos-contratados', icon: '📋', label: 'Serv. Contratados' },
  ]

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🏦</span>
          <span className="brand-name">Banco Digital</span>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">🧑‍💼</div>
          <div className="user-info">
            <p className="user-name">{usuario?.nome}</p>
            <span className="user-badge badge-funcionario">Funcionário</span>
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

        <button onClick={handleLogout} className="logout-btn">🚪 Sair</button>
      </aside>

      <main className="main-content">
        {aba === 'clientes' && (
          <AbaClientes clientes={dados.clientes} apiFetch={apiFetch} onAtualizar={carregarDados} />
        )}
        {aba === 'contas' && (
          <AbaContas contas={dados.contas} clientes={dados.clientes} apiFetch={apiFetch} onAtualizar={carregarDados} />
        )}
        {aba === 'transacoes' && (
          <AbaTransacoes transacoes={dados.transacoes} contas={dados.contas} apiFetch={apiFetch} onAtualizar={carregarDados} />
        )}
        {aba === 'servicos' && (
          <AbaServicos servicos={dados.servicos} apiFetch={apiFetch} onAtualizar={carregarDados} />
        )}
        {aba === 'servicos-contratados' && (
          <AbaServicosContratados contratados={dados.servicosContratados} clientes={dados.clientes} servicos={dados.servicos} apiFetch={apiFetch} onAtualizar={carregarDados} />
        )}
      </main>
    </div>
  )
}

// ─── Aba Clientes ─────────────────────────────────────────────────────────────

function AbaClientes({ clientes, apiFetch, onAtualizar }) {
  const formVazio = { nome: '', cpf: '', email: '', telefone: '', endereco: '' }
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formVazio)
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [busca, setBusca] = useState('')

  const termo = busca.trim().toLowerCase()
  const clientesFiltrados = termo
    ? clientes.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        c.cpf.toLowerCase().includes(termo) ||
        String(c.id) === termo
      )
    : clientes

  function abrirEdicao(cliente) {
    setEditando(cliente.id)
    setForm({ nome: cliente.nome, cpf: cliente.cpf, email: cliente.email, telefone: cliente.telefone || '', endereco: cliente.endereco || '' })
    setShowForm(true)
    setMsg(null)
  }

  function cancelar() {
    setShowForm(false)
    setEditando(null)
    setForm(formVazio)
    setMsg(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMsg(null)
    try {
      const dados = editando
        ? await apiFetch(`/clientes/${editando}`, { method: 'PUT', body: JSON.stringify(form) })
        : await apiFetch('/clientes', { method: 'POST', body: JSON.stringify(form) })

      if (dados.erro) {
        setMsg({ tipo: 'erro', texto: dados.erro })
      } else {
        setMsg({ tipo: 'sucesso', texto: editando ? 'Cliente atualizado!' : 'Cliente cadastrado!' })
        cancelar()
        onAtualizar()
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao salvar cliente' })
    } finally {
      setEnviando(false)
    }
  }

  async function deletar(id, nome) {
    if (!confirm(`Deletar cliente "${nome}"?`)) return
    const dados = await apiFetch(`/clientes/${id}`, { method: 'DELETE' })
    if (dados.erro) {
      setMsg({ tipo: 'erro', texto: dados.erro })
    } else {
      setMsg({ tipo: 'sucesso', texto: 'Cliente deletado com sucesso.' })
      onAtualizar()
    }
  }

  return (
    <div className="secao">
      <div className="secao-header">
        <h2 className="secao-titulo">Clientes</h2>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome, CPF ou ID..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <button className="btn-primary" onClick={() => { cancelar(); setShowForm(true) }}>+ Novo Cliente</button>
        </div>
      </div>

      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome *</label>
                <input type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>CPF *</label>
                <input type="text" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div className="form-group form-group-wide">
                <label>Endereço</label>
                <input type="text" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={enviando}>{enviando ? 'Salvando...' : 'Salvar'}</button>
              <button type="button" className="btn-secundario" onClick={cancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {clientesFiltrados.length === 0 ? (
        <div className="empty-state">{termo ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente cadastrado.'}</div>
      ) : (
        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr><th>ID</th><th>Nome</th><th>CPF</th><th>Email</th><th>Telefone</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nome}</td>
                  <td>{c.cpf}</td>
                  <td>{c.email}</td>
                  <td>{c.telefone || '-'}</td>
                  <td>
                    <div className="acoes">
                      <button className="btn-editar" onClick={() => abrirEdicao(c)}>✏️</button>
                      <button className="btn-deletar" onClick={() => deletar(c.id, c.nome)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Aba Contas ───────────────────────────────────────────────────────────────

function AbaContas({ contas, clientes, apiFetch, onAtualizar }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ cliente_id: '', tipo: 'corrente', saldo: '' })
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMsg(null)
    try {
      const dados = await apiFetch('/contas', {
        method: 'POST',
        body: JSON.stringify({ ...form, saldo: Number(form.saldo || 0) }),
      })
      if (dados.erro) {
        setMsg({ tipo: 'erro', texto: dados.erro })
      } else {
        setMsg({ tipo: 'sucesso', texto: 'Conta criada com sucesso!' })
        setForm({ cliente_id: '', tipo: 'corrente', saldo: '' })
        setShowForm(false)
        onAtualizar()
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao criar conta' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="secao">
      <div className="secao-header">
        <h2 className="secao-titulo">Contas</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nova Conta'}
        </button>
      </div>

      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>Nova Conta</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Cliente *</label>
                <select value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} required>
                  <option value="">Selecione o cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.cpf}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="corrente">Corrente</option>
                  <option value="poupança">Poupança</option>
                </select>
              </div>
              <div className="form-group">
                <label>Saldo Inicial (R$)</label>
                <input type="number" step="0.01" min="0" value={form.saldo} onChange={e => setForm({ ...form, saldo: e.target.value })} placeholder="0,00" />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={enviando}>{enviando ? 'Criando...' : 'Criar Conta'}</button>
          </form>
        </div>
      )}

      {contas.length === 0 ? (
        <div className="empty-state">Nenhuma conta cadastrada.</div>
      ) : (
        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr><th>Nº Conta</th><th>Tipo</th><th>Titular</th><th>Saldo</th></tr>
            </thead>
            <tbody>
              {contas.map(c => (
                <tr key={c.id}>
                  <td>{c.numero}</td>
                  <td><span className={`badge ${c.tipo === 'poupança' ? 'badge-sucesso' : 'badge-info'}`}>{c.tipo}</span></td>
                  <td>{c.cliente?.nome || '-'}</td>
                  <td className="valor-cell">R$ {formatarValor(c.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Aba Transações ───────────────────────────────────────────────────────────

const OPERADORES = {
  eq: (a, b) => a === b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  gte: (a, b) => a >= b,
  lte: (a, b) => a <= b,
}

function filtrarTransacoes(transacoes, filtroTipo, filtroOperador, filtroValor) {
  return transacoes.filter(t => {
    if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) return false
    if (filtroOperador !== 'todos' && filtroValor !== '') {
      if (!OPERADORES[filtroOperador](Number(t.valor), Number(filtroValor))) return false
    }
    return true
  })
}

function FiltroTransacoes({ filtroTipo, setFiltroTipo, filtroOperador, setFiltroOperador, filtroValor, setFiltroValor }) {
  return (
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
  )
}

function AbaTransacoes({ transacoes, contas, apiFetch, onAtualizar }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ conta_id: '', tipo: 'deposito', valor: '', descricao: '' })
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroOperador, setFiltroOperador] = useState('todos')
  const [filtroValor, setFiltroValor] = useState('')

  const transacoesFiltradas = filtrarTransacoes(transacoes, filtroTipo, filtroOperador, filtroValor)

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
        setMsg({ tipo: 'sucesso', texto: 'Transação registrada!' })
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
                <label>Conta *</label>
                <select value={form.conta_id} onChange={e => setForm({ ...form, conta_id: e.target.value })} required>
                  <option value="">Selecione a conta...</option>
                  {contas.map(c => <option key={c.id} value={c.id}>{c.numero} — {c.cliente?.nome} ({c.tipo})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="deposito">Depósito</option>
                  <option value="saque">Saque</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
              <div className="form-group">
                <label>Valor (R$) *</label>
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

      <FiltroTransacoes
        filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo}
        filtroOperador={filtroOperador} setFiltroOperador={setFiltroOperador}
        filtroValor={filtroValor} setFiltroValor={setFiltroValor}
      />

      {transacoesFiltradas.length === 0 ? (
        <div className="empty-state">Nenhuma transação encontrada para o filtro.</div>
      ) : (
        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr><th>Data</th><th>Conta</th><th>Titular</th><th>Tipo</th><th>Valor</th><th>Descrição</th></tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map(t => (
                <tr key={t.id}>
                  <td>{formatarData(t.data)}</td>
                  <td>{t.conta?.numero || t.conta_id}</td>
                  <td>{t.conta?.cliente?.nome || '-'}</td>
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

// ─── Aba Serviços ─────────────────────────────────────────────────────────────

function AbaServicos({ servicos, apiFetch, onAtualizar }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '' })
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMsg(null)
    try {
      const dados = await apiFetch('/servicos', {
        method: 'POST',
        body: JSON.stringify({ ...form, preco: Number(form.preco) }),
      })
      if (dados.erro) {
        setMsg({ tipo: 'erro', texto: dados.erro })
      } else {
        setMsg({ tipo: 'sucesso', texto: 'Serviço cadastrado!' })
        setForm({ nome: '', descricao: '', preco: '' })
        setShowForm(false)
        onAtualizar()
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao cadastrar serviço' })
    } finally {
      setEnviando(false)
    }
  }

  async function deletar(id, nome) {
    if (!confirm(`Deletar serviço "${nome}"?`)) return
    const dados = await apiFetch(`/servicos/${id}`, { method: 'DELETE' })
    if (dados.erro) {
      setMsg({ tipo: 'erro', texto: dados.erro })
    } else {
      setMsg({ tipo: 'sucesso', texto: 'Serviço deletado.' })
      onAtualizar()
    }
  }

  return (
    <div className="secao">
      <div className="secao-header">
        <h2 className="secao-titulo">Serviços</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Novo Serviço'}
        </button>
      </div>

      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>Novo Serviço</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome *</label>
                <input type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Preço Mensal (R$) *</label>
                <input type="number" step="0.01" min="0" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} required />
              </div>
              <div className="form-group form-group-wide">
                <label>Descrição</label>
                <input type="text" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={enviando}>{enviando ? 'Salvando...' : 'Salvar'}</button>
          </form>
        </div>
      )}

      {servicos.length === 0 ? (
        <div className="empty-state">Nenhum serviço cadastrado.</div>
      ) : (
        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr><th>Nome</th><th>Descrição</th><th>Preço/Mês</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {servicos.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.nome}</strong></td>
                  <td>{s.descricao || '-'}</td>
                  <td className="valor-cell">R$ {formatarValor(s.preco)}</td>
                  <td>
                    <button className="btn-deletar" onClick={() => deletar(s.id, s.nome)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Aba Serviços Contratados ─────────────────────────────────────────────────

function AbaServicosContratados({ contratados, clientes, servicos, apiFetch, onAtualizar }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ cliente_id: '', servico_id: '' })
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMsg(null)
    try {
      const dados = await apiFetch('/servicos-contratados', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (dados.erro) {
        setMsg({ tipo: 'erro', texto: dados.erro })
      } else {
        setMsg({ tipo: 'sucesso', texto: 'Serviço contratado com sucesso!' })
        setForm({ cliente_id: '', servico_id: '' })
        setShowForm(false)
        onAtualizar()
      }
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao contratar serviço' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="secao">
      <div className="secao-header">
        <h2 className="secao-titulo">Serviços Contratados</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Contratar Serviço'}
        </button>
      </div>

      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>Contratar Serviço para Cliente</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Cliente *</label>
                <select value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} required>
                  <option value="">Selecione o cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.cpf}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Serviço *</label>
                <select value={form.servico_id} onChange={e => setForm({ ...form, servico_id: e.target.value })} required>
                  <option value="">Selecione o serviço...</option>
                  {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} — R$ {(Number(s.preco) || 0).toFixed(2).replace('.', ',')}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={enviando}>{enviando ? 'Contratando...' : 'Confirmar'}</button>
          </form>
        </div>
      )}

      {contratados.length === 0 ? (
        <div className="empty-state">Nenhum serviço contratado.</div>
      ) : (
        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr><th>Cliente</th><th>Serviço</th><th>Preço/Mês</th><th>Data de Contratação</th></tr>
            </thead>
            <tbody>
              {contratados.map(c => (
                <tr key={c.id}>
                  <td>{c.cliente?.nome || '-'}</td>
                  <td>{c.servico?.nome || '-'}</td>
                  <td className="valor-cell">R$ {formatarValor(c.servico?.preco)}</td>
                  <td>{formatarData(c.data_contratacao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
