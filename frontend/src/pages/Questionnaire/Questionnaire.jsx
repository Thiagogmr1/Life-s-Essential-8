// src/pages/Questionnaire/Questionnaire.jsx
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";

export default function Questionnaire() {
  const navigate = useNavigate();
  const { submitAssessment } = useAssessment();

  // Placeholder: por enquanto só confirma que o Context está acessível
  // e que o fluxo de navegação funciona. As 8 perguntas entram na
  // próxima branch (feature/questionnaire-flow).
  const handleFinish = () => {
    submitAssessment();
    navigate("/resultado");
  };

  return (
    <main>
      <h1>Questionário</h1>
      <p>Etapas do LE8 entram aqui.</p>
      <button onClick={handleFinish}>Finalizar (placeholder)</button>
    </main>
  );
}