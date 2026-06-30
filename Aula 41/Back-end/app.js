const prompt = require('prompt-sync')()
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)
const bcrypt = require('bcrypt')
const express = require('express')

const jwt = require('jsonwebtoken')
const JWT_SENHA = process.env.JWT_SENHA

const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())


//npm install jsonwebtoken
//npm install cors


const API_KEY = process.env.API_KEY

// function verificarChave(chaveRecebida){
//     if (chaveRecebida != API_KEY){
//         return ({
//             "msg":"chave inválida"
//         })
//     }
// }


// app.post('/cadastrarusuario', async (req, res) =>{
//     console.log(req.body)
//     const dados = req.body
//     const resultado = await inserirUsuario(dados)
//     console.log(resultado)
//     res.json(resultado)
// })

// // Crie um endpoit para cadastrar um autor

// async function inserirAutor(){
//     let nome = prompt('Digite o nome do autor: ')
//     let nacionalidade = prompt('Digite a nacionalidade: ')
//     let novoAutor = {
//         nome:nome,
//         nacionalidade:nacionalidade
//     }
//     const {data, error} = await supabase.from('biblioteca_autor').insert(novoAutor).select()
//     console.log(data)
//     console.log(error)
// }
// // inserirAutor()

// app.get('/listarlivros',async (req,res)=>{
//     const {data, error} = await supabase.from('biblioteca_livro').select('titulo,genero, biblioteca_autor(nome,nacionalidade),quantidade')

//     if (error){
//         console.log(error)
//         return
//     }

//     console.log('Deu tudo certo!!',data)

//     res.json(data)
// })

// // http://localhost:3000/listarlivros/romance/1
// app.get('/listarlivros/:genero/:id', async (req,res) => {
//     console.log(req.params)
//     console.log(req.params.id)
//     console.log(req.params.genero)
//     id = req.params.id
//     const {data, error} = await supabase.from('biblioteca_livro').select('*').eq('id',id)
//     if (error){
//         res.send(`Erro: ${error}`)
//         return
//     }
//     if(data.length > 0){
//         res.json(data[0])
//     }else{
//         res.send('Livro não encontrado!!!')
//     }
// })
// // http://localhost:3000/buscarlivro?titulo=herry
// app.get('/buscarlivro',async (req, res) => {
//     console.log(req.query)
//     const titulo = req.query.titulo

//     const {data, error} = await supabase.from('biblioteca_livro').select('*').ilike('titulo',`%${titulo}%`)

//     if (error){
//         res.send(`Erro: ${error}`)
//         return
//     }
//     if(data.length > 0){
//         res.json(data)
//     }else{
//         res.send('Livro não encontrado!!!')
//     }
// })

// // Limitações do GET
// /*
// GET -> Buscar informações
// GET NÃO -> Cadastra, não atualiza e não exclue 
// */

// // Faça um endpoint para buscar todos os autores
// // Faça um endpoint bara buscar um autor pelo ID
// // Faça um endpoint para buscar pelo nome e nacionalidade (Usando o query string)

// async function buscarLivro(titulo) {
//     const {data, error} = await supabase.from('biblioteca_livro').select('titulo,genero,quantidade').eq('titulo',titulo)
//     if (error){
//         console.log(error)
//     }
//     console.log(data)
//     data.forEach(livro => {
//         console.log(`Título: ${livro.titulo} - ${livro.quantidade}, Gênero: ${livro.genero}`)
//     });
// }
// /*
// eq() -> igual
// neq() -> diferente
// gt() -> maior que
// lt() -> menor que
// lte() -> menor ou igual
// gte() -> maior ou igual
// like() -> parecido
// ilike() -> parecido (não case sentive)
// order() -> ordenar()
// limit() -> limitar resultado
// */


// // buscarLivro('A cabana')

// async function atualizarAutor(id) {
//     let nome = prompt('Digite o novo nome: ')
//     let nacionalidade = prompt('Digite a nova nacionalidade')
//     let atualizacao = {
//         nome:nome,
//         nacionalidade:nacionalidade
//     }
//     const {data, error} = await supabase.from('biblioteca_autor').update(atualizacao).eq('id',id).select()
//     if (error){
//         console.log(error)
//     }
// }

// async function deletarAutor(id) {
//     const {data, error} = await supabase.from('biblioteca_autor').delete().eq('id',id).select()
//     if (error){
//         console.log(error)
//     }
//     console.log(data)
// }

// async function inserirUsuario(dados) {
//     let nome = dados.nome
//     let cpf = dados.cpf
//     let telefone = dados.telefone
//     let endereco = dados.endereco
//     let senha = dados.senha
//     let tipo = dados.tipo
//     const saltRounds = 10
//     const senhaCrip = await bcrypt.hash(senha, saltRounds)
//     let novoUsuario = {
//         nome:nome,
//         cpf:cpf,
//         telefone:telefone,
//         endereco:endereco,
//         senha:senhaCrip,
//         tipo:tipo
//     }
//     const {data, error} = await supabase.from('biblioteca_usuarios').insert(novoUsuario).select()
//     error ? console.log(error):console.log('Dados Inseridos com sucesso')
// }
// // senha 123456789
// // senha 12345
// async function logarSistema() {
//     console.log('====== Login =======')
//     const cpf = prompt('Digite o seu CPF: ')
//     const senha = prompt('Digite sua senha: ')
//     const {data, error} = await supabase.from('biblioteca_usuarios').select('*').eq('cpf',cpf)
//     if (error){
//         console.log('Usuário não encontrado')
//         return false
//     }
//     if (data.length > 0){
//         const senhaCorreta = await bcrypt.compare(senha,data[0].senha)
//         if (senhaCorreta){
//             return data[0]
//         }else{
//             return false
//         }
//     }else{
//         console.log('CPF não encontrado')
//         return  false
//     }
    
