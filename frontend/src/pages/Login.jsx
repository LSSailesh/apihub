import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container d-flex justify-content-center">
      <div className="card p-4" style={{ width: "100%", maxWidth: 420 }}>
        <h4 className="fw-bold mb-4 text-center">Sign In</h4>
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-muted small mb-3">or continue with</div>
        <div className="d-flex gap-2 mb-3">
          <a href={`${API_URL}/oauth/github`} className="btn btn-outline-secondary w-50">
            GitHub
          </a>
          <a href={`${API_URL}/oauth/google`} className="btn btn-outline-danger w-50">
            Google
          </a>
        </div>

        <p className="text-center text-muted mt-2 small">
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
