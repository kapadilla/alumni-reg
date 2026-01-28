import { z } from "zod";

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
  { value: "Career Advancement", label: "Career Advancement" },
  { value: "Leadership & Management", label: "Leadership & Management" },
  {
    value: "Business & Corporate Skills",
    label: "Business & Corporate Skills",
  },
  { value: "Finance & Operations", label: "Finance & Operations" },
  { value: "Technology & Innovation", label: "Technology & Innovation" },
  { value: "HR & Workplace Skills", label: "HR & Workplace Skills" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
];

export const industryTracks: SelectOption[] = [
  { value: "IT & Software", label: "IT & Software" },
  { value: "Banking & Finance", label: "Banking & Finance" },
  { value: "Marketing & Advertising", label: "Marketing & Advertising" },
  { value: "Engineering", label: "Engineering" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Supply Chain", label: "Supply Chain" },
  { value: "Government / Public Sector", label: "Government / Public Sector" },
];

export const paymentOptions: SelectOption[] = [
  { value: "gcash", label: "GCash", description: "Pay via GCash" },
  { value: "bank", label: "Bank Transfer", description: "Direct bank deposit" },
  { value: "cash", label: "Cash", description: "In-person payment" },
];

export const mentorshipFormatOptions: SelectOption[] = [
  { value: "one-on-one", label: "1-on-1 Mentorship" },
  { value: "group", label: "Group Mentorship" },
  { value: "both", label: "Either format works" },
];

export const campusOptions: SelectOption[] = [
  { value: "UP Cebu", label: "UP Cebu" },
  { value: "UP Diliman", label: "UP Diliman" },
  { value: "UP Los Baños", label: "UP Los Baños" },
  { value: "UP Manila", label: "UP Manila" },
  { value: "UP Visayas", label: "UP Visayas" },
  { value: "UP Open University", label: "UP Open University" },
  { value: "UP Mindanao", label: "UP Mindanao" },
  { value: "UP Baguio", label: "UP Baguio" },
  { value: "UP Tacloban", label: "UP Tacloban" },
];

// ===========================
// Form Default Values
// ===========================

export const registrationFormDefaults = {
  // Personal Details
  firstName: "",
  lastName: "",
  middleName: "",
  suffix: "",
  maidenName: "",
  dateOfBirth: "",
  email: "",
  mobileNumber: "",
  currentAddress: "",
  province: "Cebu",
  city: "",
  barangay: "",
  zipCode: "",
  // Academic Status
  campus: "UP Cebu",
  degreeProgram: "",
  isGraduate: false,
  yearGraduated: "",
  studentNumber: "",
  unitsThreshold: "",
  torAttachment: null as File | null,
  // Professional
  currentEmployer: "",
  jobTitle: "",
  industry: "",
  yearsOfExperience: "",
  // Mentorship
  joinMentorshipProgram: false,
  mentorshipAreas: [] as string[],
  mentorshipAreasOther: "",
  mentorshipIndustryTracks: [] as string[],
  mentorshipIndustryTracksOther: "",
  mentorshipFormat: "",
  mentorshipAvailability: "",
  // Membership Payment
  idPhoto: null as File | null,
  paymentMethod: "gcash",
  gcashReferenceNumber: "",
  gcashProofOfPayment: null as File | null,
  bankSenderName: "",
  bankName: "",
  bankAccountNumber: "",
  bankReferenceNumber: "",
  bankProofOfPayment: null as File | null,
  cashPaymentDate: "",
  cashReceivedBy: "",
  paymentNotes: "",
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
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    middleName: z.string().optional(),
    suffix: z.string().optional(),
    maidenName: z.string().optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    email: z
      .email("Please enter a valid email address")
      .refine((email) => !email.toLowerCase().endsWith("@up.edu.ph"), {
        error:
          "UP email addresses are not allowed. Please use a personal email.",
      }),
    mobileNumber: z
      .string()
      .regex(/^09\d{9}$/, "Please enter a valid mobile number (09XXXXXXXXX)"),
    currentAddress: z.string().min(1, "Please enter your complete address"),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "City is required"),
    barangay: z.string().min(1, "Barangay is required"),
    zipCode: z.string().regex(/^\d{4}$/, "Zip code must be 4 digits"),
    // Academic Status
    campus: z.string().min(1, "Campus is required"),
    degreeProgram: z.string().min(2, "Degree program is required"),
    isGraduate: z.boolean().optional(),
    yearGraduated: z.string().refine(
      (year) => {
        if (!year || year === "") return true;
        if (!/^\d{4}$/.test(year)) return false;
        const y = parseInt(year);
        return y >= 1970 && y <= new Date().getFullYear();
      },
      { error: "Year must be between 1970 and current year" },
    ),
    studentNumber: z.string().optional(),
    unitsThreshold: z.string().optional(),
    torAttachment: z.instanceof(File).nullable().optional(),
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
    idPhoto: z.any().nullable().optional(),
    paymentMethod: z.string().min(1, "Please select a payment method"),
    gcashReferenceNumber: z.string().optional(),
    gcashProofOfPayment: z
      .file()
      .mime(["image/jpeg", "image/png", "image/webp"], {
        error: "Please upload a valid image (JPEG, PNG, or WebP)",
      })
      .max(5 * 1024 * 1024, { error: "Image must be less than 5MB" })
      .nullable()
      .optional(),
    bankSenderName: z.string().optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankReferenceNumber: z.string().optional(),
    bankProofOfPayment: z
      .file()
      .mime(["image/jpeg", "image/png", "image/webp"], {
        error: "Please upload a valid image (JPEG, PNG, or WebP)",
      })
      .max(5 * 1024 * 1024, { error: "Image must be less than 5MB" })
      .nullable()
      .optional(),
    cashPaymentDate: z.string().optional(),
    cashReceivedBy: z.string().optional(),
    paymentNotes: z.string().optional(),
    // Data Privacy
    dataPrivacyConsent: z.boolean().refine((val) => val === true, {
      error: "You must accept the data privacy policy",
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for non-graduates
    const isNonGraduate = !data.isGraduate;

    if (isNonGraduate) {
      if (!data.unitsThreshold || data.unitsThreshold.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Units completed is required for current students",
          path: ["unitsThreshold"],
        });
      } else {
        const units = parseInt(data.unitsThreshold);
        if (isNaN(units) || units < 0 || units > 300) {
          ctx.addIssue({
            code: "custom",
            message: "Please enter a valid number of units (0-300)",
            path: ["unitsThreshold"],
          });
        }
      }

      if (!data.torAttachment) {
        ctx.addIssue({
          code: "custom",
          message: "Transcript of Records is required for current students",
          path: ["torAttachment"],
        });
      }
    }

    // 1x1 Photo is required for everyone
    if (!data.idPhoto) {
      ctx.addIssue({
        code: "custom",
        message: "1x1 ID photo is required",
        path: ["idPhoto"],
      });
    }

    // Conditional validation based on payment method
    if (data.paymentMethod === "gcash") {
      if (!data.gcashReferenceNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Reference number is required",
          path: ["gcashReferenceNumber"],
        });
      } else if (!/^\d{13}$/.test(data.gcashReferenceNumber)) {
        ctx.addIssue({
          code: "custom",
          message: "Reference number must be exactly 13 digits",
          path: ["gcashReferenceNumber"],
        });
      }
      if (!data.gcashProofOfPayment) {
        ctx.addIssue({
          code: "custom",
          message: "Proof of payment is required",
          path: ["gcashProofOfPayment"],
        });
      }
    }

    if (data.paymentMethod === "bank") {
      if (!data.bankSenderName) {
        ctx.addIssue({
          code: "custom",
          message: "Sender name is required",
          path: ["bankSenderName"],
        });
      }
      if (!data.bankName) {
        ctx.addIssue({
          code: "custom",
          message: "Bank name is required",
          path: ["bankName"],
        });
      }
      if (!data.bankAccountNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Account number is required",
          path: ["bankAccountNumber"],
        });
      }
      if (!data.bankReferenceNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Reference number is required",
          path: ["bankReferenceNumber"],
        });
      } else if (data.bankReferenceNumber.length < 6) {
        ctx.addIssue({
          code: "custom",
          message: "Reference number is too short (minimum 6 characters)",
          path: ["bankReferenceNumber"],
        });
      }
      if (!data.bankProofOfPayment) {
        ctx.addIssue({
          code: "custom",
          message: "Proof of payment is required",
          path: ["bankProofOfPayment"],
        });
      }
    }

    if (data.paymentMethod === "cash") {
      if (!data.cashPaymentDate) {
        ctx.addIssue({
          code: "custom",
          message: "Payment date is required",
          path: ["cashPaymentDate"],
        });
      }
      if (!data.cashReceivedBy) {
        ctx.addIssue({
          code: "custom",
          message: "Staff member name is required",
          path: ["cashReceivedBy"],
        });
      }
    }

    // Conditional validation for mentorship program
    if (data.joinMentorshipProgram) {
      if (!data.mentorshipAreas || data.mentorshipAreas.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please select at least one area of interest",
          path: ["mentorshipAreas"],
        });
      }
      if (
        data.mentorshipAreas?.includes("other") &&
        !data.mentorshipAreasOther
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Please specify your other area of interest",
          path: ["mentorshipAreasOther"],
        });
      }
      if (
        !data.mentorshipIndustryTracks ||
        data.mentorshipIndustryTracks.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Please select at least one industry track",
          path: ["mentorshipIndustryTracks"],
        });
      }
      if (
        data.mentorshipIndustryTracks?.includes("other") &&
        !data.mentorshipIndustryTracksOther
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Please specify your other industry track",
          path: ["mentorshipIndustryTracksOther"],
        });
      }
      if (!data.mentorshipFormat) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a mentorship format",
          path: ["mentorshipFormat"],
        });
      }
      if (!data.mentorshipAvailability) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter your availability",
          path: ["mentorshipAvailability"],
        });
      }
    }
  });

