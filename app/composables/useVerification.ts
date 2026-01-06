import { toast } from "vue-sonner";
import type {
    ApplicantSummary,
    ApplicantDetails,
    PaginatedResponse,
    VerifyAlumniResponse,
    RejectResponse,
    ConfirmPaymentResponse,
} from "~/types";

interface FetchParams {
    search?: string;
    page?: number;
    limit?: number;
}

export const useVerification = () => {
    const { get, post, download } = useApi();
    const config = useRuntimeConfig();

    // Alumni Verification
    const alumniApplicants = ref<ApplicantSummary[]>([]);
    const alumniPagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const loadingAlumni = ref(false);

    const fetchPendingAlumni = async (params: FetchParams = {}): Promise<void> => {
        loadingAlumni.value = true;
        try {
            const response = await get<PaginatedResponse<ApplicantSummary>>("/verification/alumni/", {
                search: params.search,
                page: params.page,
                limit: params.limit,
            });
            if (response.success && response.data) {
                alumniApplicants.value = response.data.applicants || [];
                alumniPagination.value = response.data.pagination;
            }
        }
        finally {
            loadingAlumni.value = false;
        }
    };

    const getAlumniDetails = async (id: number): Promise<ApplicantDetails | null> => {
        try {
            const response = await get<ApplicantDetails>(`/verification/alumni/${id}/`);
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        }
        catch {
            return null;
        }
    };

    const verifyAlumni = async (id: number, notes?: string): Promise<boolean> => {
        try {
            const response = await post<VerifyAlumniResponse>(`/verification/alumni/${id}/verify/`, {
                notes,
            });
            if (response.success) {
                toast.success("Applicant verified as alumni");
                return true;
            }
            toast.error("Verification failed", { description: response.message });
            return false;
        }
        catch {
            toast.error("Verification failed");
            return false;
        }
    };

    const rejectAlumni = async (id: number, reason: string): Promise<boolean> => {
        try {
            const response = await post<RejectResponse>(`/verification/alumni/${id}/reject/`, {
                reason,
            });
            if (response.success) {
                toast.success("Application rejected");
                return true;
            }
            toast.error("Rejection failed", { description: response.message });
            return false;
        }
        catch {
            toast.error("Rejection failed");
            return false;
        }
    };

    const exportAlumniCSV = async (): Promise<void> => {
        await download("/verification/alumni/export/", "alumni_verification.csv");
    };

    // Payment Verification
    const paymentApplicants = ref<ApplicantSummary[]>([]);
    const paymentPagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const loadingPayment = ref(false);

    const fetchPendingPayments = async (params: FetchParams = {}): Promise<void> => {
        loadingPayment.value = true;
        try {
            const response = await get<PaginatedResponse<ApplicantSummary>>("/verification/payment/", {
                search: params.search,
                page: params.page,
                limit: params.limit,
            });
            if (response.success && response.data) {
                paymentApplicants.value = response.data.applicants || [];
                paymentPagination.value = response.data.pagination;
            }
        }
        finally {
            loadingPayment.value = false;
        }
    };

    const getPaymentDetails = async (id: number): Promise<ApplicantDetails | null> => {
        try {
            const response = await get<ApplicantDetails>(`/verification/payment/${id}/`);
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        }
        catch {
            return null;
        }
    };

    const confirmPayment = async (id: number, notes?: string): Promise<boolean> => {
        try {
            const response = await post<ConfirmPaymentResponse>(`/verification/payment/${id}/confirm/`, {
                notes,
            });
            if (response.success) {
                toast.success("Payment confirmed. Member approved!");
                return true;
            }
            toast.error("Confirmation failed", { description: response.message });
            return false;
        }
        catch {
            toast.error("Confirmation failed");
            return false;
        }
    };

    const rejectPayment = async (id: number, reason: string): Promise<boolean> => {
        try {
            const response = await post<RejectResponse>(`/verification/payment/${id}/reject/`, {
                reason,
            });
            if (response.success) {
                toast.success("Application rejected");
                return true;
            }
            toast.error("Rejection failed", { description: response.message });
            return false;
        }
        catch {
            toast.error("Rejection failed");
            return false;
        }
    };

    const exportPaymentsCSV = async (): Promise<void> => {
        await download("/verification/payment/export/", "payment_verification.csv");
    };

    return {
        // Alumni
        alumniApplicants,
        alumniPagination,
        loadingAlumni,
        fetchPendingAlumni,
        getAlumniDetails,
        verifyAlumni,
        rejectAlumni,
        exportAlumniCSV,
        // Payment
        paymentApplicants,
        paymentPagination,
        loadingPayment,
        fetchPendingPayments,
        getPaymentDetails,
        confirmPayment,
        rejectPayment,
        exportPaymentsCSV,
    };
};
