import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import BookAppointmentPage from "./pages/BookAppointmentPage"
import LandingPage from "./pages/LandingPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import ProfilePage from "./pages/ProfilePage"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { NotificationBell } from "./components/shared/NotificationBell"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/notifications" element={<NotificationBell/>} />
      </Routes>
    </BrowserRouter>
  )
}
