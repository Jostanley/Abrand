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

  const [toggle, setToggle] = useState({
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = (field) => {
    setToggle((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (formData.password !== formData.confirmPassword) {
    return setError("Passwords do not match");
  }

  if (formData.password.length < 6) {
    return setError("Password must be at least 6 characters");
  }

  if (!formData.first_name) {
    return setError("First name is required");
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (error) throw error;

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0f0f0f] p-8 rounded-lg shadow-md">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create your account
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border text-white bg-transparent"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border text-white bg-transparent"
            required
          />

          <div className="flex items-center border border-white rounded-lg px-2 focus:outline-none">
            <input
              name="password"
              type={toggle.password ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 px-2 py-3 bg-transparent text-white outline-none"
              required
            />
            <button
              type="button"
              onClick={() => togglePassword("password")}
              className="text-sm text-white"
            >
              {toggle.password ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center border border-white rounded-lg px-2">
            <input
              name="confirmPassword"
              type={toggle.confirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="flex-1 px-2 py-3 bg-transparent text-white outline-none"
              required
            />
            <button
              type="button"
              onClick={() => togglePassword("confirmPassword")}
              className="text-sm text-white"
            >
              {toggle.confirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-white">
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="font-bold ml-2"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
};

export default Signup;