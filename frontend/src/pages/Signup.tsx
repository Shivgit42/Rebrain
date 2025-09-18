/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "../icons/Logo";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    let isValid = true;
    if (!username.trim()) {
      setUsernameError("Username cannot be empty");
      isValid = false;
    } else setUsernameError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else setPasswordError("");

    return isValid;
  };

  const signup = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
      });
      const jwt = response.data.token;
      if (jwt) login(jwt);

      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-4 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: signup form */}
        <div className="bg-white p-10 md:p-14 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center">
              <Logo />
            </div>
            <div>
              <p className="text-sm text-gray-500">Join us at</p>
              <h3 className="text-lg font-semibold text-gray-900 -mt-1">
                ReBrain Studio
              </h3>
            </div>
          </div>

          <div className="max-w-md w-full">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Create an account
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Start your journey. Already have an account?{" "}
              <Link
                to="/signin"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-7 space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-indigo-100"
                />
                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (
                        e.target.value.length > 0 &&
                        e.target.value.length < 6
                      )
                        setPasswordError(
                          "Password must be at least 6 characters"
                        );
                      else setPasswordError("");
                    }}
                    placeholder="Create a password"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  onClick={signup}
                  variant="primary"
                  text="Sign up"
                  fullWidth
                  loading={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center justify-center relative bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-12">
          <div
            className="w-full h-full flex items-center justify-center p-12"
            style={{ minHeight: 420 }}
          >
            <svg
              viewBox="0 0 600 600"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-lg w-full"
              style={{ animation: "float 8s ease-in-out infinite" }}
            >
              <defs>
                <linearGradient id="sg1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="sf1" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="30" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0"
                  />
                </filter>
              </defs>

              <path
                d="M419.5,316.5Q392,383,334.5,408.5Q277,434,215.5,413.5Q154,393,108.5,345.5Q63,298,80.5,237Q98,176,145.5,133Q193,90,259.5,84.5Q326,79,374,111Q422,143,438,196.5Q454,250,419.5,316.5Z"
                fill="url(#sg1)"
                filter="url(#sf1)"
                opacity="0.95"
              />
            </svg>
          </div>

          <div className="absolute left-12 bottom-12 text-white/90">
            <h4 className="text-lg font-bold">Welcome!</h4>
            <p className="text-sm mt-1 max-w-xs text-white/90">
              Fast access to your dashboard — secure and simple.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
