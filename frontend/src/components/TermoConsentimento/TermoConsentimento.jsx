import { useEffect, useRef } from "react";
import { TERMO_CONSENTIMENTO, VERSAO_TERMO } from "../../data/termoConsentimento";
import "./TermoConsentimento.css";

export default function TermoConsentimento({ aberto, onFechar, onAceitar }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="termo"
      onClose={onFechar}
      aria-labelledby="termo-titulo"
    >
      <h2 id="termo-titulo" className="termo__titulo">Termo de Consentimento</h2>
      <p className="termo__versao">Versão {VERSAO_TERMO}</p>

      <div className="termo__corpo">
        {TERMO_CONSENTIMENTO.map((s) => (
          <section key={s.titulo}>
            <h3>{s.titulo}</h3>
            <p>{s.texto}</p>
          </section>
        ))}
      </div>

      <div className="termo__acoes">
        <button type="button" className="termo__btn termo__btn--sec" onClick={onFechar}>
          Fechar
        </button>
        <button type="button" className="termo__btn" onClick={onAceitar}>
          Li e concordo
        </button>
      </div>
    </dialog>
  );
}