const API_BASE_URL = (import.meta.env.VITE_API_URL) || 'http://localhost:5000/api';

class APIClient {
  private getAuthHeader() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth APIs
  auth = {
    register: (userData: any) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    login: (credentials: any) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    phoneLogin: (phone: string) => this.request('/auth/phone-login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
    verifyOTP: (userId: string, otp: string) => this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, otp }),
    }),
    resendOTP: (userId: string) => this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
  };

  // User APIs
  users = {
    getProfile: () => this.request('/users/profile'),
    updateProfile: (data: any) => this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  };

  // Doctor APIs
  doctors = {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/doctors${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => this.request(`/doctors/${id}`),
    getProfile: (id: string) => this.request(`/doctors/${id}/profile`),
    updateProfile: (id: string, data: any) => this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    getAppointments: (id: string) => this.request(`/doctors/${id}/appointments`),
    getPatients: (id: string) => this.request(`/doctors/${id}/patients`),
    updateAppointmentStatus: (appointmentId: string, status: string, notes?: string) => 
      this.request(`/doctors/appointments/${appointmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }),
  };

  // Appointment APIs
  appointments = {
    create: (data: any) => this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getMyAppointments: (status?: string) => {
      const query = status ? `?status=${status}` : '';
      return this.request(`/appointments/my-appointments${query}`);
    },
    getById: (id: string) => this.request(`/appointments/${id}`),
    updateStatus: (id: string, status: string) => this.request(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    cancel: (id: string, reason: string) => this.request(`/appointments/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    }),
    reschedule: (id: string, appointmentDate: string, appointmentTime: string) =>
      this.request(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ appointmentDate, appointmentTime }),
      }),
  };

  // Patient APIs
  patients = {
    getProfile: () => this.request('/patients/profile'),
    getStats: () => this.request('/patients/stats'),
    getHistory: () => this.request('/patients/history'),
  };

  // Medicine APIs
  medicines = {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/medicines${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => this.request(`/medicines/${id}`),
    getCategories: () => this.request('/medicines/meta/categories'),
  };

  // Lab Test APIs
  labTests = {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/lab-tests${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => this.request(`/lab-tests/${id}`),
    getCategories: () => this.request('/lab-tests/meta/categories'),
    book: (data: any) => this.request('/lab-tests/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  };

  // Prescription APIs
  prescriptions = {
    getAll: () => this.request('/prescriptions'),
    getById: (id: string) => this.request(`/prescriptions/${id}`),
  };

  // Chat APIs
  chat = {
    getConversations: () => this.request('/chat/conversations'),
    getChatMessages: (conversationId: string) => 
      this.request(`/chat?conversationId=${conversationId}`),
    startConversation: (doctorId: string) => this.request('/chat/start', {
      method: 'POST',
      body: JSON.stringify({ doctorId }),
    }),
    sendMessage: (conversationId: string, message: string, messageType = 'text', attachmentUrl?: string) =>
      this.request('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ conversationId, message, messageType, attachmentUrl }),
      }),
  };

  // Payment APIs
  payments = {
    create: (data: any) => this.request('/payments/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getHistory: () => this.request('/payments/history'),
    getById: (id: string) => this.request(`/payments/${id}`),
  };

  // Health Report APIs
  healthReports = {
    upload: async (formData: FormData) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/health-reports`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    },
    getAll: (type?: string) => {
      const query = type ? `?type=${type}` : '';
      return this.request(`/health-reports${query}`);
    },
    getById: (id: string) => this.request(`/health-reports/${id}`),
    delete: (id: string) => this.request(`/health-reports/${id}`, {
      method: 'DELETE',
    }),
  };
}

export const api = new APIClient();
