import { useState } from "react";
import { useLocation } from "react-router-dom";
import RequestBuilder from "../components/tester/RequestBuilder";
import ResponseViewer from "../components/tester/ResponseViewer";
import { sendRequest } from "../services/testerService";

export default function Tester() {
  const location = useLocation();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialState = {
    method: "GET",
    url: location.state?.url || "",
    headers: {},
    params: {},
    body: null,
    api_name: location.state?.apiName || "",
  };

  const handleSend = async (requestData) => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const res = await sendRequest(requestData);
      setResponse(res.data);
    } catch {
      setError("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="fw-bold mb-1">API Tester</h2>
      <p className="text-muted mb-4">Build and send HTTP requests directly from your browser</p>
      <div className="row g-4">
        <div className="col-lg-6">
          <RequestBuilder initialData={initialState} onSend={handleSend} loading={loading} />
        </div>
        <div className="col-lg-6">
          <ResponseViewer response={response} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}
