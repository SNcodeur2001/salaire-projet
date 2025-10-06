import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/dashboard-layout.jsx";
import { apiClient } from "@/lib/api";

// Pages
import Login from "./pages/login.jsx";
import SuperAdminDashboard from "./pages/super-admin/dashboard.jsx";
import SuperAdminEntreprises from "./pages/super-admin/entreprises.jsx";
import SuperAdminUsers from "./pages/super-admin/users.jsx";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdminEmployees from "./pages/admin/employes.jsx";
import AdminPayruns from "./pages/admin/payruns.jsx";
import AdminPayslips from "./pages/admin/payslips.jsx";
import AdminAttendance from "./pages/admin/attendance.jsx";
import CaissierDashboard from "./pages/caissier/dashboard.jsx";
import CaissierPayslips from "./pages/caissier/payslips.jsx";
import CaissierPaiements from "./pages/caissier/paiements.jsx";
import AttendancePage from "./pages/caissier/attendance.jsx";
import VigileAttendance from "./pages/vigile/attendance.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();



const AppContent = () => {
  const { logout, user, entreprise } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Set up API client to handle 401 responses
  React.useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      navigate('/', { replace: true });
    };

    apiClient.setOnUnauthorized(handleUnauthorized);
  }, [logout, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Super Admin Routes */}
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
          <DashboardLayout userRole="super-admin" userName="Super Admin" entreprise={entreprise} onLogout={handleLogout}>
            <SuperAdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/entreprises" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
          <DashboardLayout userRole="super-admin" userName="Super Admin" entreprise={entreprise} onLogout={handleLogout}>
            <SuperAdminEntreprises />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/users" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
          <DashboardLayout userRole="super-admin" userName="Super Admin" entreprise={entreprise} onLogout={handleLogout}>
            <SuperAdminUsers />
          </DashboardLayout>
        </ProtectedRoute>
      } />


      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <DashboardLayout userRole="admin" userName="Marie Dubois" entreprise={entreprise} onLogout={handleLogout}>
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/employes" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <DashboardLayout userRole="admin" userName="Marie Dubois" entreprise={entreprise} onLogout={handleLogout}>
            <AdminEmployees />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/payruns" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <DashboardLayout userRole="admin" userName="Marie Dubois" entreprise={entreprise} onLogout={handleLogout}>
            <AdminPayruns />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/payslips" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <DashboardLayout userRole="admin" userName="Marie Dubois" entreprise={entreprise} onLogout={handleLogout}>
            <AdminPayslips />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
          <DashboardLayout userRole="admin" userName="Marie Dubois" entreprise={entreprise} onLogout={handleLogout}>
            <AdminAttendance />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Caissier Routes */}
      <Route path="/caissier" element={
        <ProtectedRoute allowedRoles={['CAISSIER']}>
          <DashboardLayout userRole="caissier" userName="Sophie Martin" entreprise={entreprise} onLogout={handleLogout}>
            <CaissierDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/caissier/payslips" element={
        <ProtectedRoute allowedRoles={['CAISSIER']}>
          <DashboardLayout userRole="caissier" userName="Sophie Martin" entreprise={entreprise} onLogout={handleLogout}>
            <CaissierPayslips />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/caissier/paiements" element={
        <ProtectedRoute allowedRoles={['CAISSIER']}>
          <DashboardLayout userRole="caissier" userName="Sophie Martin" entreprise={entreprise} onLogout={handleLogout}>
            <CaissierPaiements />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/caissier/attendance" element={
        <ProtectedRoute allowedRoles={['CAISSIER', 'EMPLOYE', 'EMPLOYEE']}>
          <DashboardLayout userRole="caissier" userName="Sophie Martin" entreprise={entreprise} onLogout={handleLogout}>
            <AttendancePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Vigile Routes */}
      <Route path="/vigile" element={
        <ProtectedRoute allowedRoles={['VIGILE']}>
          <DashboardLayout userRole="vigile" userName="Vigile" entreprise={entreprise} onLogout={handleLogout}>
            <VigileAttendance />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
