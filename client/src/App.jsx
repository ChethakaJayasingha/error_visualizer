import { useState } from 'react';

export default function ParserAnalyzerUI() {
  const [input, setInput] = useState('3+4*5');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeInput = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        errorType: 'NETWORK_ERROR',
        message: 'Failed to connect to server. Make sure the backend is running on port 3001.',
      });
    }
    setLoading(false);
  };

  const renderParseTree = (node, level = 0) => {
    if (!node) return null;
    
    const indent = '  '.repeat(level);
    const displayValue = node.value ? ` (${node.value})` : '';
    
    return (
      <div key={Math.random()} style={{ marginLeft: level * 20 }}>
        <div className="font-mono text-sm">
          {indent}
          <span className={node.label === 'ε' ? 'text-gray-400' : 'text-blue-600 font-semibold'}>
            {node.label}
          </span>
          <span className="text-green-600">{displayValue}</span>
        </div>
        {node.children && node.children.map((child) => renderParseTree(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            error visualizer
          </h1>
          <p className="text-gray-600 mb-6">
            Grammar: E → TE' | E' → +TE'|ε | T → FT' | T' → *FT'|ε | F → (E)|id
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Input Expression
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 3+4*5 or (a+b)*c"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-lg font-mono"
                onKeyPress={(e) => e.key === 'Enter' && analyzeInput()}
              />
              <button
                onClick={analyzeInput}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {result && (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? '✓' : '✗'}
                  </span>
                  <h2 className={`text-xl font-bold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'String Accepted' : result.errorType}
                  </h2>
                </div>
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
              </div>

              {result.tokens && result.tokens.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tokens (Lexemes)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-indigo-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Token Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.tokens.map((token, idx) => (
                          <tr key={idx} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{token.position}</td>
                            <td className="border border-gray-300 px-4 py-2 font-semibold text-indigo-600">{token.type}</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono">{token.value || 'EOF'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.symbolTable && result.symbolTable.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Symbol Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Token</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">First Position</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Occurrences</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.symbolTable.map((symbol, idx) => (
                          <tr key={idx} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2 font-mono font-bold">{symbol.token}</td>
                            <td className="border border-gray-300 px-4 py-2 text-purple-600 font-semibold">{symbol.type}</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono">{symbol.firstOccurrence}</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono">{symbol.occurrences.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.statistics && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Total Tokens: {result.statistics.totalTokens}</p>
                    </div>
                  )}
                </div>
              )}

              {result.parseTree && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Parse Tree</h3>
                  <div className="bg-white p-4 rounded border-2 border-gray-200 overflow-x-auto">
                    {renderParseTree(result.parseTree)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Test Examples:</h4>
            <div className="flex flex-wrap gap-2">
              {['3+4*5', '(a+b)*c', 'x+y+z', '1*(2+3)', 'a+b*c+d', '((x))'].map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="px-3 py-1 bg-white border-2 border-blue-200 rounded hover:bg-blue-100 font-mono text-sm"
                >
                  {example}
                </button>
              ))}
            </div>
            <h4 className="font-semibold text-gray-800 mt-3 mb-2">Error Examples:</h4>
            <div className="flex flex-wrap gap-2">
              {['3+', '*5', '3+*4', '(a+b', 'a++b', '3&4'].map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="px-3 py-1 bg-white border-2 border-red-200 rounded hover:bg-red-100 font-mono text-sm"
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