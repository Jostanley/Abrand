import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#09090b] border-t border-[#18181b]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <span className="font-bold text-lg">Abrand AI</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              Smarter brand memory for AI-powered content creation. Define once, stay consistent forever.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <button onClick={() => navigate("/about")} className="hover:text-white transition-colors">
                  About
                </button>
              </li>
              <li><span className="cursor-default">Blog</span></li>
              <li><span className="cursor-default">Contact</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#18181b] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© 2026 Abrand AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Get started free →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
