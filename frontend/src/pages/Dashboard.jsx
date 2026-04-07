import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import StatsCard from "../components/dashboard/StatsCard";
import UsageChart from "../components/dashboard/UsageChart";
import RequestLogTable from "../components/dashboard/RequestLogTable";

const handleExport = () => {
  const token = localStorage.getItem("token");

  const url = "https://apihub-production-1165.up.railway.app/api/analytics/export";

  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "apihub_logs.csv";
      a.click();
    });
};

export default function Dashboard() {
  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: () => api.get("/analytics/summary").then((r) => r.data),
  });
  const { data: logs } = useQuery({
    queryKey: ["logs"],
    queryFn: () => api.get("/analytics/logs").then((r) => r.data),
  });
  const { data: usage } = useQuery({
    queryKey: ["usage"],
    queryFn: () => api.get("/analytics/usage-by-api").then((r) => r.data),
  });

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Your API usage overview</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
          ⬇ Export CSV
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatsCard label="Total Requests" value={summary?.total_requests ?? 0} icon="📡" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard label="Errors" value={summary?.error_count ?? 0} icon="⚠️" color="danger" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard label="Avg Response" value={`${summary?.avg_response_time_ms ?? 0}ms`} icon="⚡" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard label="Active Keys" value={summary?.active_keys ?? 0} icon="🔑" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="fw-semibold mb-3">Requests by API</h6>
            <UsageChart data={usage} />
          </div>
        </div>
      </div>

      <div className="card p-3">
        <h6 className="fw-semibold mb-3">Recent Requests</h6>
        <RequestLogTable logs={logs} />
      </div>
    </div>
  );
}
