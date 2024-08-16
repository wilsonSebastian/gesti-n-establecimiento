// src/components/Estudiante.js
import React from 'react';
import LogoutButton from './LogoutButton';
function Estudiante() {
  return (
    <div>
      <h1>Bienvenido Estudiante</h1>
      <LogoutButton />
      <p>Esta es tu vista específica.</p>
    </div>
  );
}

export default Estudiante;