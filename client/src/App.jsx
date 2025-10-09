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

  const renderParseTree = (node, level = 0, isLast = true, prefix = '') => {
    if (!node) return null;
    
    const isTerminal = node.value !== null && node.label !== 'ε';
    const isEpsilon = node.label === 'ε';
    
    const connector = level === 0 ? '' : isLast ? '└── ' : '├── ';
    const childPrefix = level === 0 ? '' : isLast ? '    ' : '│   ';
    
    return (
      <div key={Math.random()}>
        <div className="flex items-start gap-2 py-1 font-mono">
          {/* Tree structure lines */}
          <span className="text-gray-400 select-none whitespace-pre">
            {prefix + connector}
          </span>
          
          {/* Node content */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
              isEpsilon ? 'bg-gray-50 text-gray-400 italic border border-gray-200' :
              isTerminal ? 'bg-green-50 text-green-700 border-2 border-green-400' :
              'bg-blue-50 text-blue-700 border-2 border-blue-400'
            }`}>
              {node.label}
            </span>
            
            {node.value && node.label !== 'ε' && (
              <span className="px-3 py-1 bg-yellow-50 text-yellow-900 rounded-md border border-yellow-300 font-bold text-sm">
                {node.value}
              </span>
            )}
            
            {/* Node type label */}
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {isEpsilon ? 'epsilon' : isTerminal ? 'terminal' : 'non-terminal'}
            </span>
          </div>
        </div>
        
        {/* Children */}
        {node.children && node.children.map((child, idx) => (
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Error Visualizer
          </h1>
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-2 text-sm">Grammar Productions Use:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-indigo-800">
                      <div>E → TE'</div>
                      <div>E' → +TE' | ε</div>
                      <div>T → FT'</div>
                      <div>T' → *FT' | ε</div>
                      <div>F → (E) | id</div>
                      <div>id → 0-9 | a-z | A-Z</div>
                    </div>
                  </div><br/>

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
                className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg font-mono bg-white shadow-sm transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && analyzeInput()}
              />
              <button
                onClick={analyzeInput}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze'
                )}
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
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Parse Tree (Derivation Tree)
                  </h3>
                  
                  {/* Enhanced Legend */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border-l-4 border-indigo-500">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm">Legend:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold border-2 border-blue-400 rounded-lg text-sm">
                          E, T, F
                        </div>
                        <span className="text-xs text-gray-600">Non-Terminals (Grammar symbols)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-green-50 text-green-700 font-bold border-2 border-green-400 rounded-lg text-sm">
                          +, *, id
                        </div>
                        <span className="text-xs text-gray-600">Terminals (Actual tokens)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-gray-50 text-gray-400 italic border border-gray-200 rounded-lg text-sm">
                          ε
                        </div>
                        <span className="text-xs text-gray-600">Epsilon (Empty production)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tree Structure */}
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 overflow-x-auto shadow-inner">
                    <div className="text-sm mb-3 text-gray-600 italic">
                      📊 Tree structure showing the derivation of your expression:
                    </div>
                    {renderParseTree(result.parseTree)}
                  </div>
                  
                  
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Test Examples:</h4>
            <div className="flex flex-wrap gap-2">
              {['3+4*5', '7-9/3', '(a+b)*c', 'x+y+z', '1/(2+3)', 'a+b*c-d', '((x))'].map((example) => (
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
              {['3+', '*5', '3+/4', '(a-b', 'a++b', '3&4'].map((example) => (
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