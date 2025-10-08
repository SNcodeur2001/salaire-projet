const API_BASE_URL = 'http://localhost:4000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.onUnauthorized = null;
  }

  setOnUnauthorized(callback) {
    this.onUnauthorized = callback;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token is invalid or expired, trigger logout
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        const data = await response.json();
        throw new Error(data.error || 'Non autorisé');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || 'API request failed');
      }

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async register(user) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Employees endpoints
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/employees?${query}`);
  }

  async getEmployee(id) {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(employee) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id, employee) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async activateEmployee(id, active) {
    return this.request(`/employees/${id}/activate`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  async filterEmployees(filters) {
    return this.request('/employees/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Entreprises endpoints
  async getEntreprises() {
    return this.request('/entreprises');
  }

  async getEntreprise(id) {
    return this.request(`/entreprises/${id}`);
  }

  async createEntreprise(entreprise) {
    return this.request('/entreprises', {
      method: 'POST',
      body: JSON.stringify(entreprise),
    });
  }

  async updateEntreprise(id, entreprise) {
    return this.request(`/entreprises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entreprise),
    });
  }

  async deleteEntreprise(id) {
    return this.request(`/entreprises/${id}`, {
      method: 'DELETE',
    });
  }

  // Payruns endpoints
  async getPayruns(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/payruns?${query}`);
  }

  async getPayrun(id) {
    return this.request(`/payruns/${id}`);
  }

  async createPayrun(payrun) {
    return this.request('/payruns', {
      method: 'POST',
      body: JSON.stringify(payrun),
    });
  }

  async updatePayrun(id, payrun) {
    return this.request(`/payruns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payrun),
    });
  }

  async getPayrunPayslips(id) {
    return this.request(`/payruns/${id}/payslips`);
  }

  // Payslips endpoints
  async getPayslips(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/payslips?${query}`);
  }

  async getPayslip(id) {
    return this.request(`/payslips/${id}`);
  }

  async updatePayslip(id, payslip) {
    return this.request(`/payslips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payslip),
    });
  }

  async generatePayslips(payrunId) {
    return this.request('/payslips/generate', {
      method: 'POST',
      body: JSON.stringify({ payrunId }),
    });
  }

  async downloadPayslipPdf(id) {
    const response = await this.request(`/payslips/${id}/pdf`, {
      headers: {
        'Accept': 'application/pdf',
      },
    });
    // Assuming response is a blob URL or base64; adjust based on backend
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin_${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
    return response;
  }

  async sendPayslipEmail(id) {
    return this.request(`/payslips/${id}/email`, {
      method: 'POST',
    });
  }

  async getPayslipPayments(id) {
    return this.request(`/payslips/${id}/payments`);
  }

  // Payments endpoints
  async getPayments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/payments?${query}`);
  }

  async createPayment(payment) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async getPayment(id) {
    return this.request(`/payments/${id}`);
  }

  async getPaymentReceipt(id) {
    return this.request(`/payments/${id}/receipt`);
  }

  async downloadPaymentReceipt(paymentId) {
    // This will trigger a download
    const response = await fetch(`${this.baseURL}/payments/${paymentId}/receipt`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du reçu');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-paiement-${paymentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Payslips additional endpoints
  async getPayslipPayments(payslipId) {
    return this.request(`/payslips/${payslipId}/payments`);
  }

  async generatePayslips(payrunId) {
    return this.request(`/payruns/${payrunId}/generate`, {
      method: 'POST',
    });
  }

  async downloadPayslipPdf(payslipId) {
    // This will trigger a download
    const response = await fetch(`${this.baseURL}/payslips/${payslipId}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du PDF');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin-${payslipId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async sendPayslipEmail(payslipId) {
    return this.request(`/payslips/${payslipId}/email`, {
      method: 'POST',
    });
  }

  // Users endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendances endpoints
  async clockIn() {
    return this.request('/attendances/clock-in', {
      method: 'POST',
    });
  }

  async clockOut() {
    return this.request('/attendances/clock-out', {
      method: 'POST',
    });
  }

  async getMyAttendance() {
    return this.request('/attendances/my-attendance');
  }

  async getMyPayslips() {
    return this.request('/payslips/my/payslips');
  }

  async getAttendanceByDate(date) {
    return this.request(`/attendances/by-date?date=${date}`);
  }

  async markClockIn(employeeId, date) {
    return this.request('/attendances/mark-clock-in', {
      method: 'POST',
      body: JSON.stringify({ employeeId, date }),
    });
  }

  async markClockOut(employeeId, date) {
    return this.request('/attendances/mark-clock-out', {
      method: 'POST',
      body: JSON.stringify({ employeeId, date }),
    });
  }

  async markAbsent(employeeId, date) {
    return this.request('/attendances/mark-absent', {
      method: 'POST',
      body: JSON.stringify({ employeeId, date }),
    });
  }
}

export const apiClient = new ApiClient();
