import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getKeys, deleteKey, revealKey } from "../services/keyService";
import KeyCard from "../components/keyvault/KeyCard";
import AddKeyModal from "../components/keyvault/AddKeyModal";

export default function KeyVault() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: keys, isLoading } = useQuery({
    queryKey: ["keys"],
    queryFn: () => getKeys().then((r) => r.data),
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this key?")) return;
    await deleteKey(id);
    queryClient.invalidateQueries(["keys"]);
  };

  const handleReveal = async (id) => {
    const res = await revealKey(id);
    return res.data.key;
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Key Vault</h2>
          <p className="text-muted mb-0">Securely store and manage your API keys</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Key
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted">Loading keys...</p>
      ) : keys?.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div className="fs-1 mb-2">🔑</div>
          <p>No keys saved yet. Add your first API key.</p>
        </div>
      ) : (
        <div className="row g-3">
          {keys?.map((key) => (
            <div className="col-md-6" key={key.id}>
              <KeyCard keyData={key} onDelete={handleDelete} onReveal={handleReveal} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddKeyModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries(["keys"]);
          }}
        />
      )}
    </div>
  );
}
