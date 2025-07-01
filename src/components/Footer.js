import "./Footer.css"; // crea este archivo si quieres estilos

export default function Footer() {
  return (
    <footer className="footer">
      <small>© {new Date().getFullYear()} Grupo 3 - Software Inteligente</small>
    </footer>
  );
}
