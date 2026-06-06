const prompt = require('prompt-sync')()
require('dotenv').config()
const {createClient} = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function inserirAutor(){
    let Nome = prompt("Digite o nome do autor:")
    let Nacionalidade = prompt ("Digite a nacionalidade:")

    let novoAutor = {
        Nome: Nome,
        Nacionalidade: Nacionalidade,
        Genero: "Literatura"
    }

    const {data, error} = await supabase.from ("Biblioteca_Autores").insert(novoAutor).select
    console.log (data)
    console.log (error)
}
// // inserirAutor()
// //########################################################################################################
async function inserirLivro(){
    let Nome_Livro = prompt("Digite o nome do livro:")
    let Genero = prompt ("Digite o gênero:") 
    let ID_Autor = prompt ("Digite o ID do autor:")

let novoLivro = {
    Nome_Livro: Nome_Livro,    
    Genero: Genero,
    ID_Autor: ID_Autor,

    }

    const {data, error} = await supabase.from ("Biblioteca_Livro").insert(novoLivro).select
    console.log (data)
    console.log (error)

}
//     // inserirLivro()
//  //########################################################################################################
   async function inserirEmprestimo(){
    let Data = prompt("Digite a data do empréstimo:")
    let Devolução = prompt ("Digite a data de devolução:")
    
     let novoEmprestimo = {
       Data: Data,
        Devolução: Devolução,
    }

    const {data, error} = await supabase.from ("Biblioteca_Emprestimos").insert(novoEmprestimo).select
    console.log (data)
    console.log (error)
}
//     // inserirEmprestimo()
// // //########################################################################################################
async function inserirUsuarios(){
    let Nome = prompt("Digite o nome do usuário:")
    let CPF = prompt ("Digite o CPF:")
    let Telefone = prompt ("Digite o telefone:")
    let Endereço = prompt ("Digite o endereço:")
    let Ativo = prompt ("Digite se o usuário está ativo:")

let novoUsuarios = {
    nome: Nome,
    CPF: CPF,
    Telefone: Telefone,
    Endereço: Endereço,
    Ativo: Ativo,
    }

    const {data, error} = await supabase.from ("Biblioteca_Usuarios").insert(novoUsuarios).select
    console.log (data)
    console.log (error)
}
//     // inserirUsuarios()
// // //########################################################################################################
async function inserirPerfil(){
    let Foto = prompt("Digite a URL da foto de perfil:")
    let Bio = prompt ("Digite a bio do usuário:") 


let novoPerfil = {
    Foto: Foto,
    Bio: Bio,
   Preferencias: Preferencias,
    }

    const {data, error} = await supabase.from ("Biblioteca_Perfil").insert(novoPerfil).select
    console.log (data)
    console.log (error)
}
//     // inserirPerfil()

//########################################################################################################
async function listarLivros(){


     const {data, error} = await supabase.from ("Biblioteca_Livro").select('Nome_Livro, Genero, ID_Autor').eq("Genero", "Literatura")
    console.log (data)
    console.log (error)
    data.forEach(livro => {
        console.log(`Titulo: ${livro.Nome_Livro}, Gênero: ${livro.Genero}, ID do Autor: ${livro.ID_Autor}`)
}
    )
}
// listarLivros()

//########################################################################################################

async function buscarLivro(){
    let nome = prompt("Digite o nome do livro que deseja buscar:")
    const {data, error} = await supabase.from("Biblioteca_Livro").select().eq("Nome_Livro", nome).eq("Genero", "Literatura")
    if (error) {
        console.error("Erro ao buscar o livro:", error)
    }
    console.log(data)
    data.forEach(livro => {
        console.log(`Titulo: ${livro.Nome_Livro}, Gênero: ${livro.Genero}, ID do Autor: ${livro.ID_Autor}`)
    })
}
// buscarLivro()
//########################################################################################################
//eq() -> igual
// neq() -> diferente
// gt() -> maior que
// gte() -> maior ou igual a
// lt() -> menor que
// lte() -> menor ou igual a
// gte() -> maior ou igual a
// like() -> parecido com
// ilike() -> parecido com (case insensitive)
// in() -> dentro de um array
// not() -> negação
// order() -> ordenação
// limit() -> limite de resultados



//########################################################################################################
async function atualizarAutor(id){
    let Nome = prompt("Digite o novo nome do autor:")
    let Nacionalidade = prompt("Digite a nova nacionalidade do autor:")
    let atualizacao = {
        Nome: Nome,
        Nacionalidade: Nacionalidade
    }
    const {data, error} = await supabase.from("Biblioteca_Autores").update(atualizacao).eq("ID", id)  //Se não colocar o eq, da merda. ele atualiza tudo, ai tem que colocar o eq para atualizar somente o id que eu quero
    if (error) {
        console.error("Erro ao atualizar o autor:", error)
    }
    console.log(data)
}
//atualizarAutor(3)

//########################################################################################################
async function deletarAutor(id){
    const {data, error} = (await supabase.from("Biblioteca_Autores").delete().eq("ID", id)).select()
    if (error) {
        console.error("Erro ao deletar o autor:", error)
    }   
    console.log(data)
}
// deletarAutor(3)