import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Label } from "../components/ui/label.jsx";
import { Input } from "../components/ui/input.jsx";
import { cn } from "../lib/utils.js";

// Reused design helper components from the register page
function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}

function LabelInputContainer({ children, className }) {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-sidebar">
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-4 md:p-8 border border-border">
        <h2 className="text-xl font-bold text-textPrimary">Welcome back</h2>
        <p className="mt-2 max-w-sm text-sm text-textSecondary">
          Log in to your AI Codebase Assistant account.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-accent to-accent/80 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Log in →"}
            <BottomGradient />
          </button>
        </form>

        <p className="text-textSecondary text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;