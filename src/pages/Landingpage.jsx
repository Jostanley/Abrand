import { useNavigate } from 'react-router-dom';
import Features from "./Features.jsx";
import Pricing from "./Pricing.jsx";
import Footer from "./Footer.jsx";

function Landingpage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Abrand AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost text-sm py-2 px-4"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-sm py-2 px-4"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background blobs */}
        <div className="glow-blob w-96 h-96 bg-indigo-600/20 top-20 left-1/4" style={{ animationDelay: '0s' }} />
        <div className="glow-blob w-80 h-80 bg-violet-600/15 bottom-20 right-1/4" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            Intelligent Brand Management
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Your Brand,{" "}
            <span className="gradient-text">Remembered.</span>
            <br />Always.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-delay-2 mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Set up your brand once. Every piece of content builds on it — intelligently, automatically. No repetition. Just smarter results.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary px-8 py-3 text-base"
            >
              Start for free →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost px-8 py-3 text-base"
            >
              Sign in
            </button>
          </div>

          {/* Social proof */}
          <p className="animate-fade-up-delay-3 mt-6 text-sm text-zinc-500">
            No credit card required · Free plan available
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* Features */}
      <div id="features">
        <Features />
      </div>

      {/* Pricing */}
      <div id="pricing">
        <Pricing />
      </div>

      <Footer />
    </div>
  );
}

export default Landingpage;
