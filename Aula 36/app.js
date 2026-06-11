const express = require('express')
const app = express()


const prompt = require('prompt-sync')()
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const bcrypt = require('bcrypt')


async function inserirAutor() {
    let nome = prompt('Digite o nome do autor: ')
    let nacionalidade = prompt('Digite a nacionalidade: ')
    let novoAutor = {
        nome: nome,
        nacionalidade: nacionalidade
    }
    const { data, error } = await supabase.from('biblioteca_autor').insert(novoAutor).select()
    console.log(data)
    console.log(error)
}
// inserirAutor()

app.get ('/listarLivros', async (req, res) => {
    const { data, error } = await supabase.from('biblioteca_livro').select('titulo,genero,quantidade')
   
    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro ao buscar livros' })
        return
    }

    res.json(data)
})
// listarLivros()

async function buscarLivro(titulo) {
    const { data, error } = await supabase.from('biblioteca_livro').select('titulo,genero,quantidade').eq('titulo', titulo)
    if (error) {
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
        nome: nome,
        nacionalidade: nacionalidade
    }
    const { data, error } = await supabase.from('biblioteca_autor').update(atualizacao).eq('id', id).select()
    if (error) {
        console.log(error)
    }
}

async function deletarAutor(id) {
    const { data, error } = await supabase.from('biblioteca_autor').delete().eq('id', id).select()
    if (error) {
        console.log(error)
    }
    console.log(data)
}

async function inserirUsuario() {
    let nome = prompt('Insira o nome: ')
    let cpf = prompt('Insira o cpf: ')
    let telefone = prompt('Insira o telefone: ')
    let endereco = prompt('Insira o endereco: ')
    let senha = prompt('Insira a senha: ')
    let tipo = prompt('Insira o tipo: ')
    const saltRounds = 10
    const senhaCrip = await bcrypt.hash(senha, saltRounds)
    let novoUsuario = {
        nome: nome,
        cpf: cpf,
        telefone: telefone,
        endereco: endereco,
        senha: senhaCrip,
        tipo: tipo
    }
    const { data, error } = await supabase.from('biblioteca_usuarios').insert(novoUsuario).select()
    error ? console.log(error) : console.log('Dados Inseridos com sucesso')
}
// senha 123456789
// senha 12345
async function logarSistema() {
    console.log('====== Login =======')
    const cpf = prompt('Digite o seu CPF: ')
    const senha = prompt('Digite sua senha: ')
    const { data, error } = await supabase.from('biblioteca_usuarios').select('*').eq('cpf', cpf)
    if (error) {
        console.log('Usuário não encontrado')
        return false
    }
    if (data.length > 0) {
        const senhaCorreta = await bcrypt.compare(senha, data[0].senha)
        if (senhaCorreta) {
            return data[0]
        } else {
            return false
        }
    } else {
        console.log('CPF não encontrado')
        return false
    }

}



async function menu() {
    console.log('====== MENU ======')
    console.log('1 - Cadastrar Usuário')
    console.log('2 - Logar no sistema')
    console.log('0 - Sair')
    let opcao = prompt('Escolha uma opção: ')

    while (opcao != '0') {
        switch (opcao) {
            case '1':
                await inserirUsuario()
                break;
            case '2':
                let usuario = await logarSistema()
                if (usuario) {
                    console.log('Usuário Logado')
                    console.log(`Seja bem-vindo ${usuario.nome}`)
                    
                    if (usuario.tipo == 'cliente') {
                        console.log('====== MENU ======')
                        console.log('1 - Listar Livros')
                        console.log('0 - Sair')
                        let opcaoCliente = prompt('Escolha uma opção: ')
                        while (opcaoCliente != '0') {
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

                    } else if (usuario.tipo == 'funcionario') {
                        console.log('====== MENU ======')
                        console.log('1 - Listar Livros')
                        console.log('2 - Inserir Autor')
                        console.log('3 - Atualizar Autor')
                        console.log('4 - Buscar Livro')
                        console.log('5 - Deletar Autor')
                        console.log('0 - Sair')
                        let opcaoFuncionario = prompt('Escolha uma opção: ')
                        while (opcaoFuncionario != '0') {
                            switch (opcaoFuncionario) {
                                case '1':
                                    await listarLivros()
                                    break;
                                case '2':
                                    await inserirAutor()
                                    break;
                                case '3':
                                    let idAtualizar = prompt('Digite o ID do autor que deseja atualizar: ')
                                    await atualizarAutor(idAtualizar)
                                    break;
                                case '4':
                                    let nomeLivro = prompt('Digite o nome do livro que deseja buscar: ')
                                    await buscarLivro(nomeLivro)
                                    break;
                                case '5':
                                    let idDeletar = prompt('Digite o ID do autor que deseja deletar: ')
                                    await deletarAutor(idDeletar)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    else {
                        console.log('Falha no login, tente novamente')
                    }
                    break;


                }

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
    console.log('Ola mundo, servidor rodando na porta 3000')
})