// src/pages/AdminEstatisticas/AdminEstatisticas.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../../utils/api";
import "./AdminEstatisticas.css";
import { exportUsuariosAdminToExcel } from "../../utils/exportAdminExcel";
import { exportEstatisticasToPdf } from "../../utils/exportAdminPdf";

const LIMITE_PAGINA = 20;

const CLASSIFICACAO_LABELS = {
  alta: "Alta",
  moderada: "Moderada",
  baixa: "Baixa",
};

const DOMINIO_LABELS = {
  score_dieta: "Dieta",
  score_atividade_fisica: "Atividade física",
  score_tabagismo: "Tabagismo",
  score_sono: "Sono",
  score_imc: "IMC",
  score_colesterol: "Colesterol",
  score_glicemia: "Glicemia",
  score_pressao: "Pressão arterial",
};

function getScoreClass(score) {
  if (score === null || score === undefined || score === "—") return "";
  const n = typeof score === "number" ? score : parseFloat(score);
  if (isNaN(n)) return "";
  if (n >= 80) return "admin-score--high";
  if (n >= 50) return "admin-score--mid";
  return "admin-score--low";
}

function getClassificacaoClass(classificacao) {
  if (!classificacao) return "";
  const c = classificacao.toLowerCase();
  if (c === "alta") return "admin-badge--alta";
  if (c === "moderada") return "admin-badge--moderada";
  if (c === "baixa") return "admin-badge--baixa";
  return "";
}

