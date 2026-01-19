<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import type {
  FormSettings,
  GcashAccount,
  BankAccount,
  CashPaymentDetails,
} from "~/types";
import FormInput from "~/components/form/Input.vue";
import FormTextarea from "~/components/form/Textarea.vue";
import FormChipGroup from "~/components/form/ChipGroup.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Form Settings - UP Alumni Association - Cebu Chapter",
});

const { isOnline } = useNetworkStatus();

// Days of the week options for chip group
const daysOfWeek = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

// Form composable
const {
  loading,
  saving,
  fetchSettings,
  saveSettings,
  createEmptyGcashAccount,
  createEmptyBankAccount,
  defaultFormSettings,
} = useFormSettings();

// Initialize TanStack Form with default values from composable
const form = useForm({
  defaultValues: {
    membershipFee: defaultFormSettings.membershipFee,
    gcashAccounts: defaultFormSettings.paymentSettings
      .gcashAccounts as GcashAccount[],
    bankAccounts: defaultFormSettings.paymentSettings
      .bankAccounts as BankAccount[],
    cashPayment: {
      ...defaultFormSettings.paymentSettings.cashPayment,
    } as CashPaymentDetails,
    successMessage: defaultFormSettings.successMessage,
  },
  onSubmit: async ({ value }) => {
    // Construct complete FormSettings object
    // The saveSettings function will normalize this before sending to API
    const settings: FormSettings = {
      membershipFee: value.membershipFee,
      paymentSettings: {
        gcashAccounts: value.gcashAccounts,
        bankAccounts: value.bankAccounts,
        cashPayment: {
          address: value.cashPayment.address ?? "",
          building: value.cashPayment.building ?? "",
          office: value.cashPayment.office ?? "",
          openDays: value.cashPayment.openDays ?? [],
          openHours: value.cashPayment.openHours ?? "",
        },
      },
      successMessage: value.successMessage ?? "",
    };

    const success = await saveSettings(settings);
    const { toast } = await import("vue-sonner");
    if (success) {
      toast.success("Form settings saved successfully!");
    } else {
      toast.error("Failed to save form settings. Please try again.");
    }
  },
});

// Load settings on mount
onMounted(async () => {
  const settings = await fetchSettings();
  // Settings will always be properly normalized by the composable
  form.setFieldValue("membershipFee", settings.membershipFee);
  form.setFieldValue("gcashAccounts", settings.paymentSettings.gcashAccounts);
  form.setFieldValue("bankAccounts", settings.paymentSettings.bankAccounts);
  form.setFieldValue("cashPayment", settings.paymentSettings.cashPayment);
  form.setFieldValue("successMessage", settings.successMessage);
});

// Handle form submission
const handleSubmit = async (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  await form.handleSubmit();
};
</script>

