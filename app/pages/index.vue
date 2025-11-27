<script setup lang="ts">
const currentStep = ref(0);

// Form data for each step
const personalDetails = ref({
  title: "",
  firstName: "",
  lastName: "",
  suffix: "",
  maidenName: "",
  dateOfBirth: "",
  email: "",
  mobileNumber: "",
  currentAddress: "",
  province: "",
  city: "",
  barangay: "",
});

const academicStatus = ref({
  degreeProgram: "",
  yearGraduated: "",
  studentNumber: "",
});

const professional = ref({
  currentEmployer: "",
  jobTitle: "",
  industry: "",
});

const membership = ref({
  membershipType: "",
  paymentMethod: "",
});

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleSubmit = () => {
  const formData = {
    personalDetails: personalDetails.value,
    academicStatus: academicStatus.value,
    professional: professional.value,
    membership: membership.value,
  };

  console.log("Form submitted:", formData);
  alert("Form submitted successfully!");
};
</script>

<template>
  <div class="min-h-screen bg-background py-4 md:py-8">
    <div class="w-full max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        <!-- Sidebar with steps -->
        <aside class="w-full lg:col-span-3">
          <div
            class="w-full bg-surface rounded-xl border border-border p-2 md:p-6 lg:sticky lg:top-8"
          >
            <div
              class="flex lg:flex-col flex-row flex-wrap lg:flex-nowrap justify-evenly lg:justify-start items-center lg:items-start gap-2 lg:gap-0 lg:space-y-0 px-0 lg:px-2"
            >
              <FormStepIndicator
                step-label="STEP 01"
                title="Personal Details"
                icon="material-symbols:person"
                :is-active="currentStep === 0"
                :is-completed="currentStep > 0"
                :is-last="false"
              />
              <FormStepIndicator
                step-label="STEP 02"
                title="Academic Status"
                icon="material-symbols:school"
                :is-active="currentStep === 1"
                :is-completed="currentStep > 1"
                :is-last="false"
              />
              <FormStepIndicator
                step-label="STEP 03"
                title="Professional"
                icon="material-symbols:work"
                :is-active="currentStep === 2"
                :is-completed="currentStep > 2"
                :is-last="false"
              />
              <FormStepIndicator
                step-label="STEP 04"
                title="Membership"
                icon="material-symbols:badge"
                :is-active="currentStep === 3"
                :is-completed="currentStep > 3"
                :is-last="true"
              />
            </div>
          </div>
        </aside>

        <!-- Main form area -->
        <main class="lg:col-span-9">
          <div class="bg-surface rounded-2xl border border-border p-2 md:p-8">
            <form @submit.prevent="handleSubmit">
              <PersonalDetailsStep
                v-if="currentStep === 0"
                :form-data="personalDetails"
                @update:form-data="personalDetails = $event"
              />
              <AcademicStatusStep
                v-if="currentStep === 1"
                :form-data="academicStatus"
                @update:form-data="academicStatus = $event"
              />
              <ProfessionalStep
                v-if="currentStep === 2"
                :form-data="professional"
                @update:form-data="professional = $event"
              />
              <MembershipStep
                v-if="currentStep === 3"
                :form-data="membership"
                @update:form-data="membership = $event"
              />

              <div
                class="flex justify-between items-center mt-8 pt-8 border-t border-border"
              >
                <button
                  v-if="currentStep > 0"
                  type="button"
                  class="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-lg border border-border text-text hover:bg-background transition-colors font-medium"
                  @click="previousStep"
                >
                  Previous
                </button>
                <div v-else />

                <button
                  v-if="currentStep < 3"
                  type="button"
                  class="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-xl bg-primary text-white hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium group"
                  @click="nextStep"
                >
                  Next Step
                  <Icon
                    name="material-symbols:arrow-forward"
                    class="size-4 md:size-5 transition-transform group-hover:translate-x-1"
                  />
                </button>
                <button
                  v-else
                  type="submit"
                  class="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-xl bg-primary text-white hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium group"
                >
                  Submit
                  <Icon
                    name="material-symbols:arrow-forward"
                    class="size-4 md:size-5 transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
