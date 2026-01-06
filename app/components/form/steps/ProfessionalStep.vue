<script setup lang="ts">
import type { FormApi } from "@tanstack/vue-form";
import type { RegistrationFormData } from "~/utils/schemas";

defineProps<{
  form: FormApi<RegistrationFormData, undefined>;
}>();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">Professional</h2>
      <p class="text-subtle">
        Tell us about your current professional status (optional).
      </p>
    </div>

    <div class="space-y-4">
      <!-- Current Employer -->
      <form.Field name="professional.currentEmployer">
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="Current Employer"
            placeholder="Company Name"
            :model-value="field.state.value"
            :required="false"
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <div class="grid grid-cols-2 gap-4">
        <!-- Job Title -->
        <form.Field name="professional.jobTitle">
          <template #default="{ field }">
            <FormInput
              :id="field.name"
              label="Job Title"
              placeholder="Software Engineer"
              :model-value="field.state.value"
              :required="false"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>

        <!-- Industry -->
        <form.Field name="professional.industry">
          <template #default="{ field }">
            <FormInput
              :id="field.name"
              label="Industry"
              placeholder="Technology"
              :model-value="field.state.value"
              :required="false"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>
      </div>
    </div>
  </div>
</template>
