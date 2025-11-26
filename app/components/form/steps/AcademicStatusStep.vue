<script setup lang="ts">
const props = defineProps<{
  formData: Record<string, string>;
}>();

const emit = defineEmits<{
  "update:formData": [data: Record<string, string>];
}>();

const updateField = (field: string, value: string) => {
  emit("update:formData", { ...props.formData, [field]: value });
};
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
      <FormInput
        id="degreeProgram"
        label="Degree Program"
        placeholder="e.g., BS Computer Science"
        :model-value="formData.degreeProgram"
        required
        @update:model-value="(val) => updateField('degreeProgram', val)"
      />

      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="yearGraduated"
          label="Year Graduated"
          type="number"
          placeholder="2020"
          :model-value="formData.yearGraduated"
          required
          @update:model-value="(val) => updateField('yearGraduated', val)"
        />
        <FormInput
          id="studentNumber"
          label="Student Number"
          placeholder="2016-12345 (optional)"
          :model-value="formData.studentNumber"
          @update:model-value="(val) => updateField('studentNumber', val)"
        />
      </div>
    </div>
  </div>
</template>
