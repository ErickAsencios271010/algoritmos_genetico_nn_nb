// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import GeneticDemoPage from "./pages/GeneticDemoPage";
import NbDemoPage      from "./pages/NbDemoPage";
import NnDemoPage      from "./pages/NnDemoPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectPage />}>
          <Route path="demo/genetic" element={<GeneticDemoPage />} />
          <Route path="demo/nb"      element={<NbDemoPage />} />
          <Route path="demo/nn"      element={<NnDemoPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
