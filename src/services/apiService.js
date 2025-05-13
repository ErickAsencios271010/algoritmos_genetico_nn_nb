import axios from 'axios';

// URL de tu backend, asegúrate de que sea correcto (8000 si el backend corre en ese puerto)
const apiUrl = 'http://localhost:8000'; 

const apiService = {
  // Función para ejecutar el algoritmo
  runAlgorithm: async (algorithmKey, params) => {
    // Aquí estamos enviando los parámetros adecuados al backend
    const data = {
      params: {
        populationSize: params.populationSize,  // Tamaño de la población
        generations: params.generations,        // Número de generaciones
        mutationRate: params.mutationRate,      // Tasa de mutación
        crossoverRate: params.crossoverRate,    // Tasa de cruce
        elitismCount: params.elitismCount,      // Número de élite
        data: params.data                       // Conjunto de datos para el algoritmo
      },
      verbosity: params.verbosity || 'final'  // Verbosidad (puede ser "first", "all", "final")
    };

    try {
      // Haciendo la solicitud POST al backend en http://localhost:8000
      const response = await axios.post(`${apiUrl}/execute/${algorithmKey}`, data);
      return response.data;  // Devolver los resultados
    } catch (error) {
      console.error('Error al ejecutar el algoritmo:', error.response ? error.response.data : error.message);
      throw new Error(`Error al ejecutar el algoritmo: ${error.response ? error.response.data : error.message}`);
    }
  }
};

export default apiService;


