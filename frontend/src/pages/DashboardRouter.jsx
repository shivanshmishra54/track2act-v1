import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"
import DashboardLayout from "./dashboard/DashboardLayout"
import AdminDashboard from "./dashboard/AdminDashboard"
import DriverDashboard from "./dashboard/DriverDashboard"
import CustomerDashboard from "./dashboard/CustomerDashboard"
import CompanyOfficerDashboard from "./dashboard/CompanyOfficerDashboard"
import AnalystDashboard from "./dashboard/AnalystDashboard"


export default function DashboardRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role

  const DashboardComponent = {
    ADMIN: AdminDashboard,
    DRIVER: DriverDashboard,
    COMPANY_OFFICER: CompanyOfficerDashboard,
    PORT_MANAGER: CompanyOfficerDashboard,
    ANALYST: AnalystDashboard,
    CUSTOMER: CustomerDashboard,
  }[userRole]

  if (!DashboardComponent) {
    return <Navigate to="/login" replace />
  }

  return <DashboardComponent />
}
