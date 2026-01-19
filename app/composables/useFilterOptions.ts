import { campusOptions, paymentOptions } from "~/types/registration";

interface Province {
  code: string;
  name: string;
}

interface FilterOptions {
  degreePrograms: string[];
  years: string[];
  rejectionStages: { value: string; label: string }[];
  campuses: { value: string; label: string }[];
  provinces: { value: string; label: string }[];
  paymentMethods: { value: string; label: string }[];
}

// Generate years from current year down to 1960
const generateYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }
  return years;
};

export const useFilterOptions = () => {
  const { get } = useApi();

  const filterOptions = ref<FilterOptions>({
    degreePrograms: [],
    years: generateYearOptions(),
    rejectionStages: [
      { value: "alumni_verification", label: "Alumni Verification" },
      { value: "payment_verification", label: "Payment Verification" },
    ],
    campuses: campusOptions.map((c) => ({ value: c.value, label: c.label })),
    provinces: [],
    paymentMethods: paymentOptions.map((p) => ({
      value: p.value,
      label: p.label,
    })),
  });
  const loading = ref(false);
  const fetched = ref(false);
  const provincesLoaded = ref(false);

  const fetchFilterOptions = async (): Promise<void> => {
    if (fetched.value) return; // Only fetch once

    loading.value = true;
    try {
      const response = await get<{
        degreePrograms?: string[];
        years?: string[];
        rejectionStages?: { value: string; label: string }[];
        paymentMethods?: string[];
      }>("/dashboard/filters/");
      if (response.success && response.data) {
        filterOptions.value = {
          ...filterOptions.value,
          degreePrograms: response.data.degreePrograms || [],
          rejectionStages:
            response.data.rejectionStages ||
            filterOptions.value.rejectionStages,
        };
        fetched.value = true;
      }
    } finally {
      loading.value = false;
    }
  };

  const fetchProvinces = async (): Promise<void> => {
    if (provincesLoaded.value) return;

    try {
      const response = await fetch("https://psgc.gitlab.io/api/provinces/");
      const data: Province[] = await response.json();

      filterOptions.value.provinces = data
        .map((p) => ({
          value: p.name,
          label: p.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      provincesLoaded.value = true;
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  return {
    filterOptions,
    loading,
    fetchFilterOptions,
    fetchProvinces,
  };
};
