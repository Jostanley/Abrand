import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    // Supabase handles the token in the URL hash automatically via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setStatus("success");
        setTimeout(() => navigate("/createContent"), 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {status === "verifying" && (
          <>
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="animate-spin w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Verifying your email</h2>
            <p className="text-zinc-400 text-sm">Hang tight, we're confirming your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Email verified!</h2>
            <p className="text-zinc-400 text-sm">Redirecting you to the app...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification failed</h2>
            <p className="text-zinc-400 text-sm mb-6">The link may have expired. Try signing up again.</p>
            <button onClick={() => navigate('/signup')} className="btn-primary w-full py-3">
              Back to signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
