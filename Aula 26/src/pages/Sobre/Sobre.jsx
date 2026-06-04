import React, { useState } from "react";

const QuemSomos = () => (
  <div>
    <h2>Quem somos</h2>
    <p>
      Somos uma equipe apaixonada por tecnologia e desenvolvimento web, dedicada a
      criar experiências significativas e funcionais.
    </p>
  </div>
);

const NossaHistoria = () => (
  <div>
    <h2>Nossa História</h2>
    <p>
      Desde o início, nosso objetivo foi aprender e compartilhar conhecimentos,
      construindo projetos que inspiram e ensinam novos desenvolvedores.
    </p>
  </div>
);

const NossaMissao = () => (
  <div>
    <h2>Nossa Missão</h2>
    <p>
      Nossa missão é oferecer soluções criativas, promover a colaboração e
      transformar ideias em resultados reais por meio da programação.
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
          Nossa História
        </button>
        <button type="button" onClick={() => setActiveSection("nossaMissao") }>
          Nossa Missão
        </button>
      </div>
      <section>{renderSection()}</section>
    </main>
  );
};

export default Sobre;
