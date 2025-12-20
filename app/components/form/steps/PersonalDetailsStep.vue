<script setup lang="ts">
interface PersonalDetailsData {
  title: string;
  firstName: string;
  lastName: string;
  suffix: string;
  maidenName: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  currentAddress: string;
  province: string;
  city: string;
  barangay: string;
}

const props = defineProps<{
  formData: PersonalDetailsData;
}>();

const emit = defineEmits<{
  "update:formData": [data: PersonalDetailsData];
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

const updateField = (field: keyof PersonalDetailsData, value: string) => {
  emit("update:formData", { ...props.formData, [field]: value });
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">Personal Information</h2>
      <p class="text-subtle">
        Please provide your legal identity details as they appear in official
        records.
      </p>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <FormSelect
        id="title"
        label="Title"
        placeholder="Select"
        :model-value="formData.title"
        :options="titleOptions"
        required
        @update:model-value="(val) => updateField('title', val)"
      />
      <FormInput
        id="firstName"
        label="First Name"
        placeholder="Juan"
        :model-value="formData.firstName"
        required
        @update:model-value="(val) => updateField('firstName', val)"
      />
      <FormInput
        id="lastName"
        label="Last Name"
        placeholder="Dela Cruz"
        :model-value="formData.lastName"
        required
        @update:model-value="(val) => updateField('lastName', val)"
      />
      <FormInput
        id="suffix"
        label="Suffix"
        placeholder="Jr."
        :model-value="formData.suffix"
        @update:model-value="(val) => updateField('suffix', val)"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <FormInput
        id="maidenName"
        label="Maiden Name"
        placeholder="(if applicable)"
        hint="For verifying school records"
        :model-value="formData.maidenName"
        @update:model-value="(val) => updateField('maidenName', val)"
      />
      <FormInput
        id="dateOfBirth"
        label="Date of Birth"
        type="date"
        :model-value="formData.dateOfBirth"
        required
        @update:model-value="(val) => updateField('dateOfBirth', val)"
      />
    </div>

    <div class="pt-4">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-text mb-4">
        <Icon name="material-symbols:location-on" class="text-primary" />
        Contact & Location
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="juandelacruz@gmail.com"
            :model-value="formData.email"
            hint="* Please avoid using your up.edu.ph email."
            required
            @update:model-value="(val) => updateField('email', val)"
          />
          <FormInput
            id="mobileNumber"
            label="Mobile Number"
            type="tel"
            placeholder="0917 123 4567"
            :model-value="formData.mobileNumber"
            required
            @update:model-value="(val) => updateField('mobileNumber', val)"
          />
        </div>

        <FormInput
          id="currentAddress"
          label="Current Address"
          placeholder="Unit, Street, Subdivision"
          :model-value="formData.currentAddress"
          required
          @update:model-value="(val) => updateField('currentAddress', val)"
        />

        <div class="grid grid-cols-3 gap-4">
          <FormSelect
            id="province"
            placeholder="Select Province"
            :model-value="formData.province"
            :options="provinceOptions"
            required
            @update:model-value="(val) => updateField('province', val)"
          />
          <FormSelect
            id="city"
            placeholder="Select City"
            :model-value="formData.city"
            :options="cityOptions"
            required
            @update:model-value="(val) => updateField('city', val)"
          />
          <FormSelect
            id="barangay"
            placeholder="Select Barangay"
            :model-value="formData.barangay"
            :options="barangayOptions"
            required
            @update:model-value="(val) => updateField('barangay', val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
