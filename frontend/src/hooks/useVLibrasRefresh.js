// src/hooks/useVLibrasRefresh.js
import { useEffect } from "react";

function ensureVLibrasStyles() {
  const wrapper = document.getElementById("vlibras-access-wrapper");
  if (wrapper && wrapper.shadowRoot && !wrapper.shadowRoot.getElementById("vlibras-custom-position")) {
    const style = document.createElement("style");
    style.id = "vlibras-custom-position";
    style.textContent = `
      #vlibras-access {
        top: var(--vlibras-top, auto) !important;
        bottom: var(--vlibras-bottom, 24px) !important;
        right: var(--vlibras-right, 16px) !important;
        left: var(--vlibras-left, auto) !important;
      }
    `;
    wrapper.shadowRoot.appendChild(style);
  }
}

/**
 * Hook para suporte ao VLibras em SPAs React.
 *
 * NOTA TÉCNICA:
 * A versão atual do VLibras Widget renderiza seu botão flutuante dentro de
 * um Shadow DOM (div#vlibras-access-wrapper -> shadowRoot).
 * O hook garante que as variáveis CSS definidas no :root (--vlibras-top, --vlibras-bottom, etc.)
 * sejam repassadas para dentro do Shadow DOM.
 */
export function useVLibrasRefresh(trigger) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.VLibras &&
      !window.__vlibrasInitialized &&
      typeof window.VLibras.Widget === "function"
    ) {
      try {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        window.__vlibrasInitialized = true;
      } catch (err) {
        console.warn("[VLibras] Erro ao inicializar o widget:", err);
      }
    }

    ensureVLibrasStyles();
  }, [trigger]);
}

export default useVLibrasRefresh;
