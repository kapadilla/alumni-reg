<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { useForm } from "@tanstack/vue-form";
import {
  MapPinIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/vue/24/solid";

import FormInput from "~/components/form/Input.vue";
import FormSelect from "~/components/form/Select.vue";
import FormCheckbox from "~/components/form/Checkbox.vue";
import FormFileInput from "~/components/form/FileInput.vue";
import FormRadioTileGroup from "~/components/form/RadioTileGroup.vue";
import FormTextarea from "~/components/form/Textarea.vue";
import FormChipGroup from "~/components/form/ChipGroup.vue";

import {
  type LocationOption,
  type RegistrationFormValues,
  registrationFormDefaults,
  registrationSchema,
  fieldSchemas,
  mentorshipAreas,
  industryTracks,
  paymentOptions,
  mentorshipFormatOptions,
  campusOptions,
} from "~/types/registration";
import { handleRegistrationSubmit } from "~/utils/registrationSubmit";

// Helper to extract error message from TanStack Form errors
const getErrorMessage = (errors: unknown[]): string | undefined => {
  if (!errors || errors.length === 0) return undefined;
  const error = errors[0];
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return String(error);
};

// Public form settings
const {
  fetchPublicFormSettings,
  formatMembershipFee,
  getGcashAccounts,
  getBankAccounts,
  getCashPaymentDetails,
  formatOpenDays,
  getMembershipFee,
  getMinimumUnits,
} = usePublicFormSettings();

// Location data from API
const provinces = ref<LocationOption[]>([]);
const cities = ref<LocationOption[]>([]);
const barangays = ref<LocationOption[]>([]);

const loadingProvinces = ref(false);
const loadingCities = ref(false);
const loadingBarangays = ref(false);

// Track selected codes for API lookups (codes are needed to fetch child data)
const selectedProvinceCode = ref("");
const selectedCityCode = ref("");

// Router for navigation
const router = useRouter();

// Initialize TanStack Form
const form = useForm({
  defaultValues: registrationFormDefaults,
  onSubmit: async ({ value }) => {
    // Clean the data before submitting
    const cleanedValue: any = { ...value };

    // If isGraduate is true, remove non-graduate fields
    if (cleanedValue.yearGraduated) {
      delete cleanedValue.unitsThreshold;
      delete cleanedValue.torAttachment;
    }
    console.log(cleanedValue);
    const success = await handleRegistrationSubmit(cleanedValue);
    if (success) {
      router.push("/success");
    }
  },
});

// Custom submit handler that validates with Zod and scrolls to first error
const handleFormSubmit = async () => {
  // Get current form values
  // const value = form.state.values;
  let value: any = { ...form.state.values } as any;

  // If isGraduate is true, remove non-graduate fields from submission
  if (value.yearGraduated) {
    delete value.unitsThreshold;
    delete value.torAttachment;
  }

  // Validate with Zod schema (includes all conditional validation)
  const result = registrationSchema.safeParse(value);

  if (!result.success) {
    // Extract and display validation errors
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    console.error("Validation errors:", errors);

    // Set field-level errors on the form so they display in the UI
    for (const issue of result.error.issues) {
      const fieldName = issue.path[0] as keyof RegistrationFormValues;
      if (fieldName) {
        form.setFieldMeta(fieldName, (meta) => ({
          ...meta,
          errors: [issue.message],
          errorMap: { onChange: issue.message },
          isTouched: true,
        }));
      }
    }

    // Get the first error field path and scroll to it
    const firstErrorPath = result.error.issues[0]?.path[0];
    if (firstErrorPath) {
      const errorElement = document.getElementById(String(firstErrorPath));
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // Focus the element after scrolling
        setTimeout(() => errorElement.focus(), 300);
      }
    }

    // Show error toast with count
    const { toast } = await import("vue-sonner");
    toast.error("Some required fields need your attention. Please review and try again.")
    return;
  }

  // Validation passed - submit the form
  await form.handleSubmit();
};

