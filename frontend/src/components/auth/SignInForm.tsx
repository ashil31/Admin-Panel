import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
  id?: string;
}

export default function SignInForm() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/login", data);
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode<ExtendedJwtPayload>(res.data.token);
      setUser({
        email: decoded.email || "",
        name: decoded.name || "",
        id: decoded.id || "",
        picture: decoded.picture || "",
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        setError((err).response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://admin-panel-snq4.onrender.com/auth/google";
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <div className="w-full mb-1 sm:mb-3">
              <button
                onClick={handleGoogleLogin}
                className="inline-flex w-full items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                {/* Google SVG Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="#4285F4" d="M18.75 10.19c0-.72-.06-1.25-.19-1.79h-8.38v3.25h4.92c-.1.81-.64 2.03-1.82 2.85l2.65 2.12C17.78 15.1 18.75 12.86 18.75 10.19Z" />
                  <path fill="#34A853" d="M10.18 18.75c2.41 0 4.43-.78 5.91-2.12l-2.82-2.14c-.76.51-1.78.87-3.09.87-2.36 0-4.36-1.52-5.07-3.63L2.2 13.93c1.47 2.85 4.48 4.82 7.98 4.82Z" />
                  <path fill="#FBBC05" d="M5.1 11.73c-.19-.55-.3-1.14-.3-1.73s.11-1.33.29-1.73L2.2 6.07A8.71 8.71 0 0 0 1.25 10c0 1.41.33 2.74.95 3.93l2.9-2.2Z" />
                  <path fill="#EB4335" d="M10.18 4.63c1.68 0 2.82.71 3.63 1.3l2.52-2.41C14.6 2.12 12.59 1.25 10.18 1.25 6.69 1.25 3.67 3.21 2.2 6.07l2.89 2.2C5.81 6.16 7.82 4.63 10.18 4.63Z" />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setData({ ...data, password: e.target.value })
                      }
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?{" "}
                <Link
                  to="/"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
