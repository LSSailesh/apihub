import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="text-center py-5">
        <h1 className="fw-bold display-5 mb-3">One Hub for Every API</h1>
        <p className="text-muted fs-5 mb-4">
          Discover, test, and manage APIs — all in one place.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/marketplace" className="btn btn-primary btn-lg px-4">
            Browse APIs
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className="row g-4 mt-4">
        {[
          { icon: "🔍", title: "API Marketplace", desc: "Search and discover APIs by category, rating, and plan type." },
          { icon: "🧪", title: "Built-in Tester", desc: "Send HTTP requests and inspect responses without leaving the browser." },
          { icon: "🔑", title: "Key Vault", desc: "Store and manage your API keys securely with AES-256 encryption." },
          { icon: "📊", title: "Analytics", desc: "Track your API usage, errors, and response times in real time." },
        ].map((f) => (
          <div className="col-md-6 col-lg-3" key={f.title}>
            <div className="card h-100 p-4 text-center">
              <div className="fs-1 mb-3">{f.icon}</div>
              <h5 className="fw-semibold mb-2">{f.title}</h5>
              <p className="text-muted small mb-0">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
