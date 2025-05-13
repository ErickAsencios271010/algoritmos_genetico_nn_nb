// src/pages/ProjectPage.js
import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function ProjectPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projects = await apiService.getProjects();
        setProjects(projects);
      } catch (error) {
        alert('Error al obtener proyectos');
      }
    }

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Proyectos</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectPage;
