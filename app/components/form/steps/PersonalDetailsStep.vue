<script setup lang="ts">
import type { FormApi } from "@tanstack/vue-form";
import { z } from "zod";
import type { RegistrationFormData } from "~/utils/schemas";

defineProps<{
  form: FormApi<RegistrationFormData, undefined>;
}>();

const titleOptions = [
  { value: "Mr.", label: "Mr." },
  { value: "Ms.", label: "Ms." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Dr.", label: "Dr." },
];

const provinceOptions = [
  { value: "cebu", label: "Cebu" },
  { value: "manila", label: "Manila" },
];

const cityOptions = [
  { value: "cebu-city", label: "Cebu City" },
  { value: "mandaue", label: "Mandaue" },
];

const barangayOptions = [
  { value: "lahug", label: "Barangay Lahug" },
  { value: "apas", label: "Barangay Apas" },
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">Personal Details</h2>
      <p class="text-subtle">
        Please provide your legal identity details as they appear in official
        records.
      </p>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <!-- Title -->
      <form.Field
        name="personalDetails.title"
        :validators="{
          onBlur: z.string().min(1, 'Title is required'),
        }"
      >
        <template #default="{ field }">
          <FormSelect
            :id="field.name"
            label="Title"
            placeholder="Select"
            :model-value="field.state.value"
            :options="titleOptions"
            :error="field.state.meta.errors?.[0]"
            required
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <!-- First Name -->
      <form.Field
        name="personalDetails.firstName"
        :validators="{
          onBlur: z
            .string()
            .min(1, 'First name is required')
            .min(2, 'First name must be at least 2 characters'),
        }"
      >
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="First Name"
            placeholder="Juan"
            :model-value="field.state.value"
            :error="field.state.meta.errors?.[0]"
            required
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <!-- Last Name -->
      <form.Field
        name="personalDetails.lastName"
        :validators="{
          onBlur: z
            .string()
            .min(1, 'Last name is required')
            .min(2, 'Last name must be at least 2 characters'),
        }"
      >
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="Last Name"
            placeholder="Dela Cruz"
            :model-value="field.state.value"
            :error="field.state.meta.errors?.[0]"
            required
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <!-- Suffix -->
      <form.Field name="personalDetails.suffix">
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="Suffix"
            placeholder="Jr."
            :model-value="field.state.value"
            :required="false"
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Maiden Name -->
      <form.Field name="personalDetails.maidenName">
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="Maiden Name"
            placeholder="(if applicable)"
            hint="For verifying school records"
            :model-value="field.state.value"
            :required="false"
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <!-- Date of Birth -->
      <form.Field
        name="personalDetails.dateOfBirth"
        :validators="{
          onBlur: z.string().min(1, 'Date of birth is required'),
        }"
      >
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="Date of Birth"
            type="date"
            :model-value="field.state.value"
            :error="field.state.meta.errors?.[0]"
            required
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>
    </div>

    <div class="pt-4">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-text mb-4">
        <Icon name="material-symbols:location-on" class="text-primary" />
        Contact & Location
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- Email -->
          <form.Field
            name="personalDetails.email"
            :validators="{
              onBlur: z
                .string()
                .min(1, 'Email is required')
                .email('Please enter a valid email address')
                .refine((email) => !email.endsWith('@up.edu.ph'), {
                  message: 'Please avoid using your up.edu.ph email',
                }),
            }"
          >
            <template #default="{ field }">
              <FormInput
                :id="field.name"
                label="Email Address"
                type="email"
                placeholder="juandelacruz@gmail.com"
                :model-value="field.state.value"
                :error="field.state.meta.errors?.[0]"
                hint="* Please avoid using your up.edu.ph email."
                required
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>

          <!-- Mobile Number -->
          <form.Field
            name="personalDetails.mobileNumber"
            :validators="{
              onBlur: z
                .string()
                .min(1, 'Mobile number is required')
                .regex(
                  /^(09|\+639)\d{9}$/,
                  'Please enter a valid Philippine mobile number'
                ),
            }"
          >
            <template #default="{ field }">
              <FormInput
                :id="field.name"
                label="Mobile Number"
                type="tel"
                placeholder="09171234567"
                :model-value="field.state.value"
                :error="field.state.meta.errors?.[0]"
                required
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>
        </div>

        <!-- Current Address -->
        <form.Field
          name="personalDetails.currentAddress"
          :validators="{
            onBlur: z.string().min(1, 'Current address is required'),
          }"
        >
          <template #default="{ field }">
            <FormInput
              :id="field.name"
              label="Current Address"
              placeholder="Unit, Street, Subdivision"
              :model-value="field.state.value"
              :error="field.state.meta.errors?.[0]"
              required
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>

        <div class="grid grid-cols-3 gap-4">
          <!-- Province -->
          <form.Field
            name="personalDetails.province"
            :validators="{
              onBlur: z.string().min(1, 'Province is required'),
            }"
          >
            <template #default="{ field }">
              <FormSelect
                :id="field.name"
                placeholder="Select Province"
                :model-value="field.state.value"
                :options="provinceOptions"
                :error="field.state.meta.errors?.[0]"
                required
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>

          <!-- City -->
          <form.Field
            name="personalDetails.city"
            :validators="{
              onBlur: z.string().min(1, 'City is required'),
            }"
          >
            <template #default="{ field }">
              <FormSelect
                :id="field.name"
                placeholder="Select City"
                :model-value="field.state.value"
                :options="cityOptions"
                :error="field.state.meta.errors?.[0]"
                required
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>

          <!-- Barangay -->
          <form.Field
            name="personalDetails.barangay"
            :validators="{
              onBlur: z.string().min(1, 'Barangay is required'),
            }"
          >
            <template #default="{ field }">
              <FormSelect
                :id="field.name"
                placeholder="Select Barangay"
                :model-value="field.state.value"
                :options="barangayOptions"
                :error="field.state.meta.errors?.[0]"
                required
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>
        </div>
      </div>
    </div>
  </div>
</template>
