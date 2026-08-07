// src/context/AssessmentContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { calculateFullAssessment, DadosInsuficientesError } from "../utils/scoring";
import { api, ApiError } from "../utils/api";
import { mapAvaliacaoFromApi } from "../utils/mapAvaliacao";

const AssessmentContext = createContext(null);

const initialAnswers = {
  diet: {},
  physicalActivityMinutes: null,
  nicotineStatus: null,
  sleepHours: null,
  weightKg: null,
  heightM: null,
  nonHdlCholesterol: null,
  lipidsMedication: false,
  fastingGlucose: null,
  hba1c: null,
  glucoseMedication: false,
  systolic: null,
  diastolic: null,
};

export function AssessmentProvider({ children }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const setField = useCallback((field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setDietItem = useCallback((itemId, points) => {
    setAnswers((prev) => ({
      ...prev,
      diet: { ...prev.diet, [itemId]: points },
    }));
  }, []);

  const resetAnswers = useCallback(() => {
    setAnswers(initialAnswers);
    setResult(null);
    setErro(null);
  }, []);

  // Envia respostas_brutas pro backend, que recalcula os scores
  // server-side (ver scoring.py) e persiste. O resultado exibido na
  // tela vem da resposta da API, não do cálculo local — o backend é
  // a fonte da verdade (ver decisão sobre AvaliacaoCriar).
  const submitAssessment = useCallback(async () => {
    setEnviando(true);
    setErro(null);
    try {
      // Agora isso realmente lança erro se peso/altura estiverem
      // ausentes, em vez de mascarar com bmi = null → score 100.
      calculateFullAssessment(answers);

      const avaliacaoSalva = await api.criarAvaliacao(answers);
      const resultMapeado = mapAvaliacaoFromApi(avaliacaoSalva);
      setResult(resultMapeado);
      setHistory((prev) => [resultMapeado, ...prev]);
      return resultMapeado;
    } catch (err) {
      const mensagem =
        err instanceof DadosInsuficientesError
          ? err.message
          : err instanceof ApiError
            ? err.detail
            : "Não foi possível calcular o resultado. Verifique se todos os campos foram preenchidos.";
      setErro(mensagem);
      throw err;
    } finally {
      setEnviando(false);
    }
  }, [answers]);

  // Carrega o histórico real do backend — substitui o array em memória.
  // Chamar isso ao entrar na tela de Histórico (useEffect no componente).
  const carregarHistorico = useCallback(async () => {
    setErro(null);
    try {
      const avaliacoes = await api.listarAvaliacoes();
      setHistory(avaliacoes.map(mapAvaliacaoFromApi));
    } catch (err) {
      const mensagem =
        err instanceof ApiError ? err.detail : "Não foi possível carregar o histórico.";
      setErro(mensagem);
    }
  }, []);

  const value = {
    answers,
    setField,
    setDietItem,
    resetAnswers,
    result,
    submitAssessment,
    history,
    carregarHistorico,
    enviando,
    erro,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment precisa ser usado dentro de um AssessmentProvider");
  }
  return context;
}