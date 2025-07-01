import "./VideoPlayer.css";

export default function VideoPlayer({ file }) {
  const src = `${process.env.REACT_APP_API_URL || "http://localhost:8000"}${file.path}`;
  return (
    <div className="video-player__container">
      <video controls className="video-player">
        <source src={src} type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>
      <p>{file.name}</p>
    </div>
  );
}
