import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { logOut } from "../Service/authService";

const API_URL = "https://abrandai.onrender.com";

function CreateContent() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const [idea, setIdea] = useState("");
  const [outputs, setOutputs] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  // Subscription state
  const [plan, setPlan] = useState("free");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // PWA install prompt
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

  // Auth + subscription check
  useEffect(() => {
    const syncUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setInitLoading(false);
          return;
        }

        setUserEmail(user.email);

        const { data: subinfo, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!subError && subinfo) {
          setIsSubscribed(true);
          setPlan(subinfo.plan || "pro");
        } else {
          setIsSubscribed(false);
          setPlan("free");
        }
      } catch (err) {
        console.error(err);
        setIsSubscribed(false);
      } finally {
        setInitLoading(false);
      }
    };

    syncUser();
  }, []);

  // Scroll to bottom when new output arrives
  useEffect(() => {
    if (outputs.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [outputs]);

  const handleGenerate = async () => {
    if (!isSubscribed) {
      navigate("/subscription");
      return;
    }

    if (!idea.trim()) {
      setError("Please describe the content you want to generate.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) throw new Error("Session expired — please log in again.");

      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ message: idea }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to generate content");
      }

      setOutputs((prev) => [{ id: Date.now(), prompt: idea, text: json.reply }, ...prev]);
      setIdea("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const autoResize = (e) => {
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    // Strip special chars from input
    const safe = ta.value.replace(/[^\w\s.,!?'"()\-–—@#$%&*:;/\\]/g, "");
    setIdea(safe);
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  if (initLoading) {
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
    <div className="h-screen flex flex-col bg-[#09090b] text-white overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 glass border-b border-[#27272a] px-4 py-3 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-semibold text-sm">Abrand AI</span>
        </div>

        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300 hover:bg-indigo-500/20 transition-colors text-xs font-bold"
          title="Profile"
        >
          {userEmail ? userEmail[0].toUpperCase() : "?"}
        </button>
      </header>

      {/* Profile Dropdown */}
      {profileOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
          <div className="fixed top-14 right-4 w-60 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#27272a]">
              <p className="text-sm font-medium truncate">{userEmail || "Guest"}</p>
              <p className="text-xs text-zinc-500 capitalize mt-0.5">{plan} plan</p>
            </div>

            <div className="p-1">
              <button
                onClick={() => { navigate("/brand-setup"); setProfileOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-[#27272a] transition-colors flex items-center gap-2.5 text-zinc-300"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Brand Profile
              </button>
              <button
                onClick={() => { navigate("/contentpage"); setProfileOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-[#27272a] transition-colors flex items-center gap-2.5 text-zinc-300"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                My Content
              </button>
              {!isSubscribed && (
                <button
                  onClick={() => { navigate("/subscription"); setProfileOpen(false); }}
                  className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-[#27272a] transition-colors flex items-center gap-2.5 text-indigo-400"
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Upgrade to Pro
                </button>
              )}
            </div>

            <div className="p-1 border-t border-[#27272a]">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-[#27272a] transition-colors flex items-center gap-2.5 text-red-400"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main scrollable area */}
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Upsell banner */}
        {!isSubscribed && (
          <div className="max-w-2xl mx-auto mt-6 mb-4">
            <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Unlock full AI generation</p>
                <p className="text-xs text-zinc-400 mt-0.5">3-day free trial, then ₦1,000/month</p>
              </div>
              <button
                onClick={() => navigate('/subscription')}
                className="btn-primary py-2 px-4 text-xs flex-shrink-0"
              >
                Try free
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {outputs.length === 0 && (
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {userEmail ? `Hey${userEmail ? ", " + userEmail.split("@")[0] : ""}! 👋` : "Welcome to Abrand AI"}
            </h2>
            <p className="text-sm text-zinc-400 max-w-sm">
              {isSubscribed
                ? "Describe what you want to create and AI will generate on-brand content for you."
                : "Subscribe to start generating on-brand content with your brand memory."}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-zinc-500 hover:text-zinc-300">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Outputs */}
        <div className="max-w-2xl mx-auto mt-4 space-y-4">
          {[...outputs].reverse().map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {item.prompt}
                </p>
                <button
                  onClick={() => handleCopy(item.text, item.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    copied === item.id
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white'
                  }`}
                >
                  {copied === item.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{item.text}</p>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="card flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-400">Generating on-brand content...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Bottom input */}
      <div className="flex-shrink-0 glass border-t border-[#27272a] px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={idea}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder={
              isSubscribed
                ? "Describe the content you want... (Enter to send)"
                : "Subscribe to unlock AI generation"
            }
            rows={1}
            disabled={!isSubscribed || loading}
            className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-sm resize-none disabled:opacity-50 focus:outline-none focus:border-indigo-500/60 transition-colors leading-relaxed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleGenerate}
            disabled={!isSubscribed || loading || !idea.trim()}
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isSubscribed && idea.trim() && !loading
                ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                : "bg-[#27272a] text-zinc-600 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* PWA install button */}
      {showInstall && (
        <button
          onClick={installApp}
          className="fixed bottom-24 right-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-medium z-50 transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Install App
        </button>
      )}
    </div>
  );
}

export default CreateContent;
