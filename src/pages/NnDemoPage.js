import { useState } from "react";
import { useParams } from "react-router-dom";
import { executeNn } from "../services/apiService";
import "./NnDemoPage.css";

export default function NnDemoPage() {
  const { id } = useParams();
  const [params, setParams] = useState({
    w_ih_00: 0.1,
    w_ih_01: 0.5,
    w_ih_10: -0.7,
    w_ih_11: 0.3,
    w_ho_0:  0.2,
    w_ho_1:  0.4,
    learning_rate: 0.25,
    dataset: [
      { x: [0.0, 1.0], y: 1 },
      { x: [1.0, 0.0], y: 1 },
      { x: [1.0, 1.0], y: 0 },
      { x: [0.0, 0.0], y: 0 }
    ]
  });
  const [verbosity, setVerbosity] = useState("final");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const buildParams = () => {
    const {
      w_ih_00, w_ih_01, w_ih_10, w_ih_11,
      w_ho_0,  w_ho_1,   learning_rate, dataset
    } = params;
    return {
      w_ih: [
        [w_ih_00, w_ih_01],
        [w_ih_10, w_ih_11]
      ],
      w_ho: [w_ho_0, w_ho_1],
      learning_rate,
      dataset
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(p => ({ ...p, [name]: parseFloat(value) }));
  };

  const handleDatasetChange = (idx, field, subidx, value) => {
    setParams(p => {
      const ds = p.dataset.map((row, i) => {
        if (i !== idx) return row;
        if (field === "y") {
          return { ...row, y: parseFloat(value) };
        } else {
          const newX = [...row.x];
          newX[subidx] = parseFloat(value);
          return { ...row, x: newX };
        }
      });
      return { ...p, dataset: ds };
    });
  };

  const run = (mode) => {
    setVerbosity(mode);
    setLoading(true);
    setError(null);
    executeNn(buildParams(), mode)
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <main className="nn-page">
      <h2>Demo: Red Neuronal Manual</h2>

      <section className="nn-form">
        <h3>Pesos Iniciales</h3>
        <div className="matrix-group">
          <div>
            <label>w_ih[0][0]:</label>
            <input name="w_ih_00" type="number" step="0.01"
              value={params.w_ih_00} onChange={handleChange} />
          </div>
          <div>
            <label>w_ih[0][1]:</label>
            <input name="w_ih_01" type="number" step="0.01"
              value={params.w_ih_01} onChange={handleChange} />
          </div>
          <div>
            <label>w_ih[1][0]:</label>
            <input name="w_ih_10" type="number" step="0.01"
              value={params.w_ih_10} onChange={handleChange} />
          </div>
          <div>
            <label>w_ih[1][1]:</label>
            <input name="w_ih_11" type="number" step="0.01"
              value={params.w_ih_11} onChange={handleChange} />
          </div>
        </div>
        <div className="vector-group">
          <div>
            <label>w_ho[0]:</label>
            <input name="w_ho_0" type="number" step="0.01"
              value={params.w_ho_0} onChange={handleChange} />
          </div>
          <div>
            <label>w_ho[1]:</label>
            <input name="w_ho_1" type="number" step="0.01"
              value={params.w_ho_1} onChange={handleChange} />
          </div>
        </div>
        <div className="param-row">
          <label>learning_rate:</label>
          <input name="learning_rate" type="number" step="0.01"
            value={params.learning_rate} onChange={handleChange} />
        </div>

        <h3>Dataset</h3>
        {params.dataset.map((row, i) => (
          <div key={i} className="dataset-row">
            <label>Muestra {i + 1}:</label>
            x[0]:
            <input
              type="number" step="0.1"
              value={row.x[0]}
              onChange={e => handleDatasetChange(i, "x", 0, e.target.value)}
            />
            x[1]:
            <input
              type="number" step="0.1"
              value={row.x[1]}
              onChange={e => handleDatasetChange(i, "x", 1, e.target.value)}
            />
            y:
            <input
              type="number" step="1"
              value={row.y}
              onChange={e => handleDatasetChange(i, "y", null, e.target.value)}
            />
          </div>
        ))}

        <div className="buttons">
          <button onClick={() => run("first")} disabled={loading}>Primer Ciclo</button>
          <button onClick={() => run("all")}   disabled={loading}>Todos</button>
          <button onClick={() => run("final")} disabled={loading}>Final</button>
        </div>
        {loading && <p className="status">Ejecutando...</p>}
        {error   && <p className="error">{error}</p>}
      </section>

      <section className="legend">
        <h3>Leyenda</h3>
        <ul>
          <li><strong>net_h:</strong> suma ponderada de entradas en capa oculta</li>
          <li><strong>out_h:</strong> salida de capa oculta tras sigmoide</li>
          <li><strong>net_o:</strong> suma ponderada de salidas ocultas</li>
          <li><strong>out_o:</strong> salida final tras sigmoide</li>
          <li><strong>delta_o:</strong> error en salida × derivada sigmoide</li>
          <li><strong>delta_h:</strong> error en oculta × derivada sigmoide</li>
          <li><strong>w_ih_updated:</strong> pesos actualizados entre entrada y oculta</li>
          <li><strong>w_ho_updated:</strong> pesos actualizados entre oculta y salida</li>
        </ul>
      </section>

      {result && (
        <section className="nn-results">
          {(verbosity === "first" || verbosity === "all") && result.final?.steps && (
            <>
              <h3>Paso{verbosity === "all" ? "s" : ""}</h3>
              {result.final.steps.map((step, i) => {
                const [x1, x2] = step.x;
                const net_h0 = step.net_h[0], net_h1 = step.net_h[1];
                const out_h0 = step.out_h[0], out_h1 = step.out_h[1];
                const net_o  = step.net_o,   out_o  = step.out_o;
                const delta_o = step.delta_o;
                const delta_h0 = step.delta_h[0], delta_h1 = step.delta_h[1];
                return (
                  <div key={i} className="nn-step">
                    <h4>Muestra {i + 1}: x=[{x1}, {x2}], y={step.y_true}</h4>
                    <div className="step-row">
                      <em>net_h[0] = w_ih[0][0]*{x1} + w_ih[1][0]*{x2} = {net_h0.toFixed(3)}</em>
                    </div>
                    <div className="step-row">
                      <em>net_h[1] = w_ih[0][1]*{x1} + w_ih[1][1]*{x2} = {net_h1.toFixed(3)}</em>
                    </div>
                    <div className="step-row">
                      <em>out_h = sigmoid(net_h): [{out_h0.toFixed(3)}, {out_h1.toFixed(3)}]</em>
                    </div>
                    <div className="step-row">
                      <em>net_o = w_ho[0]*{out_h0.toFixed(3)} + w_ho[1]*{out_h1.toFixed(3)} = {net_o.toFixed(3)}</em>
                    </div>
                    <div className="step-row">
                      <em>out_o = sigmoid(net_o) = {out_o.toFixed(3)}</em>
                    </div>
                    <div className="step-row">
                      <em>delta_o = (y - out_o) × out_o×(1−out_o) = {delta_o.toFixed(3)}</em>
                    </div>
                    <div className="step-row">
                      <em>delta_h = [δₕ₀, δₕ₁] = [{delta_h0.toFixed(3)}, {delta_h1.toFixed(3)}]</em>
                    </div>
                    <div className="step-row">
                      <em>w_ih_updated = w_ih + lr·δₕ·x → [{step.w_ih_updated.map(row => `[${row.map(n => n.toFixed(3)).join(", ")}]`).join(", ")}]</em>
                    </div>
                    <div className="step-row">
                      <em>w_ho_updated = w_ho + lr·δₒ·out_h → [{step.w_ho_updated.map(n => n.toFixed(3)).join(", ")}]</em>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {result.final?.final_weights && (
            <div className="final-weights">
              <h3>Pesos Finales</h3>
              <p>
                <em>w_ih final: [{result.final.final_weights.w_ih
                  .map(row => `[${row.map(n => n.toFixed(3)).join(", ")}]`)
                  .join(", ")}]</em>
              </p>
              <p>
                <em>w_ho final: [{result.final.final_weights.w_ho
                  .map(n => n.toFixed(3))
                  .join(", ")}]</em>
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}