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
    return format(new Date(dateStr), "MMMM d, yyyy h:mm a");
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};
</script>

<template>
  <div v-if="applicant" class="space-y-8">
    <!-- Header info -->
    <div class="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
      <div class="size-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
        <Icon name="material-symbols:payments" class="size-6" />
      </div>
      <div>
        <h4 class="font-semibold text-text text-lg">{{ fullName }}</h4>
        <p class="text-sm text-subtle">{{ applicant.personalDetails.email }}</p>
      </div>
      <div class="ml-auto flex flex-col items-end">
        <span class="text-xs text-subtle">Payment Method</span>
        <span class="font-medium text-text uppercase">{{ applicant.membership.paymentMethod || "N/A" }}</span>
      </div>
    </div>

    <!-- Payment Details -->
    <section>
      <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">
        Payment Details
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Total Amount</label>
          <div class="font-medium text-text text-lg">{{ formatCurrency(applicant.membership.amount) }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Transaction Ref / ID</label>
          <div class="font-medium text-text font-mono">{{ applicant.membership.referenceNumber || "N/A" }}</div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Date Paid</label>
          <div class="font-medium text-text">{{ formatDate(applicant.membership.paymentDate) }}</div>
        </div>
      </div>
    </section>

    <!-- Proof of Payment -->
    <section>
      <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">
        Proof of Payment
      </h5>
      <div class="bg-background rounded-xl border border-border p-2 overflow-hidden">
        <div v-if="applicant.membership.receiptUrl" class="relative group cursor-zoom-in">
             <!-- Using standard img tag for now as NuxtImg might require config, flexible fallback -->
          <img
            :src="applicant.membership.receiptUrl"
            alt="Proof of Payment"
            class="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
          <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
            <a :href="applicant.membership.receiptUrl" target="_blank" class="text-white text-sm hover:underline flex items-center gap-1">
                <Icon name="material-symbols:open-in-new" class="size-4" />
                Open original
            </a>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-subtle bg-surface-hover/30 rounded-lg border border-dashed border-border">
          <Icon name="material-symbols:image-not-supported" class="size-12 opacity-50 mb-2" />
          <span>No receipt image uploaded</span>
        </div>
      </div>
    </section>

    <!-- History Notes (if any) -->
    <section v-if="applicant.history && applicant.history.length > 0">
         <h5 class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2">
            Verification History
         </h5>
         <div class="flex flex-col gap-3">
             <div v-for="entry in applicant.history" :key="entry.id" class="flex gap-3 text-sm">
                 <div class="text-subtle min-w-[140px]">{{ formatDate(entry.timestamp) }}</div>
                 <div>
                     <span class="font-medium text-text">{{ entry.performedByName }}</span>
                     <span class="text-subtle"> {{ entry.action }}</span>
                     <p v-if="entry.notes" class="text-subtle italic mt-0.5">"{{ entry.notes }}"</p>
                 </div>
             </div>
         </div>
    </section>
  </div>
  <div v-else class="text-center py-12 text-subtle">
    No payment detail available.
  </div>
</template>
