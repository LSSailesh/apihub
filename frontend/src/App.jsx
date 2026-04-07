import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ApiDetail from "./pages/ApiDetail";
import Tester from "./pages/Tester";
import KeyVault from "./pages/KeyVault";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import SubmitApi from "./pages/SubmitApi";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ApiDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/success" element={<OAuthSuccess />} />
        <Route path="/tester" element={<PrivateRoute><Tester /></PrivateRoute>} />
        <Route path="/keys" element={<PrivateRoute><KeyVault /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/submit" element={<PrivateRoute><SubmitApi /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
