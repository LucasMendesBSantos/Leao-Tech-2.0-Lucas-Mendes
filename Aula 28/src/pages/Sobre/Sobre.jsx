import React, { useState } from "react";

const QuemSomos = () => (
  <div>
    <h2>Quem somos</h2>
    <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut magnam at iure, optio nostrum pariatur quis odit dolores deserunt ipsa autem accusamus ipsum veniam recusandae qui impedit sint accusantium placeat.
    </p>
  </div>
);

const NossaHistoria = () => (
  <div>
    <h2>Nossa Historia</h2>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt quas tenetur sunt, animi sequi qui fugiat culpa consequatur ea ullam dolore? Aliquid, voluptatem neque sequi assumenda autem beatae dolor. Pariatur?
    </p>
  </div>
);

const NossaMissao = () => (
  <div>
    <h2>Nossa Missao</h2>
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt quae quas quos ea exercitationem, quasi iure consequatur, quidem reprehenderit dolorum itaque consequuntur praesentium repudiandae quo sapiente corrupti delectus. Nobis, velit!
    </p>
  </div>
);

const Sobre = () => {
  const [activeSection, setActiveSection] = useState("quemSomos");

  const renderSection = () => {
    switch (activeSection) {
      case "quemSomos":
        return <QuemSomos />;
      case "nossaHistoria":
        return <NossaHistoria />;
      case "nossaMissao":
        return <NossaMissao />;
      default:
        return <QuemSomos />;
    }
  };

  return (
    <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Sobre</h1>
      <div style={{ marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => setActiveSection("quemSomos")}
          style={{ marginRight: "8px" }}
        >
          Quem somos
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("nossaHistoria")}
          style={{ marginRight: "8px" }}
        >
          Nossa Historia
        </button>
        <button type="button" onClick={() => setActiveSection("nossaMissao") }>
          Nossa Missao
        </button>
      </div>
      <section>{renderSection()}</section>
    </main>
  );
};

export default Sobre;


