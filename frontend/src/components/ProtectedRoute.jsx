import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, url="/login", reverse=false }) {
    const token = localStorage.getItem("token");

    if (reverse) {
        if (token) return <Navigate to={url} replace/>
        return children;
    }

    if (!token) return <Navigate to={url} replace/>

    return children;
}

export default ProtectedRoute;