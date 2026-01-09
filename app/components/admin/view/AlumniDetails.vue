<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { format } from "date-fns";

interface Props {
  applicant: ApplicantDetails | null;
}

const props = defineProps<Props>();

const fullName = computed(() => {
  if (!props.applicant?.personalDetails) return "";
  const { title, firstName, lastName, suffix } = props.applicant.personalDetails;
  return `${title} ${firstName} ${lastName}${suffix ? " " + suffix : ""}`;
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "MMMM d, yyyy");
  } catch {
    return dateStr;
  }
};
</script>

<template>
  <div v-if="applicant" class="space-y-8">
    <!-- Header info -->
    <div class="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
      <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon name="material-symbols:person" class="size-6" />
      </div>
      <div>
        <h4 class="font-semibold text-text text-lg">{{ fullName }}</h4>
        <p class="text-sm text-subtle">{{ applicant.personalDetails.email }}</p>
      </div>
      <div class="ml-auto flex flex-col items-end">
        <span class="text-xs text-subtle">Date Applied</span>
        <span class="font-medium text-text">{{ formatDate(applicant.dateApplied) }}</span>
      </div>
    </div>

    <!-- Personal details -->
    <section>
      <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">
        Personal Details
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Date of Birth</label>
          <div class="font-medium text-text">{{ formatDate(applicant.personalDetails.dateOfBirth) }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Mobile Number</label>
          <div class="font-medium text-text">{{ applicant.personalDetails.mobileNumber || "N/A" }}</div>
        </div>
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-xs text-subtle mb-1">Current Address</label>
          <div class="font-medium text-text">
            {{ applicant.personalDetails.currentAddress }}, {{ applicant.personalDetails.barangay }},
            {{ applicant.personalDetails.city }}, {{ applicant.personalDetails.province }}
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Status -->
    <section>
      <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">
        Academic Information
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Degree Program</label>
          <div class="font-medium text-text">{{ applicant.academicStatus.degreeProgram }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Year Graduated</label>
          <div class="font-medium text-text">{{ applicant.academicStatus.yearGraduated }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Student Number</label>
          <div class="font-medium text-text font-mono bg-background px-2 py-0.5 rounded inline-block">
            {{ applicant.academicStatus.studentNumber || "N/A" }}
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Status -->
    <section>
      <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">
        Professional Information
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Current Employer</label>
          <div class="font-medium text-text">{{ applicant.professional.currentEmployer || "N/A" }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Job Title</label>
          <div class="font-medium text-text">{{ applicant.professional.jobTitle || "N/A" }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Industry</label>
          <div class="font-medium text-text">{{ applicant.professional.industry || "N/A" }}</div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="text-center py-12 text-subtle">
    No applicant details available.
  </div>
</template>
