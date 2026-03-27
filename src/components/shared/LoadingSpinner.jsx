// Reusable loading spinner shown during async operations
// Use this any time the app is waiting on an API call or data processing

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
}
