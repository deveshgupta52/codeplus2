import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };
  return (
    <div className="w-full bg-[url('./images/loginbg2.svg')] bg-cover bg-center bg-black/40 bg-blend-overlay min-h-screen flex flex-col justify-center">
      <div className="flex justify-center py-12">
        <div
          className="relative w-full max-w-md p-8 space-y-6
        bg-[rgba(17,25,40,0.45)] backdrop-blur-xl backdrop-saturate-150
        border border-white/10 ring-1 ring-white/10
        rounded-2xl shadow-2xl shadow-black/40 text-white
        transition-all duration-300 hover:shadow-white/10"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>

          <h1 className="text-3xl font-bold text-center z-10 relative">
            Login
          </h1>

          {error && (
            <p className="text-red-200 bg-red-500/20 rounded-md p-3 text-center text-sm z-10 relative">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 z-10 relative">
            <div>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-pink-600/75 text-white rounded-full font-semibold hover:bg-fuchsia-500/60 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-300 z-10 relative">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-white hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
