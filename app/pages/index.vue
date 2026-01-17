<!-- <script setup lang="ts">
const formData = ref({
  // Personal Details
  title: "",
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
  // Academic Status
  degreeProgram: "",
  yearGraduated: "",
  studentNumber: "",
  // Professional
  currentEmployer: "",
  jobTitle: "",
  industry: "",
  // Membership
  membershipType: "",
  paymentMethod: "",
  // Data priv
  dataPrivacyConsent: false,
});

const handleSubmit = () => {
  console.log("Form submitted:", formData.value);
  alert("Form submitted successfully!");
};
</script>

<template>
  <div class="min-h-screen bg-background py-4 md:py-8">
    <div class="w-full max-w-4xl mx-auto px-4">
      <div class="bg-surface rounded-2xl border border-border p-2 md:p-8">
        <form @submit.prevent="handleSubmit">
          <RegistrationForm
            :form-data="formData"
            @update:form-data="formData = $event"
          />

          <div
            class="flex justify-end items-center mt-8 pt-8 border-t border-border"
          >
            <button
              type="submit"
              class="px-6 py-2.5 md:px-7 md:py-3 text-sm md:text-base rounded-xl bg-primary text-white hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium group"
            >
              Submit
              <svg
                class="size-4 md:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M5 12h14"
                  class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
                <path
                  d="M13 6l6 6-6 6"
                  class="transition-transform duration-200 group-hover:translate-x-0 -translate-x-1.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> -->
<script setup lang="ts">
useHead({
  title: 'Membership Registration - UP Alumni Association - Cebu Chapter'
})
</script>

<template>
  <div class="min-h-screen bg-background py-4 md:py-8">
    <div class="w-full max-w-4xl mx-auto px-4">
      <div class="bg-surface rounded-2xl border border-border p-2 md:p-8">
        <RegistrationForm />
      </div>
    </div>
  </div>
</template>
