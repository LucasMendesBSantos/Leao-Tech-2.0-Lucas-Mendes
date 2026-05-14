import React, { createContext, useContext, useState } from 'react';
import usuariosIniciais from '../Dados/usuarios';

const UsuariosContext = createContext();

export const useUsuarios = () => {
  return useContext(UsuariosContext);
};

export const UsuariosProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);

  const adicionarUsuario = (usuario) => {
    const novoUsuario = {
      id: Math.max(...usuarios.map(u => u.id)) + 1,
      ...usuario
    };
    setUsuarios([...usuarios, novoUsuario]);
    return novoUsuario;
  };

  const removerUsuario = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <UsuariosContext.Provider value={{
      usuarios,
      adicionarUsuario,
      removerUsuario
    }}>
      {children}
    </UsuariosContext.Provider>
  );
};
