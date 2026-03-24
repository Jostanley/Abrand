function Features() {
  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center">Features</h2>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto px-6 text-center">

        <div>
          <h3 className="text-xl font-semibold">
            AI-Powered Brand Memory
          </h3>
          <p className="mt-2 text-gray-400 text-sm">
            Your brand setup is remembered across all searches.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Automated Content Suggestions
          </h3>
          <p className="mt-2 text-gray-400 text-sm">
            Generate ideas and campaigns automatically.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Consistent Branding
          </h3>
          <p className="mt-2 text-gray-400 text-sm">
            Keep your brand voice consistent.
          </p>
        </div>

      </div>
    </div>
  );
}
export default Features