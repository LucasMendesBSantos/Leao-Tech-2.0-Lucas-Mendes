import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import usuarios from '../../data/dados'


const Login = () => {

    let [login, setLogin] = useState('')
    let [senha, setSenha] = useState('')
    let [mensagemErro, setMensagemErro] = useState('')
    let [mensagemSucesso, setMensagemSucesso] = useState('')

    const navigate = useNavigate()

    function verificarLogin() {
        let usuarioEncontrado = null
        setMensagemErro('')
        setMensagemSucesso('')
        usuarios.forEach((usuario) => {
            if (usuario.login == login && usuario.senha == senha) {
                usuarioEncontrado = usuario
            }
        })
        if (usuarioEncontrado) {
            setMensagemSucesso('Usuário encontrado')
            if (usuarioEncontrado.role === 'admin') {
                navigate('/admin/produtos')
            }
        } else {
            setMensagemErro('Usuário não encontrado')
        }
    }

    return (
        <>
            <div className='container'>
                <div id='area-login' className='row justify-content-center align-items-center'>
                    <div className='col-5'>
                        <div className='area-login border border-2 rounded p-3'>
                            <div className='icone-login text-center'>
                                <i style={{ fontSize: '130px' }} className="bi bi-person-circle "></i>
                            </div>
                            <div className='form-login'>
                                <div className='d-flex flex-column'>
                                    <label htmlFor="">Login: </label>
                                    <input id="login" type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
                                </div>
                                <div className='d-flex flex-column'>
                                    <label htmlFor="">Senha: </label>
                                    <input id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
                                </div>
                                <div className='mt-2'>
                                    <button id="btn-login" onClick={verificarLogin} className='btn btn-success'>Entrar</button>
                                </div>
                                {mensagemErro && (
                                    <div id="mensagem-erro" className='text-danger mt-2'>
                                        {mensagemErro}
                                    </div>
                                )}
                                {mensagemSucesso && (
                                    <div id="mensagem-sucesso" className='text-success mt-2'>
                                        {mensagemSucesso}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
