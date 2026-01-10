import type { DegreeProgram } from "~/types";

export const useReferenceData = () => {
    const { get } = useApi();

    // Degree Programs
    const degreePrograms = ref<DegreeProgram[]>([]);
    const loadingDegreePrograms = ref(false);

    const fetchDegreePrograms = async (): Promise<DegreeProgram[]> => {
        if (degreePrograms.value.length > 0) return degreePrograms.value;
        loadingDegreePrograms.value = true;
        try {
            const response = await get<DegreeProgram[]>("/registration/reference/degree-programs/");
            if (response.success && response.data) {
                degreePrograms.value = response.data;
                return response.data;
            }
            return [];
        }
        finally {
            loadingDegreePrograms.value = false;
        }
    };

    return {
        degreePrograms,
        loadingDegreePrograms,
        fetchDegreePrograms,
    };
};
