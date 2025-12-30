<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface FormData {
  // Personal Details
  title: string;
  firstName: string;
  lastName: string;
  suffix: string;
  maidenName: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  currentAddress: string;
  province: string;
  city: string;
  barangay: string;
  zipCode: string;
  // Academic Status
  degreeProgram: string;
  yearGraduated: string;
  studentNumber: string;
  // Professional
  currentEmployer: string;
  jobTitle: string;
  industry: string;
  // Membership
  membershipType: string;
  paymentMethod: string;
  // Data Privacy
  dataPrivacyConsent: boolean;
}

interface LocationOption {
  value: string;
  label: string;
  code?: string;
}

const props = defineProps<{
  formData: FormData;
}>();

const emit = defineEmits<{
  "update:formData": [data: FormData];
}>();

const titleOptions = [
  { value: "Mr.", label: "Mr." },
  { value: "Ms.", label: "Ms." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Dr.", label: "Dr." },
];

const membershipOptions = [
  { value: "regular", label: "Regular Member - ₱500/year" },
  { value: "lifetime", label: "Lifetime Member - ₱5,000" },
];

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
watch(
  () => props.formData.province,
  async (newProvince) => {
    if (!newProvince) {
      cities.value = [];
      barangays.value = [];
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
  }
);

// Watch city changes to fetch barangays
watch(
  () => props.formData.city,
  async (newCity) => {
    if (!newCity) {
      barangays.value = [];
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
  }
);

const updateField = (field: keyof FormData, value: string | boolean) => {
  const updates: Partial<FormData> = { [field]: value };

  // Reset city and barangay when province changes
  if (field === "province") {
    updates.city = "";
    updates.barangay = "";
  }

  // Reset barangay when city changes
  if (field === "city") {
    updates.barangay = "";
  }

  emit("update:formData", { ...props.formData, ...updates });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Personal Information Section -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-text mb-2">Personal Information</h2>
        <p class="text-subtle">
          Please provide your legal identity details as they appear in official
          records.
        </p>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <FormSelect
          id="title"
          label="Title"
          placeholder="Select"
          :model-value="formData.title"
          :options="titleOptions"
          required
          @update:model-value="(val) => updateField('title', val)"
        />
        <FormInput
          id="firstName"
          label="First Name"
          placeholder="Juan"
          :model-value="formData.firstName"
          required
          @update:model-value="(val) => updateField('firstName', val)"
        />
        <FormInput
          id="lastName"
          label="Last Name"
          placeholder="Dela Cruz"
          :model-value="formData.lastName"
          required
          @update:model-value="(val) => updateField('lastName', val)"
        />
        <FormInput
          id="suffix"
          label="Suffix"
          placeholder="Jr."
          :model-value="formData.suffix"
          @update:model-value="(val) => updateField('suffix', val)"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="maidenName"
          label="Maiden Name"
          placeholder="(if applicable)"
          :model-value="formData.maidenName"
          @update:model-value="(val) => updateField('maidenName', val)"
        />
        <FormInput
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          :model-value="formData.dateOfBirth"
          required
          @update:model-value="(val) => updateField('dateOfBirth', val)"
        />
        <p class="text-[14px] text-subtle ml-0.5 -mt-2.5">
          For verifying school records
        </p>
      </div>

      <div class="pt-4">
        <h3
          class="flex items-center gap-2 text-lg font-semibold text-text mb-4"
        >
          <Icon name="material-symbols:location-on" class="text-primary" />
          Contact & Location
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="juandelacruz@gmail.com"
              :model-value="formData.email"
              required
              @update:model-value="(val) => updateField('email', val)"
            />
            <FormInput
              id="mobileNumber"
              label="Mobile Number"
              type="tel"
              placeholder="0917 123 4567"
              :model-value="formData.mobileNumber"
              required
              @update:model-value="(val) => updateField('mobileNumber', val)"
            />
            <p class="text-[14px] text-subtle ml-0.5 -mt-2.5">
              * Please avoid using your up.edu.ph email.
            </p>
          </div>

          <FormInput
            id="currentAddress"
            label="Current Address"
            placeholder="Unit, Street, Subdivision"
            :model-value="formData.currentAddress"
            required
            @update:model-value="(val) => updateField('currentAddress', val)"
          />

          <div class="grid grid-cols-3 gap-4">
            <FormSelect
              id="province"
              placeholder="Select Province"
              :model-value="formData.province"
              :options="provinces"
              required
              @update:model-value="(val) => updateField('province', val)"
            />
            <FormSelect
              id="city"
              placeholder="Select City"
              :model-value="formData.city"
              :options="cities"
              required
              @update:model-value="(val) => updateField('city', val)"
            />
            <FormSelect
              id="barangay"
              placeholder="Select Barangay"
              :model-value="formData.barangay"
              :options="barangays"
              required
              @update:model-value="(val) => updateField('barangay', val)"
            />
            <FormInput
              id="zipCode"
              label="Zip Code"
              placeholder="6000"
              type="number"
              :model-value="formData.zipCode"
              required
              @update:model-value="(val) => updateField('zipCode', val)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Academic Status Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text-text mb-2">Academic Status</h2>
        <p class="text-subtle">
          Please provide your academic information from UP Cebu.
        </p>
      </div>

      <div class="space-y-4">
        <FormInput
          id="degreeProgram"
          label="Degree Program"
          placeholder="e.g., BS Computer Science"
          :model-value="formData.degreeProgram"
          required
          @update:model-value="(val) => updateField('degreeProgram', val)"
        />

        <div class="grid grid-cols-2 gap-4">
          <FormInput
            id="yearGraduated"
            label="Year Graduated"
            type="number"
            placeholder="e.g. 2020"
            :model-value="formData.yearGraduated"
            required
            @update:model-value="(val) => updateField('yearGraduated', val)"
          />
          <FormInput
            id="studentNumber"
            label="Student Number"
            placeholder="e.g. 2016-12345 (optional)"
            :model-value="formData.studentNumber"
            @update:model-value="(val) => updateField('studentNumber', val)"
          />
        </div>
      </div>
    </div>

    <!-- Professional Information Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text-text mb-2">
          Professional Information
        </h2>
        <p class="text-subtle">
          Tell us about your current professional status (optional).
        </p>
      </div>

      <div class="space-y-4">
        <FormInput
          id="currentEmployer"
          label="Current Employer"
          placeholder="Company Name"
          :model-value="formData.currentEmployer"
          @update:model-value="(val) => updateField('currentEmployer', val)"
        />

        <div class="grid grid-cols-2 gap-4">
          <FormInput
            id="jobTitle"
            label="Job Title"
            placeholder="Software Engineer"
            :model-value="formData.jobTitle"
            @update:model-value="(val) => updateField('jobTitle', val)"
          />
          <FormInput
            id="industry"
            label="Industry"
            placeholder="Technology"
            :model-value="formData.industry"
            @update:model-value="(val) => updateField('industry', val)"
          />
        </div>
      </div>
    </div>

    <!-- Membership Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text-text mb-2">Membership</h2>
        <p class="text-subtle">
          Choose your membership type and payment method.
        </p>
      </div>

      <div class="space-y-4">
        <FormSelect
          id="membershipType"
          label="Membership Type"
          placeholder="Select membership type"
          :model-value="formData.membershipType"
          :options="membershipOptions"
          required
          @update:model-value="(val) => updateField('membershipType', val)"
        />

        <FormSelect
          id="paymentMethod"
          label="Payment Method"
          placeholder="Select payment method"
          :model-value="formData.paymentMethod"
          :options="paymentOptions"
          required
          @update:model-value="(val) => updateField('paymentMethod', val)"
        />
      </div>
    </div>
    <!-- Data Privacy Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text-text mb-2">
          Data Privacy Agreement
        </h2>
        <p class="text-subtle">
          Please review and accept our data privacy policy to continue.
        </p>
      </div>

      <div class="space-y-4">
        <div
          class="bg-surface border border-border rounded-lg p-4 max-h-60 overflow-y-auto"
        >
          <h3 class="font-semibold text-text mb-2">Privacy Policy</h3>
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

        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="formData.dataPrivacyConsent"
            @change="(e) => updateField('dataPrivacyConsent', (e.target as HTMLInputElement).checked)"
            class="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
            required
          />
          <span class="text-sm text-text">
            I have read and agree to the
            <a href="#" class="text-primary hover:underline"
              >Data Privacy Policy</a
            >
            and consent to the collection and processing of my personal
            information.
            <span class="text-red-500">*</span>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
