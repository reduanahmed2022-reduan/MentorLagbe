export type UserRole = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: Plan;
  image?: string;
  phone?: string;
  bio?: string;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage?: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus?: ApprovalStatus;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  location: string;
  experience: number | string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  mode: string;
  image?: string;
  verified?: boolean;
  bio?: string;
}

export interface TuitionApplication {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
}

export interface Transaction {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: string;
}

export interface DashboardStats {
  totalUsers?: number;
  totalStudents?: number;
  totalTutors?: number;
  totalTuitions?: number;
  pendingTuitions?: number;
  approvedTuitions?: number;
  rejectedTuitions?: number;
  totalApplications?: number;
  totalRevenue?: number;
  totalApplied?: number;
  acceptedApplications?: number;
  pendingApplications?: number;
  totalApplicants?: number;
}