// }



// async function menu() {
//     console.log('====== MENU ======')
//     console.log('1 - Cadastrar Usuário')
//     console.log('2 - Cadastrar Logar no sistema')

//     console.log('0 - Sair')
//     let opcao = prompt('Escolha uma opção: ')

//     while (opcao != '0'){
//         switch (opcao) {
//             case '1':
//                 inserirUsuario()
//                 break;
//             case '2':
//                 let usuario = await logarSistema()
//                 if (usuario){
//                     console.log('Usuário Logado')
//                     console.log(`Seja bem-vindo ${usuario.nome}`)
                    
//                     if(usuario.tipo == 'cliente'){
//                         console.log('====== MENU ======')
//                         console.log('1 - Listar Livros')
//                         console.log('0 - Sair')
//                         let opcaoCliente = prompt('Escolha uma opção: ')
//                         while(opcaoCliente != '0'){
//                             switch (opcaoCliente) {
//                                 case '1':
//                                     await listarLivros()
//                                     break;
                            
//                                 default:
//                                     break;
//                             }
//                             console.log('====== MENU ======')
//                             console.log('1 - Listar Livros')
//                             console.log('0 - Sair')
//                             opcaoCliente = prompt('Escolha uma opção: ')
//                         }
                        
//                     }else if(usuario.tipo == 'funcionario'){
//                         console.log('É funcionario')
//                     }
//                 }
//                 break;
            
//             default:
//                 break;
//         }
//         console.log('====== MENU ======')
//         console.log('1 - Cadastrar Usuário')
//         console.log('2 - Logar no sistema')

//         console.log('0 - Sair')
//         opcao = prompt('Escolha uma opção: ')
//     }
// }

// // menu()

app.get('/listarlivros',autenticarToken,async (req,res) => {
    // const chaveRecebida = req.headers['api-key']
    // console.log(chaveRecebida)
    // if(chaveRecebida != API_KEY){
    //     return res.status(401).json({
    //         "erro":"Chave API errada"
    //     })
    // }

    const {data, error} = await supabase.from('biblioteca_livro').select('*')
    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.get('/listarlivros/:id/:genero',autenticarToken, async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    const id = req.params.id
    const genero = req.params.genero
    console.log(id)
    console.log(genero)
    const {data, error} = await supabase.from('biblioteca_livro').select('*').eq('id',id)
    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.get('/buscarlivro', async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    console.log(req.query)
    const titulo = req.query.titulo
    const ano = req.query.ano
    const autor = req.query.autor
    const {data, error} = await supabase.from('biblioteca_livro').select('*').or(`titulo.ilike.%${titulo}%`,`autor.ilike.%${autor}%`,`ano.ilike.%${ano}%`)

    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.post('/cadastrarlivro', async(req,res) => {

    // const chaveRecebida = req.headers['api-key']
    // console.log(chaveRecebida)
    // if(chaveRecebida != API_KEY){
    //     return res.status(401).json({
    //         "erro":"Chave API errada"
    //     })
    // }

    console.log(req.body)

    const {data, error} = await supabase.from('biblioteca_livro').insert(req.body).select()

    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.put('/atualizarlivro/:id_livro',autenticarToken, async (req,res) => {
    console.log('atualizar livro')
    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    const id_livro = req.params.id_livro
    const atualizacoes = req.body
    console.log(atualizacoes)
    const {data, error} = await supabase.from('biblioteca_livro').update(atualizacoes).eq('id',id_livro).select()

    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.delete('/deletarlivro/:id_livro',autenticarToken, async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    const id_livro = req.params.id_livro
    const {data, error} = await supabase.from('biblioteca_livro').delete().eq('id',id_livro).select()
    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.post('/login', async (req,res) => {
    const cpf = req.body.cpf
    const senha = req.body.senha

    const {data, error} = await supabase.from('biblioteca_usuarios').select('*').eq('cpf',cpf)
    if(error){
        return res.status(401).json({
            "mensagem":`erro ${error}`
        })
    }
    if (data.length == 0){
        return res.json({
            "erro":"CPF não foi encontrado"
        })
    }
    const usuario = data[0]
    console.log(usuario)

    const senhaCorreta = await bcrypt.compare(senha,usuario.senha)
    if(senhaCorreta == false){
        return res.status(401).json({
            erro:'Senha incorreta'
        })
    }
    console.log(senhaCorreta)
    const token = await jwt.sign(
        {
            id:usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
        },JWT_SENHA,
        {
            expiresIn:'1h'
        }
    )
    

    console.log({
        mensagem: 'Login realizado com sucesso!',
        token: token,
        usuario:{
            id:usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
        }
    })

    return res.json({
        mensagem: 'Login realizado com sucesso!',
        token: token,
        usuario:{
            id:usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
        }
    })

})

function autenticarToken(req, res, next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.json({
            erro:'Token não enviado'
        })
    }
    const token = authHeader.split(' ')[1]
    try{
        const usuario = jwt.verify(token,JWT_SENHA)
        req.usuario = usuario
        console.log(usuario)
        next()
    }catch{
        return res.json({
            erro:'Token inválido'
        })
    }
}

app.listen(3000, () => {
    console.log('Acesse o sistema em: http://localhost:3000')
})
