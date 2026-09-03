// src/pages/AdminEstatisticas/AdminEstatisticas.jsx
import { useState, useEffect, useCallback } from "react";
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
      <h1 className="admin-page__title">Estatísticas do sistema</h1>

      <section className="admin-summary">
        {carregandoResumo && <p className="admin-page__status">Carregando resumo...</p>}
        {erroResumo && <p className="admin-page__error">{erroResumo}</p>}

        {resumo && (
          <>
            <div className="admin-summary__cards">
              <div className="admin-card">
                <span className="admin-card__label">Usuários cadastrados</span>
                <span className="admin-card__value">{resumo.total_usuarios}</span>
              </div>
              <div className="admin-card">
                <span className="admin-card__label">Avaliações realizadas</span>
                <span className="admin-card__value">{resumo.total_avaliacoes}</span>
              </div>
              <div className="admin-card">
                <span className="admin-card__label">Score médio geral</span>
                <span className="admin-card__value">
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
                        <strong>{valor}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-panel">
                  <h2 className="admin-panel__title">Classificação</h2>
                  <ul className="admin-panel__list">
                    {resumo.distribuicao_classificacao.map((item) => (
                      <li key={item.classificacao}>
                        <span>
                          {CLASSIFICACAO_LABELS[item.classificacao] || item.classificacao}
                        </span>
                        <strong>{item.quantidade}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-panel">
                  <h2 className="admin-panel__title">Score médio por sexo</h2>
                  <ul className="admin-panel__list">
                    {resumo.media_por_sexo.map((item) => (
                      <li key={item.sexo}>
                        <span>
                          {item.sexo === "masculino" ? "Masculino" : "Feminino"} (
                          {item.quantidade})
                        </span>
                        <strong>{item.score_medio}</strong>
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
              {exportandoExcel ? "Exportando..." : "Exportar Excel"}
            </button>

            <button
              type="button"
              className="admin-export__button admin-export__button--pdf"
              onClick={handleExportarPdf}
              disabled={exportandoPdf || !resumo || usuarios.length === 0}
            >
              {exportandoPdf ? "Exportando..." : "Exportar PDF"}
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
                      <td>{u.ultimo_score ?? "—"}</td>
                      <td>
                        {u.ultima_classificacao
                          ? CLASSIFICACAO_LABELS[u.ultima_classificacao] || u.ultima_classificacao
                          : "—"}
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