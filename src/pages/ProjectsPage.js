import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { getProjects } from "../services/apiService";
import "./ProjectsPage.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    getProjects()
      .then(data => {
        setProjects(data);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudieron cargar los proyectos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="projects-page__status">Cargando proyectos…</div>;
  if (error)   return <div className="projects-page__status projects-page__error">{error}</div>;

  return (
    <main className="projects-page">
      <h2 className="projects-page__title">Proyectos</h2>
      <div className="projects-page__grid">
        {projects.map(proj => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </main>
  );
}
