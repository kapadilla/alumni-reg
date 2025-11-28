<script setup lang="ts">
import type { FormApi } from "@tanstack/vue-form";
import { z } from "zod";
import type { RegistrationFormData } from "~/utils/schemas";

defineProps<{
  form: FormApi<RegistrationFormData, undefined>;
}>();

const membershipOptions = [
  { value: "regular", label: "Regular Member - ₱500/year" },
  { value: "lifetime", label: "Lifetime Member - ₱5,000" },
];

const paymentOptions = [
  { value: "gcash", label: "GCash" },
  { value: "bank", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">Membership</h2>
      <p class="text-subtle">Choose your membership type and payment method.</p>
    </div>

    <div class="space-y-4">
      <!-- Membership Type -->
      <form.Field
        name="membership.membershipType"
        :validators="{
          onBlur: z.string().min(1, 'Please select a membership type'),
        }"
      >
        <template #default="{ field }">
          <FormSelect
            :id="field.name"
            label="Membership Type"
            placeholder="Select membership type"
            :model-value="field.state.value"
            :options="membershipOptions"
            :error="field.state.meta.errors?.[0]"
            required
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <!-- Payment Method -->
      <form.Field
        name="membership.paymentMethod"
        :validators="{
          onBlur: z.string().min(1, 'Please select a payment method'),
        }"
      >
        <template #default="{ field }">
          <FormSelect
            :id="field.name"
            label="Payment Method"
            placeholder="Select payment method"
            :model-value="field.state.value"
            :options="paymentOptions"
            :error="field.state.meta.errors?.[0]"
            required
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>
    </div>
  </div>
</template>
