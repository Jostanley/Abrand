import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Abrand AI.",
    features: [
      "1 brand profile",
      "Limited AI generations",
      "Basic content history",
      "PWA install",
    ],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₦1,000",
    period: "per month",
    description: "For creators and brands serious about consistency.",
    features: [
      "Unlimited brand profiles",
      "Full AI generation",
      "Complete content history",
      "Priority support",
      "All future features",
    ],
    cta: "Start Pro",
    highlight: true,
  },
];

function Pricing() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            Pricing
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Simple, honest pricing</h2>
          <p className="mt-4 text-zinc-400">
            Start free. Upgrade when you're ready to go unlimited.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-indigo-500/10 to-violet-500/5 border border-indigo-500/40"
                  : "bg-[#18181b] border border-[#27272a]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-500 text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-zinc-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <svg
                      className="w-4 h-4 text-indigo-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/signup')}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
