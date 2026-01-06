import type {
    ApplicantSummary,
    ApplicantDetails,
    PaginatedResponse,
} from "~/types";

interface FetchParams {
    search?: string;
    rejectionStage?: "alumni_verification" | "payment_verification";
    page?: number;
    limit?: number;
}

export const useRejected = () => {
    const { get, download } = useApi();
    const config = useRuntimeConfig();

    const rejectedApplicants = ref<ApplicantSummary[]>([]);
    const pagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const loading = ref(false);

    const fetchRejected = async (params: FetchParams = {}): Promise<void> => {
        loading.value = true;
        try {
            const response = await get<PaginatedResponse<ApplicantSummary>>("/rejected/", {
                search: params.search,
                rejectionStage: params.rejectionStage,
                page: params.page,
                limit: params.limit,
            });
            if (response.success && response.data) {
                rejectedApplicants.value = response.data.applicants || [];
                pagination.value = response.data.pagination;
            }
        }
        finally {
            loading.value = false;
        }
    };

    const getRejectedDetails = async (id: number): Promise<ApplicantDetails | null> => {
        try {
            const response = await get<ApplicantDetails>(`/rejected/${id}/`);
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        }
        catch {
            return null;
        }
    };

    const exportRejectedCSV = async (): Promise<void> => {
        await download("/rejected/export/", "rejected_applications.csv");
    };

    return {
        rejectedApplicants,
        pagination,
        loading,
        fetchRejected,
        getRejectedDetails,
        exportRejectedCSV,
    };
};
