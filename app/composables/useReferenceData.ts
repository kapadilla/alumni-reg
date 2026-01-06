import type {
    Province,
    City,
    Barangay,
    DegreeProgram,
} from "~/types";

export const useReferenceData = () => {
    const { get } = useApi();

    // Provinces
    const provinces = ref<Province[]>([]);
    const loadingProvinces = ref(false);

    const fetchProvinces = async (): Promise<Province[]> => {
        if (provinces.value.length > 0) return provinces.value;
        loadingProvinces.value = true;
        try {
            const response = await get<Province[]>("/registration/reference/provinces/");
            if (response.success && response.data) {
                provinces.value = response.data;
                return response.data;
            }
            return [];
        }
        finally {
            loadingProvinces.value = false;
        }
    };

    // Cities
    const cities = ref<City[]>([]);
    const loadingCities = ref(false);

    const fetchCities = async (province?: string): Promise<City[]> => {
        loadingCities.value = true;
        try {
            const response = await get<City[]>("/registration/reference/cities/", {
                province,
            });
            if (response.success && response.data) {
                cities.value = response.data;
                return response.data;
            }
            return [];
        }
        finally {
            loadingCities.value = false;
        }
    };

    // Barangays
    const barangays = ref<Barangay[]>([]);
    const loadingBarangays = ref(false);

    const fetchBarangays = async (city?: string): Promise<Barangay[]> => {
        loadingBarangays.value = true;
        try {
            const response = await get<Barangay[]>("/registration/reference/barangays/", {
                city,
            });
            if (response.success && response.data) {
                barangays.value = response.data;
                return response.data;
            }
            return [];
        }
        finally {
            loadingBarangays.value = false;
        }
    };

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
        // Provinces
        provinces,
        loadingProvinces,
        fetchProvinces,
        // Cities
        cities,
        loadingCities,
        fetchCities,
        // Barangays
        barangays,
        loadingBarangays,
        fetchBarangays,
        // Degree Programs
        degreePrograms,
        loadingDegreePrograms,
        fetchDegreePrograms,
    };
};
