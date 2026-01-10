import type {
    ApplicantSummary,
    ApplicantDetails,
    PaginatedResponse,
} from "~/types";

interface FetchParams {
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    date_from?: string;
    date_to?: string;
    rejected_from?: string;
    rejected_to?: string;
    rejection_stage?: "alumni_verification" | "payment_verification";
    degree_program?: string;
    year_graduated?: string;
}

export const useRejected = () => {
    const { get, download } = useApi();
    const config = useRuntimeConfig();

    const rejectedApplicants = ref<ApplicantSummary[]>([]);
    const pagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 20 });
    const loading = ref(false);

    const fetchRejected = async (params: FetchParams = {}): Promise<void> => {
        loading.value = true;
        try {
            const response = await get<PaginatedResponse<ApplicantSummary>>("/rejected/", {
                search: params.search,
                page: params.page,
                limit: params.limit,
                ordering: params.ordering,
                date_from: params.date_from,
                date_to: params.date_to,
                rejected_from: params.rejected_from,
                rejected_to: params.rejected_to,
                rejection_stage: params.rejection_stage,
                degree_program: params.degree_program,
                year_graduated: params.year_graduated,
            });
            if (response.success && response.data) {
                rejectedApplicants.value = response.data.applicants || [];
                pagination.value = {
                    ...response.data.pagination,
                    limit: params.limit || 20,
                };
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
