<script setup lang="ts">
import type { FormApi } from "@tanstack/vue-form";
import { z } from "zod";
import type { RegistrationFormData } from "~/utils/schemas";

defineProps<{
  form: FormApi<RegistrationFormData, undefined>;
}>();

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
      <p class="text-subtle">Confirm your lifetime membership and select payment method.</p>
    </div>

    <div class="space-y-4">
      <!-- Lifetime Membership Info (fixed, not a dropdown) -->
      <div class="bg-primary/10 border border-primary/30 rounded-xl p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="heroicons:star-solid" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 class="font-semibold text-text">Lifetime Membership</h3>
            <p class="text-sm text-subtle">One-time payment, lifetime benefits</p>
          </div>
        </div>
        <div class="text-2xl font-bold text-primary mt-2">₱5,000</div>
      </div>

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

