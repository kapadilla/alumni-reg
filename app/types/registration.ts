import { z } from 'zod';

// ===========================
// Select Option Types
// ===========================

export interface SelectOption {
    value: string;
    label: string;
    description?: string;
}

export interface LocationOption extends SelectOption {
    code?: string;
}

// ===========================
// Form Field Options
// ===========================

export const mentorshipAreas: SelectOption[] = [
    { value: 'career-advancement', label: 'Career Advancement' },
    { value: 'leadership-management', label: 'Leadership & Management' },
    { value: 'business-corporate', label: 'Business & Corporate Skills' },
    { value: 'finance-operations', label: 'Finance & Operations' },
    { value: 'technology-innovation', label: 'Technology & Innovation' },
    { value: 'hr-workplace', label: 'HR & Workplace Skills' },
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
];

export const industryTracks: SelectOption[] = [
    { value: 'it-software', label: 'IT & Software' },
    { value: 'banking-finance', label: 'Banking & Finance' },
    { value: 'marketing-advertising', label: 'Marketing & Advertising' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'supply-chain', label: 'Supply Chain' },
    { value: 'government-public', label: 'Government / Public Sector' },
];

export const paymentOptions: SelectOption[] = [
    { value: 'gcash', label: 'GCash', description: 'Pay via GCash' },
    { value: 'bank', label: 'Bank Transfer', description: 'Direct bank deposit' },
    { value: 'cash', label: 'Cash', description: 'In-person payment' },
];

export const mentorshipFormatOptions: SelectOption[] = [
    { value: 'one-on-one', label: '1-on-1 Mentorship' },
    { value: 'group', label: 'Group Mentorship' },
    { value: 'both', label: 'Either format works' },
];

// ===========================
// Form Default Values
// ===========================

export const registrationFormDefaults = {
    // Personal Details
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    maidenName: '',
    dateOfBirth: '',
    email: '',
    mobileNumber: '',
    currentAddress: '',
    province: '',
    city: '',
    barangay: '',
    zipCode: '',
    // Academic Status
    degreeProgram: '',
    yearGraduated: undefined as string | undefined,
    studentNumber: '',
    // Professional
    currentEmployer: '',
    jobTitle: '',
    industry: '',
    yearsOfExperience: '',
    // Mentorship
    joinMentorshipProgram: false,
    mentorshipAreas: [] as string[],
    mentorshipAreasOther: '',
    mentorshipIndustryTracks: [] as string[],
    mentorshipIndustryTracksOther: '',
    mentorshipFormat: '',
    mentorshipAvailability: '',
    // Membership Payment
    paymentMethod: 'gcash',
    gcashReferenceNumber: '',
    gcashProofOfPayment: null as File | null,
    bankSenderName: '',
    bankName: '',
    bankAccountNumber: '',
    bankReferenceNumber: '',
    bankProofOfPayment: null as File | null,
    cashPaymentDate: '',
    cashReceivedBy: '',
    paymentNotes: '',
    // Data Privacy
    dataPrivacyConsent: false,
};

export type RegistrationFormValues = typeof registrationFormDefaults;

// ===========================
// Zod Validation Schema
// ===========================

