import { useState, useEffect } from "react";
import "./DataViewer.css";
import Papa from "papaparse";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function DataViewer({ file }) {
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}${file.path}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.text();
      })
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        setData({ headers: parsed.meta.fields || [], rows: parsed.data });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [file.path]);

  if (loading) return <p className="data-viewer__status">Cargando datos…</p>;
  if (error)   return <p className="data-viewer__error">Error: {error}</p>;

  return (
    <div className="data-viewer">
      <table>
        <thead>
          <tr>
            {data.headers.map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.slice(0, 10).map((row, i) => (
            <tr key={i}>
              {data.headers.map(h => (
                <td key={h}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.rows.length > 10 && (
        <p className="data-viewer__note">
          Mostrando 10 de {data.rows.length} filas.
        </p>
      )}
    </div>
  );
}
