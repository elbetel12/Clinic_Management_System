// ─────────────────────────────────────────────
// ENUMS / UNION TYPES
// ─────────────────────────────────────────────

// The 3 possible roles a user can have.
// Mirrors the backend's UserRole enum exactly.
export type UserRole = 'admin' | 'doctor' | 'patient';

// The 3 possible states of an appointment.
// Mirrors backend's AppointmentStatus enum.
export type AppointmentStatus = 'booked' | 'cancelled' | 'completed';

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

// Represents the currently logged-in user stored in frontend state.
// This comes from the backend login response (data.user).
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
}

// ─────────────────────────────────────────────
// AUTH — Request Inputs (what we SEND to backend)
// ─────────────────────────────────────────────

// Data we send when registering.
// Matches backend's registerSchema Joi validation.
export interface RegisterInput {
  name: string;
  email: string;
  phone: string;       // 9–15 digits (validated by backend)
  password: string;    // minimum 6 characters
  role?: 'patient' | 'admin' | 'doctor'; // optional — defaults to 'patient' on backend
  specialization?: string; // required if role is doctor
}

// Data we send when logging in.
export interface LoginInput {
  email: string;
  password: string;
}

// ─────────────────────────────────────────────
// AUTH — Responses (what backend SENDS back)
// ─────────────────────────────────────────────

// Shape of the full login API response.
// Backend returns: { success: true, message: '...', data: { token, user } }
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string; // JWT token — store this and send it on every protected request
    user: User;
  };
}

// Shape of the register API response.
// Backend returns: { success: true, data: <user document> }
export interface RegisterResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

// ─────────────────────────────────────────────
// DOCTOR
// ─────────────────────────────────────────────

// Represents a Doctor document returned by the backend.
// Note: uses _id (MongoDB ObjectId string), not id.
export interface Doctor {
  _id: string;
  user?: User; // Populated user details
  name: string;
  email: string;
  specialization: string;
  bio?: string;
  experience?: number;
  createdAt: string; // ISO date string e.g. "2025-01-15T10:30:00.000Z"
  updatedAt: string;
}

// Data we send when creating a doctor (admin only).
// Matches backend's DoctorSchema Joi validation.
export interface CreateDoctorInput {
  name: string;
  email: string;
  specialization: string;
  password?: string;
}

// ─────────────────────────────────────────────
// APPOINTMENT
// ─────────────────────────────────────────────

// Represents a fully-populated Appointment from the backend.
// IMPORTANT: doctor and patient are full OBJECTS here, not just IDs!
// This is because the backend uses .populate('doctor').populate('patient')
// which replaces the MongoDB ObjectId with the full document data.
export interface Appointment {
  _id: string;
  doctor: Doctor;  // full Doctor object (populated)
  patient: User;   // full User object (populated)
  date: string;    // ISO date string
  time: string;    // e.g. "14:30"
  status: AppointmentStatus;
  createdAt: string;
}

// Data we send when booking an appointment.
// We only send doctorId, date, and time.
// The backend gets patientId from the JWT token automatically (req.user.userId).
export interface CreateAppointmentInput {
  doctorId: string;
  date: string; // e.g. "2025-06-15"
  time: string; // e.g. "14:30"
}

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id?: number | string;
  _id?: string;
  title: string;
  message?: string;
  time?: string;
  createdAt?: string;
  isRead: boolean;
  type?: NotificationType;
} 