export default function App() {
  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-white text-xl">
          If this is green, Tailwind is working!
        </p>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <p className="text-green-600 font-medium">
            White box with shadow = Tailwind utilities working
          </p>
        </div>
      </div>
    </div>
  )
}