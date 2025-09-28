import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={
            <DashboardLayout userRole="super-admin" userName="Super Admin">
              <SuperAdminDashboard />
            </DashboardLayout>
          } />
          <Route path="/super-admin/entreprises" element={
            <DashboardLayout userRole="super-admin" userName="Super Admin">
              <SuperAdminEntreprises />
            </DashboardLayout>
          } />
          <Route path="/super-admin/utilisateurs" element={
            <DashboardLayout userRole="super-admin" userName="Super Admin">
              <SuperAdminUsers />
            </DashboardLayout>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <DashboardLayout userRole="admin" userName="Marie Dubois">
              <AdminDashboard />
            </DashboardLayout>
          } />
          <Route path="/admin/employes" element={
            <DashboardLayout userRole="admin" userName="Marie Dubois">
              <AdminEmployees />
            </DashboardLayout>
          } />
          <Route path="/admin/payruns" element={
            <DashboardLayout userRole="admin" userName="Marie Dubois">
              <AdminPayruns />
            </DashboardLayout>
          } />
          <Route path="/admin/payslips" element={
            <DashboardLayout userRole="admin" userName="Marie Dubois">
              <AdminPayslips />
            </DashboardLayout>
          } />

          {/* Caissier Routes */}
          <Route path="/caissier" element={
            <DashboardLayout userRole="caissier" userName="Sophie Martin">
              <CaissierDashboard />
            </DashboardLayout>
          } />
          <Route path="/caissier/payslips" element={
            <DashboardLayout userRole="caissier" userName="Sophie Martin">
              <CaissierPayslips />
            </DashboardLayout>
          } />
          <Route path="/caissier/paiements" element={
            <DashboardLayout userRole="caissier" userName="Sophie Martin">
              <CaissierPaiements />
            </DashboardLayout>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
