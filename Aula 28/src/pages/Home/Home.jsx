
import ListarProdutos from '../../components/ListaProdutos/ListaProdutos'
import ListaUsuarios from '../../components/ListaUsuarios/ListaUsuarios'
import './Home.css'

function Home(){
    return(
        <>
            <main className="main-home">
                <h1 className='text-center'>Sejam Bem-Vindos a Loja</h1>
                <h3 className='text-center'>Confira nossos produtos</h3>
                <ListarProdutos/>
                <ListaUsuarios />
            </main>
        </>
    )
}

export default Home