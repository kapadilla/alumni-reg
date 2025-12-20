<script setup lang="ts">
interface ProfessionalData {
  currentEmployer: string;
  jobTitle: string;
  industry: string;
}

const props = defineProps<{
  formData: ProfessionalData;
}>();

const emit = defineEmits<{
  "update:formData": [data: ProfessionalData];
}>();

const updateField = (field: keyof ProfessionalData, value: string) => {
  emit("update:formData", { ...props.formData, [field]: value });
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">
        Professional Information
      </h2>
      <p class="text-subtle">
        Tell us about your current professional status (optional).
      </p>
    </div>

    <div class="space-y-4">
      <FormInput
        id="currentEmployer"
        label="Current Employer"
        placeholder="Company Name"
        :model-value="formData.currentEmployer"
        @update:model-value="(val) => updateField('currentEmployer', val)"
      />

      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="jobTitle"
          label="Job Title"
          placeholder="Software Engineer"
          :model-value="formData.jobTitle"
          @update:model-value="(val) => updateField('jobTitle', val)"
        />
        <FormInput
          id="industry"
          label="Industry"
          placeholder="Technology"
          :model-value="formData.industry"
          @update:model-value="(val) => updateField('industry', val)"
        />
      </div>
    </div>
  </div>
</template>