// ===========================
// Field-level Zod Schemas (for onBlur validation)
// ===========================

export const fieldSchemas = {
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  maidenName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z
    .email("Please enter a valid email address")
    .refine((email) => !email.toLowerCase().endsWith("@up.edu.ph"), {
      error: "UP email addresses are not allowed. Please use a personal email.",
    }),
  mobileNumber: z
    .string()
    .regex(/^09\d{9}$/, "Please enter a valid mobile number (09XXXXXXXXX)"),
  currentAddress: z.string().min(5, "Please enter your complete address"),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City is required"),
  barangay: z.string().min(1, "Barangay is required"),
  zipCode: z.string().regex(/^\d{4}$/, "Zip code must be 4 digits"),
  campus: z.string().min(1, "Campus is required"),
  degreeProgram: z.string().min(2, "Degree program is required"),
  yearGraduated: z.string().refine(
    (year) => {
      if (!year || year === "") return true;
      if (!/^\d{4}$/.test(year)) return false;
      const y = parseInt(year);
      return y >= 1970 && y <= new Date().getFullYear();
    },
    { error: "Year must be between 1970 and current year" },
  ),
  studentNumber: z.string().optional(),
  unitsThreshold: z
    .string()
    .min(1, "Units completed is required")
    .refine(
      (val) => {
        const units = parseInt(val);
        return !isNaN(units) && units >= 0 && units <= 300;
      },
      { message: "Please enter a valid number of units (0-300)" },
    ),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  // Mentorship fields
  mentorshipAreas: z
    .array(z.string())
    .min(1, "Please select at least one area of interest"),
  mentorshipAreasOther: z
    .string()
    .min(1, "Please specify your other area of interest"),
  mentorshipIndustryTracks: z
    .array(z.string())
    .min(1, "Please select at least one industry track"),
  mentorshipIndustryTracksOther: z
    .string()
    .min(1, "Please specify your other industry track"),
  mentorshipFormat: z.string().min(1, "Please select a mentorship format"),
  mentorshipAvailability: z.string().min(1, "Please enter your availability"),
  // Payment fields
  paymentMethod: z.string().min(1, "Please select a payment method"),
  gcashReferenceNumber: z
    .string()
    .min(1, "Reference number is required")
    .regex(/^\d{13}$/, "Reference number must be exactly 13 digits"),
  bankSenderName: z.string().min(1, "Sender name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankAccountNumber: z.string().min(1, "Account number is required"),
  bankReferenceNumber: z
    .string()
    .min(6, "Reference number must be at least 6 characters"),
  cashPaymentDate: z.string().min(1, "Payment date is required"),
  cashReceivedBy: z.string().min(1, "Staff member name is required"),
  dataPrivacyConsent: z.boolean().refine((val) => val === true, {
    error: "You must accept the data privacy policy",
  }),
} as const;
