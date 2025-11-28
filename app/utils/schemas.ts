import { z } from "zod";

// Personal Details Schema
export const personalDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  maidenName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => !email.endsWith("@up.edu.ph"), {
      message: "Please avoid using your up.edu.ph email",
    }),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^(09|\+639)\d{9}$/,
      "Please enter a valid Philippine mobile number"
    ),
  currentAddress: z.string().min(1, "Current address is required"),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City is required"),
  barangay: z.string().min(1, "Barangay is required"),
});

// Academic Status Schema
export const academicStatusSchema = z.object({
  degreeProgram: z.string().min(1, "Degree program is required"),
  yearGraduated: z
    .string()
    .min(1, "Year graduated is required")
    .regex(/^\d{4}$/, "Please enter a valid year (e.g., 2020)"),
  studentNumber: z.string().optional(),
});

// Professional Schema (all optional)
export const professionalSchema = z.object({
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
});

// Membership Schema
export const membershipSchema = z.object({
  membershipType: z.string().min(1, "Please select a membership type"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

// Full form schema
export const registrationFormSchema = z.object({
  personalDetails: personalDetailsSchema,
  academicStatus: academicStatusSchema,
  professional: professionalSchema,
  membership: membershipSchema,
});

// Type exports
export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;
export type AcademicStatusData = z.infer<typeof academicStatusSchema>;
export type ProfessionalData = z.infer<typeof professionalSchema>;
export type MembershipData = z.infer<typeof membershipSchema>;
export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
