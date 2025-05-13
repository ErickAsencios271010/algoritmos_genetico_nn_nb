import { useState } from "react";
import { useParams } from "react-router-dom";
import { executeNb } from "../services/apiService";
import "./NbDemoPage.css";

export default function NbDemoPage() {
  const { id } = useParams();
  const [params, setParams] = useState({
    test_size:    0.2,
    random_state: 42,
    lowercase:    true
  });
  const [verbosity, setVerbosity] = useState("final");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setParams(p => ({
      ...p,
      [name]: type === "checkbox" ? checked : parseFloat(value)
    }));
  };

  const run = (mode) => {
    setVerbosity(mode);
    setLoading(true);
    setError(null);
    executeNb(params, mode)
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <main className="nb-page">
      <h2>Demo: Naive Bayes</h2>

      <section className="nb-form">
        <h3>Parámetros</h3>
        <div className="param-row">
          <label htmlFor="test_size">test_size:</label>
          <input
            id="test_size"
            name="test_size"
            type="number"
            step="0.05"
            min="0.05"
            max="0.5"
            value={params.test_size}
            onChange={handleChange}
          />
        </div>
        <div className="param-row">
          <label htmlFor="random_state">random_state:</label>
          <input
            id="random_state"
            name="random_state"
            type="number"
            step="1"
            min="0"
            value={params.random_state}
            onChange={handleChange}
          />
        </div>
        <div className="param-row">
          <label htmlFor="lowercase">lowercase:</label>
          <input
            id="lowercase"
            name="lowercase"
            type="checkbox"
            checked={params.lowercase}
            onChange={handleChange}
          />
        </div>
        <div className="buttons">
          <button onClick={() => run("first")} disabled={loading}>Primer Ciclo</button>
          <button onClick={() => run("all")}   disabled={loading}>Todos</button>
          <button onClick={() => run("final")} disabled={loading}>Final</button>
        </div>
        {loading && <p className="status">Ejecutando...</p>}
        {error   && <p className="error">{error}</p>}
      </section>

      {result && (
        <section className="nb-results">
          <h3>Métricas</h3>
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.final?.metrics || {}).map(([model, m]) => (
                <tr key={model}>
                  <td>{model}</td>
                  <td>{m?.accuracy != null ? m.accuracy.toFixed(3) : "—"}</td>
                  <td>{m?.precision != null ? m.precision.toFixed(3) : "—"}</td>
                  <td>{m?.recall != null ? m.recall.toFixed(3) : "—"}</td>
                  <td>{m?.f1 != null ? m.f1.toFixed(3) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(verbosity === "first" || verbosity === "all") && result.final?.confusion && (
            <>
              <h3>Matriz de Confusión</h3>
              {Object.entries(result.final.confusion).map(([model, matrix]) => (
                <div key={model} className="confusion-block">
                  <h4>{model}</h4>
                  <table className="confusion-table">
                    <thead>
                      <tr><th></th><th>Pred:0</th><th>Pred:1</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>True:0</td>
                        <td>{matrix?.[0]?.[0] ?? "—"}</td>
                        <td>{matrix?.[0]?.[1] ?? "—"}</td>
                      </tr>
                      <tr>
                        <td>True:1</td>
                        <td>{matrix?.[1]?.[0] ?? "—"}</td>
                        <td>{matrix?.[1]?.[1] ?? "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </>
          )}

          {(verbosity === "first" || verbosity === "all") && result.final?.samples && (
            <>
              <h3>Primeras Muestras</h3>
              <table className="samples-table">
                <thead>
                  <tr>
                    <th>Mensaje</th>
                    <th>True</th>
                    <th>Pred</th>
                    <th>Modelo</th>
                  </tr>
                </thead>
                <tbody>
                  {result.final.samples.map((s, i) => (
                    <tr key={i}>
                      <td className="msg-cell">{s.message}</td>
                      <td>{s.true ?? "—"}</td>
                      <td>{s.pred ?? "—"}</td>
                      <td>{s.model ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
      )}
    </main>
  );
}
