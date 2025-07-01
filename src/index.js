// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // tus estilos globales

// Capturar y silenciar el error de ResizeObserver
window.addEventListener('error', (event) => {
  if (event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    event.stopImmediatePropagation();
    console.warn("ResizeObserver warning silenced");
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
