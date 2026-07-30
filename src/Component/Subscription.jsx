import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Subscription() {
  const navigate = useNavigate();
  const [usermail, setUsermail] = useState("");
  const [userid, setUserid] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate('/login');
        return;
      }
      setUsermail(data.user.email);
      setUserid(data.user.id);
      await fetchSubscriptionStatus(data.user.id);
      setLoading(false);
    };
    loadUser();
  }, [navigate]);

  const fetchSubscriptionStatus = async (uid) => {
    try {
      const res = await fetch("https://abrandai.onrender.com/subscription-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid }),
      });
      const result = await res.json();
      setIsSubscribed(result.isSubscribed);
    } catch {
      setIsSubscribed(false);
    }
  };

  const startSubscription = () => {
    if (!usermail || !userid) return;
    if (!window.PaystackPop) {
      alert("Payment provider not loaded. Please refresh and try again.");
      return;
    }

    window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_KEY,
      email: usermail,
      amount: 1000 * 100,
      currency: "NGN",
      channels: ["card"],
      callback: () => {
        setIsSubscribed(true);
      },
      onClose: () => {},
    }).openIframe();
  };

  const cancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;

    setCanceling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("https://abrandai.onrender.com/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setIsSubscribed(false);
      } else {
        alert("Unable to cancel subscription. Please try again.");
      }
    } catch {
      alert("Failed to cancel subscription.");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/createContent')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        {/* Status */}
        {isSubscribed !== null && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${
            isSubscribed
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-[#18181b] border-[#27272a]'
          }`}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSubscribed ? 'bg-green-400' : 'bg-zinc-600'}`} />
            <p className="text-sm font-medium">
              {isSubscribed ? "Active subscription" : "No active subscription"}
            </p>
          </div>
        )}

        {/* Plan Card */}
        <div className="rounded-2xl bg-gradient-to-b from-indigo-500/10 to-violet-500/5 border border-indigo-500/30 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Pro Plan</h2>
              <p className="text-zinc-400 text-sm mt-1">Full AI access, unlimited brands</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₦1,000</div>
              <div className="text-xs text-zinc-500">/month</div>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Unlimited AI content generation",
              "Unlimited brand profiles",
              "Full content history",
              "Priority support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-zinc-300">{f}</span>
              </li>
            ))}
          </ul>

          {!isSubscribed ? (
            <button
              onClick={startSubscription}
              className="btn-primary w-full py-3 text-base"
            >
              Subscribe Now
            </button>
          ) : (
            <button
              onClick={cancelSubscription}
              disabled={canceling}
              className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {canceling ? "Canceling..." : "Cancel Subscription"}
            </button>
          )}
        </div>

        <p className="text-xs text-zinc-500 text-center">
          Payments are processed securely via Paystack
        </p>
      </div>
    </div>
  );
}

export default Subscription;
