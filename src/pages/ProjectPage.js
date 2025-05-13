import { useState, useEffect } from "react";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { getProject, getFilesForProject } from "../services/apiService";
import CodeViewer    from "../components/CodeViewer";
import DataViewer    from "../components/DataViewer";
import VideoPlayer   from "../components/VideoPlayer";
import "./ProjectPage.css";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tab, setTab]         = useState("code");

  useEffect(() => {
    setLoading(true);
    Promise.all([ getProject(id), getFilesForProject(id) ])
      .then(([proj, fls]) => {
        setProject(proj);
        setFiles(fls);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudo cargar el proyecto.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="project-page__status">Cargando…</div>;
  if (error)   return <div className="project-page__status project-page__error">{error}</div>;

  const scriptFile = files.find(f => f.type === "script" || f.type === "notebook");
  const dataFiles  = files.filter(f => f.type === "data");
  const videoFile  = files.find(f => f.type === "video");

  return (
    <main className="project-page">
      <header className="project-page__header">
        <h2>{project.title}</h2>
        <p>{project.full_desc}</p>
        <button onClick={() => navigate(-1)} className="btn--small">← Volver</button>
      </header>

      <nav className="project-page__tabs">
        <button onClick={() => setTab("code")} className={tab==="code"?"active":""}>Teoría & Código</button>
        <button onClick={() => setTab("data")} className={tab==="data"?"active":""} disabled={!dataFiles.length}>Datos</button>
        <button onClick={() => setTab("demo")} className={tab==="demo"?"active":""}>Demo</button>
        <button onClick={() => setTab("media")} className={tab==="media"?"active":""} disabled={!videoFile}>Multimedia</button>
      </nav>

      <section className="project-page__content">
        {tab === "code" && scriptFile && (
          <CodeViewer file={scriptFile} />
        )}
        {tab === "code" && !scriptFile && (
          <p>No hay código disponible.</p>
        )}

        {tab === "data" && dataFiles.length > 0 && (
          dataFiles.map(df => <DataViewer key={df.id} file={df} />)
        )}
        {tab === "data" && dataFiles.length === 0 && (
          <p>No hay datos asociados.</p>
        )}

        {tab === "demo" && (
          <Link to={`demo/${project.algorithm_key}`} className="btn">
            Ir a Demo de {project.algorithm_key.toUpperCase()}
          </Link>
        )}

        {tab === "media" && videoFile && (
          <VideoPlayer file={videoFile} />
        )}
      </section>

      <Outlet />
    </main>
  );
}
