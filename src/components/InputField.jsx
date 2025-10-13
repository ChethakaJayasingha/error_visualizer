export default function InputField({ input, setInput, analyzeInput, loading, error }) {
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter expression"
        className={`flex-1 border-2 rounded-lg px-4 py-2 font-mono focus:outline-none ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
        } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
        onKeyPress={(e) => e.key === "Enter" && analyzeInput()}
        title={error || ""}
      />
      <button
        onClick={analyzeInput}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}