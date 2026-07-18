// src/pages/History/History.jsx
import { useAssessment } from "../../context/AssessmentContext";

export default function History() {
  const { history } = useAssessment();

  return (
    <main>
      <h1>Histórico</h1>
      {history.length === 0 ? (
        <p>Nenhuma avaliação registrada nesta sessão ainda.</p>
      ) : (
        <ul>
          {history.map((entry) => (
            <li key={entry.id}>
              {new Date(entry.date).toLocaleDateString("pt-BR")} — {entry.compositeScore} pontos
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}