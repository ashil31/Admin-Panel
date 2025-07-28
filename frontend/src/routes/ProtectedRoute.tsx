import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === null) {
    // auth checked and user is not signed in
    return <Navigate to="/signin" replace />;
  }
  // while loadingAuth is true, AuthProvider would render loading spinner
  return children;
}
