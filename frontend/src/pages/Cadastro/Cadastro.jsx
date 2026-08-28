// src/pages/Cadastro/Cadastro.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/api";
import "./Cadastro.css";

const REDIRECT_DELAY_MS = 2000;
const IBGE_ESTADOS_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
const IBGE_MUNICIPIOS_URL = (uf) =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); // agora guarda no formato dd/mm/aaaa
  const [sexo, setSexo] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  // Carrega a lista de estados uma vez, ao montar o componente
  useEffect(() => {
    async function carregarEstados() {
      try {
        const res = await fetch(IBGE_ESTADOS_URL);
        const data = await res.json();
        setEstados(data);
      } catch {
        // Falha silenciosa: o select de estado fica vazio e o usuário
        // pode tentar de novo trocando de aba/recarregando. Não bloqueia
        // o resto do formulário.
        setEstados([]);
      }
    }
    carregarEstados();
  }, []);

  // Sempre que o estado muda, recarrega a lista de cidades
  useEffect(() => {
    if (!estado) {
      setCidades([]);
      setCidade("");
      return;
    }

    async function carregarCidades() {
      setCarregandoCidades(true);
      setCidade("");
      try {
        const res = await fetch(IBGE_MUNICIPIOS_URL(estado));
        const data = await res.json();
        setCidades(data);
      } catch {
        setCidades([]);
      } finally {
        setCarregandoCidades(false);
      }
    }
    carregarCidades();
  }, [estado]);

async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (!dataBrEhValida(dataNascimento)) {
      setErro("Data de nascimento inválida");
      return;
    }

    setEnviando(true);

    try {
      await cadastrar({
        nome,
        data_nascimento: dataBrParaIso(dataNascimento),
        sexo,
        estado,
        cidade,
        email,
        senha,
      });

      setSucesso(true);

      setTimeout(() => {
        navigate("/home");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      const mensagem =
        err instanceof ApiError
          ? err.detail
          : "Erro ao conectar com o servidor";

      setErro(mensagem);
      setEnviando(false);
    }
  }

  function formatarDataDigitada(valor) {
  const somenteNumeros = valor.replace(/\D/g, "").slice(0, 8);

  if (somenteNumeros.length <= 2) return somenteNumeros;
  if (somenteNumeros.length <= 4) {
    return `${somenteNumeros.slice(0, 2)}/${somenteNumeros.slice(2)}`;
  }
  return `${somenteNumeros.slice(0, 2)}/${somenteNumeros.slice(2, 4)}/${somenteNumeros.slice(4)}`;
}

function dataBrParaIso(dataBr) {
  const [dia, mes, ano] = dataBr.split("/");
  if (!dia || !mes || !ano || ano.length !== 4) return null;
  return `${ano}-${mes}-${dia}`;
}

function dataBrEhValida(dataBr) {
  const iso = dataBrParaIso(dataBr);
  if (!iso) return false;

  const data = new Date(iso);
  const [ano, mes, dia] = iso.split("-").map(Number);

  // valida que a data existe de verdade (ex: rejeita 31/02)
  const dataValida =
    data.getFullYear() === ano &&
    data.getMonth() + 1 === mes &&
    data.getDate() === dia;

  if (!dataValida) return false;
  if (data >= new Date()) return false; // não pode ser no futuro

  return true;
}

  return (
    <div className="auth-page">
      <div className="auth-card">
        {sucesso ? (
          <div className="auth-card__success" role="status" aria-live="polite">
            <svg
              className="auth-card__success-icon"
              viewBox="0 0 52 52"
              aria-hidden="true"
            >
              <circle
                className="auth-card__success-circle"
                cx="26"
                cy="26"
                r="24"
                fill="none"
              />
              <path
                className="auth-card__success-check"
                fill="none"
                d="M14 27l7 7 16-16"
              />
            </svg>
            <p className="auth-card__success-text">Conta criada!</p>
          </div>
        ) : (
          <>
            <h1 className="auth-card__title">Criar conta</h1>

            <form onSubmit={handleSubmit}>
              {erro && (
                <p className="auth-card__error" role="alert">
                  {erro}
                </p>
              )}

              <div className="auth-card__field">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="auth-card__field">
                <label htmlFor="dataNascimento">Data de nascimento</label>
                <input
                  id="dataNascimento"
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/aaaa"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(formatarDataDigitada(e.target.value))}
                  maxLength={10}
                  required
                />
              </div>

              <div className="auth-card__field">
                <label htmlFor="sexo">Sexo</label>
                <select
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div className="auth-card__field">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {estados.map((uf) => (
                    <option key={uf.sigla} value={uf.sigla}>
                      {uf.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-card__field">
                <label htmlFor="cidade">Cidade</label>
                <select
                  id="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  disabled={!estado || carregandoCidades}
                  required
                >
                  <option value="" disabled>
                    {carregandoCidades ? "Carregando..." : "Selecione"}
                  </option>
                  {cidades.map((c) => (
                    <option key={c.id} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-card__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-card__field">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  minLength={8}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <button
                className="auth-card__submit"
                type="submit"
                disabled={enviando}
              >
                {enviando ? "Criando conta..." : "Criar conta"}
              </button>

              <p className="auth-card__footer">
                Já tem conta? <Link to="/login">Entrar</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}