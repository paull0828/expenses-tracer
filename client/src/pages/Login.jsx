import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    if (!identifier.trim()) return "Email or mobile is required.";
    if (!password || password.length < 6)
      return "Password must be 6+ characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsAuthenticating(true);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsAuthenticating(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login?.({ user: data.user, token: data.token });
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-6 sm:p-8 animate-fade-in-up transform transition-all duration-300 hover:scale-[1.01]">
        <div className="pb-4 mb-6 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold text-center text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 text-sm mt-1">
            Sign in to manage your finances.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or Mobile
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or mobile"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all duration-200"
            />
          </div>
          {error && (
            <p className="text-accent-600 text-sm text-center animate-shake">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-primary-600 text-blue py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAuthenticating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in…
              </>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 hover:underline font-medium hover:text-primary-700 transition-colors duration-200"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
