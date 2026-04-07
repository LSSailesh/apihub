export default function RequestLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return <p className="text-muted small">No requests logged yet.</p>;
  }

  const statusColor = (code) => code < 300 ? "success" : code < 400 ? "warning" : "danger";

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Method</th>
            <th>URL</th>
            <th>Status</th>
            <th>Time</th>
            <th>API</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td><code className="fw-bold">{log.method}</code></td>
              <td className="text-truncate" style={{ maxWidth: 200 }}>
                <small className="text-muted">{log.url}</small>
              </td>
              <td>
                <span className={`badge bg-${statusColor(log.status_code)}`}>
                  {log.status_code}
                </span>
              </td>
              <td><small>{log.response_time_ms}ms</small></td>
              <td><small className="text-muted">{log.api_name || "—"}</small></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
