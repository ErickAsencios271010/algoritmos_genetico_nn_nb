// src/pages/ExecutePage.js
import React, { useState } from 'react';
import AlgorithmForm from '../components/AlgorithmForm';
import './ExecutePage.css';

function ExecutePage() {
  const [algorithmName, setAlgorithmName] = useState('genetic');

  return (
    <div>
      <h1 className="execute-title">Ejecutar Algoritmo</h1>

      <select onChange={(e) => setAlgorithmName(e.target.value)}>
        <option value="genetic">Algoritmo Genético</option>
        <option value="nn">Red Neuronal</option>
        <option value="nb">Naive Bayes</option>
      </select>

      <AlgorithmForm algorithmName={algorithmName} />
    </div>
  );
}

export default ExecutePage;

