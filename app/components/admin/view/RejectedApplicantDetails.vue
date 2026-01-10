<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { format } from "date-fns";

interface Props {
  applicant: ApplicantDetails | null;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "close"): void;
}>();

const activeTab = ref<"personal" | "application">("personal");

const tabs = [
  { id: "personal", label: "Personal Details", icon: "material-symbols:person" },
  { id: "application", label: "Application Info", icon: "material-symbols:description" },
] as const;

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

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return dateStr;
  }
};

// Rejection stage badge color
const getStageColor = (stage?: string) => {
    if (!stage) return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
    
    const lowerStage = stage.toLowerCase().replace(/_/g, " ");
    if (lowerStage.includes("alumni verification")) {
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
};

// Format rejection stage string
const formatRejectionStage = (stage?: string) => {
    if (!stage) return 'Rejected';
    // Handle snake_case or existing spaced strings
    return stage
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Get the rejection entry from history
const rejectionEntry = computed(() => {
    return props.applicant?.history.find(h => h.action === "rejected");
});
</script>

<template>
  <div v-if="applicant" class="flex flex-col h-full bg-surface">
    <!-- Header Summary -->
    <div class="p-6 bg-surface border-b border-border shrink-0">
      <!-- Top Row: ID + Info -->
      <div class="flex items-center gap-4 mb-4">
        <div class="size-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
          <Icon name="material-symbols:person-cancel" class="size-8" />
        </div>
        <div>
          <h4 class="font-semibold text-text text-xl">{{ fullName }}</h4>
          <p class="text-sm text-subtle">{{ applicant.personalDetails.email }}</p>
        </div>
      </div>

      <!-- Bottom Row: Status + Meta -->
      <div class="flex items-center justify-between pt-4 border-t border-border border-dashed">
        <!-- Status Badge -->
        <div 
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            :class="getStageColor(applicant.rejectionStage)" 
        >
            <span class="size-2 rounded-full bg-current opacity-75" />
            {{ formatRejectionStage(applicant.rejectionStage) }}
        </div>

        <!-- Rejected Date -->
        <div class="text-right">
          <span class="text-xs text-subtle">Rejected on </span>
          <span class="text-sm font-semibold text-text">
            {{ formatDateTime(applicant.rejectedAt || rejectionEntry?.timestamp) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center px-6 border-b border-border bg-background/50 shrink-0 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
        :class="activeTab === tab.id
          ? 'border-primary text-primary'
          : 'border-transparent text-subtle hover:text-text hover:border-subtle/30'"
      >
        <Icon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-6 flex-1 overflow-y-auto">
      
      <!-- PERSONAL TAB -->
      <div v-if="activeTab === 'personal'" class="space-y-8 animate-fade-in">
        <section>
          <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Personal Information</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label class="text-xs text-subtle block mb-1">Date of Birth</label><div class="font-medium text-text">{{ formatDate(applicant.personalDetails.dateOfBirth) }}</div></div>
            <div><label class="text-xs text-subtle block mb-1">Mobile Number</label><div class="font-medium text-text">{{ applicant.personalDetails.mobileNumber }}</div></div>
            <div class="md:col-span-2 lg:col-span-3"><label class="text-xs text-subtle block mb-1">Address</label><div class="font-medium text-text">{{ applicant.personalDetails.currentAddress }}, {{ applicant.personalDetails.city }}, {{ applicant.personalDetails.province }}</div></div>
          </div>
        </section>
        
        <section>
          <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Academic</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label class="text-xs text-subtle block mb-1">Degree</label><div class="font-medium text-text">{{ applicant.academicStatus.degreeProgram }}</div></div>
            <div><label class="text-xs text-subtle block mb-1">Year</label><div class="font-medium text-text">{{ applicant.academicStatus.yearGraduated }}</div></div>
            <div v-if="applicant.academicStatus.studentNumber"><label class="text-xs text-subtle block mb-1">Student Number</label><div class="font-medium text-text">{{ applicant.academicStatus.studentNumber }}</div></div>
          </div>
        </section>

        <section v-if="applicant.professional.currentEmployer || applicant.professional.jobTitle">
          <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Professional</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label class="text-xs text-subtle block mb-1">Employer</label><div class="font-medium text-text">{{ applicant.professional.currentEmployer }}</div></div>
            <div><label class="text-xs text-subtle block mb-1">Job Title</label><div class="font-medium text-text">{{ applicant.professional.jobTitle }}</div></div>
          </div>
        </section>
      </div>

      <!-- APPLICATION TAB -->
      <div v-else-if="activeTab === 'application'" class="space-y-8 animate-fade-in">
         <!-- Rejection Details -->
         <section>
            <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Rejection Details</h5>
            <div class="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <div class="flex gap-4">
                    <div class="p-2 bg-red-500/10 rounded-lg h-fit text-red-600">
                        <Icon name="material-symbols:error" class="size-5" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-text mb-1">Reason for Rejection</p>
                        <p class="text-sm text-subtle">{{ rejectionEntry?.notes || applicant.reason || 'No reason provided' }}</p>
                        
                        <div class="mt-4 flex flex-wrap gap-4 text-xs text-subtle">
                            <div v-if="rejectionEntry?.performedByName">
                                <span class="font-medium">Rejected by:</span> {{ rejectionEntry.performedByName }}
                            </div>
                            <div>
                                <span class="font-medium">Date:</span> {{ formatDateTime(applicant.rejectedAt || rejectionEntry?.timestamp) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </section>

         <section>
            <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Application History</h5>
            <div class="relative space-y-0">
                <div 
                  v-for="(entry, index) in applicant.history" 
                  :key="index" 
                  class="relative flex gap-4"
                >
                    <!-- Timeline column -->
                    <div class="flex flex-col items-center">
                        <div 
                          class="size-3 rounded-full ring-4 ring-surface shrink-0 mt-1"
                          :class="entry.action === 'rejected' ? 'bg-red-500' : 'bg-primary/30'"
                        />
                        <div 
                          v-if="index < applicant.history.length - 1"
                          class="w-0.5 flex-1 bg-border/50 my-1"
                        />
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 pb-6">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                                <p class="font-medium text-text capitalize">{{ entry.action.replace(/_/g, ' ') }}</p>
                                <p class="text-sm text-subtle">By <span class="text-text">{{ entry.performedByName }}</span></p>
                                <p v-if="entry.notes && entry.action !== 'rejected'" class="mt-2 text-sm text-text/80 bg-background p-2 rounded border border-border italic">
                                    "{{ entry.notes }}"
                                </p>
                            </div>
                            <span class="text-xs text-subtle whitespace-nowrap">
                                {{ formatDateTime(entry.timestamp) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
         </section>
      </div>

    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-border bg-surface shrink-0 flex justify-end">
      <button
        class="px-4 py-2 text-sm font-medium text-text bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
