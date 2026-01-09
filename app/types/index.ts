// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string | Record<string, string>>;
}

// Auth Types
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginResponse {
    token: string;
    refresh: string;
    user: User;
}

export interface VerifyResponse {
    valid: boolean;
    user: User;
}

// Admin Management Types
export interface Admin {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    dateJoined: string;
    lastLogin?: string | null;
    last_login?: string | null;
}

export interface AdminsResponse {
    admins: Admin[];
    total: number;
}

export interface CreateAdminPayload {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface UpdateAdminPayload {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export interface ReactivateAdminPayload {
    notes?: string;
}

export interface AdminActivity {
    id: number;
    action: string;
    actionDisplay: string;
    timestamp: string;
    targetType: string | null;
    targetId: number | null;
    targetName: string;
    notes: string;
    ipAddress: string;
}

export interface AdminActivityResponse {
    activities: AdminActivity[];
    pagination: Pagination;
}

// Registration Types
export interface RegistrationSubmitResponse {
    applicationId: number;
    status: string;
    submittedAt: string;
}

export interface EmailCheckResponse {
    available: boolean;
    message: string;
}

// Reference Data Types
export interface Province {
    id: number;
    name: string;
}

export interface City {
    id: number;
    name: string;
    provinceName: string;
}

export interface Barangay {
    id: number;
    name: string;
    cityName: string;
}

export interface DegreeProgram {
    id: number;
    name: string;
    college: string;
}

// Applicant Types
export interface ApplicantSummary {
    id: number;
    name: string;
    email: string;
    degreeProgram?: string;
    yearGraduated?: string;
    studentNumber?: string;
    status: string;
    dateApplied: string;
    paymentMethod?: string;
    amount?: number;
    alumniVerifiedDate?: string;
    rejectedAt?: string;
    rejectionStage?: string;
    reason?: string;
}

export interface PersonalDetails {
    title: string;
    firstName: string;
    lastName: string;
    suffix?: string | null;
    maidenName?: string | null;
    dateOfBirth: string;
    email: string;
    mobileNumber: string;
    currentAddress: string;
    province: string;
    city: string;
    barangay: string;
}

export interface AcademicStatus {
    degreeProgram: string;
    yearGraduated: string;
    studentNumber?: string | null;
}

export interface Professional {
    currentEmployer?: string | null;
    jobTitle?: string | null;
    industry?: string | null;
}

export interface Membership {
    paymentMethod: string;
    amount?: number;
    referenceNumber?: string; // or transaction ID
    receiptUrl?: string; // URL to uploaded proof
    paymentDate?: string;
}

export interface HistoryEntry {
    id: number;
    action: string;
    performedByName: string;
    notes?: string;
    timestamp: string;
}

export interface ApplicantDetails {
    id: number;
    status: string;
    dateApplied: string;
    personalDetails: PersonalDetails;
    academicStatus: AcademicStatus;
    professional: Professional;
    membership: Membership;
    history: HistoryEntry[];
    // Optional rejection details
    rejectedAt?: string;
    rejectionStage?: string;
    reason?: string;
}

// Registration Form Data (for submission)
export interface RegistrationFormData {
    personalDetails: PersonalDetails;
    academicStatus: AcademicStatus;
    professional: Professional;
    membership: Membership;
}

// Pagination
export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface PaginatedResponse<T> {
    applicants?: T[];
    members?: T[];
    pagination: Pagination;
}

// Member Types
export interface MemberSummary {
    id: number;
    fullName: string;
    email: string;
    degreeProgram: string;
    yearGraduated: string;
    memberSince: string;
    isActive: boolean;
}

export interface MentorshipInfo {
    id: number;
    relation: "mentor" | "mentee";
    partnerName: string;
    startDate: string;
    status: "active" | "completed";
}

export interface MemberDetails {
    id: number;
    user: User; // Basic user info
    personalDetails: PersonalDetails;
    academicStatus: AcademicStatus;
    professional: Professional;
    membership: Membership;
    mentorship: MentorshipInfo[]; // Placeholder array
    history: HistoryEntry[];
    memberSince: string;
    isActive: boolean;
}

// Dashboard Types
export interface DashboardStat {
    label: string;
    count: number;
}

export interface ActivityItem {
    id: string;           // Format: "al-45", "vh-123"
    type: string;         // e.g., "Approved Member", "Alumni Verified"
    description: string;  // Applicant/member name
    performedBy: string;  // Admin email
    timestamp: string;    // ISO timestamp
    notes?: string;       // Optional additional context
}

export interface DashboardStatsResponse {
    stats: DashboardStat[];
}

export interface DashboardActivityResponse {
    activities: ActivityItem[];
}

// Verification Response Types
export interface VerifyAlumniResponse {
    applicationId: number;
    status: string;
    verifiedAt: string;
    verifiedBy: string;
}

export interface RejectResponse {
    applicationId: number;
    status: string;
    rejectionStage: string;
    rejectedAt: string;
    reason: string;
}

export interface ConfirmPaymentResponse {
    applicationId: number;
    memberId: number;
    status: string;
    memberSince: string;
    approvedAt: string;
}
