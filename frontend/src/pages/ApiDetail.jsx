import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApiById, rateApi, toggleFavorite } from "../services/marketplaceService";
import { useAuth } from "../context/AuthContext";

export default function ApiDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: api, isLoading } = useQuery({
    queryKey: ["api", id],
    queryFn: () => getApiById(id).then((r) => r.data),
  });

  if (isLoading) return <div className="page-container">Loading...</div>;
  if (!api) return <div className="page-container">API not found.</div>;

  const handleFavorite = async () => {
    if (!user) return navigate("/login");
    await toggleFavorite(id);
  };

  const handleTest = () => {
    if (!user) return navigate("/login");
    navigate("/tester", { state: { url: api.base_url, apiName: api.name } });
  };

  return (
    <div className="page-container">
      <div className="card p-4 mb-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          {api.logo && <img src={api.logo} alt={api.name} style={{ width: 48, height: 48, borderRadius: 8 }} />}
          <div>
            <h3 className="fw-bold mb-0">{api.name}</h3>
            <span className="badge bg-secondary">{api.category}</span>
            <span className={`badge ms-2 badge-${api.plan.toLowerCase()}`}>{api.plan}</span>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={handleFavorite}>
              ♡ Save
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleTest}>
              Test Now
            </button>
          </div>
        </div>
        <p className="text-muted">{api.description}</p>
        <p className="mb-1"><strong>Base URL:</strong> <code>{api.base_url}</code></p>
        <p className="mb-0"><strong>Rating:</strong> ⭐ {api.rating} ({api.rating_count} reviews)</p>
      </div>

      {api.tags?.length > 0 && (
        <div className="mb-3">
          {api.tags.map((t) => (
            <span key={t} className="badge bg-light text-dark me-1 border">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
