function Pricing() {
  return (
    <div className="bg-[#111] py-16">
      <h2 className="text-3xl font-bold text-center">Pricing</h2>
      <p className="text-gray-400 text-center mt-2">
        Simple plans for teams of all sizes.
      </p>

      <div className="mt-12 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        <div className="bg-gray-900 p-6 rounded-xl text-center border border-gray-700">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-2 text-gray-400">$0 / month</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>1 Brand</li>
            <li>Limited AI</li>
            <li>Basic analytics</li>
          </ul>
          <button className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl">
            Start Free
          </button>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl text-center border border-indigo-600">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-2 text-gray-400">$19 / month</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Unlimited Brands</li>
            <li>Full AI</li>
            <li>Collaboration</li>
          </ul>
          <button className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl">
            Get Pro
          </button>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl text-center border border-gray-700">
          <h3 className="text-xl font-semibold">Enterprise</h3>
          <p className="mt-2 text-gray-400">Custom</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Custom workflows</li>
            <li>API access</li>
            <li>Support</li>
          </ul>
          <button className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl">
            Contact Sales
          </button>
        </div>

      </div>
    </div>
  );
}
export default Pricing