export const registrationSchema = z
    .object({
        // Personal Details
        firstName: z.string().min(2, 'First name is required'),
        lastName: z.string().min(2, 'Last name is required'),
        middleName: z.string().optional(),
        suffix: z.string().optional(),
        maidenName: z.string().optional(),
        dateOfBirth: z.string().min(1, 'Date of birth is required'),
        email: z.string().email('Please enter a valid email address'),
        mobileNumber: z
            .string()
            .regex(/^09\d{9}$/, 'Please enter a valid mobile number (09XXXXXXXXX)'),
        currentAddress: z.string().min(1, 'Please enter your complete address'),
        province: z.string().min(1, 'Province is required'),
        city: z.string().min(1, 'City is required'),
        barangay: z.string().min(1, 'Barangay is required'),
        zipCode: z.string().regex(/^\d{4}$/, 'Zip code must be 4 digits'),
        // Academic Status
        degreeProgram: z.string().min(2, 'Degree program is required'),
        yearGraduated: z
            .string()
            .optional()
            .refine(
                (year) => {
                    if (!year) return true;
                    if (!/^\d{4}$/.test(year)) return false;
                    const y = parseInt(year);
                    return y >= 1970 && y <= new Date().getFullYear();
                },
                { message: 'Year must be between 1970 and current year' }
            ),
        studentNumber: z.string().optional(),
        // Professional
        currentEmployer: z.string().optional(),
        jobTitle: z.string().optional(),
        industry: z.string().optional(),
        yearsOfExperience: z.string().optional(),
        // Mentorship Program
        joinMentorshipProgram: z.boolean().optional(),
        mentorshipAreas: z.array(z.string()).optional(),
        mentorshipAreasOther: z.string().optional(),
        mentorshipIndustryTracks: z.array(z.string()).optional(),
        mentorshipIndustryTracksOther: z.string().optional(),
        mentorshipFormat: z.string().optional(),
        mentorshipAvailability: z.string().optional(),
        // Membership Payment
        paymentMethod: z.string().min(1, 'Please select a payment method'),
        gcashReferenceNumber: z.string().optional(),
        gcashProofOfPayment: z.any().optional(),
        bankSenderName: z.string().optional(),
        bankName: z.string().optional(),
        bankAccountNumber: z.string().optional(),
        bankReferenceNumber: z.string().optional(),
        bankProofOfPayment: z.any().optional(),
        cashPaymentDate: z.string().optional(),
        cashReceivedBy: z.string().optional(),
        paymentNotes: z.string().optional(),
        // Data Privacy
        dataPrivacyConsent: z.boolean().refine((val) => val === true, {
            message: 'You must accept the data privacy policy',
        }),
    })
    .superRefine((data, ctx) => {
        // Conditional validation based on payment method
        if (data.paymentMethod === 'gcash') {
            if (!data.gcashReferenceNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Reference number is required',
                    path: ['gcashReferenceNumber'],
                });
            }
            if (!data.gcashProofOfPayment) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Proof of payment is required',
                    path: ['gcashProofOfPayment'],
                });
            }
        }

        if (data.paymentMethod === 'bank') {
            if (!data.bankSenderName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Sender name is required',
                    path: ['bankSenderName'],
                });
            }
            if (!data.bankName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Bank name is required',
                    path: ['bankName'],
                });
            }
            if (!data.bankAccountNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Account number is required',
                    path: ['bankAccountNumber'],
                });
            }
            if (!data.bankReferenceNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Reference number is required',
                    path: ['bankReferenceNumber'],
                });
            }
            if (!data.bankProofOfPayment) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Proof of payment is required',
                    path: ['bankProofOfPayment'],
                });
            }
        }

        if (data.paymentMethod === 'cash') {
            if (!data.cashPaymentDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Payment date is required',
                    path: ['cashPaymentDate'],
                });
            }
            if (!data.cashReceivedBy) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Staff member name is required',
                    path: ['cashReceivedBy'],
                });
            }
        }

        // Conditional validation for mentorship program
        if (data.joinMentorshipProgram) {
            if (!data.mentorshipAreas || data.mentorshipAreas.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please select at least one area of interest',
                    path: ['mentorshipAreas'],
                });
            }
            if (data.mentorshipAreas?.includes('other') && !data.mentorshipAreasOther) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please specify your other area of interest',
                    path: ['mentorshipAreasOther'],
                });
            }
            if (!data.mentorshipIndustryTracks || data.mentorshipIndustryTracks.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please select at least one industry track',
                    path: ['mentorshipIndustryTracks'],
                });
            }
            if (data.mentorshipIndustryTracks?.includes('other') && !data.mentorshipIndustryTracksOther) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please specify your other industry track',
                    path: ['mentorshipIndustryTracksOther'],
                });
            }
            if (!data.mentorshipFormat) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please select a mentorship format',
                    path: ['mentorshipFormat'],
                });
            }
            if (!data.mentorshipAvailability) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please enter your availability',
                    path: ['mentorshipAvailability'],
                });
            }
        }
    });

// ===========================
// Field-level Zod Schemas (for onBlur validation)
// ===========================

export const fieldSchemas = {
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    middleName: z.string().optional(),
    suffix: z.string().optional(),
    maidenName: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    email: z.string().email('Please enter a valid email address'),
    mobileNumber: z
        .string()
        .regex(/^09\d{9}$/, 'Please enter a valid mobile number (09XXXXXXXXX)'),
    currentAddress: z.string().min(5, 'Please enter your complete address'),
    province: z.string().min(1, 'Province is required'),
    city: z.string().min(1, 'City is required'),
    barangay: z.string().min(1, 'Barangay is required'),
    zipCode: z.string().regex(/^\d{4}$/, 'Zip code must be 4 digits'),
    degreeProgram: z.string().min(2, 'Degree program is required'),
    yearGraduated: z
        .string()
        .optional()
        .refine(
            (year) => {
                if (!year) return true;
                if (!/^\d{4}$/.test(year)) return false;
                const y = parseInt(year);
                return y >= 1970 && y <= new Date().getFullYear();
            },
            { message: 'Year must be between 1970 and current year' }
        ),
    studentNumber: z.string().optional(),
    currentEmployer: z.string().optional(),
    jobTitle: z.string().optional(),
    industry: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    paymentMethod: z.string().min(1, 'Please select a payment method'),
    gcashReferenceNumber: z.string().min(1, 'Reference number is required'),
    bankSenderName: z.string().min(1, 'Sender name is required'),
    bankName: z.string().min(1, 'Bank name is required'),
    bankAccountNumber: z.string().min(1, 'Account number is required'),
    bankReferenceNumber: z.string().min(1, 'Reference number is required'),
    cashPaymentDate: z.string().min(1, 'Payment date is required'),
    cashReceivedBy: z.string().min(1, 'Staff member name is required'),
    dataPrivacyConsent: z.boolean().refine((val) => val === true, {
        message: 'You must accept the data privacy policy',
    }),
} as const;
