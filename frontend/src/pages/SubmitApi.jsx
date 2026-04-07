import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitApi } from "../services/marketplaceService";

const CATEGORIES = ["AI/ML", "Weather", "Finance", "Maps", "Payments", "Social", "Communication", "Data", "Other"];
const PLANS = ["Free", "Freemium", "Paid"];

export default function SubmitApi() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", category: "AI/ML",
    base_url: "", logo: "", plan: "Free", tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitApi({
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      });
      setSuccess(true);
      setTimeout(() => navigate("/marketplace"), 2000);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="fw-bold mb-1">Submit an API</h2>
          <p className="text-muted mb-4">Add a new API to the marketplace for review</p>

          {success && (
            <div className="alert alert-success">
              API submitted successfully! Redirecting to marketplace...
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">API Name *</label>
                <input className="form-control" placeholder="e.g. OpenWeather API"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description *</label>
                <textarea className="form-control" rows={3} placeholder="What does this API do?"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category *</label>
                  <select className="form-select" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Plan *</label>
                  <select className="form-select" value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                    {PLANS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Base URL *</label>
                <input className="form-control" placeholder="https://api.example.com/v1"
                  value={form.base_url} onChange={(e) => setForm({ ...form, base_url: e.target.value })} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Logo URL</label>
                <input className="form-control" placeholder="https://example.com/logo.png"
                  value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Tags</label>
                <input className="form-control" placeholder="weather, forecast, climate"
                  value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                <small className="text-muted">Comma separated</small>
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Submitting..." : "Submit for Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
