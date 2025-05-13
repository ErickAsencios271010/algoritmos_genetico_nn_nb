import { Link } from "react-router-dom";
import "./HomePage.css"; // si quieres estilos específicos

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="intro">
        <h1>Bienvenido al Portfolio de Software Inteligente</h1>
        <p>
          Explora nuestros mini‐proyectos sobre Algoritmos Genéticos, Naive Bayes
          y Redes Neuronales manuales. Cada demo incluye teoría, código y visualizaciones
          interactivas.
        </p>
        <Link to="/projects" className="btn">
          Ver Proyectos
        </Link>
      </section>
    </main>
  );
}
