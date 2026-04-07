import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      api.get("/auth/me").then(() => navigate("/dashboard")).catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="page-container text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">Signing you in...</p>
    </div>
  );
}
