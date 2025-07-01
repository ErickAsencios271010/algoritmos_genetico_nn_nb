// src/components/AlgorithmForm.js
import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './AlgorithmForm.css'; // Mantener el archivo de estilo

function AlgorithmForm({ algorithmName }) {
  const [params, setParams] = useState({
    POP_SIZE_DEFAULT: 100,
    GENERATIONS_DEFAULT: 500,
    MUTATION_RATE_DEFAULT: 0.15,
    TOURNAMENT_K_DEFAULT: 2,
    ELITE_SIZE_DEFAULT: 2,
    REINIT_INTERVAL_DEFAULT: 50,
    REINIT_RATE_DEFAULT: 0.1,
    DEFAULT_LR: 0.25,
    DEFAULT_WEIGHTS_IH: '[[0.1, 0.2], [0.3, 0.4]]',
    DEFAULT_WEIGHTS_HO: '[0.5, 0.6]',
    DEFAULT_DATASET: '[{"x": [0.0, 0.0], "y": 0}, {"x": [0.0, 1.0], "y": 1}, {"x": [1.0, 0.0], "y": 1}, {"x": [1.0, 1.0], "y": 0}]',
    NB_DATA_PATH: 'data/SMSSpamCollection.csv',
    NB_PRECISION: 0,
    NB_RECALL: 0,
    NB_F1_SCORE: 0
  });

  useEffect(() => {
    // Reset parameters if algorithm changes
    setParams((prevParams) => ({
      ...prevParams,
      NB_DATA_PATH: '',
      NB_PRECISION: 0,
      NB_RECALL: 0,
      NB_F1_SCORE: 0,
    }));
  }, [algorithmName]);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await apiService.executeAlgorithm(algorithmName, params);
      alert('Resultado: ' + JSON.stringify(result));
    } catch (error) {
      alert('Error al ejecutar el algoritmo');
    }
  };

  const renderParams = () => {
    if (algorithmName === 'genetic') {
      return (
        <>
          <div className="form-group">
            <label>Tamaño de la Población:</label>
            <input type="number" name="POP_SIZE_DEFAULT" value={params.POP_SIZE_DEFAULT} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Número de Generaciones:</label>
            <input type="number" name="GENERATIONS_DEFAULT" value={params.GENERATIONS_DEFAULT} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Tasa de Mutación:</label>
            <input type="number" name="MUTATION_RATE_DEFAULT" value={params.MUTATION_RATE_DEFAULT} step="0.01" onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Participantes en Torneo:</label>
            <input type="number" name="TOURNAMENT_K_DEFAULT" value={params.TOURNAMENT_K_DEFAULT} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Número de Élite:</label>
            <input type="number" name="ELITE_SIZE_DEFAULT" value={params.ELITE_SIZE_DEFAULT} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Intervalo de Reinicio:</label>
            <input type="number" name="REINIT_INTERVAL_DEFAULT" value={params.REINIT_INTERVAL_DEFAULT} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Tasa de Reinicio:</label>
            <input type="number" name="REINIT_RATE_DEFAULT" value={params.REINIT_RATE_DEFAULT} step="0.01" onChange={handleParamChange} />
          </div>
        </>
      );
    } else if (algorithmName === 'nn') {
      return (
        <>
          <div className="form-group">
            <label>Tasa de Aprendizaje:</label>
            <input type="number" name="DEFAULT_LR" value={params.DEFAULT_LR} step="0.01" onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Pesos Entrada a Capa Oculta:</label>
            <input type="text" name="DEFAULT_WEIGHTS_IH" value={params.DEFAULT_WEIGHTS_IH} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Pesos Capa Oculta a Salida:</label>
            <input type="text" name="DEFAULT_WEIGHTS_HO" value={params.DEFAULT_WEIGHTS_HO} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Dataset:</label>
            <input type="text" name="DEFAULT_DATASET" value={params.DEFAULT_DATASET} onChange={handleParamChange} />
          </div>
        </>
      );
    } else if (algorithmName === 'nb') {
      return (
        <>
          <div className="form-group">
            <label>Ruta del archivo CSV:</label>
            <input type="text" name="NB_DATA_PATH" value={params.NB_DATA_PATH} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Precisión:</label>
            <input type="number" name="NB_PRECISION" value={params.NB_PRECISION} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Recall:</label>
            <input type="number" name="NB_RECALL" value={params.NB_RECALL} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>F1 Score:</label>
            <input type="number" name="NB_F1_SCORE" value={params.NB_F1_SCORE} onChange={handleParamChange} />
          </div>
        </>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="algorithm-form">
      {renderParams()}
      <button type="submit">Ejecutar</button>
    </form>
  );
}

export default AlgorithmForm;

