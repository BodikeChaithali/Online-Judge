import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  return children;
}
