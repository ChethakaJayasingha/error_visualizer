import { useState } from "react";
import { analizeHelper } from "../src/utils/helper";

export default function ParserAnalyzerUI() {
  const [input, setInput] = useState("3+4*5");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeInput = async () => {
    setLoading(true);
    try {
      const data = analizeHelper(input);
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        errorType: "NETWORK_ERROR",
        message: error.message || "An unexpected error occurred",
      });
    }
    setLoading(false);
  };

  const renderParseTree = (node, level = 0, isLast = true, prefix = "") => {
    if (!node) return null;
    const isTerminal = node.value !== null && node.label !== "ε";
    const isEpsilon = node.label === "ε";

    const connector = level === 0 ? "" : isLast ? "└── " : "├── ";
    const childPrefix = level === 0 ? "" : isLast ? "    " : "│   ";

    return (
      <div key={Math.random()}>
        <div className="flex items-start gap-2 py-1 font-mono text-xs sm:text-sm">
          <span className="text-gray-400 select-none whitespace-pre">
            {prefix + connector}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold ${
                isEpsilon
                  ? "bg-gray-50 text-gray-400 italic border border-gray-200"
                  : isTerminal
                  ? "bg-green-50 text-green-700 border-2 border-green-400"
                  : "bg-blue-50 text-blue-700 border-2 border-blue-400"
              }`}
            >
              {node.label}
            </span>
            {node.value && node.label !== "ε" && (
              <span className="px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-900 rounded-md border border-yellow-300 font-bold text-xs sm:text-sm">
                {node.value}
              </span>
            )}
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {isEpsilon ? "epsilon" : isTerminal ? "terminal" : "non-terminal"}
            </span>
          </div>
        </div>

        {node.children &&
          node.children.map((child, idx) => (
            <div key={idx}>
              {renderParseTree(
                child,
                level + 1,
                idx === node.children.length - 1,
                prefix + childPrefix
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center sm:text-left">
            Error Visualizer
          </h1>

          {/* Grammar Section */}
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-xs sm:text-sm mb-6">
            <h4 className="font-semibold text-indigo-900 mb-2">
              Grammar Productions Use:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 font-mono text-indigo-800">
              <div>E → TE'</div>
              <div>E' → +TE' | ε</div>
              <div>T → FT'</div>
              <div>T' → *FT' | ε</div>
              <div>F → (E) | id</div>
              <div>id → 0-9 | a-z | A-Z</div>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Input Expression
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 3+4*5 or (a+b)*c"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-base font-mono bg-white shadow-sm transition-all duration-200"
                onKeyPress={(e) => e.key === "Enter" && analyzeInput()}
              />
              <button
                onClick={analyzeInput}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze"
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Status Box */}
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-2xl ${
                      result.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.success ? "✓" : "✗"}
                  </span>
                  <h2
                    className={`text-lg sm:text-xl font-bold ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.success ? "String Accepted" : result.errorType}
                  </h2>
                </div>
                <p
                  className={`text-sm ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.message}
                </p>
              </div>

              {/* Tokens Table */}
              {result.tokens?.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg overflow-x-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    Tokens (Lexemes)
                  </h3>
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-100">
                        <th className="border border-gray-300 px-2 py-2 text-left">
                          Position
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-left">
                          Token Type
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-left">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.tokens.map((token, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="border border-gray-300 px-2 py-2 font-mono text-center">
                            {token.position}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-indigo-600 font-semibold text-center">
                            {token.type}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 font-mono text-center">
                            {token.value || "EOF"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Parse Tree */}
              {result.parseTree && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border shadow-inner overflow-x-auto">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">
                    Parse Tree (Derivation Tree)
                  </h3>
                  {renderParseTree(result.parseTree)}
                </div>
              )}
            </div>
          )}

          {/* Example Buttons */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
              Test Examples:
            </h4>
            <div className="flex flex-wrap gap-2">
              {["3+4*5", "7-9/3", "(a+b)*c", "x+y+z", "1/(2+3)", "a+b*c-d", "((x))"].map(
                (example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="px-3 py-1 bg-white border-2 border-blue-200 rounded hover:bg-blue-100 font-mono text-xs sm:text-sm"
                  >
                    {example}
                  </button>
                )
              )}
            </div>

            <h4 className="font-semibold text-gray-800 mt-4 mb-2 text-sm sm:text-base">
              Error Examples:
            </h4>
            <div className="flex flex-wrap gap-2">
              {["3+", "*5", "3+/4", "(a-b", "a++b", "3&4"].map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="px-3 py-1 bg-white border-2 border-red-200 rounded hover:bg-red-100 font-mono text-xs sm:text-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
