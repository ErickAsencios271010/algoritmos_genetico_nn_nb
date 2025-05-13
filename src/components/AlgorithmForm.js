import React, { useState } from 'react'; 
import apiService from '../services/apiService';
import './AlgorithmForm.css'; // Aseguramos que el estilo se mantenga

function AlgorithmForm({ algorithmName }) {
  const [params, setParams] = useState({
    population_size: 100,
    generations: 500,
    mutation_rate: 0.15,
    crossover_rate: "", // Puede ser null si no es necesario
    elitism_count: "",  // Puede ser null si no es necesario
    data: [],           // Este es el conjunto de datos (opcional)
    verbosity: "final",   // Verbosidad (puede ser "first", "all", "final")
    // Para Naive Bayes
    NB_DATA_PATH: 'data/SMSSpamCollection.csv',
    NB_PRECISION: 0,
    NB_RECALL: 0,
    NB_F1_SCORE: 0,
    // Para Red Neuronal
    DEFAULT_LR: 0.25,
    DEFAULT_WEIGHTS_IH: [0.1, 0.2, 0.3],  // Pesos Entrada a Capa Oculta
    DEFAULT_WEIGHTS_HO: [0.5, 0.6],        // Pesos Capa Oculta a Salida
    DEFAULT_DATASET: '',                   // Conjunto de datos
  });

  const [result, setResult] = useState(null);  // Estado para almacenar los resultados del algoritmo

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
      const formattedParams = {
        ...params,
        data: params.data ? JSON.parse(params.data) : [],  // Verifica que los datos sean válidos antes de enviarlos
      };
      const result = await apiService.runAlgorithm(algorithmName, formattedParams);
      
      // Formatear la respuesta para mostrarla correctamente
      setResult(result);  // Guardar el resultado en el estado
    } catch (error) {
      alert('Error al ejecutar el algoritmo: ' + error.message);
    }
  };

  const renderParams = () => {
    if (algorithmName === 'genetic') {
      return (
        <>
          <div className="form-group">
            <label>Tamaño de la Población:</label>
            <input type="number" name="population_size" value={params.population_size} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Número de Generaciones:</label>
            <input type="number" name="generations" value={params.generations} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Tasa de Mutación:</label>
            <input type="number" name="mutation_rate" value={params.mutation_rate} step="0.01" onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Tasa de Cruce:</label>
            <input type="number" name="crossover_rate" value={params.crossover_rate} step="0.01" onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Número de Elites:</label>
            <input type="number" name="elitism_count" value={params.elitism_count} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Conjunto de Datos:</label>
            <input type="text" name="data" value={params.data} onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Verbosity (Opcional):</label>
            <select name="verbosity" value={params.verbosity} onChange={handleParamChange}>
              <option value="first">First</option>
              <option value="all">All</option>
              <option value="final">Final</option>
            </select>
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
    } else if (algorithmName === 'nn') {
      return (
        <>
          <div className="form-group">
            <label>Tasa de Aprendizaje:</label>
            <input type="number" name="DEFAULT_LR" value={params.DEFAULT_LR} step="0.01" onChange={handleParamChange} />
          </div>
          <div className="form-group">
            <label>Pesos Entrada a Capa Oculta (valores separados por coma):</label>
            {params.DEFAULT_WEIGHTS_IH.map((weight, index) => (
              <input
                key={index}
                type="number"
                name={`DEFAULT_WEIGHTS_IH[${index}]`}
                value={weight}
                onChange={(e) => {
                  const newWeights = [...params.DEFAULT_WEIGHTS_IH];
                  newWeights[index] = e.target.value;
                  setParams({ ...params, DEFAULT_WEIGHTS_IH: newWeights });
                }}
              />
            ))}
            <button type="button" onClick={() => setParams({ ...params, DEFAULT_WEIGHTS_IH: [...params.DEFAULT_WEIGHTS_IH, 0] })}>Agregar Peso</button>
          </div>
          <div className="form-group">
            <label>Pesos Capa Oculta a Salida (valores separados por coma):</label>
            {params.DEFAULT_WEIGHTS_HO.map((weight, index) => (
              <input
                key={index}
                type="number"
                name={`DEFAULT_WEIGHTS_HO[${index}]`}
                value={weight}
                onChange={(e) => {
                  const newWeights = [...params.DEFAULT_WEIGHTS_HO];
                  newWeights[index] = e.target.value;
                  setParams({ ...params, DEFAULT_WEIGHTS_HO: newWeights });
                }}
              />
            ))}
            <button type="button" onClick={() => setParams({ ...params, DEFAULT_WEIGHTS_HO: [...params.DEFAULT_WEIGHTS_HO, 0] })}>Agregar Peso</button>
          </div>
          <div className="form-group">
            <label>Dataset (por ejemplo: {`[{ "x": [0, 0], "y": 0 }, { "x": [1, 0], "y": 1 }]`}):</label>
            <input type="text" name="DEFAULT_DATASET" value={params.DEFAULT_DATASET} onChange={handleParamChange} />
          </div>
        </>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="algorithm-form">
      {renderParams()}
      <button type="submit">Ejecutar</button>

      {/* Mostrar los resultados si existen */}
      {result && (
        <div>
          <h3>Resultado del Algoritmo</h3>
          {result.first_epoch && (
            <div>
              <h4>Primera Época:</h4>
              <p><strong>Mejor Valor:</strong> {result.first_epoch.best}</p>
              <p><strong>Promedio:</strong> {result.first_epoch.avg}</p>
            </div>
          )}
          {/* Agregar más resultados según lo que devuelva el backend */}
          {result.history && result.history.length > 0 && (
            <div>
              <h4>Historial de Épocas:</h4>
              <ul>
                {result.history.map((epoch, index) => (
                  <li key={index}>
                    <p><strong>Generación:</strong> {epoch.gen}</p>
                    <p><strong>Mejor:</strong> {epoch.best}</p>
                    <p><strong>Promedio:</strong> {epoch.avg}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

export default AlgorithmForm;


