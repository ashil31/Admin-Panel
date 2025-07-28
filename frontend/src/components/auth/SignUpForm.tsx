import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import api from "../../api/axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

interface AuthUser {
  email: string;
  name?: string;
  id: string;
  picture?: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/register", formData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode<AuthUser>(res.data.token);
        setUser({
          email: decoded.email,
          name: decoded.name || "",
          id: decoded.id,
          picture: decoded.picture || "",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://admin-panel-snq4.onrender.com/api/admin/auth/google";
  };

  return (
    <div className="flex flex-col w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>

          {/* Google Auth Button */}
          <div className="w-full mb-3">
            <button
              onClick={handleGoogleLogin}
              className="inline-flex w-full items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {/* Google SVG Path */}
                <path d="M18.75 10.2c0-.72-.06-1.24-.19-1.79h-8.38v3.25h4.92c-.1.81-.64 2.03-1.82 2.85l-.02.11 2.65 2.01.18.02c1.67-1.52 2.64-3.76 2.64-6.45Z" fill="#4285F4"/>
                <path d="M10.18 18.75c2.41 0 4.43-.78 5.91-2.12l-2.82-2.14c-.75.52-1.77.88-3.09.88-2.36 0-4.36-1.53-5.07-3.63l-.1.01-2.76 2.1-.04.1c1.47 2.85 4.48 4.8 7.97 4.8Z" fill="#34A853"/>
                <path d="M5.1 11.73c-.18-.54-.3-1.12-.3-1.73 0-.61.11-1.19.29-1.73l-.01-.11-2.79-2.12-.09.04c-.6 1.19-.95 2.53-.95 3.91s.34 2.72.95 3.91l2.9-2.17Z" fill="#FBBC05"/>
                <path d="M10.18 4.63c1.68 0 2.81.7 3.46 1.29l2.52-2.4C14.6 2.11 12.59 1.25 10.18 1.25 6.69 1.25 3.67 3.21 2.2 6.07l2.89 2.2C5.81 6.16 7.82 4.63 10.18 4.63Z" fill="#EB4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                Or
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>
                    First Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
