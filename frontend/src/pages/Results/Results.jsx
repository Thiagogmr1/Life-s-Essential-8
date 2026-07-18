// src/pages/Results/Results.jsx
import { Link } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";

export default function Results() {
  const { result } = useAssessment();

  if (!result) {
    return (
      <main>
        <p>Nenhuma avaliação encontrada.</p>
        <Link to="/questionario">Fazer avaliação</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Resultado</h1>
      <p>Score: {result.compositeScore} — {result.classification.label}</p>
      <Link to="/historico">Ver histórico</Link>
    </main>
  );
}