export default function LoadingSpinner({ fullScreen = false, message }) {
  return (
    <div className={`grid place-items-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  );
}