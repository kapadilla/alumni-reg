import { toast } from "vue-sonner";
import type { MemberSummary, MemberDetails, PaginatedResponse } from "~/types";

interface FetchParams {
  search?: string;
  page?: number;
  limit?: number;
  ordering?: string;
  date_from?: string;
  date_to?: string;
  degree_program?: string;
  year_graduated?: string;
  campus?: string;
  province?: string;
  mentorship?: boolean;
  payment_method?: string;
  status?: "active" | "revoked" | "all" | "";
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
  const { get, put, post, del, download } = useApi();
  const config = useRuntimeConfig();

  const members = ref<MemberSummary[]>([]);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  });
  const loading = ref(false);

  const fetchMembers = async (params: FetchParams = {}): Promise<void> => {
    loading.value = true;
    try {
      const response = await get<PaginatedResponse<MemberSummary>>(
        "/members/",
        {
          search: params.search,
          page: params.page,
          limit: params.limit,
          ordering: params.ordering,
          date_from: params.date_from,
          date_to: params.date_to,
          degree_program: params.degree_program,
          year_graduated: params.year_graduated,
          campus: params.campus,
          province: params.province,
          mentorship:
            params.mentorship !== undefined
              ? String(params.mentorship)
              : undefined,
          payment_method: params.payment_method,
          status: params.status || undefined,
        },
      );
      if (response.success && response.data) {
        members.value = response.data.members || [];
        pagination.value = {
          ...response.data.pagination,
          limit: params.limit || 20,
        };
      }
    } finally {
      loading.value = false;
    }
  };

  // API now returns flattened camelCase structure directly
  // Note: The API may return mentorship data as either "mentorship" or "mentorshipInterest"
  interface ApiMemberDetails {
    id: number;
    memberSince: string;
    isActive: boolean;
    personalDetails: MemberDetails["personalDetails"];
    academicStatus: MemberDetails["academicStatus"];
    professional: MemberDetails["professional"];
    membership: MemberDetails["membership"];
    mentorshipInterest?: MemberDetails["mentorshipInterest"];
    mentorship?: MemberDetails["mentorshipInterest"]; // API may use this name instead
    history: MemberDetails["history"];
  }

  const getMemberDetails = async (
    id: number,
  ): Promise<MemberDetails | null> => {
    try {
      const response = await get<ApiMemberDetails>(`/members/${id}/`);
      if (response.success && response.data) {
        const api = response.data;
        // API may return mentorship data as "mentorship" or "mentorshipInterest"
        const mentorshipData = api.mentorshipInterest || api.mentorship;
        return {
          id: api.id,
          user: {
            id: api.id,
            email: api.personalDetails?.email || "",
            firstName: api.personalDetails?.firstName || "",
            lastName: api.personalDetails?.lastName || "",
          },
          personalDetails: api.personalDetails || {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            email: "",
            mobileNumber: "",
            currentAddress: "",
            province: "",
            city: "",
            barangay: "",
          },
          academicStatus: api.academicStatus || {
            degreeProgram: "",
            yearGraduated: "",
          },
          professional: api.professional || {},
          membership: api.membership || {
            paymentMethod: "",
          },
          mentorshipInterest: mentorshipData,
          mentorship: [],
          history: api.history || [],
          memberSince: api.memberSince || "",
          isActive: api.isActive ?? true,
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const updateMember = async (
    id: number,
    data: MemberUpdateData,
  ): Promise<boolean> => {
    try {
      const response = await put(`/members/${id}/update/`, data);
      if (response.success) {
        toast.success("Member updated successfully");
        return true;
      }
      toast.error("Update failed", { description: response.message });
      return false;
    } catch {
      toast.error("Update failed");
      return false;
    }
  };

  const revokeMembership = async (
    id: number,
    reason: string,
    notes?: string,
  ): Promise<boolean> => {
    try {
      const response = await post(`/members/${id}/revoke/`, { reason, notes });
      if (response.success) {
        toast.success("Membership revoked");
        return true;
      }
      toast.error("Revocation failed", { description: response.message });
      return false;
    } catch {
      toast.error("Revocation failed");
      return false;
    }
  };

  const reinstateMembership = async (
    id: number,
    notes?: string,
  ): Promise<boolean> => {
    try {
      const response = await post(`/members/${id}/reinstate/`, { notes });
      if (response.success) {
        toast.success("Membership reinstated");
        return true;
      }
      toast.error("Reinstatement failed", { description: response.message });
      return false;
    } catch {
      toast.error("Reinstatement failed");
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
    reinstateMembership,
    exportMembersCSV,
  };
};
