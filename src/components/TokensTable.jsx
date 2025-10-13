export default function TokensTable({ tokens }) {
  if (!tokens?.length) return null;

  return (
    <div className="mt-4 overflow-x-auto">
      <h2 className="font-bold text-lg mb-2">Tokens</h2>
      <table className="border-collapse w-full text-sm">
        <thead>
          <tr className="bg-indigo-100">
            <th className="border px-2 py-1">Pos</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Value</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i} className="hover:bg-gray-100">
              <td className="border px-2 py-1 text-center">{t.position}</td>
              <td className="border px-2 py-1 text-center">{t.type}</td>
              <td className="border px-2 py-1 text-center">{t.value || "EOF"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}