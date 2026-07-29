import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="border-b border-border">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono text-sm text-accent tracking-widest uppercase"
        >
          AI Codebase Assistant
        </Link>

        <div className="flex items-center gap-5 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-textSecondary hover:text-textPrimary">
                Dashboard
              </Link>
              <Link to="/settings" className="text-textSecondary hover:text-textPrimary">
                Settings
              </Link>
              <span className="text-textSecondary">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-textSecondary hover:text-textPrimary"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-textSecondary hover:text-textPrimary">
                Log In
              </Link>
              <Link to="/register" className="text-accent hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;