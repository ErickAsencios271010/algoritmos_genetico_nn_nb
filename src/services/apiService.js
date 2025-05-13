import axios from 'axios';

const apiUrl = 'http://localhost:8000'; 

const apiService = {
  // Función para ejecutar el algoritmo
  runAlgorithm: async (algorithmKey, params) => {
    const data = {
      params: {
        population_size: params.populationSize,  // Tamaño de la población
        generations: params.generations,         // Número de generaciones
        mutation_rate: params.mutationRate,      // Tasa de mutación
        crossover_rate: params.crossoverRate,    // Tasa de cruce
        elitism_count: params.elitismCount,      // Número de élite
        data: params.data                        // Conjunto de datos
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




