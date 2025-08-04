"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import API from "../services/api"; // Assuming API is imported from services/api

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email format.";
    if (!/^[0-9]{10}$/.test(formData.mobile))
      errs.mobile = "Mobile number must be 10 digits.";
    if (formData.password.length < 6)
      errs.password = "Password must be 6+ characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setIsSigningUp(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-6 sm:p-8 animate-fade-in-up transform transition-all duration-300 hover:scale-[1.01]">
        <div className="pb-4 mb-6 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold text-center text-gray-800">
            Create Account
          </h2>
          <p className="text-center text-gray-600 text-sm mt-1">
            Join us to start tracking your expenses!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {["name", "email", "mobile", "password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 capitalize mb-1"
              >
                {field}
              </label>
              <input
                id={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                placeholder={`Enter ${field}`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-300 focus:border-secondary-500 outline-none transition-all duration-200"
              />
              {errors[field] && (
                <p className="text-accent-600 text-sm mt-1 animate-shake">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-secondary-600 text-blue py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSigningUp ? (
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
                Creating Account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary-600 hover:underline font-medium hover:text-secondary-700 transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
