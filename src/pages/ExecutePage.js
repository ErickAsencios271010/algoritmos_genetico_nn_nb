// src/pages/ExecutePage.js
import React, { useState } from 'react';
import AlgorithmForm from '../components/AlgorithmForm';
import './ExecutePage.css'; // Estilo de la página de ejecución

function ExecutePage() {
  const [algorithmName, setAlgorithmName] = useState('genetic');  // El algoritmo seleccionado por defecto

  return (
    <div>
      <h1>Ejecutar Algoritmo</h1>
      <select onChange={(e) => setAlgorithmName(e.target.value)}>
        <option value="genetic">Algoritmo Genético</option>
        <option value="nn">Red Neuronal</option>
        <option value="nb">Naive Bayes</option>
      </select>

      {/* Componente de formulario basado en el algoritmo seleccionado */}
      <AlgorithmForm algorithmName={algorithmName} />
    </div>
  );
}

export default ExecutePage;
