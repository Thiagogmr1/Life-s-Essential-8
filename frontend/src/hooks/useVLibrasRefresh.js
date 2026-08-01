// src/hooks/useVLibrasRefresh.js
// import { useEffect } from "react";

// // Força o VLibras a re-escanear o texto da tela sempre que `trigger` mudar.
// // Necessário porque o VLibras foi feito para sites tradicionais (HTML
// // estático), não para SPAs — sem isso, ele não percebe trocas de conteúdo
// // que acontecem sem recarregar a página (troca de rota OU troca de estado
// // interno, como o passo atual do questionário).
// export function useVLibrasRefresh(trigger) {
//   useEffect(() => {
//     if (window.VLibras) {
//       new window.VLibras.Widget("https://vlibras.gov.br/app");
//     }
//   }, [trigger]);
// }