interface FilterOptions {
    degreePrograms: string[];
    years: string[];
    rejectionStages: { value: string; label: string }[];
}

export const useFilterOptions = () => {
    const { get } = useApi();

    const filterOptions = ref<FilterOptions>({
        degreePrograms: [],
        years: [],
        rejectionStages: [
            { value: "alumni_verification", label: "Alumni Verification" },
            { value: "payment_verification", label: "Payment Verification" },
        ],
    });
    const loading = ref(false);
    const fetched = ref(false);

    const fetchFilterOptions = async (): Promise<void> => {
        if (fetched.value) return; // Only fetch once

        loading.value = true;
        try {
            const response = await get<FilterOptions>("/dashboard/filters/");
            if (response.success && response.data) {
                filterOptions.value = {
                    degreePrograms: response.data.degreePrograms || [],
                    years: response.data.years || [],
                    rejectionStages: response.data.rejectionStages || filterOptions.value.rejectionStages,
                };
                fetched.value = true;
            }
        } finally {
            loading.value = false;
        }
    };

    return {
        filterOptions,
        loading,
        fetchFilterOptions,
    };
};
