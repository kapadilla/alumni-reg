<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { format } from "date-fns";

interface Props {
  applicant: ApplicantDetails | null;
}

const props = defineProps<Props>();

const fullName = computed(() => {
  if (!props.applicant?.personalDetails) return "";
  const { firstName, middleName, lastName, suffix } =
    props.applicant.personalDetails;
  const middle = middleName ? ` ${middleName}` : "";
  return `${firstName}${middle} ${lastName}${suffix ? " " + suffix : ""}`;
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

// Get payment method display info
const paymentMethodInfo = computed(() => {
  const method = props.applicant?.membership?.paymentMethod?.toLowerCase();
  switch (method) {
    case "gcash":
      return {
        label: "GCash",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        icon: "material-symbols:phone-android",
      };
    case "bank":
      return {
        label: "Bank Transfer",
        color: "bg-green-500/10 text-green-600 dark:text-green-400",
        icon: "material-symbols:account-balance",
      };
    case "cash":
      return {
        label: "Cash",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        icon: "material-symbols:payments",
      };
    default:
      return {
        label: method || "Unknown",
        color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        icon: "material-symbols:help",
      };
  }
});

// Get proof of payment URL based on payment method
const proofOfPaymentUrl = computed(() => {
  const membership = props.applicant?.membership;
  if (!membership) return null;

  const config = useRuntimeConfig();
  const mediaBaseUrl = config.public.mediaBaseUrl as string;

  const method = membership.paymentMethod?.toLowerCase();
  if (method === "gcash" && membership.gcashProofOfPayment) {
    // Handle relative path from API - prepend base URL if needed
    return membership.gcashProofOfPayment.startsWith("http")
      ? membership.gcashProofOfPayment
      : `${mediaBaseUrl}${membership.gcashProofOfPayment}`;
  }
  if (method === "bank" && membership.bankProofOfPayment) {
    return membership.bankProofOfPayment.startsWith("http")
      ? membership.bankProofOfPayment
      : `${mediaBaseUrl}${membership.bankProofOfPayment}`;
  }
  return null; // Cash doesn't have proof
});

// Get reference number based on payment method
const referenceNumber = computed(() => {
  const membership = props.applicant?.membership;
  if (!membership) return null;

  const method = membership.paymentMethod?.toLowerCase();
  if (method === "gcash") return membership.gcashReferenceNumber;
  if (method === "bank") return membership.bankReferenceNumber;
  return null;
});
</script>

<template>
  <div v-if="applicant" class="space-y-8">
    <!-- Header info -->
    <div
      class="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg border border-secondary/10"
    >
      <div
        class="size-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0"
      >
        <Icon name="material-symbols:payments" class="size-6" />
      </div>
      <div>
        <h4 class="font-semibold text-text text-lg">{{ fullName }}</h4>
        <p class="text-sm text-subtle">{{ applicant.personalDetails.email }}</p>
      </div>
      <div class="ml-auto flex flex-col items-end">
        <span class="text-xs text-subtle">Payment Method</span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          :class="paymentMethodInfo.color"
        >
          <Icon :name="paymentMethodInfo.icon" class="size-3.5" />
          {{ paymentMethodInfo.label }}
        </span>
      </div>
    </div>

    <!-- Payment Details - GCash -->
    <section
      v-if="applicant.membership.paymentMethod?.toLowerCase() === 'gcash'"
    >
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        GCash Payment Details
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="applicant.membership.amount">
          <label class="block text-xs text-subtle mb-1">Amount</label>
          <div class="font-medium text-text text-lg">
            {{ formatCurrency(applicant.membership.amount) }}
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1"
            >GCash Reference Number</label
          >
          <div class="font-medium">
            <template v-if="applicant.membership.gcashReferenceNumber">
              <span
                class="font-mono bg-background px-2 py-0.5 rounded inline-block text-text"
                >{{ applicant.membership.gcashReferenceNumber }}</span
              >
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div
          v-if="applicant.membership.paymentNotes"
          class="md:col-span-2 lg:col-span-3"
        >
          <label class="block text-xs text-subtle mb-1">Payment Notes</label>
          <div class="font-medium text-text">
            {{ applicant.membership.paymentNotes }}
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Details - Bank Transfer -->
    <section
      v-else-if="applicant.membership.paymentMethod?.toLowerCase() === 'bank'"
    >
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Bank Transfer Details
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="applicant.membership.amount">
          <label class="block text-xs text-subtle mb-1">Amount</label>
          <div class="font-medium text-text text-lg">
            {{ formatCurrency(applicant.membership.amount) }}
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Bank Name</label>
          <div class="font-medium">
            <template v-if="applicant.membership.bankName">{{
              applicant.membership.bankName
            }}</template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Account Number</label>
          <div class="font-medium">
            <template v-if="applicant.membership.bankAccountNumber">
              <span
                class="font-mono bg-background px-2 py-0.5 rounded inline-block text-text"
                >{{ applicant.membership.bankAccountNumber }}</span
              >
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Reference Number</label>
          <div class="font-medium">
            <template v-if="applicant.membership.bankReferenceNumber">
              <span
                class="font-mono bg-background px-2 py-0.5 rounded inline-block text-text"
                >{{ applicant.membership.bankReferenceNumber }}</span
              >
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Sender Name</label>
          <div class="font-medium">
            <template v-if="applicant.membership.bankSenderName">{{
              applicant.membership.bankSenderName
            }}</template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div
          v-if="applicant.membership.paymentNotes"
          class="md:col-span-2 lg:col-span-3"
        >
          <label class="block text-xs text-subtle mb-1">Payment Notes</label>
          <div class="font-medium text-text">
            {{ applicant.membership.paymentNotes }}
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Details - Cash -->
    <section
      v-else-if="applicant.membership.paymentMethod?.toLowerCase() === 'cash'"
    >
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Cash Payment Details
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="applicant.membership.amount">
          <label class="block text-xs text-subtle mb-1">Amount</label>
          <div class="font-medium text-text text-lg">
            {{ formatCurrency(applicant.membership.amount) }}
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Payment Date</label>
          <div class="font-medium text-text">
            {{ formatDate(applicant.membership.cashPaymentDate ?? undefined) }}
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Received By</label>
          <div class="font-medium">
            <template v-if="applicant.membership.cashReceivedBy">{{
              applicant.membership.cashReceivedBy
            }}</template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div
          v-if="applicant.membership.paymentNotes"
          class="md:col-span-2 lg:col-span-3"
        >
          <label class="block text-xs text-subtle mb-1">Payment Notes</label>
          <div class="font-medium text-text">
            {{ applicant.membership.paymentNotes }}
          </div>
        </div>
      </div>
    </section>

    <!-- Proof of Payment (for GCash and Bank only) -->
    <section
      v-if="
        proofOfPaymentUrl ||
        applicant.membership.paymentMethod?.toLowerCase() !== 'cash'
      "
    >
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Proof of Payment
      </h5>
      <div
        class="bg-background rounded-xl border border-border p-2 overflow-hidden"
      >
        <div v-if="proofOfPaymentUrl" class="relative group cursor-zoom-in">
          <img
            :src="proofOfPaymentUrl"
            alt="Proof of Payment"
            class="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
          <div
            class="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center"
          >
            <a
              :href="proofOfPaymentUrl"
              target="_blank"
              class="text-white text-sm hover:underline flex items-center gap-1"
            >
              <Icon name="material-symbols:open-in-new" class="size-4" />
              Open original
            </a>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-subtle bg-surface-hover/30 rounded-lg border border-dashed border-border"
        >
          <Icon
            name="material-symbols:image-not-supported"
            class="size-12 opacity-50 mb-2"
          />
          <span>No receipt image uploaded</span>
        </div>
      </div>
    </section>

    <!-- Application History -->
    <section v-if="applicant.history?.length">
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Application History
      </h5>
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
              :class="
                entry.action === 'alumni_verified'
                  ? 'bg-green-500'
                  : 'bg-primary/30'
              "
            />
            <div
              v-if="index < (applicant.history?.length ?? 0) - 1"
              class="w-0.5 flex-1 bg-border/50 my-1"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 pb-6">
            <div
              class="flex flex-col sm:flex-row sm:items-start justify-between gap-2"
            >
              <div>
                <p class="font-medium text-text capitalize">
                  {{ entry.action.replace(/_/g, " ") }}
                </p>
                <p class="text-sm text-subtle">
                  <template
                    v-if="entry.performedByName?.toLowerCase() === 'system'"
                  >
                    <span class="text-text">System</span>
                  </template>
                  <template v-else>
                    By
                    <span class="text-text">{{ entry.performedByName }}</span>
                  </template>
                </p>
                <p
                  v-if="entry.notes"
                  class="mt-2 text-sm text-text/80 bg-background p-2 rounded border border-border italic"
                >
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
  <div v-else class="text-center py-12 text-subtle">
    No payment detail available.
  </div>
</template>
