import { toast } from "vue-sonner";
import type {
    MemberSummary,
    ApplicantDetails,
    PaginatedResponse,
} from "~/types";

interface FetchParams {
    search?: string;
    page?: number;
    limit?: number;
}

interface MemberUpdateData {
    personalDetails?: {
        email?: string;
        mobileNumber?: string;
        currentAddress?: string;
    };
    professional?: {
        currentEmployer?: string;
        jobTitle?: string;
        industry?: string;
    };
}

export const useMembers = () => {
    const { get, put, del, download } = useApi();
    const config = useRuntimeConfig();

    const members = ref<MemberSummary[]>([]);
    const pagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const loading = ref(false);

    const fetchMembers = async (params: FetchParams = {}): Promise<void> => {
        loading.value = true;
        try {
            const response = await get<PaginatedResponse<MemberSummary>>("/members/", {
                search: params.search,
                page: params.page,
                limit: params.limit,
            });
            if (response.success && response.data) {
                members.value = response.data.members || [];
                pagination.value = response.data.pagination;
            }
        }
        finally {
            loading.value = false;
        }
    };

    const getMemberDetails = async (id: number): Promise<ApplicantDetails | null> => {
        try {
            const response = await get<ApplicantDetails>(`/members/${id}/`);
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        }
        catch {
            return null;
        }
    };

    const updateMember = async (id: number, data: MemberUpdateData): Promise<boolean> => {
        try {
            const response = await put(`/members/${id}/update/`, data);
            if (response.success) {
                toast.success("Member updated successfully");
                return true;
            }
            toast.error("Update failed", { description: response.message });
            return false;
        }
        catch {
            toast.error("Update failed");
            return false;
        }
    };

    const revokeMembership = async (id: number): Promise<boolean> => {
        try {
            const response = await del(`/members/${id}/revoke/`);
            if (response.success) {
                toast.success("Membership revoked");
                return true;
            }
            toast.error("Revocation failed", { description: response.message });
            return false;
        }
        catch {
            toast.error("Revocation failed");
            return false;
        }
    };

    const exportMembersCSV = async (): Promise<void> => {
        await download("/members/export/", "members.csv");
    };

    return {
        members,
        pagination,
        loading,
        fetchMembers,
        getMemberDetails,
        updateMember,
        revokeMembership,
        exportMembersCSV,
    };
};
