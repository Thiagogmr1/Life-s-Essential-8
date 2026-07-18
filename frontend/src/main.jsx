// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AssessmentProvider } from "./context/AssessmentContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AssessmentProvider>
      <App />
    </AssessmentProvider>
  </StrictMode>
);