// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/execute">Ejecutar Algoritmo</Link></li>
          <li><Link to="/project">Proyectos</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
