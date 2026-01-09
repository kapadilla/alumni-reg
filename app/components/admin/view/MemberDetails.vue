<script setup lang="ts">
import type { MemberDetails } from "~/types";
import { format } from "date-fns";

interface Props {
  member: MemberDetails | null;
}

const props = defineProps<Props>();

const activeTab = ref<"personal" | "mentorship" | "membership">("personal");

const tabs = [
  { id: "personal", label: "Personal Details", icon: "material-symbols:person" },
  { id: "mentorship", label: "Mentorship", icon: "material-symbols:school" },
  { id: "membership", label: "Membership & History", icon: "material-symbols:history" },
] as const;

const fullName = computed(() => {
  if (!props.member?.personalDetails) return "";
  const { title, firstName, lastName, suffix } = props.member.personalDetails;
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

// Payment method chip styling
const getPaymentMethodChip = (method: string | undefined) => {
  const lower = (method || "").toLowerCase();
  if (lower === "gcash") {
    return {
      label: "GCash",
      class: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  }
  if (lower === "bank") {
    return {
      label: "Bank",
      class: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
  }
  // Default/cash
  return {
    label: method ? method.charAt(0).toUpperCase() + method.slice(1) : "—",
    class: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };
};

// Format action name to readable phrase
const formatActionName = (action: string) => {
  const actionMap: Record<string, string> = {
    submitted: "Application Submitted",
    alumni_verified: "Alumni Status Verified",
    alumni_verification: "Alumni Verification",
    payment_confirmed: "Payment Confirmed",
    payment_verification: "Payment Verification",
    approved: "Membership Approved",
    rejected: "Application Rejected",
    revoked: "Membership Revoked",
    reinstated: "Membership Reinstated",
  };
  return actionMap[action] || action.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};
</script>

<template>
  <div v-if="member" class="flex flex-col h-full bg-surface">
    <!-- Header Summary -->
    <!-- Header Summary -->
    <div class="p-6 bg-surface border-b border-border shrink-0">
      <!-- Top Row: ID + Info -->
      <div class="flex items-center gap-4 mb-4">
        <div class="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon name="material-symbols:verified-user" class="size-8" />
        </div>
        <div>
          <h4 class="font-semibold text-text text-xl">{{ fullName }}</h4>
          <p class="text-sm text-subtle">{{ member.personalDetails.email }}</p>
        </div>
      </div>

      <!-- Bottom Row: Status + Meta -->
      <div class="flex items-center justify-between pt-4 border-t border-border border-dashed">
        <!-- Status Badge -->
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          :class="member.isActive
            ? 'bg-secondary/10 text-secondary'
            : 'bg-red-500/10 text-red-600 dark:text-red-400'"
        >
          <span
            class="size-2 rounded-full"
            :class="member.isActive ? 'bg-secondary' : 'bg-red-500'"
          />
          {{ member.isActive ? 'Active Member' : 'Revoked' }}
        </div>

        <!-- Member Since -->
        <div class="text-right">
          <span class="text-xs text-subtle">Member since </span>
          <span class="text-sm font-semibold text-text">{{ formatDate(member.memberSince) }}</span>
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
    <div class="p-6 flex-1">
      
      <!-- PERSONAL TAB -->
      <div v-if="activeTab === 'personal'" class="space-y-8 animate-fade-in">
        <section>
          <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Personal Information</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label class="text-xs text-subtle block mb-1">Date of Birth</label><div class="font-medium text-text">{{ formatDate(member.personalDetails.dateOfBirth) }}</div></div>
            <div><label class="text-xs text-subtle block mb-1">Mobile Number</label><div class="font-medium text-text">{{ member.personalDetails.mobileNumber }}</div></div>
            <div class="md:col-span-2 lg:col-span-3"><label class="text-xs text-subtle block mb-1">Address</label><div class="font-medium text-text">{{ member.personalDetails.currentAddress }}, {{ member.personalDetails.city }}, {{ member.personalDetails.province }}</div></div>
          </div>
        </section>
        
        <section>
          <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Academic</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label class="text-xs text-subtle block mb-1">Degree</label><div class="font-medium text-text">{{ member.academicStatus.degreeProgram }}</div></div>
            <div><label class="text-xs text-subtle block mb-1">Year</label><div class="font-medium text-text">{{ member.academicStatus.yearGraduated }}</div></div>
          </div>
        </section>

        <section>
          <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Professional</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label class="text-xs text-subtle block mb-1">Employer</label><div class="font-medium text-text">{{ member.professional.currentEmployer }}</div></div>
            <div><label class="text-xs text-subtle block mb-1">Job Title</label><div class="font-medium text-text">{{ member.professional.jobTitle }}</div></div>
          </div>
        </section>
      </div>

      <!-- MENTORSHIP TAB -->
      <div v-else-if="activeTab === 'mentorship'" class="animate-fade-in">
        <div v-if="member.mentorship && member.mentorship.length > 0" class="space-y-4">
             <div v-for="item in member.mentorship" :key="item.id" class="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                 <div class="flex items-center gap-3">
                     <div class="p-2 rounded-full" :class="item.relation === 'mentor' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'">
                         <Icon :name="item.relation === 'mentor' ? 'material-symbols:school' : 'material-symbols:local-library'" class="size-5" />
                     </div>
                     <div>
                         <p class="font-medium text-text">{{ item.partnerName }}</p>
                         <p class="text-xs text-subtle capitalize">{{ item.relation }} • Since {{ formatDate(item.startDate) }}</p>
                     </div>
                 </div>
                 <span class="px-2 py-0.5 rounded-full text-xs" :class="item.status === 'active' ? 'bg-success/10 text-success' : 'bg-subtle/10 text-subtle'">
                     {{ item.status }}
                 </span>
             </div>
        </div>
        <div v-else class="text-center py-12">
            <div class="inline-flex p-4 rounded-full bg-surface-hover mb-3">
                <Icon name="material-symbols:school-outline" class="size-8 text-subtle" />
            </div>
            <p class="text-text font-medium">No mentorship records found</p>
            <p class="text-subtle text-sm">This member is not currently participating in the mentorship program.</p>
        </div>
      </div>

      <!-- MEMBERSHIP TAB -->
      <div v-else-if="activeTab === 'membership'" class="space-y-8 animate-fade-in">
        <!-- Payment Info (Recap) -->
        <section>
            <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Membership Payment</h5>
            <div class="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                <div class="size-12 rounded-lg bg-surface-hover flex items-center justify-center text-text border border-border">
                    <Icon name="material-symbols:payments" class="size-6" />
                </div>
                <div>
                    <p class="text-xs text-subtle uppercase mb-1">Payment Method</p>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPaymentMethodChip(member.membership.paymentMethod).class"
                    >
                      {{ getPaymentMethodChip(member.membership.paymentMethod).label }}
                    </span>
                </div>
                <div v-if="member.membership.amount" class="ml-auto text-right">
                     <p class="text-xs text-subtle">Amount Paid</p>
                     <p class="font-semibold text-text text-lg">PHP {{ member.membership.amount }}</p>
                </div>
            </div>
        </section>

        <!-- Approval Timeline -->
         <section>
            <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">Membership History</h5>
            <div class="relative space-y-0">
                <div 
                  v-for="(entry, index) in member.history" 
                  :key="index" 
                  class="relative flex gap-4"
                >
                    <!-- Timeline column -->
                    <div class="flex flex-col items-center">
                        <!-- Dot -->
                        <div 
                          class="size-3 rounded-full ring-4 ring-surface shrink-0 mt-1"
                          :class="index === 0 ? 'bg-primary' : 'bg-border'"
                        />
                        <!-- Connecting line -->
                        <div 
                          v-if="index < member.history.length - 1"
                          class="w-0.5 flex-1 bg-border/50 my-1"
                        />
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 pb-6">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                                <p class="font-medium text-text">{{ formatActionName(entry.action) }}</p>
                                <p class="text-sm text-subtle">By <span class="text-text">{{ entry.performedByName }}</span></p>
                                <p v-if="entry.notes" class="mt-2 text-sm text-text/80 bg-background p-2 rounded border border-border italic">
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
