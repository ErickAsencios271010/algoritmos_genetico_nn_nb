// src/pages/HomePage.js
import React from 'react';
import './HomePage.css'; // Importamos los estilos de la página de inicio

function HomePage() {
  return (
    <div className="home-container">
      <div className="welcome-message">
        <h1>Bienvenido a la página de inicio</h1>
        <p>Este es el lugar donde puedes empezar a trabajar con los algoritmos.</p>
      </div>
      <div className="image-container">
        <img 
          src="https://www.santanderopenacademy.com/content/dam/becasmicrosites/01-soa-blog/tipos-de-algoritmo-1.jpg" 
          alt="Welcome" 
          className="welcome-image" 
        />
      </div>
    </div>
  );
}

export default HomePage;


