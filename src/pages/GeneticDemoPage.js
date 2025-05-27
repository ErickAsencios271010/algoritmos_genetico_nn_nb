import { useState } from "react";
import { useParams } from "react-router-dom";
import { executeGenetic } from "../services/apiService";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import "./GeneticDemoPage.css";

export default function GeneticDemoPage() {
  const { id } = useParams();
  const [params, setParams] = useState({
    population_size: 100,
    generations: 50,
    mutation_rate: 0.15,
    tournament_k: 2,
    elite_size: 2,
    reinit_interval: 10,
    reinit_rate: 0.1,
    num_vehicles: 4,
    vehicle_capacity: 15,
  });

  const [verbosity, setVerbosity] = useState("final");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para la solución seleccionada en primer ciclo
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((p) => ({ ...p, [name]: parseFloat(value) }));
  };

  const run = (mode) => {
    setVerbosity(mode);
    setLoading(true);
    setError(null);
    executeGenetic(params, mode)
      .then((data) => {
        setResult(data);
        // Reset selector cuando carga primer ciclo
        if (mode === "first" && data.first_epoch && data.first_epoch.population) {
          setSelectedSolutionIndex(0);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const vehicleColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  const prepareCombinedData = (routes) => {
    const maxLength = Math.max(...routes.map(r => r.length));
    const combined = [];
    for (let i = 0; i < maxLength; i++) {
      const point = { step: i + 1 };
      routes.forEach((route, idx) => {
        point[`vehicle${idx}`] = route[i] !== undefined ? route[i] : null;
      });
      combined.push(point);
    }
    return combined;
  };

  const renderCombinedRouteChart = (routes, key) => {
    const data = prepareCombinedData(routes);
    return (
      <div key={key} className="route-chart">
        <h4>Rutas de los vehículos</h4>
        <LineChart
          width={600}
          height={250}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="step"
            label={{ value: "Paso en la ruta", position: "insideBottom", offset: -5 }}
            allowDecimals={false}
          />
          <YAxis
            label={{ value: "Nodo visitado", angle: -90, position: "insideLeft" }}
            allowDecimals={false}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {routes.map((_, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`vehicle${idx}`}
              stroke={vehicleColors[idx]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
              connectNulls
              name={`Vehículo ${idx + 1}`}
            />
          ))}
        </LineChart>
      </div>
    );
  };

  return (
    <main className="genetic-page">
      <h2>Demo: Algoritmo Genético</h2>

      <section className="genetic-form">
        <h3>Parámetros</h3>
        {Object.entries(params).map(([key, val]) => (
          <div key={key} className="param-row">
            <label htmlFor={key}>{key.replace(/_/g, " ")}</label>
            <input
              id={key}
              name={key}
              type="number"
              value={val}
              step={key.includes("rate") || key.includes("reinit_rate") ? 0.01 : 1}
              min={0}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="buttons">
          <button onClick={() => run("first")} disabled={loading}>Primer Ciclo</button>
          <button onClick={() => run("all")} disabled={loading}>Evolución</button>
          <button onClick={() => run("final")} disabled={loading}>Resultado Final</button>
        </div>
        {loading && <p className="status">Ejecutando...</p>}
        {error && <p className="error">{error}</p>}
      </section>

      {result && (
        <section className="genetic-results">
          {verbosity === "first" && result.first_epoch && (
            <div className="first-cycle">
              <h3>Primer Ciclo</h3>
              <p>
                Mejor fitness: {result.first_epoch.best != null
                  ? result.first_epoch.best.toFixed(2)
                  : "—"}
              </p>
              <p>
                Fitness promedio: {result.first_epoch.avg != null
                  ? result.first_epoch.avg.toFixed(2)
                  : "—"}
              </p>

              {/* Selector de soluciones */}
              <label htmlFor="solution-select">Selecciona solución:</label>
              <select
                id="solution-select"
                value={selectedSolutionIndex}
                onChange={(e) => setSelectedSolutionIndex(parseInt(e.target.value, 10))}
                style={{ marginLeft: "1rem", padding: "0.25rem" }}
              >
                {result.first_epoch.population.map((_, idx) => (
                  <option key={idx} value={idx}>
                    Solución {idx + 1}
                  </option>
                ))}
              </select>

              <div className="routes" style={{ marginTop: "1rem" }}>
                {result.first_epoch.population[selectedSolutionIndex] &&
                  renderCombinedRouteChart(result.first_epoch.population[selectedSolutionIndex], `first-${selectedSolutionIndex}`)}
              </div>
            </div>
          )}

          {verbosity === "all" && result.history && (
            <div className="evolution-chart">
              <h3>Evolución del Fitness</h3>
              <LineChart
                width={600}
                height={300}
                data={result.history}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gen" label={{ value: "Generación", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Fitness", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line type="monotone" dataKey="best" name="Mejor" />
                <Line type="monotone" dataKey="avg" name="Promedio" />
              </LineChart>
            </div>
          )}

          {verbosity === "final" && result.final && (
            <div className="final-result">
              <h3>Resultado Final</h3>
              <p>
                Distancia total: {result.final.total_distance != null
                  ? result.final.total_distance.toFixed(2)
                  : "—"}
              </p>
              <div className="routes">
                {renderCombinedRouteChart(result.final.best_solution, "final")}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}




