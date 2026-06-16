const prompt = require('prompt-sync')()
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)
const bcrypt = require('bcrypt')
const express = require('express')
const app = express()
app.use(express.json())

app.post('/cadastrarusuario', async (req, res) =>{
    console.log(req.body)
    const dados = req.body
    const resultado = await inserirUsuario(dados)
    console.log(resultado)
    res.json(resultado)
})

//endpoit para cadastrar um autor

async function inserirAutor(){
    let nome = prompt('Digite o nome do autor: ')
    let nacionalidade = prompt('Digite a nacionalidade: ')
    let novoAutor = {
        nome:nome,
        nacionalidade:nacionalidade
    }
    const {data, error} = await supabase.from('biblioteca_autor').insert(novoAutor).select()
    console.log(data)
    console.log(error)
}
// inserirAutor()



// hash de senha
async function hashSenha(senha){
    if (!senha) return null
    const saltRounds = 10
    return await bcrypt.hash(senha, saltRounds)
}

// ---------- USUÁRIOS ----------
app.post('/usuarios', async (req, res) => {
    try{
        const body = req.body
        if (body.senha) body.senha = await hashSenha(body.senha)
        const {data, error} = await supabase.from('biblioteca_usuarios').insert(body).select()
        if (error) return res.status(400).json({error})
        res.status(201).json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/usuarios', async (req, res) => {
    try{
        const {data, error} = await supabase.from('biblioteca_usuarios').select('id,nome,cpf,telefone,endereco,tipo')
        if (error) return res.status(400).json({error})
        res.json(data)
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/usuarios/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_usuarios').select('*').eq('id', id)
        if (error) return res.status(400).json({error})
        if (!data || data.length === 0) return res.status(404).json({message:'Usuário não encontrado'})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.put('/usuarios/:id', async (req, res) => {
    try{
        const id = req.params.id
        const body = req.body
        if (body.senha) body.senha = await hashSenha(body.senha)
        const {data, error} = await supabase.from('biblioteca_usuarios').update(body).eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.delete('/usuarios/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_usuarios').delete().eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json({deleted: data})
    }catch(e){res.status(500).json({error:e.message})}
})

// PERFIS 
app.post('/perfis', async (req, res) => {
    try{
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_perfis').insert(body).select()
        if (error) return res.status(400).json({error})
        res.status(201).json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/perfis', async (req, res) => {
    try{
        const {data, error} = await supabase.from('biblioteca_perfis').select('*')
        if (error) return res.status(400).json({error})
        res.json(data)
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/perfis/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_perfis').select('*').eq('id', id)
        if (error) return res.status(400).json({error})
        if (!data || data.length === 0) return res.status(404).json({message:'Perfil não encontrado'})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.put('/perfis/:id', async (req, res) => {
    try{
        const id = req.params.id
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_perfis').update(body).eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.delete('/perfis/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_perfis').delete().eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json({deleted: data})
    }catch(e){res.status(500).json({error:e.message})}
})

// AUTORES 
app.post('/autores', async (req, res) => {
    try{
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_autor').insert(body).select()
        if (error) return res.status(400).json({error})
        res.status(201).json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/autores', async (req, res) => {
    try{
        const {data, error} = await supabase.from('biblioteca_autor').select('*')
        if (error) return res.status(400).json({error})
        res.json(data)
    }catch(e){res.status(500).json({error:e.message})}
})

// Buscar autores por nome e/ou nacionalidade via query
// Ex: /autores/buscar?nome=joao&nacionalidade=brasileiro
app.get('/autores/buscar', async (req, res) => {
    try{
        const { nome, nacionalidade } = req.query
        let query = supabase.from('biblioteca_autor').select('*')
        if (nome) query = query.ilike('nome', `%${nome}%`)
        if (nacionalidade) query = query.ilike('nacionalidade', `%${nacionalidade}%`)
        const { data, error } = await query
        if (error) return res.status(400).json({error})
        if (!data || data.length === 0) return res.status(404).json({message: 'Nenhum autor encontrado'})
        res.json(data)
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/autores/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_autor').select('*').eq('id', id)
        if (error) return res.status(400).json({error})
        if (!data || data.length === 0) return res.status(404).json({message:'Autor não encontrado'})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.put('/autores/:id', async (req, res) => {
    try{
        const id = req.params.id
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_autor').update(body).eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.delete('/autores/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_autor').delete().eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json({deleted: data})
    }catch(e){res.status(500).json({error:e.message})}
})

// LIVROS 
app.post('/livros', async (req, res) => {
    try{
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_livro').insert(body).select()
        if (error) return res.status(400).json({error})
        res.status(201).json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/livros', async (req, res) => {
    try{
        const {data, error} = await supabase.from('biblioteca_livro').select('*, biblioteca_autor(*)')
        if (error) return res.status(400).json({error})
        res.json(data)
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/livros/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_livro').select('*, biblioteca_autor(*)').eq('id', id)
        if (error) return res.status(400).json({error})
        if (!data || data.length === 0) return res.status(404).json({message:'Livro não encontrado'})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.put('/livros/:id', async (req, res) => {
    try{
        const id = req.params.id
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_livro').update(body).eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.delete('/livros/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_livro').delete().eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json({deleted: data})
    }catch(e){res.status(500).json({error:e.message})}
})

// EMPRÉSTIMOS 
app.post('/emprestimos', async (req, res) => {
    try{
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_emprestimo').insert(body).select()
        if (error) return res.status(400).json({error})
        res.status(201).json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/emprestimos', async (req, res) => {
    try{
        const {data, error} = await supabase.from('biblioteca_emprestimo').select('*, biblioteca_usuarios(*), biblioteca_livro(*)')
        if (error) return res.status(400).json({error})
        res.json(data)
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/emprestimos/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_emprestimo').select('*, biblioteca_usuarios(*), biblioteca_livro(*)').eq('id', id)
        if (error) return res.status(400).json({error})
        if (!data || data.length === 0) return res.status(404).json({message:'Empréstimo não encontrado'})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.put('/emprestimos/:id', async (req, res) => {
    try{
        const id = req.params.id
        const body = req.body
        const {data, error} = await supabase.from('biblioteca_emprestimo').update(body).eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json(data[0])
    }catch(e){res.status(500).json({error:e.message})}
})

app.delete('/emprestimos/:id', async (req, res) => {
    try{
        const id = req.params.id
        const {data, error} = await supabase.from('biblioteca_emprestimo').delete().eq('id', id).select()
        if (error) return res.status(400).json({error})
        res.json({deleted: data})
    }catch(e){res.status(500).json({error:e.message})}
})

app.get('/listarlivros',async (req,res)=>{
    const {data, error} = await supabase.from('biblioteca_livro').select('titulo,genero, biblioteca_autor(nome,nacionalidade),quantidade')

    if (error){
        console.log(error)
    }

    console.log('Deu tudo certo!!',data)

    res.json(data)
})

// http://localhost:3000/listarlivros/romance/1
app.get('/listarlivros/:genero/:id', async (req,res) => {
    console.log(req.params)
    console.log(req.params.id)
    console.log(req.params.genero)
    id = req.params.id
    const {data, error} = await supabase.from('biblioteca_livro').select('*').eq('id',id)
    if (error){
        res.send(`Erro: ${error}`)
        return
    }
    if(data.length > 0){
        res.json(data[0])
    }else{
        res.send('Livro não encontrado!!!')
    }
})
// http://localhost:3000/buscarlivro?titulo=herry
app.get('/buscarlivro',async (req, res) => {
    console.log(req.query)
    const titulo = req.query.titulo

    const {data, error} = await supabase.from('biblioteca_livro').select('*').ilike('titulo',`%${titulo}%`)

    if (error){
        res.send(`Erro: ${error}`)
        return
    }
    if(data.length > 0){
        res.json(data)
    }else{
        res.send('Livro não encontrado!!!')
    }
})

// Limitações do GET
/*
GET -> Buscar informações
GET NÃO -> Cadastra, não atualiza e não exclue 
*/



async function buscarLivro(titulo) {
    const {data, error} = await supabase.from('biblioteca_livro').select('titulo,genero,quantidade').eq('titulo',titulo)
    if (error){
        console.log(error)
    }
    console.log(data)
    data.forEach(livro => {
        console.log(`Título: ${livro.titulo} - ${livro.quantidade}, Gênero: ${livro.genero}`)
    });
}
/*
eq() -> igual
neq() -> diferente
gt() -> maior que
lt() -> menor que
lte() -> menor ou igual
gte() -> maior ou igual
like() -> parecido
ilike() -> parecido (não case sentive)
order() -> ordenar()
limit() -> limitar resultado
*/


// buscarLivro('A cabana')

async function atualizarAutor(id) {
    let nome = prompt('Digite o novo nome: ')
    let nacionalidade = prompt('Digite a nova nacionalidade')
    let atualizacao = {
        nome:nome,
        nacionalidade:nacionalidade
    }
    const {data, error} = await supabase.from('biblioteca_autor').update(atualizacao).eq('id',id).select()
    if (error){
        console.log(error)
    }
}

async function deletarAutor(id) {
    const {data, error} = await supabase.from('biblioteca_autor').delete().eq('id',id).select()
    if (error){
        console.log(error)
    }
    console.log(data)
}

async function inserirUsuario(dados) {
    let nome = dados.nome
    let cpf = dados.cpf
    let telefone = dados.telefone
    let endereco = dados.endereco
    let senha = dados.senha
    let tipo = dados.tipo
    const saltRounds = 10
    const senhaCrip = await bcrypt.hash(senha, saltRounds)
    let novoUsuario = {
        nome:nome,
        cpf:cpf,
        telefone:telefone,
        endereco:endereco,
        senha:senhaCrip,
        tipo:tipo
    }
    const {data, error} = await supabase.from('biblioteca_usuarios').insert(novoUsuario).select()
    error ? console.log(error):console.log('Dados Inseridos com sucesso')
}
// senha 123456789
// senha 12345
async function logarSistema() {
    console.log('====== Login =======')
    const cpf = prompt('Digite o seu CPF: ')
    const senha = prompt('Digite sua senha: ')
    const {data, error} = await supabase.from('biblioteca_usuarios').select('*').eq('cpf',cpf)
    if (error){
        console.log('Usuário não encontrado')
        return false
    }
    if (data.length > 0){
        const senhaCorreta = await bcrypt.compare(senha,data[0].senha)
        if (senhaCorreta){
            return data[0]
        }else{
            return false
        }
    }else{
        console.log('CPF não encontrado')
        return  false
    }
    
}



async function menu() {
    console.log('====== MENU ======')
    console.log('1 - Cadastrar Usuário')
    console.log('2 - Cadastrar Logar no sistema')

    console.log('0 - Sair')
    let opcao = prompt('Escolha uma opção: ')

    while (opcao != '0'){
        switch (opcao) {
            case '1':
                inserirUsuario()
                break;
            case '2':
                let usuario = await logarSistema()
                if (usuario){
                    console.log('Usuário Logado')
                    console.log(`Seja bem-vindo ${usuario.nome}`)
                    
                    if(usuario.tipo == 'cliente'){
                        console.log('====== MENU ======')
                        console.log('1 - Listar Livros')
                        console.log('0 - Sair')
                        let opcaoCliente = prompt('Escolha uma opção: ')
                        while(opcaoCliente != '0'){
                            switch (opcaoCliente) {
                                case '1':
                                    await listarLivros()
                                    break;
                            
                                default:
                                    break;
                            }
                            console.log('====== MENU ======')
                            console.log('1 - Listar Livros')
                            console.log('0 - Sair')
                            opcaoCliente = prompt('Escolha uma opção: ')
                        }
                        
                    }else if(usuario.tipo == 'funcionario'){
                        console.log('É funcionario')
                    }
                }
                break;
            
            default:
                break;
        }
        console.log('====== MENU ======')
        console.log('1 - Cadastrar Usuário')
        console.log('2 - Logar no sistema')

        console.log('0 - Sair')
        opcao = prompt('Escolha uma opção: ')
    }
}

// menu()

app.listen(3000, () => {
    console.log('Acesse o sistema em: http://localhost:3000')
})