import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../../apis/authApi";
import { clearError } from "../../../stores/actions/authSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.password !== data.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await dispatch(
        registerUser({
          username: data.firstName + " " + data.lastName,
          email: data.email,
          password: data.password,
        })
      );
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <section className="w-full max-w-xl">
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
              Create your account to personalize every stay.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4"
            aria-label="Registration form"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Alex"
                  className="h-11 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Morgan"
                  className="h-11 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                />
              </div>
            </div>

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

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 my-3 px-3 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Use 8+ characters with letters & numbers.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="confirm" className="text-sm font-medium">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute inset-y-0 right-2 my-5 px-3 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 focus:outline-none"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+66 99 999 9999"
                  className="h-11 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country/Region
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="h-11 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                >
                  <option value="">Select...</option>
                  <option>Thailand</option>
                  <option>Vietnam</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Singapore</option>
                </select>
              </div>
            </div>

            {(error || reduxError) && (
              <div className="rounded-lg bg-red-50 text-red-700 text-sm p-3">
                {error || reduxError}
              </div>
            )}

            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="terms" className="text-sm text-slate-700">
                I agree to the{" "}
                <a href="/terms" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-slate-900 hover:underline"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by our security and anti‑fraud systems.
        </p>
      </section>
    </main>
  );
};

export default Register;
