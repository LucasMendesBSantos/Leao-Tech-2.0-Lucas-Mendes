const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const JWT_SENHA = process.env.JWT_SENHA

// ─── Middlewares ──────────────────────────────────────────────────────────────

function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não enviado' })
    }
    const token = authHeader.split(' ')[1]
    try {
        req.usuario = jwt.verify(token, JWT_SENHA)
        next()
    } catch {
        return res.status(401).json({ erro: 'Token inválido ou expirado' })
    }
}

function apenasParaFuncionarios(req, res, next) {
    if (req.usuario.tipo !== 'funcionario') {
        return res.status(403).json({ erro: 'Acesso restrito a funcionários' })
    }
    next()
}

// ─── Cadastro ─────────────────────────────────────────────────────────────────

app.post('/cadastro', async (req, res) => {
    const { nome, cpf, senha, tipo, email, telefone, endereco } = req.body

    if (!nome || !cpf || !senha || !tipo) {
        return res.status(400).json({ erro: 'Nome, CPF, senha e tipo são obrigatórios' })
    }
    if (!['cliente', 'funcionario'].includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo inválido' })
    }
    if (senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' })
    }
    if (tipo === 'cliente' && !email) {
        return res.status(400).json({ erro: 'Email é obrigatório para clientes' })
    }

    const { data: existente, error: erroBusca } = await supabase
        .from('usuarios')
        .select('id')
        .eq('cpf', cpf)

    if (erroBusca) {
        return res.status(500).json({ erro: erroBusca.message })
    }
    if (existente.length > 0) {
        return res.status(409).json({ erro: 'CPF já cadastrado' })
    }

    const senhaCrip = await bcrypt.hash(senha, 10)

    const { data: novoUsuario, error: erroUsuario } = await supabase
        .from('usuarios')
        .insert([{ nome, cpf, senha: senhaCrip, tipo }])
        .select()

    if (erroUsuario) {
        return res.status(500).json({ erro: erroUsuario.message })
    }

    let clienteId = null
    if (tipo === 'cliente') {
        const { data: clienteData, error: erroCliente } = await supabase
            .from('clientes')
            .insert([{ nome, cpf, email, telefone, endereco }])
            .select()

        if (erroCliente) {
            await supabase.from('usuarios').delete().eq('id', novoUsuario[0].id)
            return res.status(500).json({ erro: erroCliente.message })
        }
        clienteId = clienteData[0].id
    }

    const usuario = novoUsuario[0]
    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo, cpf: usuario.cpf, clienteId },
        JWT_SENHA,
        { expiresIn: '1h' }
    )

    return res.status(201).json({
        mensagem: 'Cadastro realizado com sucesso!',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo, cpf: usuario.cpf, clienteId }
    })
})

// ─── Login ────────────────────────────────────────────────────────────────────

app.post('/login', async (req, res) => {
    const { cpf, senha } = req.body
    if (!cpf || !senha) {
        return res.status(400).json({ erro: 'CPF e senha são obrigatórios' })
    }

    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('cpf', cpf)

    if (error) {
        return res.status(500).json({ erro: 'Erro ao buscar usuário' })
    }
    if (data.length === 0) {
        return res.status(401).json({ erro: 'CPF não encontrado' })
    }

    const usuario = data[0]
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta' })
    }

    // Se for cliente, busca o registro financeiro pelo CPF
    let clienteId = null
    if (usuario.tipo === 'cliente') {
        const { data: clienteData } = await supabase
            .from('clientes')
            .select('id')
            .eq('cpf', cpf)
            .single()
        clienteId = clienteData?.id || null
    }

    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo, cpf: usuario.cpf, clienteId },
        JWT_SENHA,
        { expiresIn: '1h' }
    )

    return res.json({
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo, cpf: usuario.cpf, clienteId }
    })
})

// ─── Clientes ─────────────────────────────────────────────────────────────────

app.get('/clientes', autenticarToken, async (req, res) => {
    if (req.usuario.tipo === 'funcionario') {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('id', { ascending: true })
        if (error) return res.status(500).json({ erro: error.message })
        return res.json(data)
    }

    // Cliente vê apenas o próprio registro
    if (!req.usuario.clienteId) {
        return res.status(404).json({ erro: 'Registro de cliente não encontrado. Cadastre seu CPF na tabela de clientes.' })
    }
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', req.usuario.clienteId)
        .single()
    if (error) return res.status(500).json({ erro: error.message })
    return res.json(data)
})

app.post('/clientes', autenticarToken, apenasParaFuncionarios, async (req, res) => {
    const { nome, cpf, email, telefone, endereco } = req.body
    if (!nome || !cpf || !email) {
        return res.status(400).json({ erro: 'Nome, CPF e email são obrigatórios' })
    }
    const { data, error } = await supabase
        .from('clientes')
        .insert([{ nome, cpf, email, telefone, endereco }])
        .select()
    if (error) return res.status(500).json({ erro: error.message })
    return res.status(201).json(data[0])
})

app.put('/clientes/:id', autenticarToken, apenasParaFuncionarios, async (req, res) => {
    const { id } = req.params
    const { nome, cpf, email, telefone, endereco } = req.body
    const { data, error } = await supabase
        .from('clientes')
        .update({ nome, cpf, email, telefone, endereco })
        .eq('id', id)
        .select()
    if (error) return res.status(500).json({ erro: error.message })
    if (!data.length) return res.status(404).json({ erro: 'Cliente não encontrado' })
    return res.json(data[0])
})

