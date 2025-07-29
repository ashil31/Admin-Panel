import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

// Define the shape of the decoded JWT payload
interface DecodedToken {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");


    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        localStorage.setItem("token", token);

        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name || "",
          picture: decoded.picture || "",
        });

        navigate("/dashboard", {
          replace: true,
          state: { loginSuccess: true }, // ✅ include login success state
        });
      } catch (err) {
        console.error("Token decode failed in OAuthCallback", err);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/register", { replace: true });
    }
  }, [location.search, setUser, navigate]);

  return <div>Processing login…</div>;
}
