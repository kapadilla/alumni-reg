<script setup lang="ts">
interface MembershipData {
  membershipType: string;
  paymentMethod: string;
}

const props = defineProps<{
  formData: MembershipData;
}>();

const emit = defineEmits<{
  "update:formData": [data: MembershipData];
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

const updateField = (field: keyof MembershipData, value: string) => {
  emit("update:formData", { ...props.formData, [field]: value });
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text mb-2">Membership</h2>
      <p class="text-subtle">Choose your membership type and payment method.</p>
    </div>

    <div class="space-y-4">
      <FormSelect
        id="membershipType"
        label="Membership Type"
        placeholder="Select membership type"
        :model-value="formData.membershipType"
        :options="membershipOptions"
        required
        @update:model-value="(val) => updateField('membershipType', val)"
      />

      <FormSelect
        id="paymentMethod"
        label="Payment Method"
        placeholder="Select payment method"
        :model-value="formData.paymentMethod"
        :options="paymentOptions"
        required
        @update:model-value="(val) => updateField('paymentMethod', val)"
      />
    </div>
  </div>
</template>
