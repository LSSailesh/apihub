export default function ResponseViewer({ response, error, loading }) {
  const statusColor = response?.status_code < 300 ? "success"
    : response?.status_code < 400 ? "warning" : "danger";

  const formatBody = (body) => {
    try { return JSON.stringify(JSON.parse(body), null, 2); }
    catch { return body; }
  };

  return (
    <div className="card p-3 h-100">
      <h6 className="fw-semibold mb-3">Response</h6>

      {loading && <p className="text-muted">Sending request...</p>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {response && (
        <>
          <div className="d-flex gap-3 mb-3">
            <span className={`badge bg-${statusColor} fs-6`}>
              {response.status_code}
            </span>
            <span className="text-muted small align-self-center">
              ⚡ {response.response_time_ms}ms
            </span>
            <button
              className="btn btn-sm btn-outline-secondary ms-auto"
              onClick={() => navigator.clipboard.writeText(response.body)}
            >
              Copy
            </button>
          </div>
          <pre
            className="bg-light p-3 rounded font-monospace overflow-auto"
            style={{ fontSize: 12, maxHeight: 400 }}
          >
            {formatBody(response.body)}
          </pre>
        </>
      )}

      {!response && !loading && !error && (
        <div className="text-center text-muted py-5">
          <div className="fs-1 mb-2">📭</div>
          <p>Send a request to see the response here</p>
        </div>
      )}
    </div>
  );
}
