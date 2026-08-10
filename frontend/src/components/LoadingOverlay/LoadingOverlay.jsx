import "./LoadingOverlay.css";

export default function LoadingOverlay({ visible, message = "Calculando resultado..." }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__card">
        <div className="loading-overlay__spinner" />
        <p className="loading-overlay__message">{message}</p>
      </div>
    </div>
  );
}