import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="#">
          <span className="text-warning">&#9670;</span> Aplicação Lucas Mendes
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <a className="nav-link active px-3 py-2 rounded" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 py-2 rounded" href="#">Sobre</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 py-2 rounded" href="#">Contato</a>
            </li>
          </ul>
          <a href="#" className="btn btn-warning btn-sm ms-3 fw-semibold">Entrar</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;