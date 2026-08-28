import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import { QUESTIONNAIRE_STEPS } from "../../data/questionnaireSteps";
import QuestionCard from "../../components/QuestionCard/QuestionCard";

// Input de número decimal controlado por texto local, em vez de
// depender do `value` numérico vindo de fora. Isso evita o bug do
// "volta pra zero ao apagar", já que o campo nunca é re-derivado de
// Number(""). Aceita vírgula (padrão BR) e converte pra ponto só na
// hora de repassar o valor numérico pro setField.
function DecimalField({ value, onChange, placeholder, autoComma = false, maxDecimals = 2 }) {
  const toDisplayString = (v) => (v === null || v === undefined || v === "" ? "" : String(v).replace(".", ","));

  const [text, setText] = useState(() => toDisplayString(value));

  // Sincroniza se o valor externo mudar por fora do input
  // (ex: resetAnswers ao clicar em "Nova avaliação").
  useEffect(() => {
    setText(toDisplayString(value));
  }, [value]);

  function handleChange(e) {
    let raw = e.target.value;

    // mantém só dígitos e vírgula
    raw = raw.replace(/[^\d,]/g, "");

    // permite no máximo uma vírgula
    const firstComma = raw.indexOf(",");
    if (firstComma !== -1) {
      raw = raw.slice(0, firstComma + 1) + raw.slice(firstComma + 1).replace(/,/g, "");
    }

    if (autoComma) {
      // insere a vírgula automaticamente após o primeiro dígito
      const digitsOnly = raw.replace(",", "");
      if (digitsOnly.length <= 1) {
        raw = digitsOnly;
      } else {
        const intPart = digitsOnly.slice(0, 1);
        const decPart = digitsOnly.slice(1, 1 + maxDecimals);
        raw = `${intPart},${decPart}`;
      }
    } else if (firstComma !== -1) {
      // sem auto-vírgula, mas ainda limita casas decimais
      const [intPart, decPart = ""] = raw.split(",");
      raw = `${intPart},${decPart.slice(0, maxDecimals)}`;
    }

    setText(raw);

    if (raw === "" || raw === ",") {
      onChange(null);
      return;
    }

    const numeric = parseFloat(raw.replace(",", "."));
    onChange(Number.isNaN(numeric) ? null : numeric);
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={text}
      onChange={handleChange}
    />
  );
}

// Handler compartilhado para os inputs type="number" que continuam
// inteiros (colesterol, glicemia de jejum, sistólica, diastólica,
// e os do tipo genérico "number"). Único ajuste: campo vazio vira
// null, nunca 0 — resolve o bug de "não consigo apagar o último dígito".
function handleIntegerChange(e, field, setField) {
  const raw = e.target.value;
  setField(field, raw === "" ? null : Number(raw));
}

export default function Questionnaire() {
  const navigate = useNavigate();
  const { answers, setField, setDietItem, submitAssessment, enviando, erro } = useAssessment();
  const [stepIndex, setStepIndex] = useState(0);

  const step = QUESTIONNAIRE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === QUESTIONNAIRE_STEPS.length - 1;

  const goNext = async () => {
    if (isLast) {
      try {
        await submitAssessment();
        navigate("/resultado");
      } catch {
        // erro já fica disponível em `erro` (do contexto) e é exibido
        // abaixo — usuário permanece na última pergunta para tentar de novo
      }
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  return (
    <>
      {erro && <p role="alert">{erro}</p>}
      <QuestionCard
        label={step.label}
        onNext={goNext}
        onBack={goBack}
        isFirst={isFirst}
        isLast={isLast}
        isValid={isStepValid(step, answers) && !enviando}
        nextLabel={isLast && enviando ? "Calculando..." : undefined}
      >
        {renderStepInput(step, answers, setField, setDietItem)}
      </QuestionCard>
    </>
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
            onChange={(e) => handleIntegerChange(e, step.field, setField)}
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
            <DecimalField
              value={answers.weightKg}
              onChange={(v) => setField("weightKg", v)}
              placeholder="Ex: 75,5"
            />
          </label>
          <label>
            Altura (m)
            <DecimalField
              value={answers.heightM}
              onChange={(v) => setField("heightM", v)}
              placeholder="Ex: 1,75"
              autoComma
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
              onChange={(e) => handleIntegerChange(e, "nonHdlCholesterol", setField)}
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
              onChange={(e) => handleIntegerChange(e, "fastingGlucose", setField)}
            />
          </label>
          <p>ou</p>
          <label>
            Hemoglobina glicada — HbA1c (%)
            <DecimalField
              value={answers.hba1c}
              onChange={(v) => setField("hba1c", v)}
              placeholder="Ex: 5,4"
              maxDecimals={1}
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
              onChange={(e) => handleIntegerChange(e, "systolic", setField)}
            />
          </label>
          <label>
            Diastólica (mmHg)
            <input
              type="number"
              value={answers.diastolic ?? ""}
              onChange={(e) => handleIntegerChange(e, "diastolic", setField)}
            />
          </label>
        </div>
      );

    default:
      return null;
  }
}