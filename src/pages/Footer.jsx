import {useNavigate} from "react-router-dom"
function Footer(){
  const navigate = useNavigate()
  return(
    <footer className="bg-[#111] text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-white text-xl font-bold">ABrand</h2>
          <p className="mt-2 text-sm">
            Smarter brand memory for AI-powered workflows.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto px-6 text-center">
                <h1>Features</h1>
  <div>
    <h3 className="text-xl font-semibold text-white">AI-Powered Brand Memory</h3>
    <p className="mt-2 text-gray-400 text-sm">
      Your brand setup is remembered across all searches, summaries, and ideas.
    </p>
  </div>
  <div>
    <h3 className="text-xl font-semibold text-white">Automated Content Suggestions</h3>
    <p className="mt-2 text-gray-400 text-sm">
      Generate ideas, summaries, and campaigns automatically, saving hours.
    </p>
  </div>
  <div>
    <h3 className="text-xl font-semibold text-white">Consistent Branding</h3>
    <p className="mt-2 text-gray-400 text-sm">
      Keep your brand voice consistent across all content.
    </p>
  </div>
</div>
            </li>
            <li>
              <div className="bg-[#111] py-16">
  <h2 className="text-3xl font-bold text-white text-center">Pricing</h2>
  <p className="text-gray-400 text-center mt-2">Simple plans for teams of all sizes.</p>

  <div className="mt-12 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
    
    {/* Free Plan */}
    <div className="bg-gray-900 p-6 rounded-xl text-center border border-gray-700">
      <h3 className="text-xl font-semibold text-white">Free</h3>
      <p className="mt-2 text-gray-400">$0 / month</p>
      <ul className="mt-4 space-y-2 text-gray-400 text-sm">
        <li>1 Brand</li>
        <li>Limited AI suggestions</li>
        <li>Basic analytics</li>
      </ul>
      <button className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition">
        Start Free
      </button>
    </div>

    {/* Pro Plan */}
    <div className="bg-gray-900 p-6 rounded-xl text-center border border-indigo-600 shadow-lg">
      <h3 className="text-xl font-semibold text-white">Pro</h3>
      <p className="mt-2 text-gray-400">$19 / month</p>
      <ul className="mt-4 space-y-2 text-gray-400 text-sm">
        <li>Unlimited Brands</li>
        <li>Full AI suggestions</li>
        <li>Collaboration tools</li>
        <li>Advanced analytics</li>
      </ul>
      <button className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition">
        Get Pro
      </button>
    </div>

    {/* Enterprise Plan */}
    <div className="bg-gray-900 p-6 rounded-xl text-center border border-gray-700">
      <h3 className="text-xl font-semibold text-white">Enterprise</h3>
      <p className="mt-2 text-gray-400">Custom</p>
      <ul className="mt-4 space-y-2 text-gray-400 text-sm">
        <li>Custom workflows</li>
        <li>Dedicated support</li>
        <li>API access</li>
        <li>Priority updates</li>
      </ul>
      <button className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition">
        Contact Sales
      </button>
    </div>

  </div>
</div>
            </li>
            <li>API</li>
            <li>Docs</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick ={()=>navigate('/about')}>About</button>
            </li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

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
  )
}
export default Footer