// Create a dynamic validator for units threshold
const unitsThresholdValidator = {
  onBlur: ({ value }: { value: string }) => {
    if (!value || value.trim() === "") {
      return "Units completed is required";
    }

    const units = parseInt(value);
    const minUnits = getMinimumUnits();

    if (isNaN(units)) {
      return "Please enter a valid number";
    }

    if (units < minUnits) {
      return `Units must be at least ${minUnits}`;
    }

    if (units > 300) {
      return "Units cannot exceed 300";
    }

    return undefined; // No error
  },
};
// Fetch provinces and form settings on mount
onMounted(async () => {
  // Fetch form settings (payment details, membership fee, etc.)
  await fetchPublicFormSettings();

  // Fetch provinces
  try {
    loadingProvinces.value = true;
    const response = await fetch("https://psgc.gitlab.io/api/provinces/");
    const data = await response.json();

    provinces.value = data
      .map((item: any) => ({
        value: item.name, // Store name as value (for form)
        label: item.name,
        code: item.code, // Keep code for API lookups
      }))
      .sort((a: LocationOption, b: LocationOption) =>
        a.label.localeCompare(b.label),
      );
    const cebuCode = getProvinceCode("Cebu");
    if (cebuCode) {
      selectedProvinceCode.value = cebuCode;
    }
  } catch (error) {
    console.error("Error fetching provinces:", error);
  } finally {
    loadingProvinces.value = false;
  }
});

// Helper function to find province code by name
const getProvinceCode = (name: string): string => {
  const province = provinces.value.find((p) => p.value === name);
  return province?.code || "";
};

// Helper function to find city code by name
const getCityCode = (name: string): string => {
  const city = cities.value.find((c) => c.value === name);
  return city?.code || "";
};

// Watch province code changes to fetch cities
watch(selectedProvinceCode, async (newProvinceCode) => {
  // Reset dependent fields
  cities.value = [];
  barangays.value = [];
  selectedCityCode.value = "";
  form.setFieldValue("city", "");
  form.setFieldValue("barangay", "");

  if (!newProvinceCode) {
    return;
  }

  try {
    loadingCities.value = true;
    const response = await fetch(
      `https://psgc.gitlab.io/api/provinces/${newProvinceCode}/cities-municipalities/`,
    );
    const data = await response.json();

    cities.value = data
      .map((item: any) => ({
        value: item.name, // Store name as value (for form)
        label: item.name,
        code: item.code, // Keep code for API lookups
      }))
      .sort((a: LocationOption, b: LocationOption) =>
        a.label.localeCompare(b.label),
      );
  } catch (error) {
    console.error("Error fetching cities:", error);
    cities.value = [];
  } finally {
    loadingCities.value = false;
  }
});

