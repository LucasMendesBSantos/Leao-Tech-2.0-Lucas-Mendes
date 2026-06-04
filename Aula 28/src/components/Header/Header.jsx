import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Header() {
    const { getTotalItems } = useCart();

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Loja Online</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sobre">Sobre</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/usuarios">Usuários</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/cadastro">Cadastro</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/carrinho">
                                    Carrinho ({getTotalItems()})
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header