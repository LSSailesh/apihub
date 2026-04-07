const METHOD_COLORS = {
  GET: "success", POST: "primary", PUT: "warning",
  PATCH: "info", DELETE: "danger",
};

export default function MethodSelector({ value, onChange }) {
  return (
    <select
      className={`form-select fw-bold text-${METHOD_COLORS[value] || "secondary"}`}
      style={{ width: 110 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {Object.keys(METHOD_COLORS).map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
}
