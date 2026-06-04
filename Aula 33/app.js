// const prompt = require('prompt-sync')()

// let nome = prompt("Qual é o seu nome? ")
// let idade = parseInt(prompt("Quantos anos você tem? "))

// console.log(`Ola ${nome}, vejo que você tem ${idade} anos de idade.`)

// 1° Crie um programa em node.js que peça para o usuario digitar o login e uma senha, se o usuario digitar a senha errada, peça novamente até 5 vezes,
//  se ele errar as 5 vezes, mostre: Login Bloqueado, entre em contato com o adminsitrador para recipaerar a sia senha.

// const prompt = require('prompt-sync')()

// const login = "admin"
// const senha = "123456"

// for (let i = 0; i < 5; i++) {
//     let loginInput = prompt("Digite o login: ")
//     let senhaInput = prompt("Digite a senha: ")

//     if (loginInput === login && senhaInput === senha) {
//         console.log("Login realizado com sucesso!")
//         break
//     } else if (i === 4) {
//         console.log("Login Bloqueado. Entre em contato com o administrador para recuperar sua senha.")
//     } else {
//         console.log("Login ou senha incorretos.")
//     }
// }

// 2° criem um progaa que simule uma urna de votação 
// 1  - João
// 2 - Maria
// 3 - José
//  A urna deve receber 10 votos e no final mostrar a contagem de votos para cada canidato


// const prompt = require('prompt-sync')()

// let votosJoao = 0
// let votosMaria = 0
// let votosJose = 0
// let votosNulos = 0  
// let votosBrancos = 0

// for (let i = 0; i < 10; i++) {
//     let voto = parseInt(prompt("Digite o número do candidato (1 - João, 2 - Maria, 3 - José, 4 - Nulo, 5 - Branco): "))
//     switch (voto) {
//         case 1:
//             votosJoao++
//             break
//         case 2:
//             votosMaria++
//             break
//         case 3:
//             votosJose++
//             break
//         case 4:
//             votosNulos++
//             break
//         case 5:
//             votosBrancos++
//             break    
            
//         default:
//             console.log("Voto inválido.")
//     }
// }

// console.log("Contagem de votos:")
// console.log(`João: ${votosJoao}`)
// console.log(`Maria: ${votosMaria}`)
// console.log(`José: ${votosJose}`)
// console.log(`Nulos: ${votosNulos}`)
// console.log(`Brancos: ${votosBrancos}`)

// 3° Crie um progama que funcione como um caixa eletronico
//se o usuario digitar:
// 1 - sacar
// 2 - depositar
// 3 - ver valor
// 0 - sair
//  regras:
// O sistema inicia com saldo de 1000 reais
//se tetar sacar um valor maior que o salfo, vai mostar: Saldo insuuciente 
// O programa feve funcionar em loop até a pessoa digitar 0
// Ao sair, mostrat o saldo final da conta

// const prompt = require('prompt-sync')()
// let saldo = 1000

// while (true) {  
//     console.log("1 - Sacar")
//     console.log("2 - Depositar")
//     console.log("3 - Ver saldo")
//     console.log("0 - Sair") 
//     let opcao = parseInt(prompt("Escolha uma opção: "))

//     switch (opcao) {
//         case 1:
//             let valorSaque = parseFloat(prompt("Digite o valor para sacar: "))
//             if (valorSaque > saldo) {
//                 console.log("Saldo insuficiente.")
//             } else {
//                 saldo -= valorSaque
//                 console.log(`Saque realizado. Saldo atual: R$ ${saldo.toFixed(2)}`)
//             }
//             break
//         case 2:
//             let valorDeposito = parseFloat(prompt("Digite o valor para depositar: "))
//             saldo += valorDeposito
//             console.log(`Depósito realizado. Saldo atual: R$ ${saldo.toFixed(2)}`)
//             break
//         case 3:
//             console.log(`Saldo atual: R$ ${saldo.toFixed(2)}`)
//             break
//         case 0:
//             console.log(`Saldo final: R$ ${saldo.toFixed(2)}`)
//             console.log("Obrigado por usar o caixa eletrônico. Até logo!")
//             process.exit()
//         default:
//             console.log("Opção inválida. Por favor, escolha uma opção válida.")
//     }
// }

// esses são os comando para instalar o supabase e o prompt-sync
// npm install @supabase/supabase-js
// npm install prompt-sync

const prompt = require('prompt-sync')()

const {createClient} = require('@supabase/supabase-js')
const supabase = createClient (process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

console.log('Conectando ao Supabase...')

async function inserirAutor() {
    let Nome = prompt("Digite o nome do autor: ")
    let Nacionalidade = prompt("Digite a nacionalidade do autor: ")

    let novoAutor = {
        Nome: Nome,
        Nacionalidade: Nacionalidade,
        Genero: "Literatura"
    }

    // aqui é onde a gente insere os dados na tabela autores do banco de dados do supabase
    const {data, error} = await supabase.from('Biblioteca_Autores').insert(novoAutor).select()

    console.log (data)
    console.log (error)
}

inserirAutor()

//usar o dotenv para guardar as chaves de acesso do supabase, para não deixar exposto no código
//npm install dotenv

//tem que criar um arquivo .env na raiz do projeto e colocar as chaves de acesso do supabase lá, e depois usar o dotenv para carregar essas chaves no código, assim: