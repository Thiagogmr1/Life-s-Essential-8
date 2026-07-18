// src/context/AssessmentContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { calculateFullAssessment } from "../utils/scoring";

const AssessmentContext = createContext(null);

// Formato inicial das respostas — reflete exatamente os campos que
// scoring.js espera em calculateFullAssessment()
const initialAnswers = {
  diet: {}, // { fruitsVeggies, wholeGrains, fish, sodium, sugaryDrinks, redMeat, nutsLegumes, fatType }
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
  const [history, setHistory] = useState([]); // mock em memória, sem persistência ainda

  // Atualiza um campo simples (ex: setField("sleepHours", 7))
  const setField = useCallback((field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Atualiza um item dentro do bloco de dieta (ex: setDietItem("fish", 2))
  const setDietItem = useCallback((itemId, points) => {
    setAnswers((prev) => ({
      ...prev,
      diet: { ...prev.diet, [itemId]: points },
    }));
  }, []);

  const resetAnswers = useCallback(() => {
    setAnswers(initialAnswers);
    setResult(null);
  }, []);

  // Roda o cálculo e guarda o resultado + adiciona ao histórico da sessão
  const submitAssessment = useCallback(() => {
    const calculated = calculateFullAssessment(answers);
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...calculated,
    };
    setResult(entry);
    setHistory((prev) => [...prev, entry]);
    return entry;
  }, [answers]);

  const value = {
    answers,
    setField,
    setDietItem,
    resetAnswers,
    result,
    submitAssessment,
    history,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

// Hook de acesso — lança erro se usado fora do Provider,
// pra pegar bugs de integração cedo
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment precisa ser usado dentro de um AssessmentProvider");
  }
  return context;
}