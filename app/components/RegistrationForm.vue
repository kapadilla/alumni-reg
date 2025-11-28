<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { toast } from "vue-sonner";
import {
  personalDetailsSchema,
  academicStatusSchema,
  professionalSchema,
  membershipSchema,
  type PersonalDetailsData,
  type AcademicStatusData,
  type ProfessionalData,
  type MembershipData,
} from "~/utils/schemas";

const currentStep = ref(0);
const slideDirection = ref<"forward" | "back">("forward");
const showReviewModal = ref(false);
const dialogRef = ref<HTMLDialogElement>();
const isClosing = ref(false);

// Define form with TanStack Form
const form = useForm({
  defaultValues: {
    personalDetails: {
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
    } as PersonalDetailsData,
    academicStatus: {
      degreeProgram: "",
      yearGraduated: "",
      studentNumber: "",
    } as AcademicStatusData,
    professional: {
      currentEmployer: "",
      jobTitle: "",
      industry: "",
    } as ProfessionalData,
    membership: {
      membershipType: "",
      paymentMethod: "",
    } as MembershipData,
  },
  onSubmit: async ({ value }) => {
    console.log("Form submitted:", value);
    closeReviewModal();
    // Navigate to success page
    await navigateTo("/success");
  },
});

const openReviewModal = async () => {
  if (isCurrentStepValid.value) {
    showReviewModal.value = true;
    await nextTick();
    dialogRef.value?.showModal();
  } else {
    await triggerStepValidation();
  }
};

const closeReviewModal = () => {
  isClosing.value = true;
  setTimeout(() => {
    dialogRef.value?.close();
    showReviewModal.value = false;
    isClosing.value = false;
  }, 120); // Match animation duration
};

// Step validation schemas
const stepSchemas = [
  personalDetailsSchema,
  academicStatusSchema,
  professionalSchema,
  membershipSchema,
] as const;

// Step field prefixes
const stepPrefixes = [
  "personalDetails",
  "academicStatus",
  "professional",
  "membership",
] as const;

// Check if current step is valid using form.useStore for reactivity
const formValues = form.useStore((state) => state.values);

const isCurrentStepValid = computed(() => {
  const currentPrefix = stepPrefixes[currentStep.value];
  const currentSchema = stepSchemas[currentStep.value];

  if (!currentPrefix || !currentSchema) return false;

  const stepData = formValues.value[currentPrefix];
  const result = currentSchema.safeParse(stepData);

  return result.success;
});

// Track if user attempted to proceed (for showing validation errors)
const attemptedNextStep = ref(false);

// Step names for toast messages
const stepNames = [
  "Personal Details",
  "Academic Status",
  "Professional Information",
  "Membership",
];

const triggerStepValidation = async () => {
  // Trigger blur on all fields to show validation errors
  attemptedNextStep.value = true;

  // Use form.validate to trigger all field validations
  await form.validate("blur");

  // Count errors in current step
  const currentPrefix = stepPrefixes[currentStep.value];
  const currentSchema = stepSchemas[currentStep.value];

  if (currentPrefix && currentSchema) {
    const stepData = formValues.value[currentPrefix];
    const result = currentSchema.safeParse(stepData);
    console.log("Validation result:", result); // Debug log
    if (!result.success) {
      const errorCount = result.error.issues.length;
      console.log("Showing error toast with", errorCount, "errors"); // Debug log
      toast.error("Please complete all required fields", {
        description: `${errorCount} field${errorCount > 1 ? "s" : ""} in ${
          stepNames[currentStep.value]
        } need${errorCount === 1 ? "s" : ""} your attention.`,
      });
    }
  }

  // Scroll to first error field after a short delay to let DOM update
  await nextTick();
  const firstErrorElement = document.querySelector(".border-red-500");
  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus the input for better UX
    const input = firstErrorElement.querySelector(
      "input, select"
    ) as HTMLElement;
    if (input) input.focus();
  }
};

