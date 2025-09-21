import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../../apis/authApi";
import { clearError } from "../../../stores/actions/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await dispatch(loginUser({ email: data.email, password: data.password }));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <section className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="Go to homepage"
            >
              <span className="inline-grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white font-semibold">
                OH
              </span>
              <span className="text-2xl font-semibold tracking-tight">
                Oceanview Hotel
              </span>
            </a>
            <p className="mt-2 text-slate-500">
              Welcome back — manage your bookings and rewards.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4"
            aria-label="Login form"
          >
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-slate-700 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-slate-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2 my-1 px-3 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="remember" className="text-sm">
                Keep me signed in
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 text-sm p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-slate-900 hover:underline"
              >
                Create one
              </a>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </main>
  );
};

export default Login;
