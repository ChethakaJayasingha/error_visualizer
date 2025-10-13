export default function ExampleButtons({ setInput }) {
  const testExamples = ["3+4*5", "7-9/3", "(a+b)*c", "x+y+z", "1/(2+3)", "a+b*c-d", "((x))"];
  const errorExamples = ["3+", "*5", "3+/4", "(a-b", "a++b", "3&4"];

  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Test Examples:</h4>
      <div className="flex flex-wrap gap-2">
        {testExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="px-3 py-1 bg-white border-2 border-blue-200 rounded hover:bg-blue-100 font-mono text-xs sm:text-sm"
          >
            {ex}
          </button>
        ))}
      </div>

      <h4 className="font-semibold text-gray-800 mt-4 mb-2 text-sm sm:text-base">Error Examples:</h4>
      <div className="flex flex-wrap gap-2">
        {errorExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="px-3 py-1 bg-white border-2 border-red-200 rounded hover:bg-red-100 font-mono text-xs sm:text-sm"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}