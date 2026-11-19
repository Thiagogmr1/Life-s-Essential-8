import { useEffect, useRef } from "react";
import { AlertTriangle, Clock, X } from "lucide-react";
import "./ModalAvisoExames.css";

export default function ModalAvisoExames({ aberto, onFechar, onConfirmar }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (aberto && !dialog.open) {
      dialog.showModal();
    } else if (!aberto && dialog.open) {
      dialog.close();
    }
  }, [aberto]);

  return (
    <dialog
      ref={dialogRef}
      className="modal-aviso"
      onClose={onFechar}
      aria-labelledby="modal-aviso-titulo"
    >
      <div className="modal-aviso__container">
        <button
          type="button"
          className="modal-aviso__fechar"
          onClick={onFechar}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className="modal-aviso__icone-wrapper" aria-hidden="true">
          <AlertTriangle className="modal-aviso__icone" size={36} />
        </div>

        <h2 id="modal-aviso-titulo" className="modal-aviso__titulo">
          Atenção aos seus exames e aferições
        </h2>

        <div className="modal-aviso__conteudo">
          <p>
            Para garantir a precisão da sua avaliação cardiovascular, é fundamental
            utilizar <strong>dados e resultados de exames recentes</strong> (como{" "}
            <strong>colesterol não-HDL</strong>, <strong>glicemia</strong>  e{" "}
            <strong>pressão arterial</strong>).
          </p>

          <div className="modal-aviso__destaque">
            <Clock size={18} className="modal-aviso__destaque-icone" aria-hidden="true" />
            <span>
              O uso de dados desatualizados pode comprometer o cálculo da sua pontuação,
              causando <strong>subestimação</strong> ou <strong>superestimação</strong> dos
              indicadores de saúde.
            </span>
          </div>
        </div>

        <div className="modal-aviso__acoes">
          <button
            type="button"
            className="modal-aviso__btn-cancelar"
            onClick={onFechar}
          >
            Voltar
          </button>
          <button
            type="button"
            className="modal-aviso__btn-confirmar"
            onClick={onConfirmar}
          >
            Entendi, continuar
          </button>
        </div>
      </div>
    </dialog>
  );
}
