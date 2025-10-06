# TODO: Implement Employee User Creation with Credentials

## Backend Changes
- [ ] Extend backend/src/controllers/employeeController.ts createEmployee method to accept email and password, and call authService.register to create user with employee data.
- [ ] Update backend/src/services/employeeService.ts createEmployee method to support email and password parameters if needed.

## Frontend Changes
- [ ] Update frontend/src/components/admin/EmployeeForm.jsx to add email and password fields with validation.
- [ ] Update frontend/src/lib/api.js to send email and password in the createEmployee API call.

## Testing
- [ ] Test employee creation with email and password.
- [ ] Test login with the created credentials.
- [ ] Verify access to employee interface after login.
