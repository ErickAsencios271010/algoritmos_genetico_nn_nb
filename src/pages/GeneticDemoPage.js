import { useState } from "react";
import { useParams } from "react-router-dom";
import { executeGenetic } from "../services/apiService";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import "./GeneticDemoPage.css";

export default function GeneticDemoPage() {
  const { id } = useParams();
  const [params, setParams] = useState({
    population_size: 100,
    generations:      50,
    mutation_rate:    0.15,
    tournament_k:     2,
    elite_size:       2,
    reinit_interval:  10,
    reinit_rate:      0.1,
    num_vehicles:     4,
    vehicle_capacity: 15,
  });

  const [verbosity, setVerbosity] = useState("final");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(p => ({ ...p, [name]: parseFloat(value) }));
  };

  const run = (mode) => {
    setVerbosity(mode);
    setLoading(true);
    setError(null);
    executeGenetic(params, mode)
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <main className="genetic-page">
      <h2>Demo: Algoritmo Genético</h2>

      <section className="genetic-form">
        <h3>Parámetros</h3>
        {Object.entries(params).map(([key, val]) => (
          <div key={key} className="param-row">
            <label htmlFor={key}>{key.replace(/_/g, " ")}:</label>
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
              <pre className="population">
                {JSON.stringify(result.first_epoch.population, null, 2)}
              </pre>
            </div>
          )}

          {verbosity === "all" && result.history && (
            <div className="evolution-chart">
              <h3>Evolución del Fitness</h3>
              <LineChart
                width={600} height={300}
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
              <pre className="population">
                {JSON.stringify(result.final.best_solution, null, 2)}
              </pre>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
