import { Link } from "react-router-dom";
import "./Header.css"; // crea este archivo si quieres estilos

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        SI Portfolio
      </Link>
      <nav>
        <Link to="/projects">Proyectos</Link>
      </nav>
    </header>
  );
}
