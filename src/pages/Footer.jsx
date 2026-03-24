import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#111] text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold">ABrand</h2>
          <p className="mt-2 text-sm">
            Smarter brand memory for AI-powered workflows.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-white font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>Features</li>
            <li>Pricing</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => navigate("/about")}>
                About
              </button>
            </li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

      </div>

      <div className="text-center mt-10 text-sm text-gray-500">
        © 2026 BrandMind. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;