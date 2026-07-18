// src/pages/Home/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>Life's Essential 8</h1>
      <p>
        Avalie sua saúde cardiovascular com base na metodologia da American
        Heart Association.
      </p>
      <button onClick={() => navigate("/questionario")}>
        Iniciar avaliação
      </button>
    </main>
  );
}