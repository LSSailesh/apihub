import { useState } from "react";
import MethodSelector from "./MethodSelector";

export default function RequestBuilder({ initialData, onSend, loading }) {
  const [method, setMethod] = useState(initialData.method);
  const [url, setUrl] = useState(initialData.url);
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("{}");
  const [tab, setTab] = useState("headers");

  const handleSend = () => {
    let parsedHeaders = {};
    let parsedBody = null;
    try { parsedHeaders = JSON.parse(headers); } catch {}
    try { parsedBody = ["POST", "PUT", "PATCH"].includes(method) ? JSON.parse(body) : null; } catch {}
    onSend({ method, url, headers: parsedHeaders, body: parsedBody, api_name: initialData.api_name });
  };

  return (
    <div className="card p-3 h-100">
      <h6 className="fw-semibold mb-3">Request</h6>
      <div className="d-flex gap-2 mb-3">
        <MethodSelector value={method} onChange={setMethod} />
        <input
          className="form-control"
          placeholder="https://api.example.com/endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <ul className="nav nav-tabs mb-2">
        {["headers", "body"].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link py-1 ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {tab === "headers" && (
        <textarea
          className="form-control font-monospace"
          rows={6}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          style={{ fontSize: 13 }}
        />
      )}
      {tab === "body" && (
        <textarea
          className="form-control font-monospace"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ fontSize: 13 }}
          disabled={!["POST", "PUT", "PATCH"].includes(method)}
          placeholder={!["POST", "PUT", "PATCH"].includes(method) ? "Body not applicable for " + method : ""}
        />
      )}

      <button className="btn btn-primary mt-3 w-100" onClick={handleSend} disabled={loading || !url}>
        {loading ? "Sending..." : "Send Request"}
      </button>
    </div>
  );
}
