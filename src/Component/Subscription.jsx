import React from "react";
import {useEffect,useState} from 'react';
import {supabase} from '../supabaseClient.js'
function Subscription(){
  // Function to start trial and collect card
  const [usermail,setUsermail] = useState("")
  const [userid,setUserid] = useState(null)
  
  useEffect(
  const userinfo = async ()=>{
  const { data:{user},errors
  } = await supabase.auth.getUser();
   if (user){
     alert(user.email)
     setUsermail(data.user?.email)
     setUserid(data.user?.id)
   } else{
     alert("user not exist")
   }
  },[])
  const startTrial = async (method) =>{
    try{
      let handler = await PaystackPop.setup({
        key:"pk_test_409f5b1a06d78f18537c5c76597da4efe1371e48",
        email:"jostanley@gmail.com",
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
  }
  catch (err){
    alert (err.message)
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
        onClick={cancelSubscription}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Cancel Subscription
      </button>
    </div>
  );
};

export default Subscription;