const API_BASE_URL = 'http://localhost:4000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

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

  async getPayslipPayments(id) {
    return this.request(`/payslips/${id}/payments`);
  }

  // Payments endpoints
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
}

export const apiClient = new ApiClient();
