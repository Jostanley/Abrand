import { useState } from "react";
import { resetPassword } from "../Service/authService";
import {useNavigate} from 'react-router-dom'
 function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await resetPassword(email);

    if (!res.success) {
      setError(res.error);
    } else {
      setMessage("Password reset link sent. Check your email.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#1a1a1a] p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Reset your password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-[#0f0f0f] border border-gray-700 outline-none"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
        <button
        onClick ={()=> navigate('/login')}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-medium disabled:opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  );
}
export default ResetPassword