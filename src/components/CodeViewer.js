import { useState, useEffect } from "react";
import "./CodeViewer.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function CodeViewer({ file }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}${file.path}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.text();
      })
      .then(text => setContent(text))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [file.path]);

  if (loading) return <p className="code-viewer__status">Cargando código…</p>;
  if (error)   return <p className="code-viewer__error">Error: {error}</p>;

  return (
    <pre className="code-viewer">
      <code>{content}</code>
    </pre>
  );
}
