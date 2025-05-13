import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      {project.thumbnail_url && (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="project-card__thumb"
        />
      )}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.short_desc}</p>
        <Link to={`/projects/${project.id}`} className="project-card__link">
          Ver detalles →
        </Link>
      </div>
    </div>
  );
}