app.delete('/clientes/:id', autenticarToken, apenasParaFuncionarios, async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (error) return res.status(500).json({ erro: error.message })
    return res.json({ mensagem: 'Cliente deletado com sucesso' })
})

// ─── Contas ───────────────────────────────────────────────────────────────────

app.get('/contas', autenticarToken, async (req, res) => {
    let query = supabase
        .from('contas')
        .select('*, cliente:clientes(id, nome, cpf)')
        .order('id', { ascending: true })

    if (req.usuario.tipo === 'cliente') {
        if (!req.usuario.clienteId) return res.json([])
        query = query.eq('cliente_id', req.usuario.clienteId)
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ erro: error.message })
    return res.json(data)
})

app.post('/contas', autenticarToken, apenasParaFuncionarios, async (req, res) => {
    const { cliente_id, numero, tipo, saldo } = req.body
    if (!cliente_id) {
        return res.status(400).json({ erro: 'ID do cliente é obrigatório' })
    }
    const numeroGerado = numero || String(Math.floor(Math.random() * 900000) + 100000)
    const { data, error } = await supabase
        .from('contas')
        .insert([{ cliente_id, numero: numeroGerado, tipo: tipo || 'corrente', saldo: saldo || 0 }])
        .select()
    if (error) return res.status(500).json({ erro: error.message })
    return res.status(201).json(data[0])
})

// ─── Transações ───────────────────────────────────────────────────────────────

app.get('/transacoes', autenticarToken, async (req, res) => {
    if (req.usuario.tipo === 'funcionario') {
        const { data, error } = await supabase
            .from('transacoes')
            .select('*, conta:contas(id, numero, tipo, cliente:clientes(nome))')
            .order('data', { ascending: false })
        if (error) return res.status(500).json({ erro: error.message })
        return res.json(data)
    }

    if (!req.usuario.clienteId) return res.json([])

    const { data: contas } = await supabase
        .from('contas')
        .select('id')
        .eq('cliente_id', req.usuario.clienteId)

    if (!contas?.length) return res.json([])

    const contaIds = contas.map(c => c.id)
    const { data, error } = await supabase
        .from('transacoes')
        .select('*, conta:contas(id, numero, tipo)')
        .in('conta_id', contaIds)
        .order('data', { ascending: false })
    if (error) return res.status(500).json({ erro: error.message })
    return res.json(data)
})

app.post('/transacoes', autenticarToken, async (req, res) => {
    const { conta_id, tipo, valor, descricao } = req.body
    if (!conta_id || !tipo || valor === undefined) {
        return res.status(400).json({ erro: 'conta_id, tipo e valor são obrigatórios' })
    }

    // Se for cliente, verifica se a conta pertence a ele
    if (req.usuario.tipo === 'cliente') {
        const { data: conta } = await supabase
            .from('contas')
            .select('cliente_id')
            .eq('id', conta_id)
            .single()
        if (!conta || conta.cliente_id !== req.usuario.clienteId) {
            return res.status(403).json({ erro: 'Conta não pertence ao usuário' })
        }
    }

    const { data, error } = await supabase
        .from('transacoes')
        .insert([{ conta_id, tipo, valor: Number(valor), descricao, data: new Date().toISOString() }])
        .select()
    if (error) return res.status(500).json({ erro: error.message })
    return res.status(201).json(data[0])
})

// ─── Serviços ─────────────────────────────────────────────────────────────────

app.get('/servicos', autenticarToken, async (req, res) => {
    const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('id', { ascending: true })
    if (error) return res.status(500).json({ erro: error.message })
    return res.json(data)
})

app.post('/servicos', autenticarToken, apenasParaFuncionarios, async (req, res) => {
    const { nome, descricao, preco } = req.body
    if (!nome || preco === undefined) {
        return res.status(400).json({ erro: 'Nome e preço são obrigatórios' })
    }
    const { data, error } = await supabase
        .from('servicos')
        .insert([{ nome, descricao, preco: Number(preco) }])
        .select()
    if (error) return res.status(500).json({ erro: error.message })
    return res.status(201).json(data[0])
})

app.delete('/servicos/:id', autenticarToken, apenasParaFuncionarios, async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('servicos').delete().eq('id', id)
    if (error) return res.status(500).json({ erro: error.message })
    return res.json({ mensagem: 'Serviço deletado com sucesso' })
})

// ─── Serviços Contratados ─────────────────────────────────────────────────────

app.get('/servicos-contratados', autenticarToken, async (req, res) => {
    let query = supabase
        .from('servicos_contratados')
        .select('*, cliente:clientes(id, nome), servico:servicos(id, nome, preco)')
        .order('id', { ascending: true })

    if (req.usuario.tipo === 'cliente') {
        if (!req.usuario.clienteId) return res.json([])
        query = query.eq('cliente_id', req.usuario.clienteId)
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ erro: error.message })
    return res.json(data)
})

app.post('/servicos-contratados', autenticarToken, async (req, res) => {
    let { cliente_id, servico_id } = req.body

    if (req.usuario.tipo === 'cliente') {
        cliente_id = req.usuario.clienteId
    }

    if (!cliente_id || !servico_id) {
        return res.status(400).json({ erro: 'cliente_id e servico_id são obrigatórios' })
    }

    const { data, error } = await supabase
        .from('servicos_contratados')
        .insert([{ cliente_id, servico_id, data_contratacao: new Date().toISOString() }])
        .select()
    if (error) return res.status(500).json({ erro: error.message })
    return res.status(201).json(data[0])
})

// ─── Servidor ─────────────────────────────────────────────────────────────────

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000')
})
