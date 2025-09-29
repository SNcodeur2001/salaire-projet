# Admin Interface Dynamic Implementation

## Overview
Making the admin interface dynamic for managing employees, payruns, and payslips using existing endpoints. Focus on adding forms, mutations, modals, and actions to existing pages.

## Steps

### 1. Create Reusable Components
- [ ] Create `frontend/src/components/admin/EmployeeForm.jsx`: Reusable form for add/edit employees with fields (firstName, lastName, email, position, department, contractType, salary, startDate, status). Use React Hook Form, validation, and integrate with apiClient.createEmployee/updateEmployee.
- [ ] Create `frontend/src/components/admin/PayrunForm.jsx`: Reusable form for create/edit payruns with fields (period, status). Integrate with apiClient.createPayrun/updatePayrun.

### 2. Update Employees Page (frontend/src/pages/admin/employes.jsx)
- [ ] Add "Ajouter un employé" button to open modal with EmployeeForm for creation (mutation with apiClient.createEmployee, invalidate queries on success).
- [ ] Add edit action in dropdown: Open modal with pre-filled EmployeeForm (apiClient.updateEmployee).
- [ ] Implement "Voir profil" action: Open modal or navigate to new employee-detail view with full details (fetch via apiClient.getEmployee).
- [ ] Link "Bulletins de paie" action: Navigate to payslips page with employee filter (use React Router query params).
- [ ] Enhance delete mutation: Add loading state, confirmation dialog already exists.

### 3. Update Payruns Page (frontend/src/pages/admin/payruns.jsx)
- [ ] Add "Créer un cycle" button to open modal with PayrunForm (apiClient.createPayrun).
- [ ] Add "Lancer le cycle" mutation for BROUILLON status: Use apiClient.updatePayrun to set status 'APPROUVE', invalidate payruns and payslips queries.
- [ ] Add edit action: Open modal with pre-filled PayrunForm (apiClient.updatePayrun).
- [ ] Implement "Voir détails" action: Open modal showing payslips for payrun (fetch via apiClient.getPayrunPayslips, display in sub-DataTable).
- [ ] Add delete mutation with confirmation dialog (apiClient.deletePayrun if exists, else update status).

### 4. Update Payslips Page (frontend/src/pages/admin/payslips.jsx)
- [ ] Add "Générer bulletins" button/modal: For selected payrun, call apiClient.generatePayslips (add method if missing: POST /payslips/generate with {payrunId}), refresh table.
- [ ] Implement "Voir détails" action: Open modal with payslip breakdown (gross, deductions details, net) from apiClient.getPayslip.
- [ ] Add "Télécharger PDF" action: Use apiClient.downloadPayslipPdf (add method: GET /payslips/:id/pdf as blob, trigger download).
- [ ] Add "Envoyer par email" mutation: apiClient.sendPayslipEmail (add method: POST /payslips/:id/email).
- [ ] Add "Modifier" action: Open edit modal for payslip adjustments (apiClient.updatePayslip).
- [ ] Enhance DataTable with bulk actions (e.g., select all, mark as paid via batch update).

### 5. Update API Client (frontend/src/lib/api.js)
- [ ] Add missing methods if endpoints exist:
  - generatePayslips(payrunId): POST /payslips/generate {payrunId}.
  - downloadPayslipPdf(id): GET /payslips/${id}/pdf (handle blob response).
  - sendPayslipEmail(id): POST /payslips/${id}/email.
  - deletePayrun(id): DELETE /payruns/${id} (if needed).
- [ ] Ensure all methods use entrepriseId where scoped.

### 6. Additional Updates
- [ ] Update `frontend/src/components/layout/sidebar.jsx`: Ensure active links to /admin/employes, /admin/payruns, /admin/payslips.
- [ ] Create `frontend/src/pages/admin/employee-detail.jsx` (if needed): Detail view with tabs for profile and payslips.
- [ ] Integrate navigation: Use React Router for filtering (e.g., /admin/payslips?employeeId=123).

### 7. Testing and Followup
- [ ] After each major update, test with `cd frontend && npm run dev`.
- [ ] Use browser_action to verify UI interactions (add employee, generate payslips, etc.).
- [ ] Update this TODO.md as steps complete (mark [x]).
- [ ] If backend endpoints missing (e.g., generatePayslips), note for separate task.

Progress: Starting with reusable components.
