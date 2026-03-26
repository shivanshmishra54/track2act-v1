import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleBasedRoute } from '@/components/RoleBasedRoute'
import Navbar from '@/components/Navbar'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardRouter from '@/pages/DashboardRouter'
import TrackShipment from '@/pages/TrackShipment'
import Support from '@/pages/Support'
import AdminDashboard from '@/pages/dashboard/AdminDashboard'
import DriverDashboard from '@/pages/dashboard/DriverDashboard'
import CustomerDashboard from '@/pages/dashboard/CustomerDashboard'
import CompanyOfficerDashboard from '@/pages/dashboard/CompanyOfficerDashboard'
import DashboardLayout from '@/pages/dashboard/DashboardLayout' 
// Yahan naye pages import karne padenge aage chal kar, 
// abhi ke liye placeholders ke liye hum purane use kar rahe hain.

export default function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/track" element={<TrackShipment />} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        
        {/* The MASTER DASHBOARD LAYOUT (Provides Sidebar) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          
          {/* Index Route - Decides which overview page to show */}
          <Route index element={<DashboardRouter />} />
          
          {/* --- ADMIN ROUTES --- */}
          <Route path="users" element={<RoleBasedRoute requiredRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>} />
          <Route path="shipments" element={<RoleBasedRoute requiredRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>} />
          
          {/* --- DRIVER ROUTES --- */}
          <Route path="tasks" element={<RoleBasedRoute requiredRoles={['DRIVER']}><DriverDashboard /></RoleBasedRoute>} />
          <Route path="location" element={<RoleBasedRoute requiredRoles={['DRIVER']}><DriverDashboard /></RoleBasedRoute>} />
          <Route path="driver-shipments" element={<RoleBasedRoute requiredRoles={['DRIVER']}><DriverDashboard /></RoleBasedRoute>} />
          
          {/* --- COMPANY OFFICER ROUTES --- */}
          <Route path="audit" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><CompanyOfficerDashboard /></RoleBasedRoute>} />
          <Route path="live-map" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><CompanyOfficerDashboard /></RoleBasedRoute>} />
          <Route path="decision" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><CompanyOfficerDashboard /></RoleBasedRoute>} />
          <Route path="compliance" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><CompanyOfficerDashboard /></RoleBasedRoute>} />

          {/* --- CUSTOMER ROUTES --- */}
          <Route path="reports" element={<RoleBasedRoute requiredRoles={['CUSTOMER']}><CustomerDashboard /></RoleBasedRoute>} />
          
          {/* Settings Route (Shared) */}
          <Route path="settings" element={<div className="p-8">Settings Page Coming Soon</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}