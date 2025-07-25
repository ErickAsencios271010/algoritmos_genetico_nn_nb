import { useState } from "react";
import { useParams } from "react-router-dom";
import { executeNn } from "../services/apiService";
import "./NnDemoPage.css";

export default function NnDemoPage() {
  const { id } = useParams();

  const sanitizeNumber = (n) => {
    const num = parseFloat(n);
    return isNaN(num) ? 0 : num;
  };

  const [params, setParams] = useState({
    w_ih_00: 0.1,
    w_ih_01: 0.5,
    w_ih_10: -0.7,
    w_ih_11: 0.3,
    w_ho_0: 0.2,
    w_ho_1: 0.4,
    learning_rate: 0.25,
    dataset: [
      { x: [0.0, 1.0], y: 1 },
      { x: [1.0, 0.0], y: 1 },
      { x: [1.0, 1.0], y: 0 },
      { x: [0.0, 0.0], y: 0 },
    ],
  });

  const [verbosity, setVerbosity] = useState("final");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRow, setSelectedRow] = useState(0);

  const buildParams = () => {
    const {
      w_ih_00,
      w_ih_01,
      w_ih_10,
      w_ih_11,
      w_ho_0,
      w_ho_1,
      learning_rate,
      dataset,
    } = params;

    return {
      w_ih: [
        [sanitizeNumber(w_ih_00), sanitizeNumber(w_ih_01)],
        [sanitizeNumber(w_ih_10), sanitizeNumber(w_ih_11)],
      ],
      w_ho: [sanitizeNumber(w_ho_0), sanitizeNumber(w_ho_1)],
      learning_rate: sanitizeNumber(learning_rate),
      dataset,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((p) => ({ ...p, [name]: sanitizeNumber(value) }));
  };

  const handleDatasetChange = (idx, field, subidx, value) => {
    setParams((p) => {
      const ds = p.dataset.map((row, i) => {
        if (i !== idx) return row;
        if (field === "y") {
          return { ...row, y: sanitizeNumber(value) };
        } else {
          const newX = [...row.x];
          newX[subidx] = sanitizeNumber(value);
          return { ...row, x: newX };
        }
      });
      return { ...p, dataset: ds };
    });
  };

  const addRow = () => {
    setParams((p) => ({
      ...p,
      dataset: [...p.dataset, { x: [0, 0], y: 0 }],
    }));
  };

  const removeRow = (idx) => {
    setParams((p) => {
      const newDataset = p.dataset.filter((_, i) => i !== idx);
      return { ...p, dataset: newDataset };
    });
    if (selectedRow >= params.dataset.length - 1) {
      setSelectedRow(Math.max(0, params.dataset.length - 2));
    }
  };

  const run = (mode) => {
    setVerbosity(mode);
    setLoading(true);
    setError(null);
    executeNn(buildParams(), mode)
      .then((data) => setResult(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const selectedStep = result?.final?.steps ? result.final.steps[selectedRow] : null;

  // --- NUEVA FUNCION PARA GRAFICA DE NODOS ---
const renderGraph = () => {
    if (!selectedStep) return null;

    const inputs = selectedStep.x;
    const hiddenOutputs = selectedStep.out_h;
    const finalOutput = selectedStep.out_o;

    // Pesos actualizados
    const w_ih = selectedStep.w_ih_updated; // matriz 2x2
    const w_ho = selectedStep.w_ho_updated; // vector 2

    const inputY = [60, 180];
    const hiddenY = [90, 170];
    const outputY = 130;

    // Colores para diferenciar las entradas
    const inputColors = ["#3b82f6", "#f97316"]; // azul y naranja

    return (
      <svg width="400" height="220" className="nn-graph">
        {/* Nodos Entrada */}
        {inputs.map((val, i) => (
          <g key={`input-${i}`}>
            <circle cx={50} cy={inputY[i]} r={20} fill={inputColors[i]} />
            <text
              x={50}
              y={inputY[i]}
              fill="white"
              fontWeight="bold"
              fontSize="14"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {val.toFixed(2)}
            </text>
            <text
              x={50}
              y={inputY[i] + 35}
              fill="#374151"
              fontSize="12"
              textAnchor="middle"
            >
              x{i}
            </text>
          </g>
        ))}

        {/* Nodos Ocultos */}
        {hiddenOutputs.map((val, i) => (
          <g key={`hidden-${i}`}>
            <circle cx={230} cy={hiddenY[i]} r={28} fill="#10b981" />
            <text
              x={230}
              y={hiddenY[i]}
              fill="white"
              fontWeight="bold"
              fontSize="16"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {val.toFixed(2)}
            </text>
            <text
              x={230}
              y={hiddenY[i] + 45}
              fill="#374151"
              fontSize="14"
              textAnchor="middle"
            >
              h{i}
            </text>
          </g>
        ))}

        {/* Nodo Salida */}
        <g>
          <circle cx={350} cy={outputY} r={25} fill="#ef4444" />
          <text
            x={350}
            y={outputY}
            fill="white"
            fontWeight="bold"
            fontSize="16"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {finalOutput.toFixed(2)}
          </text>
          <text
            x={350}
            y={outputY + 40}
            fill="#374151"
            fontSize="12"
            textAnchor="middle"
          >
            Output
          </text>
        </g>

        {/* Conexiones Entrada a Oculta */}
        {inputs.map((_, i) =>
          hiddenOutputs.map((_, j) => {
            const weight = w_ih[i][j];
            return (
              <g key={`line-ih-${i}-${j}`}>
                <line
                  x1={70}
                  y1={inputY[i]}
                  x2={200}
                  y2={hiddenY[j]}
                  stroke={weight >= 0 ? inputColors[i] : "#dc2626"}
                  strokeWidth={Math.min(Math.abs(weight) * 5, 5)}
                />
                <text
                  x={135 + (j === 0 ? -10 : 10)}
                  y={(inputY[i] + hiddenY[j]) / 2 - 5}
                  fill={weight >= 0 ? inputColors[i] : "#dc2626"}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {weight.toFixed(2)}
                </text>
              </g>
            );
          })
        )}

        {/* Conexiones Oculta a Salida */}
        {hiddenOutputs.map((_, i) => {
          const weight = w_ho[i];
          return (
            <g key={`line-ho-${i}`}>
              <line
                x1={258}
                y1={hiddenY[i]}
                x2={325}
                y2={outputY}
                stroke={weight >= 0 ? "#16a34a" : "#dc2626"}
                strokeWidth={Math.min(Math.abs(weight) * 5, 5)}
              />
              <text
                x={290}
                y={hiddenY[i] - 10}
                fill={weight >= 0 ? "#16a34a" : "#dc2626"}
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {weight.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <main className="nn-page">
      <h2 className="title">Demo: Red Neuronal Manual</h2>

      <section className="nn-form">
        <h3 className="section-title">Pesos Iniciales</h3>
        <div className="matrix-group">
          {[
            ["w_ih_00", "w_ih[0][0]"],
            ["w_ih_01", "w_ih[0][1]"],
            ["w_ih_10", "w_ih[1][0]"],
            ["w_ih_11", "w_ih[1][1]"],
          ].map(([name, label]) => (
            <div key={name} className="input-group">
              <label>{label}:</label>
              <input
                name={name}
                type="number"
                step="0.01"
                value={params[name]}
                onChange={handleChange}
                className="input-number"
              />
            </div>
          ))}
        </div>

        <div className="vector-group">
          {[
            ["w_ho_0", "w_ho[0]"],
            ["w_ho_1", "w_ho[1]"],
          ].map(([name, label]) => (
            <div key={name} className="input-group">
              <label>{label}:</label>
              <input
                name={name}
                type="number"
                step="0.01"
                value={params[name]}
                onChange={handleChange}
                className="input-number"
              />
            </div>
          ))}
        </div>

        <div className="param-row">
          <label>learning_rate:</label>
          <input
            name="learning_rate"
            type="number"
            step="0.01"
            value={params.learning_rate}
            onChange={handleChange}
            className="input-number"
          />
        </div>

        <h3 className="section-title">Dataset</h3>

        <table className="dataset-table">
          <thead>
            <tr>
              <th>Fila</th>
              <th>x[0]</th>
              <th>x[1]</th>
              <th>y</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {params.dataset.map((row, i) => (
              <tr key={i} className="dataset-row">
                <td>Fila {i + 1}</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    value={row.x[0]}
                    onChange={(e) => handleDatasetChange(i, "x", 0, e.target.value)}
                    className="input-small"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    value={row.x[1]}
                    onChange={(e) => handleDatasetChange(i, "x", 1, e.target.value)}
                    className="input-small"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="1"
                    value={row.y}
                    onChange={(e) => handleDatasetChange(i, "y", null, e.target.value)}
                    className="input-small"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeRow(i)}
                    disabled={params.dataset.length <= 1}
                    title="Eliminar fila"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn-add-row"
          onClick={addRow}
          title="Agregar fila"
        >
          + Agregar fila
        </button>

        <div className="buttons">
          <button onClick={() => run("first")} disabled={loading} className="btn">
            Primer Ciclo
          </button>
          <button onClick={() => run("all")} disabled={loading} className="btn">
            Todos
          </button>
          <button onClick={() => run("final")} disabled={loading} className="btn">
            Final
          </button>
        </div>

        {loading && <p className="status">Ejecutando...</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="legend">
        <h3>Leyenda</h3>
        <ul>
          <li>
            <strong>net_h:</strong> suma ponderada de entradas en capa oculta
          </li>
          <li>
            <strong>out_h:</strong> salida de capa oculta tras sigmoide
          </li>
          <li>
            <strong>net_o:</strong> suma ponderada de salidas ocultas
          </li>
          <li>
            <strong>out_o:</strong> salida final tras sigmoide
          </li>
          <li>
            <strong>delta_o:</strong> error en salida × derivada sigmoide
          </li>
          <li>
            <strong>delta_h:</strong> error en oculta × derivada sigmoide
          </li>
          <li>
            <strong>w_ih_updated:</strong> pesos actualizados entre entrada y oculta
          </li>
          <li>
            <strong>w_ho_updated:</strong> pesos actualizados entre oculta y salida
          </li>
        </ul>
      </section>

      {result && (
        <section className="step-selector">
          <h3>Seleccionar Fila</h3>
          <select
            value={selectedRow}
            onChange={(e) => setSelectedRow(parseInt(e.target.value, 10))}
            className="select-sample"
          >
            {result.final.steps.map((_, i) => (
              <option key={i} value={i}>
                Fila {i + 1}
              </option>
            ))}
          </select>
        </section>
      )}

      {selectedStep && (
        <section className="nn-results">
          <h3>Paso para Fila {selectedRow + 1}</h3>
          <div className="nn-step">
            <h4>
              x=[{selectedStep.x[0]}, {selectedStep.x[1]}], y={selectedStep.y_true}
            </h4>
            <div className="step-row">
              <em>
                net_h[0] = w_ih[0][0]*{selectedStep.x[0]} + w_ih[1][0]*{selectedStep.x[1]} ={" "}
                {selectedStep.net_h[0].toFixed(3)}
              </em>
            </div>
            <div className="step-row">
              <em>
                net_h[1] = w_ih[0][1]*{selectedStep.x[0]} + w_ih[1][1]*{selectedStep.x[1]} ={" "}
                {selectedStep.net_h[1].toFixed(3)}
              </em>
            </div>
            <div className="step-row">
              <em>
                out_h = sigmoid(net_h): [{selectedStep.out_h[0].toFixed(3)},{" "}
                {selectedStep.out_h[1].toFixed(3)}]
              </em>
            </div>
            <div className="step-row">
              <em>
                net_o = w_ho[0]*{selectedStep.out_h[0].toFixed(3)} + w_ho[1]*
                {selectedStep.out_h[1].toFixed(3)} = {selectedStep.net_o.toFixed(3)}
              </em>
            </div>
            <div className="step-row">
              <em>out_o = sigmoid(net_o) = {selectedStep.out_o.toFixed(3)}</em>
            </div>
            <div className="step-row">
              <em>
                delta_o = (y - out_o) × out_o×(1−out_o) = {selectedStep.delta_o.toFixed(3)}
              </em>
            </div>
            <div className="step-row">
              <em>
                delta_h = [δₕ₀, δₕ₁] = [{selectedStep.delta_h[0].toFixed(3)},{" "}
                {selectedStep.delta_h[1].toFixed(3)}]
              </em>
            </div>
            <div className="step-row">
              <em>
                w_ih_updated = w_ih + lr·δₕ·x → [
                {selectedStep.w_ih_updated
                  .map((row) => `[${row.map((n) => n.toFixed(3)).join(", ")}]`)
                  .join(", ")}
                ]
              </em>
            </div>
            <div className="step-row">
              <em>
                w_ho_updated = w_ho + lr·δₒ·out_h → [
                {selectedStep.w_ho_updated.map((n) => n.toFixed(3)).join(", ")}]
              </em>
            </div>
          </div>

          {/* Aquí insertamos la gráfica SVG */}
          <div className="nn-graph-container">
            {renderGraph()}
          </div>
        </section>
      )}

      {result && verbosity === "final" && result.final?.final_weights && (
        <section className="final-weights">
          <h3>Pesos Finales</h3>
          <p>
            <em>
              w_ih final: [
              {result.final.final_weights.w_ih
                .map((row) => `[${row.map((n) => n.toFixed(3)).join(", ")}]`)
                .join(", ")}
              ]
            </em>
          </p>
          <p>
            <em>
              w_ho final: [
              {result.final.final_weights.w_ho.map((n) => n.toFixed(3)).join(", ")}
              ]
            </em>
          </p>
        </section>
      )}
    </main>
  );
}
