import React from 'react';

const Main = () => {
  return (
    <main className="container my-5">
      <div className="p-5 mb-4 bg-light rounded-3 border">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Título da Área Principal</h1>
          <p className="col-md-8 fs-4">
            Este parágrafo está dentro do componente Main. Ele utiliza classes do
            Bootstrap para estilização de tipografia e espaçamento responsivo.
          </p>
          <button className="btn btn-primary btn-lg" type="button">Saiba mais</button>
        </div>
      </div>
    </main>
  );
};

export default Main;