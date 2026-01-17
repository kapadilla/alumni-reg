<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useForm } from "@tanstack/vue-form";
import { z } from "zod";
import {
  MapPinIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
} from "@heroicons/vue/24/solid";

const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return error.message;
  }
  return String(error);
};

interface LocationOption {
  value: string;
  label: string;
  code?: string;
}

const mentorshipAreas = [
  { value: "career-advancement", label: "Career Advancement" },
  { value: "leadership-management", label: "Leadership & Management" },
  { value: "business-corporate", label: "Business & Corporate Skills" },
  { value: "finance-operations", label: "Finance & Operations" },
  { value: "technology-innovation", label: "Technology & Innovation" },
  { value: "hr-workplace", label: "HR & Workplace Skills" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "other", label: "Other" },
];

const industryTracks = [
  { value: "it-software", label: "IT & Software" },
  { value: "banking-finance", label: "Banking & Finance" },
  { value: "marketing-advertising", label: "Marketing & Advertising" },
  { value: "engineering", label: "Engineering" },
  { value: "healthcare", label: "Healthcare" },
  { value: "real-estate", label: "Real Estate" },
  { value: "supply-chain", label: "Supply Chain" },
  { value: "government-public", label: "Government / Public Sector" },
  { value: "other", label: "Other" },
];

// Zod validation schema
const formSchema = z
  .object({
    // Personal Details
    firstName: z.string().min(2, "This field is required"),
    lastName: z.string().min(2, "This field is required"),
    middleName: z.string().optional(),
    suffix: z.string().optional(),
    maidenName: z.string().optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    email: z.string().email("Invalid email address"),
    mobileNumber: z
      .string()
      .regex(/^(09|\+639)\d{9}$/, "Invalid mobile number"),
    currentAddress: z.string().min(5, "This field is required"),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "City is required"),
    barangay: z.string().min(1, "Barangay is required"),
    zipCode: z.string().regex(/^\d{4}$/, "Zip code must be 4 digits"),
    // Academic Status
    degreeProgram: z.string().min(2, "Degree program is required"),
    yearGraduated: z
      .string()
      .regex(/^\d{4}$/, "Invalid year")
      .refine(
        (year) => {
          const y = parseInt(year);
          return y >= 1970 && y <= new Date().getFullYear();
        },
        { message: "Year must be between 1970 and current year" }
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
    // Membership
    paymentMethod: z.string().min(1, "This field is required"),
    //GCash Fields
    gcashReferenceNumber: z.string().optional(),
    gcashProofOfPayment: z.any().optional(),
    // Bank Transfer fields
    bankSenderName: z.string().optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankReferenceNumber: z.string().optional(),
    bankProofOfPayment: z.any().optional(),
    // Cash fields
    cashPaymentDate: z.string().optional(),
    cashReceivedBy: z.string().optional(),
    // Data Privacy
    dataPrivacyConsent: z.boolean().refine((val) => val === true, {
      message: "You must accept the data privacy policy",
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation based on payment method
    if (data.paymentMethod === "gcash") {
      if (!data.gcashReferenceNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Reference number is required",
          path: ["gcashReferenceNumber"],
        });
      }
      if (!data.gcashProofOfPayment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Proof of payment is required",
          path: ["gcashProofOfPayment"],
        });
      }
    }

    if (data.paymentMethod === "bank") {
      if (!data.bankSenderName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender name is required",
          path: ["bankSenderName"],
        });
      }
      if (!data.bankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bank name is required",
          path: ["bankName"],
        });
      }
      if (!data.bankAccountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Account number is required",
          path: ["bankAccountNumber"],
        });
      }
      if (!data.bankReferenceNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Reference number is required",
          path: ["bankReferenceNumber"],
        });
      }
      if (!data.bankProofOfPayment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Proof of payment is required",
          path: ["bankProofOfPayment"],
        });
      }
    }

    if (data.paymentMethod === "cash") {
      if (!data.cashPaymentDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Payment date is required",
          path: ["cashPaymentDate"],
        });
      }
      if (!data.cashReceivedBy) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Staff member name is required",
          path: ["cashReceivedBy"],
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

