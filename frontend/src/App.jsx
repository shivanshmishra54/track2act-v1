import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Public tracking (no auth required) */}
      <Route path="/track" element={<TrackShipment />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardRouter /></ProtectedRoute>
      } />
      
      <Route path="/support" element={
        <ProtectedRoute><Support /></ProtectedRoute>
      } />
      
      {/* Admin Dashboard */}
      <Route path="/dashboard/admin" element={
        <RoleBasedRoute requiredRoles={['ADMIN']}>
          <AdminDashboard />
        </RoleBasedRoute>
      } />
      
      {/* Driver Dashboard */}
      <Route path="/dashboard/driver" element={
        <RoleBasedRoute requiredRoles={['DRIVER']}>
          <DriverDashboard />
        </RoleBasedRoute>
      } />
      
      {/* Customer Dashboard */}
      <Route path="/dashboard/customer" element={
        <RoleBasedRoute requiredRoles={['CUSTOMER']}>
          <CustomerDashboard />
        </RoleBasedRoute>
      } />
      
      {/* Company/Port Dashboard */}
      <Route path="/dashboard/company" element={
        <RoleBasedRoute requiredRoles={['COMPANY_OFFICER', 'PORT_MANAGER']}>
          <CompanyOfficerDashboard />
        </RoleBasedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