<template>
  <div class="py-4 md:py-8">
    <div class="w-full max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
          Form Settings
        </h1>
        <p class="text-subtle text-sm md:text-base">
          Configure registration form parameters and payment details
        </p>
      </div>

      <!-- Offline Warning -->
      <div
        v-if="!isOnline"
        class="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3"
      >
        <Icon
          name="material-symbols:wifi-off"
          class="size-5 text-amber-500 shrink-0"
        />
        <p class="text-sm text-amber-600 dark:text-amber-400">
          You are currently offline. Changes cannot be saved until connection is
          restored.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-surface rounded-xl border border-border p-6 animate-pulse"
        >
          <div class="h-6 bg-background rounded w-1/3 mb-4" />
          <div class="space-y-3">
            <div class="h-10 bg-background rounded w-full" />
            <div class="h-10 bg-background rounded w-2/3" />
          </div>
        </div>
      </div>

      <!-- Form -->
      <form v-else class="space-y-6" @submit="handleSubmit">
        <!-- Membership Fee Section -->
        <div class="bg-surface rounded-xl border border-border overflow-hidden">
          <div class="p-4 md:p-6 border-b border-border">
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
                <h2 class="text-lg font-semibold text-text">Membership Fee</h2>
                <p class="text-sm text-subtle">
                  Set the lifetime membership fee amount
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 md:p-6">
            <form.Field v-slot="{ field }" name="membershipFee">
              <div class="flex flex-col gap-1">
                <label
                  :for="field.name"
                  class="text-base font-medium text-text"
                >
                  Amount
                </label>
                <p class="text-sm text-subtle">
                  The amount required for lifetime membership
                </p>
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-subtle font-medium"
                  >
                    Php
                  </span>
                  <input
                    :id="field.name"
                    :name="field.name"
                    type="number"
                    min="0"
                    step="0.01"
                    :value="field.state.value"
                    class="w-full pl-12 pr-4 py-2.5 border-2 border-border rounded-lg bg-surface text-text focus:outline-none focus:border-primary transition-colors"
                    @input="
                      field.handleChange(
                        Number(($event.target as HTMLInputElement).value) || 0,
                      )
                    "
                  />
                </div>
              </div>
            </form.Field>
          </div>
        </div>

        <!-- GCash Payment Section -->
        <div class="bg-surface rounded-xl border border-border overflow-hidden">
          <div class="p-4 md:p-6 border-b border-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:phone-android"
                    class="size-5 text-blue-500"
                  />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-text">
                    GCash Payment Details
                  </h2>
                  <p class="text-sm text-subtle">
                    GCash accounts where members can send payment
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 md:p-6">
            <form.Field v-slot="{ field }" name="gcashAccounts">
              <div class="space-y-4">
                <!-- GCash Account Cards -->
                <div
                  v-for="(_, index) in field.state.value"
                  :key="index"
                  class="relative p-4 bg-background rounded-lg border border-border"
                >
                  <!-- Remove Button -->
                  <button
                    type="button"
                    class="absolute top-2 right-2 p-1.5 text-subtle hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove account"
                    @click="field.removeValue(index)"
                  >
                    <Icon name="material-symbols:close" class="size-4" />
                  </button>

                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8 md:pr-0"
                  >
                    <!-- Account Name -->
                    <form.Field
                      v-slot="{ field: subField }"
                      :name="`gcashAccounts[${index}].name`"
                    >
                      <FormInput
                        :id="`gcash-name-${index}`"
                        :name="subField.name"
                        label="Account Name"
                        placeholder="e.g., Juan Dela Cruz"
                        :model-value="subField.state.value"
                        :required="true"
                        @update:model-value="subField.handleChange($event)"
                      />
                    </form.Field>

                    <!-- Account Number -->
                    <form.Field
                      v-slot="{ field: subField }"
                      :name="`gcashAccounts[${index}].number`"
                    >
                      <FormInput
                        :id="`gcash-number-${index}`"
                        :name="subField.name"
                        label="GCash Number"
                        placeholder="e.g., 09171234567"
                        :model-value="subField.state.value"
                        :required="true"
                        @update:model-value="subField.handleChange($event)"
                      />
                    </form.Field>
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  v-if="field.state.value.length === 0"
                  class="text-center py-8 text-subtle"
                >
                  <Icon
                    name="material-symbols:phone-android"
                    class="size-12 mx-auto mb-3 opacity-30"
                  />
                  <p class="text-sm">No GCash accounts added yet</p>
                </div>

                <!-- Add Button -->
                <button
                  type="button"
                  class="w-full py-3 border-2 border-dashed border-border rounded-lg text-subtle hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                  @click="field.pushValue(createEmptyGcashAccount())"
                >
                  <Icon name="material-symbols:add" class="size-5" />
                  Add GCash Account
                </button>
              </div>
            </form.Field>
          </div>
        </div>

        <!-- Bank Payment Section -->
        <div class="bg-surface rounded-xl border border-border overflow-hidden">
          <div class="p-4 md:p-6 border-b border-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-lg bg-green-500/10 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:account-balance"
                    class="size-5 text-green-500"
                  />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-text">
                    Bank Transfer Details
                  </h2>
                  <p class="text-sm text-subtle">
                    Bank accounts where members can send payment
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 md:p-6">
            <form.Field v-slot="{ field }" name="bankAccounts">
              <div class="space-y-4">
                <!-- Bank Account Cards -->
                <div
                  v-for="(_, index) in field.state.value"
                  :key="index"
                  class="relative p-4 bg-background rounded-lg border border-border"
                >
                  <!-- Remove Button -->
                  <button
                    type="button"
                    class="absolute top-2 right-2 p-1.5 text-subtle hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove account"
                    @click="field.removeValue(index)"
                  >
                    <Icon name="material-symbols:close" class="size-4" />
                  </button>

                  <div
                    class="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8 md:pr-0"
                  >
                    <!-- Bank Name -->
                    <form.Field
                      v-slot="{ field: subField }"
                      :name="`bankAccounts[${index}].bankName`"
                    >
                      <FormInput
                        :id="`bank-name-${index}`"
                        :name="subField.name"
                        label="Bank Name"
                        placeholder="e.g., BDO, BPI, Metrobank"
                        :model-value="subField.state.value"
                        :required="true"
                        @update:model-value="subField.handleChange($event)"
                      />
                    </form.Field>

                    <!-- Account Name -->
                    <form.Field
                      v-slot="{ field: subField }"
                      :name="`bankAccounts[${index}].accountName`"
                    >
                      <FormInput
                        :id="`bank-account-name-${index}`"
                        :name="subField.name"
                        label="Account Name"
                        placeholder="e.g., Juan Dela Cruz"
                        :model-value="subField.state.value"
                        :required="true"
                        @update:model-value="subField.handleChange($event)"
                      />
                    </form.Field>

                    <!-- Account Number -->
                    <form.Field
                      v-slot="{ field: subField }"
                      :name="`bankAccounts[${index}].accountNumber`"
                    >
                      <FormInput
                        :id="`bank-account-number-${index}`"
                        :name="subField.name"
                        label="Account Number"
                        placeholder="e.g., 1234567890"
                        :model-value="subField.state.value"
                        :required="true"
                        @update:model-value="subField.handleChange($event)"
                      />
                    </form.Field>
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  v-if="field.state.value.length === 0"
                  class="text-center py-8 text-subtle"
                >
                  <Icon
                    name="material-symbols:account-balance"
                    class="size-12 mx-auto mb-3 opacity-30"
                  />
                  <p class="text-sm">No bank accounts added yet</p>
                </div>

                <!-- Add Button -->
                <button
                  type="button"
                  class="w-full py-3 border-2 border-dashed border-border rounded-lg text-subtle hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                  @click="field.pushValue(createEmptyBankAccount())"
                >
                  <Icon name="material-symbols:add" class="size-5" />
                  Add Bank Account
                </button>
              </div>
            </form.Field>
          </div>
        </div>

        <!-- Cash Payment Section -->
        <div class="bg-surface rounded-xl border border-border overflow-hidden">
          <div class="p-4 md:p-6 border-b border-border">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:money"
                  class="size-5 text-amber-500"
                />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-text">
                  Cash Payment Details
                </h2>
                <p class="text-sm text-subtle">
                  Location where members can pay in cash
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 md:p-6 space-y-4">
            <!-- Address -->
            <form.Field v-slot="{ field }" name="cashPayment.address">
              <FormInput
                :id="field.name"
                :name="field.name"
                label="Address"
                placeholder="e.g., 123 Main Street, Cebu City"
                :model-value="field.state.value"
                :required="false"
                @update:model-value="field.handleChange($event)"
              />
            </form.Field>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Building -->
              <form.Field v-slot="{ field }" name="cashPayment.building">
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Building"
                  placeholder="e.g., UP Cebu Main Building"
                  :model-value="field.state.value"
                  :required="false"
                  @update:model-value="field.handleChange($event)"
                />
              </form.Field>

              <!-- Office -->
              <form.Field v-slot="{ field }" name="cashPayment.office">
                <FormInput
                  :id="field.name"
                  :name="field.name"
                  label="Office / Room"
                  placeholder="e.g., Room 101, Alumni Office"
                  :model-value="field.state.value"
                  :required="false"
                  @update:model-value="field.handleChange($event)"
                />
              </form.Field>
            </div>

            <!-- Open Days -->
            <form.Field v-slot="{ field }" name="cashPayment.openDays">
              <FormChipGroup
                :id="field.name"
                :name="field.name"
                label="Open Days"
                hint="Select the days when the office is open for payment"
                :options="daysOfWeek"
                :model-value="field.state.value"
                :required="false"
                @update:model-value="field.handleChange($event)"
              />
            </form.Field>

            <!-- Open Hours -->
            <form.Field v-slot="{ field }" name="cashPayment.openHours">
              <FormInput
                :id="field.name"
                :name="field.name"
                label="Office Hours"
                placeholder="e.g., 8:00 AM - 5:00 PM"
                :model-value="field.state.value"
                :required="false"
                @update:model-value="field.handleChange($event)"
              />
            </form.Field>
          </div>
        </div>

        <!-- Success Page Message Section -->
        <div class="bg-surface rounded-xl border border-border overflow-hidden">
          <div class="p-4 md:p-6 border-b border-border">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-lg bg-secondary/10 flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:celebration"
                  class="size-5 text-secondary"
                />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-text">
                  Success Page Message
                </h2>
                <p class="text-sm text-subtle">
                  Additional message shown after successful registration
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 md:p-6">
            <form.Field v-slot="{ field }" name="successMessage">
              <FormTextarea
                :id="field.name"
                :name="field.name"
                label="Custom Message"
                hint="This message will be displayed alongside the default success message"
                placeholder="e.g., Welcome to the UP Alumni Association! We look forward to seeing you at our upcoming events."
                :model-value="field.state.value"
                :required="false"
                :rows="4"
                :maxlength="500"
                :show-char-count="true"
                @update:model-value="field.handleChange($event)"
              />
            </form.Field>

            <!-- Preview -->
            <form.Subscribe v-slot="{ values }">
              <div
                v-if="values.successMessage"
                class="mt-4 p-4 bg-background rounded-lg border border-border"
              >
                <p class="text-xs font-medium text-subtle uppercase mb-2">
                  Preview
                </p>
                <p class="text-sm text-text whitespace-pre-wrap">
                  {{ values.successMessage }}
                </p>
              </div>
            </form.Subscribe>
          </div>
        </div>

        <!-- Submit Button -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4"
        >
          <form.Subscribe v-slot="{ isSubmitting }">
            <button
              type="submit"
              :disabled="!isOnline || isSubmitting || saving"
              class="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon
                v-if="isSubmitting || saving"
                name="svg-spinners:ring-resize"
                class="size-5"
              />
              <Icon v-else name="material-symbols:save" class="size-5" />
              {{ isSubmitting || saving ? "Saving..." : "Save Settings" }}
            </button>
          </form.Subscribe>
        </div>
      </form>
    </div>
  </div>
</template>