const paymentOptions = [
  { value: "gcash", label: "GCash" },
  { value: "bank", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
];

// Location data from API
const provinces = ref<LocationOption[]>([]);
const cities = ref<LocationOption[]>([]);
const barangays = ref<LocationOption[]>([]);

const loadingProvinces = ref(false);
const loadingCities = ref(false);
const loadingBarangays = ref(false);

// Initialize TanStack Form
const form = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    maidenName: "",
    dateOfBirth: "",
    email: "",
    mobileNumber: "",
    currentAddress: "",
    province: "",
    city: "",
    barangay: "",
    zipCode: "",
    degreeProgram: "",
    yearGraduated: "",
    studentNumber: "",
    currentEmployer: "",
    jobTitle: "",
    industry: "",
    yearsOfExperience: "",
    // Mentorship
    joinMentorshipProgram: false,
    mentorshipAreas: [],
    mentorshipAreasOther: "",
    mentorshipIndustryTracks: [],
    mentorshipIndustryTracksOther: "",
    mentorshipFormat: "",
    mentorshipAvailability: "",
    membershipType: "",
    paymentMethod: "",
    // GCash
    gcashReferenceNumber: "",
    gcashProofOfPayment: null,
    // Bank
    bankSenderName: "",
    bankName: "",
    bankAccountNumber: "",
    bankReferenceNumber: "",
    bankProofOfPayment: null,
    // Cash
    cashPaymentDate: "",
    cashReceivedBy: "",
    dataPrivacyConsent: false,
  } as FormData,
  validators: {
    onChange: formSchema,
  },
  onSubmit: async ({ value }) => {
    console.log("Form submitted:", value);
    // Handle form submission here
    alert("Form submitted successfully! Check console for data.");
  },
});

// Fetch provinces on mount
onMounted(async () => {
  try {
    loadingProvinces.value = true;
    const response = await fetch("https://psgc.gitlab.io/api/provinces/");
    const data = await response.json();

    provinces.value = data
      .map((item: any) => ({
        value: item.code,
        label: item.name,
        code: item.code,
      }))
      .sort((a: LocationOption, b: LocationOption) =>
        a.label.localeCompare(b.label)
      );
  } catch (error) {
    console.error("Error fetching provinces:", error);
  } finally {
    loadingProvinces.value = false;
  }
});

// Watch province changes to fetch cities
const watchProvince = ref("");
watch(watchProvince, async (newProvince) => {
  if (!newProvince) {
    cities.value = [];
    barangays.value = [];
    form.setFieldValue("city", "");
    form.setFieldValue("barangay", "");
    return;
  }

  try {
    loadingCities.value = true;
    const response = await fetch(
      `https://psgc.gitlab.io/api/provinces/${newProvince}/cities-municipalities/`
    );
    const data = await response.json();

    cities.value = data
      .map((item: any) => ({
        value: item.code,
        label: item.name,
        code: item.code,
      }))
      .sort((a: LocationOption, b: LocationOption) =>
        a.label.localeCompare(b.label)
      );
  } catch (error) {
    console.error("Error fetching cities:", error);
    cities.value = [];
  } finally {
    loadingCities.value = false;
  }
});

