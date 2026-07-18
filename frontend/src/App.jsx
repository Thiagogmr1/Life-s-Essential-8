// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Results from "./pages/Results/Results";
import History from "./pages/History/History";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questionario" element={<Questionnaire />} />
      <Route path="/resultado" element={<Results />} />
      <Route path="/historico" element={<History />} />
    </Routes>
  );
}

export default App;