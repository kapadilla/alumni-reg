<script setup lang="ts">
import type { FormApi } from "@tanstack/vue-form";
import { z } from "zod";
import type { RegistrationFormData } from "~/utils/schemas";

defineProps<{
  form: FormApi<RegistrationFormData, undefined>;
}>();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">Academic Status</h2>
      <p class="text-subtle">
        Please provide your academic information from UP Cebu.
      </p>
    </div>

    <div class="space-y-4">
      <!-- Degree Program -->
      <form.Field
        name="academicStatus.degreeProgram"
        :validators="{
          onBlur: z.string().min(1, 'Degree program is required'),
        }"
      >
        <template #default="{ field }">
          <FormInput
            :id="field.name"
            label="Degree Program"
            placeholder="e.g., BS Computer Science"
            :model-value="field.state.value"
            :error="field.state.meta.errors?.[0]"
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>

      <div class="grid grid-cols-2 gap-4">
        <!-- Year Graduated -->
        <form.Field
          name="academicStatus.yearGraduated"
          :validators="{
            onBlur: z
              .string()
              .min(1, 'Year graduated is required')
              .regex(/^\d{4}$/, 'Please enter a valid year (e.g., 2020)'),
          }"
        >
          <template #default="{ field }">
            <FormInput
              :id="field.name"
              label="Year Graduated"
              type="text"
              placeholder="2020"
              :model-value="field.state.value"
              :error="field.state.meta.errors?.[0]"
              @update:model-value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>

        <!-- Student Number -->
        <form.Field name="academicStatus.studentNumber">
          <template #default="{ field }">
            <FormInput
              :id="field.name"
              label="Student Number"
              placeholder="2016-12345"
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
