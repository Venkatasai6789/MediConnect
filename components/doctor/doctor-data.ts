
import { Users, Calendar, MessageSquare, DollarSign, Video, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface DoctorStat {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
}

export interface Appointment {
  id: string;
  time: string;
  date?: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  age: number;
  gender: string;
  type: 'Video Call' | 'In-Clinic';
  reason: string;
  status: 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled';
  symptoms?: string[];
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  image: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  status: 'Active' | 'Recovered' | 'Critical';
  phone: string;
  email: string;
  bloodType: string;
}

export interface PatientHistoryItem {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  prescription?: string;
}

export interface PatientDocument {
  id: string;
  title: string;
  date: string;
  type: 'Report' | 'Prescription' | 'Scan';
  url?: string;
}

export interface ChatThread {
  id: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  status: 'sent' | 'delivered' | 'read';
}

// All mock data has been removed - data will be loaded from API
// These empty arrays are kept for backwards compatibility
export const DOCTOR_STATS: DoctorStat[] = [];
export const TODAY_SCHEDULE: Appointment[] = [];
export const PENDING_REQUESTS: Appointment[] = [];
export const HISTORY_LOG: Appointment[] = [];
export const ALL_PATIENTS: Patient[] = [];
export const MOCK_PATIENT_HISTORY: PatientHistoryItem[] = [];
export const MOCK_PATIENT_DOCUMENTS: PatientDocument[] = [];
export const MOCK_CHAT_THREADS: ChatThread[] = [];
export const MOCK_CHAT_HISTORY: { [key: string]: ChatMessage[] } = {};
