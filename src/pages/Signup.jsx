import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let safeValue = value;
    if (name === "first_name") safeValue = value.replace(/[^a-zA-Z\s'-]/g, "");
    else if (name === "email") safeValue = value.trim();
    setFormData((prev) => ({ ...prev, [name]: safeValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.first_name.trim()) return setError("First name is required");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { first_name: formData.first_name },
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-zinc-400 text-sm mb-6">
            We sent a confirmation link to <strong className="text-white">{formData.email}</strong>. Click it to activate your account.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full py-3">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="glow-blob w-80 h-80 bg-violet-600/10 top-1/4 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-400">Start building your brand memory</p>
        </div>

        {/* Card */}
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">First name</label>
              <input
                name="first_name"
                placeholder="Alex"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                  className="input-field pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => ({ ...p, password: !p.password }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
                >
                  {showPassword.password ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                  className="input-field pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => ({ ...p, confirmPassword: !p.confirmPassword }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
                >
                  {showPassword.confirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
