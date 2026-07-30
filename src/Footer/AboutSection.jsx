import { useNavigate } from "react-router-dom";

function AboutSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="glass border-b border-[#27272a] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white"/>
              </svg>
            </div>
            <span className="font-semibold text-sm">Abrand AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            About us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Built for brands who
            <br />
            <span className="gradient-text">refuse to repeat themselves.</span>
          </h1>

          <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
            <p>
              At Abrand AI, our mission is to make brand management effortless and intelligent. Most brands struggle to maintain consistency across campaigns — our AI ensures your brand voice is remembered, applied, and improved automatically.
            </p>
            <p>
              Founded in 2026 by marketers and AI enthusiasts, Abrand AI is designed to help every business maintain a strong, memorable presence — without repeating the same setup work over and over.
            </p>
            <p>
              You define your brand once: your niche, your tone, your core beliefs. We handle the rest — generating content that always sounds like <em>you</em>.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#27272a]">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary px-8 py-3 text-base"
            >
              Get started free →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutSection;
