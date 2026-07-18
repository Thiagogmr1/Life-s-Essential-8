// src/components/PulseLine/PulseLine.jsx
// Traço de ECG decorativo — usado com moderação (Home e Histórico apenas)
export default function PulseLine({ width = 320, height = 40 }) {
    return (
      <svg
        viewBox="0 0 320 40"
        width={width}
        height={height}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 20 H100 L112 20 L120 4 L132 36 L142 20 L160 20 L172 20 L180 8 L190 32 L198 20 H320"
          stroke="var(--pulse)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }