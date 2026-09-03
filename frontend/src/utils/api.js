// src/utils/api.js
// Client HTTP central. Todas as chamadas à API passam por aqui —
// isso centraliza a base URL, o envio de cookies e o tratamento de erro,
// em vez de espalhar fetch() cru pelos componentes.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // obrigatório: manda/recebe o cookie httpOnly cross-origin
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // 204 No Content (ex: logout) não tem corpo pra parsear
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.detail || "Erro na requisição",
      response.status,
      data?.detail
    );
  }

  return data;
}

export const api = {
    cadastrar: (dados) =>
      request("/usuarios/cadastro", {
        method: "POST",
        body: JSON.stringify(dados),
      }),
  
    login: (dados) =>
      request("/usuarios/login", {
        method: "POST",
        body: JSON.stringify(dados),
      }),
  
    logout: () => request("/usuarios/logout", { method: "POST" }),
  
    obterUsuarioAtual: () => request("/usuarios/me"),
  
    criarAvaliacao: (respostasBrutas) =>
      request("/avaliacoes", {
        method: "POST",
        body: JSON.stringify({ respostas_brutas: respostasBrutas }),
      }),
  
    listarAvaliacoes: () => request("/avaliacoes"),

    obterEstatisticasResumo: () => request("/admin/estatisticas/resumo"),

    listarUsuariosAdmin: (filtros = {}) => {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor !== "" && valor !== null && valor !== undefined) {
          params.append(chave, valor);
        }
      });
      const query = params.toString();
      return request(`/admin/estatisticas/usuarios${query ? `?${query}` : ""}`);
    },
  };

  export { ApiError };