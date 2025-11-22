import { Navigate } from "react-router-dom";

function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function ProtectedRoute({ children, url = "/login", reverse = false }) {
  const token = localStorage.getItem("token");
  const expired = token ? isExpired(token) : true;

  if (reverse) {
    if (token && !expired) {
      return <Navigate to={url} replace />;
    }
    localStorage.removeItem("token");
    return children;
  }

  if (!token || expired) {
    localStorage.removeItem("token");
    return <Navigate to={url} replace />;
  }

  return children;
}

export default ProtectedRoute;