export default function AdminEstatisticas() {
  const [resumo, setResumo] = useState(null);
  const [carregandoResumo, setCarregandoResumo] = useState(true);
  const [erroResumo, setErroResumo] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);
  const [erroUsuarios, setErroUsuarios] = useState(null);

  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [exportandoPdf, setExportandoPdf] = useState(false);

  const [filtros, setFiltros] = useState({
    sexo: "",
    estado: "",
    cidade: "",
    idade_min: "",
    idade_max: "",
  });

  useEffect(() => {
    async function carregarResumo() {
      setCarregandoResumo(true);
      setErroResumo(null);
      try {
        const data = await api.obterEstatisticasResumo();
        setResumo(data);
      } catch (err) {
        setErroResumo(
          err instanceof ApiError ? err.detail : "Erro ao carregar estatísticas"
        );
      } finally {
        setCarregandoResumo(false);
      }
    }
    carregarResumo();
  }, []);

  const carregarUsuarios = useCallback(async () => {
    setCarregandoUsuarios(true);
    setErroUsuarios(null);
    try {
      const data = await api.listarUsuariosAdmin({
        ...filtros,
        pagina,
        limite: LIMITE_PAGINA,
      });
      setUsuarios(data.usuarios);
      setTotalUsuarios(data.total);
    } catch (err) {
      setErroUsuarios(
        err instanceof ApiError ? err.detail : "Erro ao carregar usuários"
      );
    } finally {
      setCarregandoUsuarios(false);
    }
  }, [filtros, pagina]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  function handleFiltroChange(campo, valor) {
    setPagina(1); // qualquer mudança de filtro volta pra primeira página
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
  }

  function limparFiltros() {
    setPagina(1);
    setFiltros({ sexo: "", estado: "", cidade: "", idade_min: "", idade_max: "" });
  }

  const totalPaginas = Math.max(1, Math.ceil(totalUsuarios / LIMITE_PAGINA));

  async function buscarTodosUsuariosFiltrados() {
    const primeiraPagina = await api.listarUsuariosAdmin({
      ...filtros,
      pagina: 1,
      limite: 100,
    });

    let todos = [...primeiraPagina.usuarios];
    const totalPaginasBusca = Math.ceil(primeiraPagina.total / 100);

    for (let paginaAtual = 2; paginaAtual <= totalPaginasBusca; paginaAtual++) {
      const proxima = await api.listarUsuariosAdmin({
        ...filtros,
        pagina: paginaAtual,
        limite: 100,
      });
      todos = todos.concat(proxima.usuarios);
    }

    return todos;
  }

  async function handleExportarExcel() {
    setExportandoExcel(true);
    try {
      const todosUsuarios = await buscarTodosUsuariosFiltrados();
      exportUsuariosAdminToExcel(todosUsuarios);
    } catch (err) {
      alert("Erro ao exportar: " + (err instanceof ApiError ? err.detail : "tente novamente"));
    } finally {
      setExportandoExcel(false);
    }
  }

  async function handleExportarPdf() {
    setExportandoPdf(true);
    try {
      const todosUsuarios = await buscarTodosUsuariosFiltrados();
      exportEstatisticasToPdf(resumo, todosUsuarios);
    } catch (err) {
      alert("Erro ao exportar: " + (err instanceof ApiError ? err.detail : "tente novamente"));
    } finally {
      setExportandoPdf(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <Link to="/home" className="admin-page__back-button" title="Voltar para a Home">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Voltar</span>
        </Link>
        <h1 className="admin-page__title">Estatísticas do sistema</h1>
      </div>

      <section className="admin-summary">
        {carregandoResumo && <p className="admin-page__status">Carregando resumo...</p>}
        {erroResumo && <p className="admin-page__error">{erroResumo}</p>}

        {resumo && (
          <>
            <div className="admin-summary__cards">
              <div className="admin-card admin-card--users">
                <span className="admin-card__label">Usuários cadastrados</span>
                <span className="admin-card__value">{resumo.total_usuarios}</span>
              </div>
              <div className="admin-card admin-card--evals">
                <span className="admin-card__label">Avaliações realizadas</span>
                <span className="admin-card__value">{resumo.total_avaliacoes}</span>
              </div>
              <div className="admin-card admin-card--score">
                <span className="admin-card__label">Score médio geral</span>
                <span className={`admin-card__value ${getScoreClass(resumo.score_medio_geral)}`}>
                  {resumo.score_medio_geral ?? "—"}
                </span>
              </div>
            </div>

            {resumo.total_avaliacoes > 0 && (
              <div className="admin-summary__details">
                <div className="admin-panel">
                  <h2 className="admin-panel__title">Média por domínio</h2>
                  <ul className="admin-panel__list">
                    {Object.entries(resumo.media_por_dominio).map(([chave, valor]) => (
                      <li key={chave}>
                        <span>{DOMINIO_LABELS[chave] || chave}</span>
                        <strong className={getScoreClass(valor)}>{valor}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-panel">
                  <h2 className="admin-panel__title">Classificação</h2>
                  <ul className="admin-panel__list">
                    {resumo.distribuicao_classificacao.map((item) => (
                      <li key={item.classificacao}>
                        <span className="admin-class-label">
                          <span className={`admin-dot admin-dot--${item.classificacao}`} />
                          {CLASSIFICACAO_LABELS[item.classificacao] || item.classificacao}
                        </span>
                        <strong className={`admin-count-badge admin-count-badge--${item.classificacao}`}>
                          {item.quantidade}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-panel">
                  <h2 className="admin-panel__title">Score médio por sexo</h2>
                  <ul className="admin-panel__list">
                    {resumo.media_por_sexo.map((item) => (
                      <li key={item.sexo}>
                        <span className="admin-sex-label">
                          <span className={`admin-sex-dot admin-sex-dot--${item.sexo}`} />
                          {item.sexo === "masculino" ? "Masculino" : "Feminino"} ({item.quantidade})
                        </span>
                        <strong className={getScoreClass(item.score_medio)}>{item.score_medio}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="admin-list">
        <h2 className="admin-page__subtitle">Usuários</h2>

        <div className="admin-filters">
          <div className="admin-filters__field">
            <label htmlFor="filtro-sexo">Sexo</label>
            <select
              id="filtro-sexo"
              value={filtros.sexo}
              onChange={(e) => handleFiltroChange("sexo", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
          </div>

          <div className="admin-filters__field">
            <label htmlFor="filtro-estado">Estado</label>
            <input
              id="filtro-estado"
              type="text"
              maxLength={2}
              placeholder="GO"
              value={filtros.estado}
              onChange={(e) => handleFiltroChange("estado", e.target.value.toUpperCase())}
            />
          </div>

          <div className="admin-filters__field">
            <label htmlFor="filtro-cidade">Cidade</label>
            <input
              id="filtro-cidade"
              type="text"
              placeholder="Anápolis"
              value={filtros.cidade}
              onChange={(e) => handleFiltroChange("cidade", e.target.value)}
            />
          </div>

          <div className="admin-filters__field">
            <label htmlFor="filtro-idade-min">Idade mín.</label>
            <input
              id="filtro-idade-min"
              type="number"
              min="0"
              max="130"
              value={filtros.idade_min}
              onChange={(e) => handleFiltroChange("idade_min", e.target.value)}
            />
          </div>

          <div className="admin-filters__field">
            <label htmlFor="filtro-idade-max">Idade máx.</label>
            <input
              id="filtro-idade-max"
              type="number"
              min="0"
              max="130"
              value={filtros.idade_max}
              onChange={(e) => handleFiltroChange("idade_max", e.target.value)}
            />
          </div>

          <button
            type="button"
            className="admin-filters__limpar"
            onClick={limparFiltros}
          >
            Limpar filtros
          </button>

          <div className="admin-export-group">
            <button
              type="button"
              className="admin-export__button admin-export__button--excel"
              onClick={handleExportarExcel}
              disabled={exportandoExcel || usuarios.length === 0}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="8" y1="13" x2="16" y2="13"></line>
                <line x1="8" y1="17" x2="16" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>{exportandoExcel ? "Exportando..." : "Exportar Excel"}</span>
            </button>

            <button
              type="button"
              className="admin-export__button admin-export__button--pdf"
              onClick={handleExportarPdf}
              disabled={exportandoPdf || !resumo || usuarios.length === 0}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{exportandoPdf ? "Exportando..." : "Exportar PDF"}</span>
            </button>
          </div>

        </div>

        {carregandoUsuarios && <p className="admin-page__status">Carregando usuários...</p>}
        {erroUsuarios && <p className="admin-page__error">{erroUsuarios}</p>}

        {!carregandoUsuarios && !erroUsuarios && (
          <>
            <div className="admin-table__wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Sexo</th>
                    <th>Idade</th>
                    <th>Cidade/UF</th>
                    <th>Email</th>
                    <th>Avaliações</th>
                    <th>Último score</th>
                    <th>Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan={8} className="admin-table__vazio">
                        Nenhum usuário encontrado com esses filtros.
                      </td>
                    </tr>
                  )}
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nome}</td>
                      <td>{u.sexo === "masculino" ? "Masculino" : "Feminino"}</td>
                      <td>{u.idade}</td>
                      <td>{u.cidade}/{u.estado}</td>
                      <td>{u.email}</td>
                      <td>{u.total_avaliacoes}</td>
                      <td>
                        <strong className={getScoreClass(u.ultimo_score)}>
                          {u.ultimo_score ?? "—"}
                        </strong>
                      </td>
                      <td>
                        {u.ultima_classificacao ? (
                          <span className={`admin-badge ${getClassificacaoClass(u.ultima_classificacao)}`}>
                            {CLASSIFICACAO_LABELS[u.ultima_classificacao] || u.ultima_classificacao}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className="admin-pagination">
                <button
                  type="button"
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => p - 1)}
                >
                  Anterior
                </button>
                <span>
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  type="button"
                  disabled={pagina === totalPaginas}
                  onClick={() => setPagina((p) => p + 1)}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}