// src/components/ui/Alert.jsx
export default function Alert({ type = 'info', message }) {
  const colors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <div className={`${colors[type]} border px-4 py-3 rounded relative mb-4`}>
      {message}
    </div>
  );
}