export default function ResultBox({ success, message, errorType }) {
  if (!message) return null;

  const bgColor = success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const textColor = success ? "text-green-800" : "text-red-800";

  return (
    <div className={`p-4 rounded-lg border-2 ${bgColor} mb-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-2xl ${success ? "text-green-600" : "text-red-600"}`}>
          {success ? "✓" : "✗"}
        </span>
        <h2 className={`text-lg font-bold ${textColor}`}>
          {success ? "String Accepted" : errorType}
        </h2>
      </div>
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
}
