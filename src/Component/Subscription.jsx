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

 const StartSubscription = (methods) => {
  if (!usermail) {
    alert("User email not loaded yet");
    return;
  }

  if (!window.PaystackPop) {
    alert("Paystack not loaded");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_KEY,
    email: usermail,
    amount:"15000",
    channels: [methods],
    
    callback: function (response) {
      alert("Payment successful! Your subscription is being activated.");
      console.log("Reference:", response.reference);
    },

    onClose: function () {
      alert("Payment window closed.");
    },
  });

  handler.openIframe();
};

const startSubscription = (methods) => {
  if (!usermail || !userid) {
    alert("User info not loaded yet");
    return;
  }

  if (!window.PaystackPop) {
    alert("Paystack not loaded");
    return;
  }

  // Setup and open Paystack popup immediately
  window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_KEY,
    email: usermail,
    amount: 15000 * 100,
    currency: "NGN",
    channels: [methods],
    callback:  function(event) {
    alert(event.amount)  
    setIsSubscribed(true)
      
    },
    onClose: () => {
      alert("Payment window closed.");
    },
  }).openIframe(); // 🔑 directly open popup
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
      alert("Subscription canceled.");
    } else {
      alert("Unable to cancel.");
    }
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
          onClick={()=>startSubscription("card")}
          
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded mb-4 disabled:opacity-50"
        >
        Subscribe Now - ₦1,000/m
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