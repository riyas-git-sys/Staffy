import DashboardLayout from '../../components/layout/DashboardLayout'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Dashboard content goes here */}
        <p>Welcome to your dashboard!</p>
      </div>
    </DashboardLayout>
  )
}