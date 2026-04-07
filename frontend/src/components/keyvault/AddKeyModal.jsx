import { useState } from "react";
import { addKey } from "../../services/keyService";

export default function AddKeyModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "", service: "", key_value: "",
    environment: "Development", tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await addKey({
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      });
      onSaved();
    } catch {
      setError("Failed to save key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Add API Key</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {[
              { label: "Key Name", key: "name", placeholder: "My OpenAI Key" },
              { label: "Service", key: "service", placeholder: "OpenAI" },
              { label: "Key Value", key: "key_value", placeholder: "sk-..." },
              { label: "Tags (comma separated)", key: "tags", placeholder: "ai, production" },
            ].map((f) => (
              <div className="mb-3" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-control"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Environment</label>
              <select
                className="form-select"
                value={form.environment}
                onChange={(e) => setForm({ ...form, environment: e.target.value })}
              >
                <option>Development</option>
                <option>Staging</option>
                <option>Production</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