// Watch city changes to fetch barangays
const watchCity = ref("");
watch(watchCity, async (newCity) => {
  if (!newCity) {
    barangays.value = [];
    form.setFieldValue("barangay", "");
    return;
  }

  try {
    loadingBarangays.value = true;
    const response = await fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${newCity}/barangays/`
    );
    const data = await response.json();

    barangays.value = data
      .map((item: any) => ({
        value: item.code,
        label: item.name,
        code: item.code,
      }))
      .sort((a: LocationOption, b: LocationOption) =>
        a.label.localeCompare(b.label)
      );
  } catch (error) {
    console.error("Error fetching barangays:", error);
    barangays.value = [];
  } finally {
    loadingBarangays.value = false;
  }
});
</script>

<template>
  <form
    @submit="
      (e) => {
        e.preventDefault();
        form.handleSubmit();
      }
    "
    class="space-y-8 p-1"
  >
    <!-- Personal Information Section -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Personal Information</h2>
        <p class="text-subtle">
          Please provide your legal identity details as they appear in official
          records.
        </p>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
      >
        <!-- First Name Field -->
        <form.Field name="firstName" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              First Name <span class="text-primary">*</span>
            </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="Juan"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <!-- Last Name Field -->
        <form.Field name="lastName" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              Last Name <span class="text-primary">*</span>
            </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="Dela Cruz"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <!-- Middle Name Field -->
        <form.Field name="middleName" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="Murillo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>
        <!-- Suffix Field -->
        <form.Field name="suffix" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1"> Suffix </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="Jr."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Maiden Name Field -->
        <form.Field name="maidenName" v-slot="{ field, state }">
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text2 mb-1">
              Maiden Name
            </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="(if applicable)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <!-- Date of Birth Field -->
        <form.Field name="dateOfBirth" v-slot="{ field, state }">
          <div class="sm:col-span-1">
            <label class="block text-sm font-medium text2 mb-1">
              Date of Birth <span class="text-primary">*</span>
            </label>
            <input
              type="date"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              For verifying school records
            </p>
          </div>
        </form.Field>
      </div>

      <div class="">
        <h3 class="flex items-center gap-2 text-lg font-semibold text mb-4">
          <MapPinIcon class="w-5 h-5 text-primary -mr-1.5 mb-0.5" />Contact &
          Location
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <!-- Email Field -->
            <form.Field name="email" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Email Address <span class="text-primary">*</span>
                </label>
                <input
                  type="email"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="juandelacruz@gmail.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  Please avoid using your up.edu.ph email.
                </p>
              </div>
            </form.Field>

            <!-- Mobile Number Field -->
            <form.Field name="mobileNumber" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Mobile Number <span class="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="0917 123 4567"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>
          </div>

          <!-- Current Address Field -->
          <form.Field name="currentAddress" v-slot="{ field, state }">
            <div>
              <label class="block text-sm font-medium text2 mb-1">
                Current Address <span class="text-primary">*</span>
              </label>
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                placeholder="Unit, Street, Subdivision"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p
                v-if="state.meta.isTouched && state.meta.errors.length"
                class="text-primary text-xs mt-1"
              >
                {{ getErrorMessage(state.meta.errors[0]) }}
              </p>
            </div>
          </form.Field>

          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Province Field -->
            <form.Field name="province" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Province <span class="text-primary">*</span>
                </label>
                <select
                  :value="field.state.value"
                  @input="(e) => {
                    const val = (e.target as HTMLSelectElement).value;
                    field.handleChange(val);
                    watchProvince = val;
                  }"
                  @blur="field.handleBlur"
                  :disabled="loadingProvinces"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-gray-100"
                >
                  <option value="" disabled>Select Province</option>
                  <option
                    v-for="option in provinces"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- City Field -->
            <form.Field name="city" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  City <span class="text-primary">*</span>
                </label>
                <select
                  :value="field.state.value"
                  @input="(e) => {
                    const val = (e.target as HTMLSelectElement).value;
                    field.handleChange(val);
                    watchCity = val;
                  }"
                  @blur="field.handleBlur"
                  :disabled="loadingCities || cities.length === 0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary disabled:background"
                >
                  <option value="" disabled>Select City</option>
                  <option
                    v-for="option in cities"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Barangay Field -->
            <form.Field name="barangay" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Barangay <span class="text-primary">*</span>
                </label>
                <select
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLSelectElement).value)"
                  @blur="field.handleBlur"
                  :disabled="loadingBarangays || barangays.length === 0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary disabled:background"
                >
                  <option value="" disabled>Select Barangay</option>
                  <option
                    v-for="option in barangays"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Zip Code Field -->
            <form.Field name="zipCode" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Zip Code <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="6000"
                  maxlength="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>
          </div>
        </div>
      </div>
    </div>

    <!-- Academic Status Section -->
    <div class="space-y-6 border-t border-gray-200 pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Academic Status</h2>
        <p class="text-subtle">
          Please provide your academic information from UP Cebu.
        </p>
      </div>

      <div class="space-y-4">
        <!-- Degree Program Field -->
        <form.Field name="degreeProgram" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              Degree Program <span class="text-primary">*</span>
            </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="e.g., BS Computer Science"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <!-- Year Graduated Field -->
          <form.Field name="yearGraduated" v-slot="{ field, state }">
            <div>
              <label class="block text-sm font-medium text2 mb-1">
                Year Graduated <span class="text-primary">*</span>
              </label>
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                placeholder="e.g. 2020"
                maxlength="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p
                v-if="state.meta.isTouched && state.meta.errors.length"
                class="text-primary text-xs mt-1"
              >
                {{ getErrorMessage(state.meta.errors[0]) }}
              </p>
            </div>
          </form.Field>

          <!-- Student Number Field -->
          <form.Field name="studentNumber" v-slot="{ field, state }">
            <div>
              <label class="block text-sm font-medium text2 mb-1">
                Student Number
              </label>
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                placeholder="e.g. 2016-12345 (optional)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p
                v-if="state.meta.isTouched && state.meta.errors.length"
                class="text-primary text-xs mt-1"
              >
                {{ getErrorMessage(state.meta.errors[0]) }}
              </p>
            </div>
          </form.Field>
        </div>
      </div>
    </div>

    <!-- Professional Information Section -->
    <div class="space-y-6 border-t border-gray-200 pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Professional Information</h2>
        <p class="text-subtle">
          Tell us about your current professional status (optional).
        </p>
      </div>

      <div class="space-y-4">
        <!-- Current Employer Field -->
        <form.Field name="currentEmployer" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              Current Employer
            </label>
            <input
              type="text"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="Company Name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Job Title Field -->
          <form.Field name="jobTitle" v-slot="{ field, state }">
            <div>
              <label class="block text-sm font-medium text2 mb-1">
                Job Title
              </label>
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                placeholder="Software Engineer"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p
                v-if="state.meta.isTouched && state.meta.errors.length"
                class="text-primary text-xs mt-1"
              >
                {{ getErrorMessage(state.meta.errors[0]) }}
              </p>
            </div>
          </form.Field>

          <!-- Industry Field -->
          <form.Field name="industry" v-slot="{ field, state }">
            <div>
              <label class="block text-sm font-medium text2 mb-1">
                Industry
              </label>
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
                placeholder="Technology"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p
                v-if="state.meta.isTouched && state.meta.errors.length"
                class="text-primary text-xs mt-1"
              >
                {{ getErrorMessage(state.meta.errors[0]) }}
              </p>
            </div>
          </form.Field>
        </div>

        <!-- Years of Experience -->
        <form.Field name="yearsOfExperience" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              Years of Professional Experience
            </label>
            <input
              type="number"
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
              @blur="field.handleBlur"
              placeholder="e.g., 5"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <!-- Mentorship Program Section -->
        <div class="pt-4 border-t border-gray-200">
          <h3 class="flex items-center gap-2 text-lg font-semibold text mb-4">
            <AcademicCapIcon
              class="w-5 h-5 text-primary -mr-1 mb-0.5"
            />Mentorship Program
          </h3>

          <!-- Join Mentorship Program -->
          <form.Field name="joinMentorshipProgram" v-slot="{ field, state }">
            <div>
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="field.state.value"
                  @change="(e) => field.handleChange((e.target as HTMLInputElement).checked)"
                  @blur="field.handleBlur"
                  class="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-secondary"
                />
                <span class="text-sm text">
                  I am interested in joining the Mentorship Program
                </span>
              </label>
              <p
                v-if="state.meta.isTouched && state.meta.errors.length"
                class="text-primary text-xs mt-1 ml-7"
              >
                {{ getErrorMessage(state.meta.errors[0]) }}
              </p>
            </div>
          </form.Field>

          <!-- Mentorship Details (Show only if checkbox is checked) -->
          <form.Subscribe v-slot="{ values }">
            <div
              v-if="values.joinMentorshipProgram"
              class="mt-6 space-y-4 background border border-purple-200 rounded-lg p-4"
            >
              <h4 class="font-semibold text mb-3">Mentorship Preferences</h4>

              <!-- Mentorship Areas (Multi-select) -->
              <div>
                <label class="block text-sm font-medium text2 mb-2">
                  Areas of Interest (Select all that apply)
                </label>
                <div class="space-y-2">
                  <form.Field name="mentorshipAreas" v-slot="{ field, state }">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        v-for="area in mentorshipAreas"
                        :key="area.value"
                        class="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          :value="area.value"
                          :checked="field.state.value?.includes(area.value)"
                          @change="(e) => {
                        const checked = (e.target as HTMLInputElement).checked;
                        const currentValue = field.state.value || [];
                        const newValue = checked
                          ? [...currentValue, area.value]
                          : currentValue.filter((v: string) => v !== area.value);
                        field.handleChange(newValue);
                      }"
                          class="w-4 h-4 border-gray-300 rounded focus:ring-secondary"
                        />
                        <span class="text-sm text2">{{ area.label }}</span>
                      </label>
                    </div>
                    <p
                      v-if="state.meta.isTouched && state.meta.errors.length"
                      class="text-primary text-xs mt-1"
                    >
                      {{ getErrorMessage(state.meta.errors[0]) }}
                    </p>
                  </form.Field>
                </div>
              </div>
              <form.Subscribe v-slot="{ values }">
                <div
                  v-if="values.mentorshipAreas?.includes('other')"
                  class="mt-3"
                >
                  <form.Field
                    name="mentorshipAreasOther"
                    v-slot="{ field, state }"
                  >
                    <div>
                      <label
                        class="block text-sm font-medium text2 mb-1 focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        Please specify (Other)
                      </label>
                      <input
                        type="text"
                        :value="field.state.value"
                        @input="(e) =>
            field.handleChange(
              (e.target as HTMLInputElement).value
            )
          "
                        @blur="field.handleBlur"
                        placeholder="Enter your area of interest"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      />

                      <p
                        v-if="state.meta.isTouched && state.meta.errors.length"
                        class="text-primary text-xs mt-1"
                      >
                        {{ getErrorMessage(state.meta.errors[0]) }}
                      </p>
                    </div>
                  </form.Field>
                </div>
              </form.Subscribe>

              <!-- Industry Tracks (Multi-select) -->
              <div>
                <label class="block text-sm font-medium text2 mb-2">
                  Industry Tracks (Select all that apply)
                </label>
                <div class="space-y-2">
                  <form.Field
                    name="mentorshipIndustryTracks"
                    v-slot="{ field, state }"
                  >
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        v-for="track in industryTracks"
                        :key="track.value"
                        class="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          :value="track.value"
                          :checked="field.state.value?.includes(track.value)"
                          @change="(e) => {
                        const checked = (e.target as HTMLInputElement).checked;
                        const currentValue = field.state.value || [];
                        const newValue = checked
                          ? [...currentValue, track.value]
                          : currentValue.filter((v: string) => v !== track.value);
                        field.handleChange(newValue);
                      }"
                          class="w-4 h-4 border-gray-300 rounded focus:ring-secondary"
                        />
                        <span class="text-sm text2">{{ track.label }}</span>
                      </label>
                    </div>
                    <p
                      v-if="state.meta.isTouched && state.meta.errors.length"
                      class="text-primary text-xs mt-1"
                    >
                      {{ getErrorMessage(state.meta.errors[0]) }}
                    </p>
                  </form.Field>
                </div>
              </div>

              <form.Subscribe v-slot="{ values }">
                <div
                  v-if="values.mentorshipIndustryTracks?.includes('other')"
                  class="mt-3"
                >
                  <form.Field
                    name="mentorshipIndustryTracksOther"
                    v-slot="{ field, state }"
                  >
                    <div>
                      <label class="block text-sm font-medium text2 mb-1">
                        Please specify (Other)
                      </label>
                      <input
                        type="text"
                        :value="field.state.value"
                        @input="(e) =>
            field.handleChange(
              (e.target as HTMLInputElement).value
            )
          "
                        @blur="field.handleBlur"
                        placeholder="Enter industry"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      />

                      <p
                        v-if="state.meta.isTouched && state.meta.errors.length"
                        class="text-primary text-xs mt-1"
                      >
                        {{ getErrorMessage(state.meta.errors[0]) }}
                      </p>
                    </div>
                  </form.Field>
                </div>
              </form.Subscribe>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Mentorship Format -->
                <form.Field name="mentorshipFormat" v-slot="{ field, state }">
                  <div>
                    <label class="block text-sm font-medium text2 mb-1">
                      Preferred Mentorship Format
                    </label>
                    <select
                      :value="field.state.value"
                      @input="(e) => field.handleChange((e.target as HTMLSelectElement).value)"
                      @blur="field.handleBlur"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="" disabled>Select format</option>
                      <option value="one-on-one">1-on-1 Mentorship</option>
                      <option value="group">Group Mentorship</option>
                      <option value="both">Either format works</option>
                    </select>
                    <p
                      v-if="state.meta.isTouched && state.meta.errors.length"
                      class="text-primary text-xs mt-1"
                    >
                      {{ getErrorMessage(state.meta.errors[0]) }}
                    </p>
                  </div>
                </form.Field>

                <!-- Availability -->
                <form.Field
                  name="mentorshipAvailability"
                  v-slot="{ field, state }"
                >
                  <div>
                    <label class="block text-sm font-medium text2 mb-1">
                      Availability (hours per month)
                    </label>
                    <input
                      type="number"
                      :value="field.state.value"
                      @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                      @blur="field.handleBlur"
                      placeholder="e.g., 4"
                      min="1"
                      max="40"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <p class="text-sm text-gray-500 mt-1">
                      Typical commitment: 2-4 hours per month
                    </p>
                    <p
                      v-if="state.meta.isTouched && state.meta.errors.length"
                      class="text-primary text-xs mt-1"
                    >
                      {{ getErrorMessage(state.meta.errors[0]) }}
                    </p>
                  </div>
                </form.Field>
              </div>
            </div>
          </form.Subscribe>
        </div>
      </div>
    </div>

    <!-- Membership Section -->
    <div class="space-y-6 border-t border-gray-200 pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Membership</h2>
        <p class="text-subtle">Choose your payment method.</p>
      </div>

      <div class="space-y-4">
        <!-- Payment Method Field -->
        <form.Field name="paymentMethod" v-slot="{ field, state }">
          <div>
            <label class="block text-sm font-medium text2 mb-1">
              Payment Method <span class="text-primary">*</span>
            </label>
            <select
              :value="field.state.value"
              @input="(e) => field.handleChange((e.target as HTMLSelectElement).value)"
              @blur="field.handleBlur"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="" disabled>Select payment method</option>
              <option
                v-for="option in paymentOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>

        <!-- Wrap payment details in form.Subscribe -->
        <form.Subscribe v-slot="{ values }">
          <!-- GCash Payment Details -->
          <div v-if="values.paymentMethod === 'gcash'" class="space-y-4 p-4">
            <h3
              class="flex items-center gap-2 text-lg font-semibold text mb-4 -ml-3"
            >
              <DevicePhoneMobileIcon
                class="w-5 h-5 text-primary -mr-1.5 mb-0.5"
              />GCash Payment Details
            </h3>

            <!-- GCash Reference Number -->
            <form.Field name="gcashReferenceNumber" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  GCash Reference Number <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="e.g. 1234567890123"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- GCash Proof of Payment -->
            <form.Field name="gcashProofOfPayment" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Screenshot/Proof of Payment
                  <span class="text-primary">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => field.handleChange((e.target as HTMLInputElement).files?.[0])"
                  @blur="field.handleBlur"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p class="text-sm text-gray-500 mt-1">
                  Upload a screenshot of your GCash transaction
                </p>
              </div>
            </form.Field>
          </div>

          <!-- Bank Transfer Payment Details -->
          <div v-if="values.paymentMethod === 'bank'" class="space-y-4 p-4">
            <h3
              class="flex items-center gap-2 text-lg font-semibold text mb-4 -ml-3"
            >
              <BuildingLibraryIcon
                class="w-5 h-5 text-primary -mr-1.5 mb-0.5"
              />Bank Transfer Details
            </h3>

            <!-- Sender Name -->
            <form.Field name="bankSenderName" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Name of Sender/Account Holder
                  <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="Juan Dela Cruz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Bank Name -->
            <form.Field name="bankName" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Bank Name <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="e.g. BDO, BPI, Metrobank"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Account Number -->
            <form.Field name="bankAccountNumber" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Account Number (Last 4 digits)
                  <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="1234"
                  maxlength="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Reference Number -->
            <form.Field name="bankReferenceNumber" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Reference/Transaction Number
                  <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="Transaction reference number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Proof of Transfer -->
            <form.Field name="bankProofOfPayment" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Proof of Transfer <span class="text-primary">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  @change="(e) => field.handleChange((e.target as HTMLInputElement).files?.[0])"
                  @blur="field.handleBlur"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p class="text-sm text-gray-500 mt-1">
                  Upload screenshot or deposit slip
                </p>
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>
          </div>

          <!-- Cash Payment Details -->
          <div v-if="values.paymentMethod === 'cash'" class="space-y-4 p-4">
            <h3
              class="flex items-center gap-2 text-lg font-semibold text mb-4 -ml-3"
            >
              <BanknotesIcon class="w-5 h-5 text-primary -mr-1 mb-0.5" />Cash
              Payment Details
            </h3>

            <!-- Date of Payment -->
            <form.Field name="cashPaymentDate" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Date of Payment <span class="text-primary">*</span>
                </label>
                <input
                  type="date"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>

            <!-- Staff Member -->
            <form.Field name="cashReceivedBy" v-slot="{ field, state }">
              <div>
                <label class="block text-sm font-medium text2 mb-1">
                  Name of Staff Member Who Received Payment
                  <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  :value="field.state.value"
                  @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="Staff member name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p
                  v-if="state.meta.isTouched && state.meta.errors.length"
                  class="text-primary text-xs mt-1"
                >
                  {{ getErrorMessage(state.meta.errors[0]) }}
                </p>
              </div>
            </form.Field>
          </div>
        </form.Subscribe>
      </div>
    </div>

    <!-- Data Privacy Section -->
    <div class="space-y-6 border-t border-gray-200 pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Data Privacy Agreement</h2>
        <p class="text-subtle">
          Please review and accept our data privacy policy to continue.
        </p>
      </div>

      <div class="space-y-4">
        <div
          class="bg-background border-background rounded-lg p-4 max-h-60 overflow-y-auto"
        >
          <h3 class="font-semibold text mb-2">Privacy Policy</h3>
          <p class="text-sm text-subtle mb-3">
            By submitting this form, you agree to the collection and processing
            of your personal information in accordance with the Data Privacy Act
            of 2012 (Republic Act No. 10173).
          </p>
          <p class="text-sm text-subtle mb-3">
            <strong>Information We Collect:</strong> We collect your personal
            details, academic records, professional information, and contact
            details for the purpose of membership registration and
            communication.
          </p>
          <p class="text-sm text-subtle mb-3">
            <strong>How We Use Your Data:</strong> Your information will be used
            solely for membership management, event notifications, alumni
            networking, and communication purposes.
          </p>
          <p class="text-sm text-subtle mb-3">
            <strong>Data Security:</strong> We implement appropriate security
            measures to protect your personal information from unauthorized
            access, disclosure, or misuse.
          </p>
          <p class="text-sm text-subtle">
            <strong>Your Rights:</strong> You have the right to access, correct,
            or request deletion of your personal data at any time by contacting
            us.
          </p>
        </div>

        <!-- Data Privacy Consent Field -->
        <form.Field name="dataPrivacyConsent" v-slot="{ field, state }">
          <div>
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                :checked="field.state.value"
                @change="(e) => field.handleChange((e.target as HTMLInputElement).checked)"
                @blur="field.handleBlur"
                class="mt-1 w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
              />
              <span class="text-sm text">
                I have read and agree to the
                <a href="#" class="text-primary hover:underline"
                  >Data Privacy Policy</a
                >
                and consent to the collection and processing of my personal
                information.
                <span class="text-primary">*</span>
              </span>
            </label>
            <p
              v-if="state.meta.isTouched && state.meta.errors.length"
              class="text-primary text-xs mt-1 ml-7"
            >
              {{ getErrorMessage(state.meta.errors[0]) }}
            </p>
          </div>
        </form.Field>
      </div>
    </div>

    <!-- Submit Button -->
    <!-- <div class="border-t border-gray-200 pt-8">
      <form.Subscribe v-slot="{ canSubmit, isSubmitting }">
        
        <button
          type="submit"
          :disabled="!canSubmit || isSubmitting"
          class="w-full bg-primary text py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Registration" }}
        </button>
      </form.Subscribe>
    </div> -->
    <div class="border-t border-gray-200 pt-8">
      <form.Subscribe v-slot="{ canSubmit, isSubmitting, isValid, values }">
        <!-- Debug info -->
        <!-- <div
          class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs space-y-1"
        >
          <p><strong>Can Submit:</strong> {{ canSubmit }}</p>
          <p><strong>Is Valid:</strong> {{ isValid }}</p>
          <p><strong>Is Submitting:</strong> {{ isSubmitting }}</p>
          <p class="text-xs text-gray-600 mt-2">
            Check console for form values
          </p>
          <button
            type="button"
            @click="console.log('Form values:', values)"
            class="mt-2 px-3 py-1 bg-blue-100 rounded text-blue-700"
          >
            Log Form Values
          </button>
        </div> -->

        <button
          type="submit"
          :disabled="!canSubmit || isSubmitting"
          class="w-full bg-primary text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Registration" }}
        </button>
      </form.Subscribe>
    </div>
  </form>
</template>
