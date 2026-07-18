// src/pages/Questionnaire/Questionnaire.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import { QUESTIONNAIRE_STEPS } from "../../data/questionnaireSteps";
import QuestionCard from "../../components/QuestionCard/QuestionCard";

export default function Questionnaire() {
  const navigate = useNavigate();
  const { answers, setField, setDietItem, submitAssessment } = useAssessment();
  const [stepIndex, setStepIndex] = useState(0);

  const step = QUESTIONNAIRE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === QUESTIONNAIRE_STEPS.length - 1;

  const goNext = () => {
    if (isLast) {
      submitAssessment();
      navigate("/resultado");
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  return (
    <QuestionCard
      label={step.label}
      onNext={goNext}
      onBack={goBack}
      isFirst={isFirst}
      isLast={isLast}
      isValid={isStepValid(step, answers)}
    >
      {renderStepInput(step, answers, setField, setDietItem)}
    </QuestionCard>
  );
}

// ---- Validação: impede avançar sem responder ----
function isStepValid(step, answers) {
  switch (step.type) {
    case "dietItem":
      return answers.diet[step.itemId] !== undefined;
    case "number":
      return answers[step.field] !== null && answers[step.field] !== "";
    case "radio":
      return answers[step.field] !== null;
    case "bmi":
      return answers.weightKg && answers.heightM;
    case "lipids":
      return answers.nonHdlCholesterol !== null && answers.nonHdlCholesterol !== "";
    case "glucose":
      return (
        (answers.fastingGlucose !== null && answers.fastingGlucose !== "") ||
        (answers.hba1c !== null && answers.hba1c !== "")
      );
    case "bloodPressure":
      return answers.systolic && answers.diastolic;
    default:
      return true;
  }
}

// ---- Renderização: um input diferente por tipo de passo ----
function renderStepInput(step, answers, setField, setDietItem) {
  switch (step.type) {
    case "dietItem":
      return (
        <div>
          {step.options.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name={step.id}
                checked={answers.diet[step.itemId] === opt.points}
                onChange={() => setDietItem(step.itemId, opt.points)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "number":
      return (
        <div>
          <input
            type="number"
            min={step.min}
            max={step.max}
            step={step.step ?? 1}
            placeholder={step.placeholder}
            value={answers[step.field] ?? ""}
            onChange={(e) => setField(step.field, e.target.value === "" ? "" : Number(e.target.value))}
          />
          <span> {step.unit}</span>
        </div>
      );

    case "radio":
      return (
        <div>
          {step.options.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name={step.id}
                checked={answers[step.field] === opt.value}
                onChange={() => setField(step.field, opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "bmi":
      return (
        <div>
          <label>
            Peso (kg)
            <input
              type="number"
              value={answers.weightKg ?? ""}
              onChange={(e) => setField("weightKg", Number(e.target.value))}
            />
          </label>
          <label>
            Altura (m)
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 1.75"
              value={answers.heightM ?? ""}
              onChange={(e) => setField("heightM", Number(e.target.value))}
            />
          </label>
        </div>
      );

    case "lipids":
      return (
        <div>
          <label>
            Colesterol não-HDL (mg/dL)
            <input
              type="number"
              value={answers.nonHdlCholesterol ?? ""}
              onChange={(e) => setField("nonHdlCholesterol", Number(e.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={answers.lipidsMedication}
              onChange={(e) => setField("lipidsMedication", e.target.checked)}
            />
            Faço uso de medicação para colesterol
          </label>
        </div>
      );

    case "glucose":
      return (
        <div>
          <label>
            Glicemia de jejum (mg/dL)
            <input
              type="number"
              value={answers.fastingGlucose ?? ""}
              onChange={(e) => setField("fastingGlucose", Number(e.target.value))}
            />
          </label>
          <p>ou</p>
          <label>
            Hemoglobina glicada — HbA1c (%)
            <input
              type="number"
              step="0.1"
              value={answers.hba1c ?? ""}
              onChange={(e) => setField("hba1c", Number(e.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={answers.glucoseMedication}
              onChange={(e) => setField("glucoseMedication", e.target.checked)}
            />
            Faço uso de medicação para diabetes/glicemia
          </label>
        </div>
      );

    case "bloodPressure":
      return (
        <div>
          <label>
            Sistólica (mmHg)
            <input
              type="number"
              value={answers.systolic ?? ""}
              onChange={(e) => setField("systolic", Number(e.target.value))}
            />
          </label>
          <label>
            Diastólica (mmHg)
            <input
              type="number"
              value={answers.diastolic ?? ""}
              onChange={(e) => setField("diastolic", Number(e.target.value))}
            />
          </label>
        </div>
      );

    default:
      return null;
  }
}