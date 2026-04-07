export default function StatsCard({ label, value, icon, color = "primary" }) {
  return (
    <div className="card p-3 h-100">
      <div className="d-flex align-items-center gap-2 mb-1">
        <span className="fs-4">{icon}</span>
        <small className="text-muted">{label}</small>
      </div>
      <h4 className={`fw-bold text-${color} mb-0`}>{value}</h4>
    </div>
  );
}
