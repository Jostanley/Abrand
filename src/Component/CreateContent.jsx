import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { logOut } from "../Service/authService";
const API_URL = "https://abrandai.onrender.com"; // change if deployed

function CreateContent() {
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState(null);
const [showInstall, setShowInstall] = useState(false);


  const [idea, setIdea] = useState("");
  const [outputs, setOutputs] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaders, setLoaders] = useState(false)
  const [error, setError] = useState("");
const [login, setLogin] = useState(false)
  // Subscription states
  const [plan, setPlan] = useState("free");
  const [isSubscribed, setIsSubscribed] = useState(false);

// install function
useEffect(() => {
  const handler = (e) => {
    e.preventDefault();
    setInstallPrompt(e);
    setShowInstall(true);
  };

  window.addEventListener("beforeinstallprompt", handler);

  return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);

const installApp = async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  setInstallPrompt(null);
  setShowInstall(false);
};
  /* ==============================
     AUTH + SUBSCRIPTION CHECK
  =============================== */
  useEffect(() => {
  const syncUser = async () => {
    try {
  setLoaders(true)
      // 1️⃣ Get session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.warn("No active session");
        return;
      }

      const user = session.user;

      // 2️⃣ Payload
      const payload = {
        auth_id: user.id,
        email: user.email,
        
      };

      // 3️⃣ Send to backend
      const res = await fetch(`${API_URL}/api/user/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Sync failed");
        alert("error")
      } 
       
      const newdata = await res.json();
          setLoaders(false)
          setLogin(true)
      setUserId(newdata.user?.id);
      setUserEmail(newdata.user?.email);
      setPlan(newdata.subscription?.plan);
        
      
    } catch (err) {
      setLoaders(false)
      setLogin(false)
      alert(err.message)
      console.error(err.message);
    }
  };

  syncUser();
}, []);

  const toggleText = () => setToggle((prev) => !prev);

  /* ==============================
     CALL AI BACKEND
  =============================== */
  const handleGenerate = async () => {
    if (!isSubscribed) {
      navigate("/subscribe");
      return;
    }

    if (!idea.trim() || !userId) return;

    setLoading(true);
    setError("");
    setOutputs([]);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: idea }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate content");

      setOutputs([data.reply]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  //=============================

const startSubscription = (methods) => {
  const handler = PaystackPop.setup({
    key:import.meta.env.VITE_PAYSTACK_KEY,
    email: userEmail,
    plan: import.meta.env.VITE_PLAN_CODE_KEY , // ✅ subscription plan code
    channels: [methods], // e.g. "card", "bank"

    callback: function () {
      // ✅ Payment successful (UI feedback only)
      alert("Payment successful! Your subscription is being activated.");
    },

    onClose: function () {
      alert("Payment window closed.");
    },
  });

  handler.openIframe();
};

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f] text-white">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0f0f0f] border-b border-gray-800 px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Brand AI</h1>
        <button onClick={toggleText} className="text-sm text-gray-400 hover:text-white">
          Profile
        </button>
      </header>
{showInstall && (
  <button
    onClick={installApp}
    className="fixed bottom-20 right-4 bg-blue-600 px-4 py-2 rounded-lg shadow-lg text-sm"
  >
    Install App
  </button>
)}
      {/* Profile Dropdown */}
      {toggle && (
       <div className="fixed top-14 right-4 w-56 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium truncate">{userEmail}</p>
            <p className="text-xs text-gray-400">{plan}</p>
          </div>

          <button
            onClick={() => navigate("/brand-setup")}
            className="w-full px-4 py-2 text-sm text-left hover:bg-[#2a2a2a]"
          >
            Brand Profile
          </button>

          <button
            onClick={() => navigate("/contentpage")}
            className="w-full px-4 py-2 text-sm text-left hover:bg-[#2a2a2a]"
          >
            My Content
          </button>
     { !login ?
          <button
            onClick={async () => {
              await logOut();
              navigate("/login");
            }}
            className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-[#2a2a2a]"
          >
            Logout
          </button>:
          <button onClick = {()=>navigate('/login')}
          className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-[#2a2a2a]">login</button>
     }
          <button onClick ={toggleText}className ="absolute right-1">close</button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 mt-20 mb-32 px-4">
        {/* Hero */}
        
          {login ?
           
       ( <>
         
      
      
          <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Hello Brand 👋</h2>
          <p className="text-gray-400 text-sm mb-4">
            An AI that helps creators generate on-brand content by remembering their brand, audience, and past posts.
          </p>
           <h3 className ="mt-2 mb-2">3-Day Free Trial · Then $10/Month</h3>
          <button
          onClick ={()=>navigate('/subscription')}
            className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            Try for free
          </button>
        </div>

        {/* Outputs */}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <div className="space-y-4">
          {outputs.map((text, index) => (
            <div key={index} className="bg-[#161616] border border-gray-700 rounded-xl p-4 relative">
              <pre className="whitespace-pre-wrap text-sm">{text}</pre>
              <button
                onClick={() => handleCopy(text)}
                className="absolute top-3 right-3 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        </>
        )
        :
        (<>
          <div className="max-w-4xl text-center">
        
        {/* Badge */}
        <div className="inline-block px-4 py-1 mb-6 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full">
          Intelligent Brand Management
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Brand, <span className="text-indigo-600">Remembered.</span> Always.
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg md:text-xl text-gray-600">
          Set up your brand once. Every search, summary, and idea builds on it —
          intelligently, automatically. No repetition. Just smarter results.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick ={()=>navigate('/signup')} className="px-6 py-3 text-white bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 transition">
            Create Your Brand
          </button>

          <button onClick ={()=>navigate('/login')} className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-white hover:bg-gray-100 transition">
            Login
          </button>
        </div>

    </div>
        </>)
        }
        
      </main>

      {/* Bottom Input */}
      <footer className="fixed bottom-0 w-full bg-[#1a1a1a] border-t border-gray-800 p-3 flex gap-2 items-center">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={isSubscribed ? "Describe the content you want..." : "Subscribe to unlock AI generation"}
          rows={2}
          disabled={!isSubscribed}
          className="flex-1 bg-black border border-gray-700 rounded-lg p-3 text-sm disabled:opacity-50 focus:outline-none focus:border-blue-500"
        />
         {/*login in navigate */}
        
        <button
          onClick={handleGenerate}
          disabled={!isSubscribed || loading}
          className={`px-5 py-2 rounded-lg text-sm font-medium ${
            isSubscribed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {isSubscribed ? (loading ? "Generating..." : "Generate") : "Locked 🔒"}
        </button>
        </footer>
    </div>
  );
}

export default CreateContent;