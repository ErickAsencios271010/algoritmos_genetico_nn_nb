import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="intro">
        <h1>Bienvenido al Portfolio de Software Inteligente</h1>
        <p>
          Explora nuestros mini‐proyectos sobre Algoritmos Genéticos, Naive Bayes
          y Redes Neuronales manuales. Cada demo incluye teoría, código y
          visualizaciones interactivas.
        </p>
        <Link to="/projects" className="btn">
          Ver Proyectos
        </Link>
      </section>

      <section className="team-info">
        <h2>Equipo</h2>
        <p>
          Este portfolio es el resultado del trabajo colaborativo de estudiantes
          de la Universidad Nacional Mayor de San Marcos, Perú.
        </p>
        <ul>
          <li>Cano Carbajo, Yeyson Samir</li>
          <li>Ascue Orosco, Carlos</li>
          <li>Ostos Torres, Deysi</li>
          <li>Sotelo Arce, Jocelyn</li>
          <li>Gonzalez Villalobos, Jhon</li>
          <li>Sánchez Montalvan, Jesús Sebastian</li>
        </ul>
      </section>
    </main>
  );
}
