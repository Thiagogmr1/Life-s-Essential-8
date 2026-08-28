import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import ResultView from "../Results/ResultView";
import { exportResultToPdf } from "../../utils/exportPdf";
import "../Results/Results.css";

export default function HistoryDetail() {
  const { id } = useParams();
  const { history, carregarHistorico, erro } = useAssessment();
  const [carregando, setCarregando] = useState(false);

  // Se o usuário chegar direto nesta URL (refresh, link compartilhado),
  // o history do contexto ainda está vazio — precisamos buscar antes.
  useEffect(() => {
    if (history.length === 0) {
      setCarregando(true);
      carregarHistorico().finally(() => setCarregando(false));
    }
  }, [history.length, carregarHistorico]);

  const entry = history.find((item) => String(item.id) === id);

  if (carregando) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p>Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p role="alert">{erro}</p>
          <Link to="/historico">Voltar ao histórico</Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p>Avaliação não encontrada.</p>
          <Link to="/historico">Voltar ao histórico</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <ResultView
        result={entry}
        actions={
          <>
            <button className="results-card__secondary" onClick={() => exportResultToPdf(entry)}>
              Exportar PDF
            </button>
            <Link to="/historico" className="results-card__primary">
              Voltar ao histórico
            </Link>
          </>
        }
      />
    </div>
  );
}