import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-4">
        <div className="row gy-3 align-items-center">
          <div className="col-md-4 text-center align-items-center text-md-start">
            <span className="fw-bold fs-5">
              <span className="text-warning">&#9670;</span> Lucas Mendes merece um 10 na tarefa de hoje
            </span>
          </div>

          <div className="col-md-4 text-center">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-muted text-decoration-none small">Home</a>
              </li>
              <li className="list-inline-item mx-2 text-muted">|</li>
              <li className="list-inline-item">
                <a href="#" className="text-muted text-decoration-none small">Sobre</a>
              </li>
              <li className="list-inline-item mx-2 text-muted">|</li>
              <li className="list-inline-item">
                <a href="#" className="text-muted text-decoration-none small">Contato</a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 text-center text-md-end">
            <small className="text-muted">
              &copy; {new Date().getFullYear()} Todos os direitos reservados.
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;