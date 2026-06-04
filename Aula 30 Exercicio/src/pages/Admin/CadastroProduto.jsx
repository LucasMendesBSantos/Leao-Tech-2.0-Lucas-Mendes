import { useState } from 'react'
import { useProdutos } from '../../context/ProdutosContext'
import './CadastroProduto.css'

const CadastroProduto = () => {
    const { produtos, adicionarProduto } = useProdutos()
    const [nome, setNome] = useState('')
    const [preco, setPreco] = useState('')
    const [descricao, setDescricao] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [ativo, setAtivo] = useState(true)
    const [mostrarLista, setMostrarLista] = useState(false)
    const [mensagem, setMensagem] = useState('')

    function cadastrarProduto(e) {
        e.preventDefault()
        if (!nome || !preco || !descricao || !quantidade) {
            setMensagem('Preencha todos os campos')
            return
        }
        adicionarProduto({
            nome,
            preco: parseFloat(preco),
            descricao,
            quantidade: parseInt(quantidade),
            ativo
        })
        setNome('')
        setPreco('')
        setDescricao('')
        setQuantidade('')
        setAtivo(true)
        setMensagem('Produto cadastrado com sucesso!')
    }

    return (
        <div className='container mt-4'>
            <h2>Cadastro de Produtos</h2>
            <form onSubmit={cadastrarProduto}>
                <div className='mb-3'>
                    <label>Nome:</label>
                    <input id="nome" className='form-control' value={nome} onChange={e => setNome(e.target.value)} />
                </div>
                <div className='mb-3'>
                    <label>Preço:</label>
                    <input id="preco" type="number" step="0.01" className='form-control' value={preco} onChange={e => setPreco(e.target.value)} />
                </div>
                <div className='mb-3'>
                    <label>Descrição:</label>
                    <textarea id="descricao" className='form-control' value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
                <div className='mb-3'>
                    <label>Quantidade:</label>
                    <input id="quantidade" type="number" className='form-control' value={quantidade} onChange={e => setQuantidade(e.target.value)} />
                </div>
                <div className='mb-3 form-check'>
                    <input id="ativo" type="checkbox" className='form-check-input' checked={ativo} onChange={e => setAtivo(e.target.checked)} />
                    <label className='form-check-label' htmlFor="ativo">Ativo</label>
                </div>
                {mensagem && (
                    <div id="mensagem-cadastro" className={mensagem.includes('sucesso') ? 'text-success mb-2' : 'text-danger mb-2'}>
                        {mensagem}
                    </div>
                )}
                <button id="btn-cadastrar" type="submit" className='btn btn-primary'>Cadastrar Produto</button>
            </form>

            <div className='mt-4'>
                <button id="btn-listar" className='btn btn-secondary' onClick={() => setMostrarLista(!mostrarLista)}>
                    {mostrarLista ? 'Ocultar Produtos' : 'Listar Produtos'}
                </button>

                {mostrarLista && (
                    <div id="lista-produtos" className='mt-3'>
                        <h4>Produtos Cadastrados ({produtos.length})</h4>
                        {produtos.length === 0 ? (
                            <p>Nenhum produto cadastrado.</p>
                        ) : (
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Preço</th>
                                        <th>Descrição</th>
                                        <th>Quantidade</th>
                                        <th>Ativo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtos.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.nome}</td>
                                            <td>R$ {p.preco.toFixed(2)}</td>
                                            <td>{p.descricao}</td>
                                            <td>{p.quantidade}</td>
                                            <td>{p.ativo ? 'Sim' : 'Não'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CadastroProduto
