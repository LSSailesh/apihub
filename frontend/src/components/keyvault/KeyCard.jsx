import { useState } from "react";

export default function KeyCard({ keyData, onDelete, onReveal }) {
  const [revealed, setRevealed] = useState(null);
  const [revealing, setRevealing] = useState(false);

  const handleReveal = async () => {
    if (revealed) { setRevealed(null); return; }
    setRevealing(true);
    const key = await onReveal(keyData.id);
    setRevealed(key);
    setRevealing(false);
  };

  const envColor = { Production: "danger", Staging: "warning", Development: "success" };

  return (
    <div className="card p-3 h-100">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="fw-semibold mb-0">{keyData.name}</h6>
          <small className="text-muted">{keyData.service}</small>
        </div>
        <span className={`badge bg-${envColor[keyData.environment] || "secondary"}`}>
          {keyData.environment}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 mb-3">
        <code className="text-muted small flex-grow-1 text-truncate">
          {revealed || "•••••••••••••••••••••"}
        </code>
        <button className="btn btn-sm btn-outline-secondary" onClick={handleReveal} disabled={revealing}>
          {revealing ? "..." : revealed ? "Hide" : "Reveal"}
        </button>
        {revealed && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigator.clipboard.writeText(revealed)}
          >
            Copy
          </button>
        )}
      </div>

      {keyData.tags?.length > 0 && (
        <div className="mb-2">
          {keyData.tags.map((t) => (
            <span key={t} className="badge bg-light text-dark border me-1 small">{t}</span>
          ))}
        </div>
      )}

      <button
        className="btn btn-sm btn-outline-danger mt-auto"
        onClick={() => onDelete(keyData.id)}
      >
        Delete
      </button>
    </div>
  );
}
