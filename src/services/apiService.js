// src/services/apiService.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Proyectos
 */
export async function getProjects() {
  const res = await fetch(`${API_URL}/projects/`);
  if (!res.ok) {
    throw new Error(`Error fetching projects: ${res.statusText}`);
  }
  return res.json();
}

export async function getProject(projectId) {
  const res = await fetch(`${API_URL}/projects/${projectId}`);
  if (!res.ok) {
    throw new Error(`Error fetching project ${projectId}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Archivos
 */
export async function getFilesForProject(projectId) {
  const res = await fetch(`${API_URL}/files/projects/${projectId}/files`);
  if (!res.ok) {
    throw new Error(`Error fetching files for project ${projectId}: ${res.statusText}`);
  }
  return res.json();
}

export async function getFile(fileId) {
  const res = await fetch(`${API_URL}/files/${fileId}`);
  if (!res.ok) {
    throw new Error(`Error fetching file ${fileId}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Ejecución de algoritmos
 */
export async function executeAlgorithm(algorithmKey, params = {}, verbosity = "final") {
  const res = await fetch(`${API_URL}/execute/${algorithmKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ params, verbosity }),
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const errorBody = await res.json();
      message = errorBody?.detail || message;
    } catch (err) {
      // El cuerpo de error no es JSON válido
    }
    throw new Error(`Error executing ${algorithmKey}: ${message}`);
  }

  const data = await res.json();
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid response received for ${algorithmKey} execution.`);
  }

  return data;
}

/**
 * Helpers específicos
 */
export const executeGenetic = (params, verbosity) =>
  executeAlgorithm("genetic", params, verbosity);

export const executeNb = (params, verbosity) =>
  executeAlgorithm("nb", params, verbosity);

export const executeNn = (params, verbosity) =>
  executeAlgorithm("nn", params, verbosity);
