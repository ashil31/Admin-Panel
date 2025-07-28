// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

// Define the structure of decoded JWT
interface DecodedToken {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

// Define the structure of the user context
interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Context value type
interface AuthContextType {
  user: AuthUser | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null | undefined>>;
}

// Create a typed context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name || "",
          picture: decoded.picture || "",
        });
      } catch (error) {
        console.error("AuthContext: Invalid token");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoadingAuth(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loadingAuth ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