const nextStep = async () => {
  if (currentStep.value < 3) {
    if (isCurrentStepValid.value) {
      attemptedNextStep.value = false;
      slideDirection.value = "forward";
      currentStep.value++;
      nextTick(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else {
      // Trigger validation and scroll to errors
      await triggerStepValidation();
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    slideDirection.value = "back";
    currentStep.value--;
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-start">
    <!-- Sidebar with steps -->
    <aside
      class="w-full lg:col-span-3 pb-4 lg:pb-0 mb-4 lg:mb-0 border-b lg:border-b-0 border-border"
    >
      <div class="w-full px-0 py-2 md:p-6 lg:sticky lg:top-8">
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
    <main class="lg:col-span-9 h-fit">
      <div
        class="lg:bg-surface lg:rounded-2xl lg:border lg:border-border p-0 md:p-8 h-fit"
      >
        <form @submit.prevent.stop="form.handleSubmit">
          <Transition
            :name="slideDirection === 'forward' ? 'slide-left' : 'slide-right'"
            mode="out-in"
          >
            <FormStepsPersonalDetailsStep
              v-if="currentStep === 0"
              :form="form"
            />
            <FormStepsAcademicStatusStep
              v-else-if="currentStep === 1"
              :form="form"
            />
            <FormStepsProfessionalStep
              v-else-if="currentStep === 2"
              :form="form"
            />
            <FormStepsMembershipStep
              v-else-if="currentStep === 3"
              :form="form"
            />
          </Transition>

          <div
            class="flex justify-between items-center mt-8 pt-6 border-t border-border"
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
              class="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-xl bg-primary text-white transition-colors flex items-center gap-2 font-medium group"
              @click="nextStep"
            >
              Next Step
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

            <form.Subscribe v-else>
              <template #default="{ isSubmitting }">
                <button
                  type="button"
                  class="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-xl bg-primary text-white transition-colors flex items-center gap-2 font-medium group"
                  :disabled="isSubmitting"
                  @click="openReviewModal"
                >
                  Review & Submit
                  <Icon
                    name="material-symbols:visibility"
                    class="size-4 md:size-5"
                  />
                </button>
              </template>
            </form.Subscribe>
          </div>
        </form>
      </div>
    </main>
  </div>

  <!-- Review Modal -->
  <Teleport to="body">
    <dialog
      v-if="showReviewModal"
      ref="dialogRef"
      :class="[
        'modal-dialog bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 backdrop:bg-black/50',
        { 'modal-closing': isClosing },
      ]"
      @close="closeReviewModal"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-border shrink-0"
      >
        <h2 class="text-xl font-bold text-text">Review Your Information</h2>
        <button
          type="button"
          class="size-9 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-300"
          @click="closeReviewModal"
        >
          <Icon name="material-symbols:close" class="size-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-6">
        <!-- Personal Details -->
        <div>
          <h3
            class="text-sm font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <Icon name="material-symbols:person" class="size-4" />
            Personal Details
          </h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-subtle">Title</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.title || "—" }}
            </div>
            <div class="text-subtle">First Name</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.firstName || "—" }}
            </div>
            <div class="text-subtle">Last Name</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.lastName || "—" }}
            </div>
            <div class="text-subtle">Suffix</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.suffix || "—" }}
            </div>
            <div class="text-subtle">Maiden Name</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.maidenName || "—" }}
            </div>
            <div class="text-subtle">Date of Birth</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.dateOfBirth || "—" }}
            </div>
            <div class="text-subtle">Email</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.email || "—" }}
            </div>
            <div class="text-subtle">Mobile Number</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.mobileNumber || "—" }}
            </div>
            <div class="text-subtle">Current Address</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.currentAddress || "—" }}
            </div>
            <div class="text-subtle">Province</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.province || "—" }}
            </div>
            <div class="text-subtle">City</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.city || "—" }}
            </div>
            <div class="text-subtle">Barangay</div>
            <div class="text-text font-medium">
              {{ formValues.personalDetails.barangay || "—" }}
            </div>
          </div>
        </div>

        <!-- Academic Status -->
        <div>
          <h3
            class="text-sm font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <Icon name="material-symbols:school" class="size-4" />
            Academic Status
          </h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-subtle">Degree Program</div>
            <div class="text-text font-medium">
              {{ formValues.academicStatus.degreeProgram || "—" }}
            </div>
            <div class="text-subtle">Year Graduated</div>
            <div class="text-text font-medium">
              {{ formValues.academicStatus.yearGraduated || "—" }}
            </div>
            <div class="text-subtle">Student Number</div>
            <div class="text-text font-medium">
              {{ formValues.academicStatus.studentNumber || "—" }}
            </div>
          </div>
        </div>

        <!-- Professional -->
        <div>
          <h3
            class="text-sm font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <Icon name="material-symbols:work" class="size-4" />
            Professional
          </h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-subtle">Current Employer</div>
            <div class="text-text font-medium">
              {{ formValues.professional.currentEmployer || "—" }}
            </div>
            <div class="text-subtle">Job Title</div>
            <div class="text-text font-medium">
              {{ formValues.professional.jobTitle || "—" }}
            </div>
            <div class="text-subtle">Industry</div>
            <div class="text-text font-medium">
              {{ formValues.professional.industry || "—" }}
            </div>
          </div>
        </div>

        <!-- Membership -->
        <div>
          <h3
            class="text-sm font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-2"
          >
            <Icon name="material-symbols:badge" class="size-4" />
            Membership
          </h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-subtle">Membership Type</div>
            <div class="text-text font-medium">
              {{ formValues.membership.membershipType || "—" }}
            </div>
            <div class="text-subtle">Payment Method</div>
            <div class="text-text font-medium">
              {{ formValues.membership.paymentMethod || "—" }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-end gap-3 p-6 border-t border-border shrink-0 bg-background/50"
      >
        <button
          type="button"
          class="px-5 py-2.5 text-sm rounded-lg border border-border text-text hover:bg-background transition-colors font-medium"
          @click="closeReviewModal"
        >
          Cancel
        </button>
        <form.Subscribe>
          <template #default="{ isSubmitting }">
            <button
              type="button"
              class="px-5 py-2.5 text-sm rounded-xl bg-primary text-white transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
              :disabled="isSubmitting"
              @click="form.handleSubmit"
            >
              <span v-if="isSubmitting">Submitting...</span>
              <template v-else>
                Submit Registration
                <Icon name="material-symbols:check" class="size-4" />
              </template>
            </button>
          </template>
        </form.Subscribe>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
/* Slide left (forward navigation) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide right (back navigation) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Modal dialog animations */
.modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-dialog.modal-closing {
  animation: slideDown 0.12s cubic-bezier(0.4, 0, 1, 1) forwards;
}

.modal-dialog[open]::backdrop {
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, calc(-50% + 100vh));
  }
  to {
    transform: translate(-50%, -50%);
  }
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -50%);
  }
  to {
    transform: translate(-50%, calc(-50% + 100vh));
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
