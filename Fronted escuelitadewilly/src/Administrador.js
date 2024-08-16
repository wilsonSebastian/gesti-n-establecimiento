
// src/components/Administrador.js
import React from 'react';
import LogoutButton from './LogoutButton';

function Administrador() {
  return (
    <div>
      <h1>Bienvenido Administrador</h1>
      <LogoutButton />
      <p>Esta es tu vista específica.</p>
    </div>
  );
}

export default Administrador;