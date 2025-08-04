"use client";

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Menu,
  X,
  Wallet,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout?.();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-lg sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 group"
          aria-label="Home - Expense Tracker"
        >
          <Wallet className="w-7 h-7 text-primary-400 group-hover:rotate-6 transition-transform duration-200" />
          <span className="text-white hover:text-gray-200 transition-colors duration-200">
            Expense Tracker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-200">
                Welcome,{" "}
                <strong className="font-semibold text-secondary-300">
                  {user.name || user.username || "User"}
                </strong>
              </span>

              <button
                onClick={handleLogout}
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1"
                aria-label="Login"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1"
                aria-label="Signup"
              >
                <UserPlus className="w-4 h-4" /> Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-gray-800 border-t border-gray-700 flex flex-col p-4 shadow-lg animate-fade-in-down">
              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    <span className="text-lg font-medium text-secondary-300 text-center">
                      Welcome, {user.name || user.username || "User"}
                    </span>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg transition-colors duration-200"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      hboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg transition-colors duration-200"
                    >
                      <LogIn className="w-5 h-5" /> Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg transition-colors duration-200"
                    >
                      <UserPlus className="w-5 h-5" /> Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
