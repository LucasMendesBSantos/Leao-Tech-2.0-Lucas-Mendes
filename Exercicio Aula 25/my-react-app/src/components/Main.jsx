import React from 'react';

const cards = [
  {
    icon: '🚀',
    title: 'Alta Performance',
    text: 'Vou fazer os cards mais simples prq o prazo pro classroom ta acabando.',
    badge: 'foguete não tem ré',
    badgeColor: 'bg-success',
  },
  {
    icon: '🔒',
    title: 'Segurança',
    text: 'Sites seguros, igual ao codigo da hanna com as funções de requisção de posição.',
    badge: 'cão de guarda = pincher',
    badgeColor: 'bg-primary',
  },
  {
    icon: '🎨',
    title: 'Design Moderno',
    text: 'Davinci está se contorcendo no tumulo com meu front-end',
    badge: 'dadaismo',
    badgeColor: 'bg-warning text-dark',
  },
  {
    icon: '📊',
    title: 'Relatórios',
    text: 'Loren não funciona aqui   :(',
    badge: 'Pro',
    badgeColor: 'bg-danger',
  },
  {
    icon: '🤝',
    title: 'Suporte 24/7',
    text: 'Erro 404',
    badge: 'funcional',
    badgeColor: 'bg-info text-dark',
  },
  {
    icon: '⚡',
    title: 'Integrações',
    text: '#UI/UX é trabalho demais pra alguel vir falar mal. kkkkk',
    badge: '...',
    badgeColor: 'bg-secondary',
  },
];

function Main() {
  return (
    <main className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Tarefa do dia 06/05</h1>
        <p className="lead text-muted">
          Foco na Network Security.
        </p>
        <hr className="w-25 mx-auto border-warning border-2 opacity-75" />
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {cards.map((card, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3 gap-2">
                  <span className="fs-2">{card.icon}</span>
                  <span className={`badge ${card.badgeColor} ms-auto`}>{card.badge}</span>
                </div>
                <h5 className="card-title fw-bold">{card.title}</h5>
                <p className="card-text text-muted">{card.text}</p>
              </div>
              <div className="card-footer bg-transparent border-0 pb-3 px-4">
                <a href="#" className="btn btn-outline-dark btn-sm">Saiba mais &rarr;</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Main;