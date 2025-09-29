import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/dashboard-layout.jsx";

// Pages
import Login from "./pages/login.jsx";
import SuperAdminDashboard from "./pages/super-admin/dashboard.jsx";
import SuperAdminEntreprises from "./pages/super-admin/entreprises.jsx";
import SuperAdminUsers from "./pages/super-admin/users.jsx";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdminEmployees from "./pages/admin/employes.jsx";
import AdminPayruns from "./pages/admin/payruns.jsx";
import AdminPayslips from "./pages/admin/payslips.jsx";
import CaissierDashboard from "./pages/caissier/dashboard.jsx";
import CaissierPayslips from "./pages/caissier/payslips.jsx";
import CaissierPaiements from "./pages/caissier/paiements.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Super Admin Routes */}
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <DashboardLayout userRole="super-admin" userName="Super Admin">
                  <SuperAdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/super-admin/entreprises" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <DashboardLayout userRole="super-admin" userName="Super Admin">
                  <SuperAdminEntreprises />
                </DashboardLayout>
              </ProtectedRoute>
            } />


            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout userRole="admin" userName="Marie Dubois">
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/employes" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout userRole="admin" userName="Marie Dubois">
                  <AdminEmployees />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/payruns" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout userRole="admin" userName="Marie Dubois">
                  <AdminPayruns />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/payslips" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout userRole="admin" userName="Marie Dubois">
                  <AdminPayslips />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Caissier Routes */}
            <Route path="/caissier" element={
              <ProtectedRoute allowedRoles={['CAISSIER']}>
                <DashboardLayout userRole="caissier" userName="Sophie Martin">
                  <CaissierDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/caissier/payslips" element={
              <ProtectedRoute allowedRoles={['CAISSIER']}>
                <DashboardLayout userRole="caissier" userName="Sophie Martin">
                  <CaissierPayslips />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/caissier/paiements" element={
              <ProtectedRoute allowedRoles={['CAISSIER']}>
                <DashboardLayout userRole="caissier" userName="Sophie Martin">
                  <CaissierPaiements />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
