// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Results from "./pages/Results/Results";
import History from "./pages/History/History";
import HistoryDetail from "./pages/HistoryDetail/HistoryDetail";
import AdminEstatisticas from "./pages/AdminEstatisticas/AdminEstatisticas";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/questionario"
            element={
              <PrivateRoute>
                <Questionnaire />
              </PrivateRoute>
            }
          />

          <Route
            path="/resultado"
            element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            }
          />

          <Route
            path="/historico"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />

          <Route
            path="/historico/:id"
            element={
              <PrivateRoute>
                <HistoryDetail />
              </PrivateRoute>
            }
          />

          <Route
          path="/admin/estatisticas"
          element={
            <AdminRoute>
              <AdminEstatisticas />
            </AdminRoute>
          }
        />

        </Routes> 
      </main>
    </AuthProvider>
  );
}

export default App;