// Watch city code changes to fetch barangays
watch(selectedCityCode, async (newCityCode) => {
  // Reset barangay field
  barangays.value = [];
  form.setFieldValue("barangay", "");

  if (!newCityCode) {
    return;
  }

  try {
    loadingBarangays.value = true;
    const response = await fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${newCityCode}/barangays/`,
    );
    const data = await response.json();

    barangays.value = data
      .map((item: any) => ({
        value: item.name, // Store name as value (for form)
        label: item.name,
        code: item.code, // Keep code for reference
      }))
      .sort((a: LocationOption, b: LocationOption) =>
        a.label.localeCompare(b.label),
      );
  } catch (error) {
    console.error("Error fetching barangays:", error);
    barangays.value = [];
  } finally {
    loadingBarangays.value = false;
  }
});

// Clear non-graduate fields when year graduated is filled
const clearNonGraduateFields = () => {
  form.setFieldValue("unitsThreshold", "");
  form.setFieldValue("torAttachment", null);

  ["unitsThreshold", "torAttachment"].forEach((fieldName) => {
    form.setFieldMeta(fieldName as any, (meta) => ({
      ...meta,
      errors: [],
      errorMap: {},
      isTouched: false,
    }));
  });
};

// Clean reactively when payment method changes (BETTER)
const clearPaymentFields = (method: string) => {
  if (method === "gcash") {
    form.setFieldValue("gcashReferenceNumber", "");
    form.setFieldValue("gcashProofOfPayment", null);
    form.setFieldMeta("gcashReferenceNumber", (meta) => ({
      ...meta,
      errors: [],
      errorMap: {},
      isTouched: false,
    }));
    form.setFieldMeta("gcashProofOfPayment", (meta) => ({
      ...meta,
      errors: [],
      errorMap: {},
      isTouched: false,
    }));
  } else if (method === "bank") {
    form.setFieldValue("bankSenderName", "");
    form.setFieldValue("bankName", "");
    form.setFieldValue("bankAccountNumber", "");
    form.setFieldValue("bankReferenceNumber", "");
    form.setFieldValue("bankProofOfPayment", null);
    [
      "bankSenderName",
      "bankName",
      "bankAccountNumber",
      "bankReferenceNumber",
      "bankProofOfPayment",
    ].forEach((fieldName) => {
      form.setFieldMeta(fieldName as any, (meta) => ({
        ...meta,
        errors: [],
        errorMap: {},
        isTouched: false,
      }));
    });
  } else if (method === "cash") {
    form.setFieldValue("cashPaymentDate", "");
    form.setFieldValue("cashReceivedBy", "");
    ["cashPaymentDate", "cashReceivedBy"].forEach((fieldName) => {
      form.setFieldMeta(fieldName as any, (meta) => ({
        ...meta,
        errors: [],
        errorMap: {},
        isTouched: false,
      }));
    });
  }
};
</script>

<template>
  <form @submit.prevent class="space-y-8 p-1">
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
        <!-- First Name -->
        <form.Field
          name="firstName"
          :validators="{ onBlur: fieldSchemas.firstName }"
          v-slot="{ field, state }"
        >
          <FormInput
            :id="field.name"
            :name="field.name"
            label="First Name"
            hint="As shown in official records"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>

        <!-- Last Name -->
        <form.Field
          name="lastName"
          :validators="{ onBlur: fieldSchemas.lastName }"
          v-slot="{ field, state }"
        >
          <FormInput
            :id="field.name"
            :name="field.name"
            label="Last Name"
            hint="As shown in official records"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>

        <!-- Middle Name -->
        <form.Field name="middleName" v-slot="{ field, state }">
          <FormInput
            :id="field.name"
            :name="field.name"
            label="Middle Name"
            hint="Leave blank if none"
            :required="false"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>

        <!-- Suffix -->
        <form.Field name="suffix" v-slot="{ field, state }">
          <FormInput
            :id="field.name"
            :name="field.name"
            label="Suffix"
            hint="e.g., Jr., Sr., III"
            :required="false"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Maiden Name -->
        <form.Field name="maidenName" v-slot="{ field, state }">
          <div class="sm:col-span-3">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Maiden Name"
              hint="Surname at graduation if different"
              :required="false"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </div>
        </form.Field>

        <!-- Date of Birth -->
        <form.Field
          name="dateOfBirth"
          :validators="{ onBlur: fieldSchemas.dateOfBirth }"
          v-slot="{ field, state }"
        >
          <div class="sm:col-span-1">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Date of Birth"
              type="date"
              hint="MM/DD/YYYY"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </div>
        </form.Field>
      </div>

      <!-- Contact & Location -->
      <div>
        <h3 class="flex items-center gap-2 text-lg font-semibold text mb-4">
          <MapPinIcon class="w-5 h-5 text-primary mb-0.5" />Contact & Location
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <!-- Email -->
            <form.Field
              name="email"
              :validators="{ onBlur: fieldSchemas.email }"
              v-slot="{ field, state }"
            >
              <FormInput
                :id="field.name"
                :name="field.name"
                label="Email Address"
                type="email"
                hint="Use a personal email, not your UP email"
                :model-value="field.state.value"
                :error="
                  state.meta.isTouched
                    ? getErrorMessage(state.meta.errors)
                    : undefined
                "
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </form.Field>

            <!-- Mobile Number -->
            <form.Field
              name="mobileNumber"
              :validators="{ onBlur: fieldSchemas.mobileNumber }"
              v-slot="{ field, state }"
            >
              <FormInput
                :id="field.name"
                :name="field.name"
                label="Mobile Number"
                type="tel"
                hint="09XXXXXXXXX"
                :model-value="field.state.value"
                :error="
                  state.meta.isTouched
                    ? getErrorMessage(state.meta.errors)
                    : undefined
                "
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </form.Field>
          </div>

          <!-- Current Address -->
          <form.Field
            name="currentAddress"
            :validators="{ onBlur: fieldSchemas.currentAddress }"
            v-slot="{ field, state }"
          >
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Current Address"
              hint="Unit, Street, Subdivision"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </form.Field>

          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Province -->
            <form.Field
              name="province"
              :validators="{ onBlur: fieldSchemas.province }"
              v-slot="{ field, state }"
            >
              <FormSelect
                :id="field.name"
                :name="field.name"
                label="Province"
                placeholder="Select Province"
                :options="provinces"
                :loading="loadingProvinces"
                :disabled="true"
                :model-value="field.state.value"
                :error="
                  state.meta.isTouched
                    ? getErrorMessage(state.meta.errors)
                    : undefined
                "
                @update:model-value="
                  (val) => {
                    field.handleChange(val);
                    selectedProvinceCode = getProvinceCode(val);
                  }
                "
                @blur="field.handleBlur"
              />
            </form.Field>

            <!-- City -->
            <form.Field
              name="city"
              :validators="{ onBlur: fieldSchemas.city }"
              v-slot="{ field, state }"
            >
              <FormSelect
                :id="field.name"
                :name="field.name"
                label="City/Municipality"
                placeholder="Select City"
                :options="cities"
                :loading="loadingCities"
                :disabled="cities.length === 0"
                :model-value="field.state.value"
                :error="
                  state.meta.isTouched
                    ? getErrorMessage(state.meta.errors)
                    : undefined
                "
                @update:model-value="
                  (val) => {
                    field.handleChange(val);
                    selectedCityCode = getCityCode(val);
                  }
                "
                @blur="field.handleBlur"
              />
            </form.Field>

            <!-- Barangay -->
            <form.Field
              name="barangay"
              :validators="{ onBlur: fieldSchemas.barangay }"
              v-slot="{ field, state }"
            >
              <FormSelect
                :id="field.name"
                :name="field.name"
                label="Barangay"
                placeholder="Select Barangay"
                :options="barangays"
                :loading="loadingBarangays"
                :disabled="barangays.length === 0"
                :model-value="field.state.value"
                :error="
                  state.meta.isTouched
                    ? getErrorMessage(state.meta.errors)
                    : undefined
                "
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </form.Field>

            <!-- Zip Code -->
            <form.Field
              name="zipCode"
              :validators="{ onBlur: fieldSchemas.zipCode }"
              v-slot="{ field, state }"
            >
              <FormInput
                :id="field.name"
                :name="field.name"
                label="Zip Code"
                maxlength="4"
                :model-value="field.state.value"
                :error="
                  state.meta.isTouched
                    ? getErrorMessage(state.meta.errors)
                    : undefined
                "
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </form.Field>
          </div>
        </div>
      </div>
    </div>

    <!-- Academic Status Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Academic Status</h2>
        <p class="text-subtle">
          Please provide your academic information from UP.
        </p>
      </div>

      <div class="space-y-4">
        <!-- Campus -->
        <form.Field
          name="campus"
          :validators="{ onBlur: fieldSchemas.campus }"
          v-slot="{ field, state }"
        >
          <FormSelect
            :id="field.name"
            :name="field.name"
            label="Campus"
            placeholder="Select Campus"
            :options="campusOptions"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>

        <!-- Degree Program -->
        <form.Field
          name="degreeProgram"
          :validators="{ onBlur: fieldSchemas.degreeProgram }"
          v-slot="{ field, state }"
        >
          <FormInput
            :id="field.name"
            :name="field.name"
            label="Degree Program"
            hint="e.g., BS Computer Science"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>

        <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <!-- Year Graduated -->
          <form.Field
            name="yearGraduated"
            :validators="{ onBlur: fieldSchemas.yearGraduated }"
            v-slot="{ field, state }"
          >
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Year Graduated"
              hint="Leave blank if not yet graduated"
              :required="false"
              maxlength="4"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="
                (val: string) => {
                  field.handleChange(val);
                  if (val) {
                    nextTick(() => {
                      clearNonGraduateFields();
                    });
                  }
                }
              "
              @blur="field.handleBlur"
            />
          </form.Field>

          <!-- Student Number -->
          <form.Field name="studentNumber" v-slot="{ field, state }">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Student Number"
              hint="e.g., 2016-12345"
              :required="false"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </form.Field>
        </div>

        <!-- Additional fields for non-graduates -->
        <form.Subscribe v-slot="{ values }">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2 max-h-0"
            enter-to-class="opacity-100 translate-y-0 max-h-[2000px]"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 max-h-[2000px]"
            leave-to-class="opacity-0 -translate-y-2 max-h-0"
          >
            <div
              v-if="!values.yearGraduated"
              class="mt-4 space-y-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <h4 class="font-semibold text-text flex items-center gap-2">
                <UserIcon class="w-5 h-5 text-primary mb-0.5" />
                Student Information
              </h4>
              <p class="text-sm text-subtle -mt-2">
                If you are not a graduate, please fill in the fields below
              </p>

              <!-- Units Threshold -->
              <form.Field
                name="unitsThreshold"
                :validators="unitsThresholdValidator"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Units Completed"
                  type="number"
                  :min="getMinimumUnits()"
                  :hint="`Minimum ${getMinimumUnits()} units required`"
                  :required="true"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- TOR Attachment -->
              <form.Field
                name="torAttachment"
                :validators="{
                  onChange: fieldSchemas.torAttachment,
                  onBlur: fieldSchemas.torAttachment,
                }"
                v-slot="{ field, state }"
              >
                <FormFileInput
                  :id="field.name"
                  :name="field.name"
                  label="Transcript of Records (TOR)"
                  hint="Upload your latest TOR or grade report"
                  accept="image/*,.pdf"
                  :required="true"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>
            </div>
          </Transition>
        </form.Subscribe>
      </div>
    </div>

    <!-- Professional Information Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Professional Information</h2>
        <p class="text-subtle">
          Tell us about your current professional status.
        </p>
      </div>

      <div class="space-y-4">
        <!-- Row 1: Current Employer and Industry -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Current Employer -->
          <form.Field name="currentEmployer" v-slot="{ field, state }">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Current Employer"
              :required="false"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </form.Field>

          <!-- Industry -->
          <form.Field name="industry" v-slot="{ field, state }">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Industry"
              :required="false"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </form.Field>
        </div>

        <!-- Row 2: Job Title and Years of Experience -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Job Title -->
          <form.Field name="jobTitle" v-slot="{ field, state }">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Job Title"
              :required="false"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </form.Field>

          <!-- Years of Experience -->
          <form.Field name="yearsOfExperience" v-slot="{ field, state }">
            <FormInput
              :id="field.name"
              :name="field.name"
              label="Total years of work experience"
              type="number"
              :required="false"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </form.Field>
        </div>

        <!-- Mentorship Program Section -->
        <div class="pt-4 border-t border-border">
          <h3 class="flex items-center gap-2 text-lg font-semibold text mb-4">
            <AcademicCapIcon class="w-5 h-5 text-primary -mr-1 mb-0.5" />
            Mentorship Program
          </h3>

          <!-- Join Mentorship Program -->
          <form.Field name="joinMentorshipProgram" v-slot="{ field, state }">
            <FormCheckbox
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :error="
                state.meta.isTouched
                  ? getErrorMessage(state.meta.errors)
                  : undefined
              "
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            >
              I am interested in joining the Mentorship Program
            </FormCheckbox>
          </form.Field>

          <!-- Mentorship Details (Show only if checkbox is checked) -->
          <form.Subscribe v-slot="{ values }">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2 max-h-0"
              enter-to-class="opacity-100 translate-y-0 max-h-[2000px]"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 max-h-[2000px]"
              leave-to-class="opacity-0 -translate-y-2 max-h-0"
            >
              <div
                v-if="values.joinMentorshipProgram"
                class="mt-6 space-y-4 background border border-purple-200 rounded-lg p-4 overflow-hidden"
              >
                <h4 class="flex items-center gap-2 font-semibold text mb-3">
                  <SparklesIcon class="w-5 h-5 text-primary" />
                  Mentorship Preferences
                </h4>

                <!-- Mentorship Areas -->
                <form.Field
                  name="mentorshipAreas"
                  :validators="{ onBlur: fieldSchemas.mentorshipAreas }"
                  v-slot="{ field, state }"
                >
                  <form.Field
                    name="mentorshipAreasOther"
                    v-slot="{ field: otherField }"
                  >
                    <FormChipGroup
                      :id="field.name"
                      :name="field.name"
                      label="Areas of Interest"
                      hint="Select all that apply"
                      :required="true"
                      :has-other="true"
                      :options="mentorshipAreas"
                      :model-value="field.state.value"
                      :other-value="otherField.state.value"
                      :error="
                        state.meta.isTouched
                          ? getErrorMessage(state.meta.errors)
                          : undefined
                      "
                      @update:model-value="field.handleChange"
                      @update:other-value="otherField.handleChange"
                      @blur="field.handleBlur"
                    />
                  </form.Field>
                </form.Field>

                <!-- Industry Tracks -->
                <form.Field
                  name="mentorshipIndustryTracks"
                  :validators="{
                    onBlur: fieldSchemas.mentorshipIndustryTracks,
                  }"
                  v-slot="{ field, state }"
                >
                  <form.Field
                    name="mentorshipIndustryTracksOther"
                    v-slot="{ field: otherField }"
                  >
                    <FormChipGroup
                      :id="field.name"
                      :name="field.name"
                      label="Industry Tracks"
                      hint="Select all that apply"
                      :required="true"
                      :has-other="true"
                      :options="industryTracks"
                      :model-value="field.state.value"
                      :other-value="otherField.state.value"
                      :error="
                        state.meta.isTouched
                          ? getErrorMessage(state.meta.errors)
                          : undefined
                      "
                      @update:model-value="field.handleChange"
                      @update:other-value="otherField.handleChange"
                      @blur="field.handleBlur"
                    />
                  </form.Field>
                </form.Field>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Mentorship Format -->
                  <form.Field
                    name="mentorshipFormat"
                    :validators="{ onBlur: fieldSchemas.mentorshipFormat }"
                    v-slot="{ field, state }"
                  >
                    <FormSelect
                      :id="field.name"
                      :name="field.name"
                      label="Preferred Mentorship Format"
                      placeholder="Select format"
                      :required="true"
                      :options="mentorshipFormatOptions"
                      :model-value="field.state.value"
                      :error="
                        state.meta.isTouched
                          ? getErrorMessage(state.meta.errors)
                          : undefined
                      "
                      @update:model-value="field.handleChange"
                      @blur="field.handleBlur"
                    />
                  </form.Field>

                  <!-- Availability -->
                  <form.Field
                    name="mentorshipAvailability"
                    :validators="{
                      onBlur: fieldSchemas.mentorshipAvailability,
                    }"
                    v-slot="{ field, state }"
                  >
                    <FormInput
                      :id="field.name"
                      :name="field.name"
                      label="Availability (hours per month)"
                      type="number"
                      :required="true"
                      :model-value="field.state.value"
                      :error="
                        state.meta.isTouched
                          ? getErrorMessage(state.meta.errors)
                          : undefined
                      "
                      @update:model-value="field.handleChange"
                      @blur="field.handleBlur"
                    />
                  </form.Field>
                </div>
              </div>
            </Transition>
          </form.Subscribe>
        </div>
      </div>
    </div>

    <!-- Membership Section -->
    <div class="space-y-6 border-t border-border pt-8">
      <div>
        <h2 class="text-2xl font-bold text mb-2">Membership</h2>
        <p class="text-subtle">Choose your payment method.</p>
      </div>

      <!-- Membership Fee Display -->
      <div
        class="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-10 rounded-lg bg-primary/10 flex items-center justify-center"
          >
            <Icon
              name="material-symbols:payments"
              class="size-5 text-primary"
            />
          </div>
          <div>
            <p class="text-sm text-subtle">Membership Fee</p>
            <p class="text-xl font-bold text-primary">
              {{ formatMembershipFee(getMembershipFee()) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 1x1 Picture Upload -->
      <div class="space-y-2">
        <form.Field
          name="idPhoto"
          :validators="{
            onChange: fieldSchemas.idPhoto,
            onBlur: fieldSchemas.idPhoto,
          }"
          v-slot="{ field, state }"
        >
          <FormFileInput
            :id="field.name"
            :name="field.name"
            label="1x1 ID Picture"
            hint="Upload a recent 1x1 ID photo for your Alumni ID"
            accept="image/*"
            :required="true"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>
      </div>

      <div class="space-y-4">
        <!-- Payment Method -->
        <form.Field
          name="paymentMethod"
          :validators="{ onBlur: fieldSchemas.paymentMethod }"
          v-slot="{ field, state }"
        >
          <FormRadioTileGroup
            :id="field.name"
            :name="field.name"
            label="Payment Method"
            :options="paymentOptions"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="
              (val) => {
                const oldMethod = field.state.value;
                field.handleChange(val);

                // Clear fields from the old payment method
                if (oldMethod && oldMethod !== val) {
                  clearPaymentFields(oldMethod);
                }
              }
            "
            @blur="field.handleBlur"
          />
        </form.Field>

        <!-- Payment Details based on selected method -->
        <form.Subscribe v-slot="{ values }">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <!-- GCash Payment Details -->
            <div
              v-if="values.paymentMethod === 'gcash'"
              key="gcash"
              class="space-y-4 p-4"
            >
              <h3
                class="flex items-center gap-2 text-lg font-semibold text mb-4"
              >
                <DevicePhoneMobileIcon class="w-5 h-5 text-primary mb-0.5" />
                GCash Payment Details
              </h3>

              <!-- GCash Accounts Info -->
              <div
                v-if="getGcashAccounts().length > 0"
                class="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3"
              >
                <p class="text-sm font-medium text-text">
                  Send payment to any of the following GCash accounts:
                </p>
                <div class="space-y-2">
                  <div
                    v-for="(account, index) in getGcashAccounts()"
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border"
                  >
                    <Icon
                      name="material-symbols:phone-android"
                      class="size-5 text-red-500 shrink-0"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-text truncate">
                        {{ account.name }}
                      </p>
                      <p class="text-sm text-subtle font-mono">
                        {{ account.number }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- GCash Reference Number -->
              <form.Field
                name="gcashReferenceNumber"
                :validators="{ onBlur: fieldSchemas.gcashReferenceNumber }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="GCash Reference Number"
                  hint="13-digit reference number from your GCash transaction"
                  maxlength="13"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- GCash Proof of Payment -->
              <form.Field
                name="gcashProofOfPayment"
                :validators="{
                  onChange: fieldSchemas.gcashProofOfPayment,
                  onBlur: fieldSchemas.gcashProofOfPayment,
                }"
                v-slot="{ field, state }"
              >
                <FormFileInput
                  :id="field.name"
                  :name="field.name"
                  label="Proof of Payment"
                  hint="Upload a screenshot of your GCash transaction"
                  accept="image/*"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>
            </div>

            <!-- Bank Transfer Payment Details -->
            <div
              v-else-if="values.paymentMethod === 'bank'"
              key="bank"
              class="space-y-4 p-4"
            >
              <h3
                class="flex items-center gap-2 text-lg font-semibold text mb-4"
              >
                <BuildingLibraryIcon class="w-5 h-5 text-primary mb-0.5" />
                Bank Transfer Details
              </h3>

              <!-- Bank Accounts Info -->
              <div
                v-if="getBankAccounts().length > 0"
                class="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3"
              >
                <p class="text-sm font-medium text-text">
                  Transfer payment to any of the following bank accounts:
                </p>
                <div class="space-y-2">
                  <div
                    v-for="(account, index) in getBankAccounts()"
                    :key="index"
                    class="p-3 bg-surface rounded-lg border border-border"
                  >
                    <div class="flex items-start gap-3">
                      <Icon
                        name="material-symbols:account-balance"
                        class="size-5 text-green-500 shrink-0 mt-1"
                      />
                      <div class="min-w-0 flex-1 space-y-1">
                        <p class="font-medium text-text">
                          {{ account.bankName }}
                        </p>
                        <p class="text-sm text-subtle">
                          {{ account.accountName }}
                        </p>
                        <p class="text-sm text-subtle font-mono">
                          {{ account.accountNumber }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sender Name -->
              <form.Field
                name="bankSenderName"
                :validators="{ onBlur: fieldSchemas.bankSenderName }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Name of Sender/Account Holder"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- Bank Name -->
              <form.Field
                name="bankName"
                :validators="{ onBlur: fieldSchemas.bankName }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Bank Name"
                  hint="e.g., BDO, BPI, Metrobank"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- Account Number -->
              <form.Field
                name="bankAccountNumber"
                :validators="{ onBlur: fieldSchemas.bankAccountNumber }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Account Number (Last 4 digits)"
                  maxlength="4"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- Reference Number -->
              <form.Field
                name="bankReferenceNumber"
                :validators="{ onBlur: fieldSchemas.bankReferenceNumber }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Reference/Transaction Number"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- Proof of Transfer -->
              <form.Field
                name="bankProofOfPayment"
                :validators="{
                  onChange: fieldSchemas.bankProofOfPayment,
                  onBlur: fieldSchemas.bankProofOfPayment,
                }"
                v-slot="{ field, state }"
              >
                <FormFileInput
                  :id="field.name"
                  :name="field.name"
                  label="Proof of Transfer"
                  hint="Upload screenshot or deposit slip"
                  accept="image/*,.pdf"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>
            </div>

            <!-- Cash Payment Details -->
            <div
              v-else-if="values.paymentMethod === 'cash'"
              key="cash"
              class="space-y-4 p-4"
            >
              <h3
                class="flex items-center gap-2 text-lg font-semibold text mb-4"
              >
                <BanknotesIcon class="w-5 h-5 text-primary mb-0.5" />
                Cash Payment Details
              </h3>

              <!-- Cash Payment Location Info -->
              <div
                v-if="getCashPaymentDetails()"
                class="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 space-y-3"
              >
                <p class="text-sm font-medium text-text">
                  Visit our office to pay in cash:
                </p>
                <div
                  class="p-3 bg-surface rounded-lg border border-border space-y-2"
                >
                  <div
                    v-if="
                      getCashPaymentDetails()?.building ||
                      getCashPaymentDetails()?.office
                    "
                    class="flex items-start gap-3"
                  >
                    <Icon
                      name="material-symbols:location-on"
                      class="size-5 text-amber-500 shrink-0 mt-0.5"
                    />
                    <div>
                      <p
                        v-if="getCashPaymentDetails()?.building"
                        class="font-medium text-text"
                      >
                        {{ getCashPaymentDetails()?.building }}
                      </p>
                      <p
                        v-if="getCashPaymentDetails()?.office"
                        class="text-sm text-subtle"
                      >
                        {{ getCashPaymentDetails()?.office }}
                      </p>
                      <p
                        v-if="getCashPaymentDetails()?.address"
                        class="text-sm text-subtle"
                      >
                        {{ getCashPaymentDetails()?.address }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="getCashPaymentDetails()?.openDays?.length"
                    class="flex items-start gap-3"
                  >
                    <Icon
                      name="material-symbols:calendar-today"
                      class="size-5 text-amber-500 shrink-0 mt-0.5"
                    />
                    <div>
                      <p class="text-sm text-text">
                        {{
                          formatOpenDays(
                            getCashPaymentDetails()?.openDays || [],
                          )
                        }}
                      </p>
                      <p
                        v-if="getCashPaymentDetails()?.openHours"
                        class="text-sm text-subtle"
                      >
                        {{ getCashPaymentDetails()?.openHours }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date of Payment -->
              <form.Field
                name="cashPaymentDate"
                :validators="{ onBlur: fieldSchemas.cashPaymentDate }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Date of Payment"
                  type="date"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>

              <!-- Staff Member -->
              <form.Field
                name="cashReceivedBy"
                :validators="{ onBlur: fieldSchemas.cashReceivedBy }"
                v-slot="{ field, state }"
              >
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Name of Staff Member Who Received Payment"
                  :model-value="field.state.value"
                  :error="
                    state.meta.isTouched
                      ? getErrorMessage(state.meta.errors)
                      : undefined
                  "
                  @update:model-value="field.handleChange"
                  @blur="field.handleBlur"
                />
              </form.Field>
            </div>
          </Transition>
        </form.Subscribe>

        <!-- Payment Notes -->
        <form.Field name="paymentNotes" v-slot="{ field, state }">
          <FormTextarea
            :id="field.name"
            :name="field.name"
            label="Additional Notes"
            hint="Any information to help verify your payment"
            :required="false"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </form.Field>
      </div>
    </div>

    <!-- Data Privacy Section -->
    <div class="space-y-6 border-t border-border pt-8">
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

        <!-- Data Privacy Consent -->
        <form.Field
          name="dataPrivacyConsent"
          :validators="{ onBlur: fieldSchemas.dataPrivacyConsent }"
          v-slot="{ field, state }"
        >
          <FormCheckbox
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :error="
              state.meta.isTouched
                ? getErrorMessage(state.meta.errors)
                : undefined
            "
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          >
            I have read and agree to the
            <a href="#" class="text-primary hover:underline"
              >Data Privacy Policy</a
            >
            and consent to the collection and processing of my personal
            information.
          </FormCheckbox>
        </form.Field>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="border-t border-border pt-8 flex justify-end">
      <form.Subscribe v-slot="{ isSubmitting }">
        <button
          type="button"
          @click="handleFormSubmit"
          :disabled="isSubmitting"
          class="bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Registration" }}
        </button>
      </form.Subscribe>
    </div>
  </form>
</template>
