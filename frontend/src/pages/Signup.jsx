import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authApi from "../api/authApi";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authApi.signupUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center 
  bg-[url('./images/loginbg2.svg')] bg-cover bg-center 
  bg-black/40 bg-blend-overlay px-4"
    >
      <div
        className="relative w-full max-w-md p-8 space-y-6 
    bg-[rgba(17,25,40,0.45)] backdrop-blur-2xl backdrop-saturate-150
    border border-white/10 ring-1 ring-white/10
    rounded-2xl shadow-2xl shadow-black/50 text-white
    transition-all duration-300 hover:shadow-white/10"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>

        <h1 className="text-3xl font-bold text-center relative z-10">
          Create an Account
        </h1>

        {error && (
          <p className="text-red-200 bg-red-500/20 rounded-full p-3 text-center text-sm relative z-10">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-gray-400"
            />
          </div>

          <div>
            <input
              id="email-signup"
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-gray-400"
            />
          </div>

          <div>
            <input
              id="password-signup"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4  bg-pink-600/75 text-white rounded-full font-semibold hover:bg-fuchsia-500/60 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 relative z-10">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
