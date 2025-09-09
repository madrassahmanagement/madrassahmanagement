
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
  logout: () =>
    api.post('/auth/logout'),
  getProfile: () =>
    api.get('/auth/profile'),
};

// Students API
export const studentsAPI = {
  getAll: (params?: any) =>
    api.get('/students', { params }),
  getById: (id: string) =>
    api.get(`/students/${id}`),
  create: (studentData: any) =>
    api.post('/students', studentData),
  update: (id: string, studentData: any) =>
    api.put(`/students/${id}`, studentData),
  delete: (id: string) =>
    api.delete(`/students/${id}`),
  getAttendance: (id: string, params?: any) =>
    api.get(`/students/${id}/attendance`, { params }),
  getNamaz: (id: string, params?: any) =>
    api.get(`/students/${id}/namaz`, { params }),
  getIslamicStudies: (id: string, params?: any) =>
    api.get(`/students/${id}/islamic-studies`, { params }),
  getDiscipline: (id: string, params?: any) =>
    api.get(`/students/${id}/discipline`, { params }),
  getFitness: (id: string, params?: any) =>
    api.get(`/students/${id}/fitness`, { params }),
};

// Teachers API
export const teachersAPI = {
  getAll: (params?: any) =>
    api.get('/teachers', { params }),
  getById: (id: string) =>
    api.get(`/teachers/${id}`),
  create: (teacherData: any) =>
    api.post('/teachers', teacherData),
  update: (id: string, teacherData: any) =>
    api.put(`/teachers/${id}`, teacherData),
  delete: (id: string) =>
    api.delete(`/teachers/${id}`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (attendanceData: any) =>
    api.post('/attendance', attendanceData),
  getByDate: (date: string, classId?: string) =>
    api.get('/attendance', { params: { date, classId } }),
  getByStudent: (studentId: string, params?: any) =>
    api.get(`/attendance/student/${studentId}`, { params }),
  update: (id: string, attendanceData: any) =>
    api.put(`/attendance/${id}`, attendanceData),
};

// Namaz API
export const namazAPI = {
  recordNamaz: (namazData: any) =>
    api.post('/namaz', namazData),
  getByDate: (date: string, studentId?: string) =>
    api.get('/namaz', { params: { date, studentId } }),
  getByStudent: (studentId: string, params?: any) =>
    api.get(`/namaz/student/${studentId}`, { params }),
  update: (id: string, namazData: any) =>
    api.put(`/namaz/${id}`, namazData),
};

// Islamic Studies API
export const islamicStudiesAPI = {
  recordSabaq: (sabaqData: any) =>
    api.post('/islamic-studies/sabaq', sabaqData),
  recordSabqi: (sabqiData: any) =>
    api.post('/islamic-studies/sabqi', sabqiData),
  recordManzil: (manzilData: any) =>
    api.post('/islamic-studies/manzil', manzilData),
  getByStudent: (studentId: string, params?: any) =>
    api.get(`/islamic-studies/student/${studentId}`, { params }),
  getByDate: (date: string, classId?: string) =>
    api.get('/islamic-studies', { params: { date, classId } }),
};

// Classes API
export const classesAPI = {
  getAll: () =>
    api.get('/classes'),
  getById: (id: string) =>
    api.get(`/classes/${id}`),
  create: (classData: any) =>
    api.post('/classes', classData),
  update: (id: string, classData: any) =>
    api.put(`/classes/${id}`, classData),
  delete: (id: string) =>
    api.delete(`/classes/${id}`),
};

// Reports API
export const reportsAPI = {
  getDashboardStats: () =>
    api.get('/reports/dashboard'),
  getStudentReport: (studentId: string, params?: any) =>
    api.get(`/reports/student/${studentId}`, { params }),
  getClassReport: (classId: string, params?: any) =>
    api.get(`/reports/class/${classId}`, { params }),
  getAttendanceReport: (params?: any) =>
    api.get('/reports/attendance', { params }),
  getNamazReport: (params?: any) =>
    api.get('/reports/namaz', { params }),
};

export default api;
