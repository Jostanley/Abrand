import React from "react";

function subscription(){
  // Function to start trial and collect card
  const startTrial = (method) =>{
      let handler = PaystackPop.setup({
        key: 'pk_live_10343c5462a915b51fac6020b280054f73231fa3', 
        email: 'customer@email.com',
        amount: 1000 * 100, 
        currency: 'NGN', // or 'NGN', 'USD' depending on your setup
        channels: [method],
        callback: function(response) {
          alert('Payment successful! Ref: ' + response.reference);
        },
        onClose: function() {
          alert('Payment window closed.');
        }
      });
      handler.openIframe();
    }
  // Cancel subscription function
  const cancelSubscription = async () => {
    await fetch("https://abrandai.onrender.com/cancel-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });

    alert("Subscription canceled");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Start Free Trial</h1>

      <button
        onClick={()=>startTrial("card")} // call function on click
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Subscribe
      </button>

      <button
        onClick={()=>cancelSubscription}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Cancel Subscription
      </button>
    </div>
  );
};

export default Subscription;