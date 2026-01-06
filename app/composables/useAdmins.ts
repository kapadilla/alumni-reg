import { toast } from "vue-sonner";
import type {
    Admin,
    AdminsResponse,
    CreateAdminPayload,
    UpdateAdminPayload,
} from "~/types";

export const useAdmins = () => {
    const { apiFetch } = useApi();

    // State
    const admins = ref<Admin[]>([]);
    const loading = ref(false);
    const total = ref(0);

    /**
     * Fetch all admins
     */
    const fetchAdmins = async (): Promise<void> => {
        loading.value = true;
        try {
            const response = await apiFetch<AdminsResponse>(
                "/auth/admins/"
            );
            if (response.success && response.data) {
                admins.value = response.data.admins;
                total.value = response.data.total;
            }
        } catch (error) {
            toast.error("Failed to fetch admins");
            console.error("Fetch admins error:", error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Get admin by ID
     */
    const getAdmin = async (id: number): Promise<Admin | null> => {
        try {
            const response = await apiFetch<Admin>(
                `/auth/admins/${id}/`
            );
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            toast.error("Failed to fetch admin details");
            console.error("Get admin error:", error);
            return null;
        }
    };

    /**
     * Create new admin
     */
    const createAdmin = async (
        payload: CreateAdminPayload
    ): Promise<Admin | null> => {
        try {
            const response = await apiFetch<Admin>("/auth/admins/", {
                method: "POST",
                body: payload,
            });
            if (response.success && response.data) {
                toast.success("Admin created successfully");
                return response.data;
            } else {
                toast.error(response.message || "Failed to create admin");
                return null;
            }
        } catch (error) {
            toast.error("Failed to create admin");
            console.error("Create admin error:", error);
            return null;
        }
    };

    /**
     * Update admin
     */
    const updateAdmin = async (
        id: number,
        payload: UpdateAdminPayload
    ): Promise<Admin | null> => {
        try {
            const response = await apiFetch<Admin>(
                `/auth/admins/${id}/`,
                {
                    method: "PUT",
                    body: payload,
                }
            );
            if (response.success && response.data) {
                toast.success("Admin updated successfully");
                return response.data;
            } else {
                toast.error(response.message || "Failed to update admin");
                return null;
            }
        } catch (error) {
            toast.error("Failed to update admin");
            console.error("Update admin error:", error);
            return null;
        }
    };

    /**
     * Delete (deactivate) admin
     */
    const deleteAdmin = async (id: number): Promise<boolean> => {
        try {
            const response = await apiFetch<{ id: number; isActive: boolean }>(
                `/auth/admins/${id}/`,
                {
                    method: "DELETE",
                }
            );
            if (response.success) {
                toast.success("Admin deactivated successfully");
                return true;
            } else {
                toast.error(response.message || "Failed to deactivate admin");
                return false;
            }
        } catch (error) {
            toast.error("Failed to deactivate admin");
            console.error("Delete admin error:", error);
            return false;
        }
    };

    return {
        // State
        admins,
        loading,
        total,
        // Methods
        fetchAdmins,
        getAdmin,
        createAdmin,
        updateAdmin,
        deleteAdmin,
    };
};

