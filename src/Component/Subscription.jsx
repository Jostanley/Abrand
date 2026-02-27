import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Subscription() {
  const [usermail, setUsermail] = useState("");
  const [userid, setUserid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(null); // null = unknown

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) { console.error(error); return; }
      if (data?.user) {
        setUsermail(data.user.email);
        setUserid(data.user.id);
        fetchSubscriptionStatus(data.user.id);
      }
    };
    loadUser();
  }, []);

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
    if (!usermail) { alert("User email not loaded yet"); return; }
    if (!window.PaystackPop) { alert("Payment system not ready. Please refresh."); return; }

    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: "pk_test_409f5b1a06d78f18537c5c76597da4efe1371e48",
      email: usermail,
      amount: 1000 * 100,
      currency: "NGN",
      callback: async (response) => {
        try {
          const res = await fetch("https://abrandai.onrender.com/verify-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference, user_id: userid }),
          });
          const result = await res.json();
          if (result.success) {
            setIsSubscribed(true);
            alert("Subscription activated successfully!");
          } else {
            alert("Verification failed. Please contact support.");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong during verification.");
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        setLoading(false);
        alert("Payment window closed.");
      },
    });
    handler.openIframe();
  };

  const cancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
    setCanceling(true);
    try {
      await fetch("https://abrandai.onrender.com/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userid }),
      });
      setIsSubscribed(false);
      alert("Subscription canceled.");
    } catch {
      alert("Failed to cancel subscription.");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Premium Subscription</h1>

      {isSubscribed !== null && (
        <p className={`mb-4 text-sm font-medium ${isSubscribed ? "text-green-600" : "text-gray-500"}`}>
          {isSubscribed ? "✅ You have an active subscription" : "You are not currently subscribed"}
        </p>
      )}

      {!isSubscribed && (
        <button
          onClick={startSubscription}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded mb-4 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Subscribe Now - ₦1,000/mo"}
        </button>
      )}

      {isSubscribed && (
        <button
          onClick={cancelSubscription}
          disabled={canceling}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {canceling ? "Canceling..." : "Cancel Subscription"}
        </button>
      )}
    </div>
  );
}

export default Subscription;