import { Link } from "react-router-dom";

export default function ApiCard({ api }) {
  return (
    <div className="card h-100 p-3">
      <div className="d-flex align-items-center gap-2 mb-2">
        {api.logo ? (
          <img src={api.logo} alt={api.name} style={{ width: 36, height: 36, borderRadius: 6 }} />
        ) : (
          <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, fontSize: 16 }}>
            {api.name[0]}
          </div>
        )}
        <div>
          <h6 className="mb-0 fw-semibold">{api.name}</h6>
          <small className="text-muted">{api.category}</small>
        </div>
        <span className={`badge ms-auto badge-${api.plan?.toLowerCase()}`}>{api.plan}</span>
      </div>
      <p className="text-muted small mb-3" style={{ minHeight: 40 }}>
        {api.description?.slice(0, 80)}...
      </p>
      <div className="d-flex justify-content-between align-items-center mt-auto">
        <small className="text-warning">⭐ {api.rating?.toFixed(1)}</small>
        <Link to={`/marketplace/${api.id}`} className="btn btn-sm btn-outline-primary">
          View
        </Link>
      </div>
    </div>
  );
}
