import { toast } from "vue-sonner";
import type { LoginResponse, User, VerifyResponse } from "~/types";

export const useAuth = () => {
    const { post, get } = useApi();
    const router = useRouter();

    // Cookie-based token storage (SSR-safe)
    const authToken = useCookie("auth_token", {
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
    });
    const refreshToken = useCookie("refresh_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
    });

    // Reactive user state
    const user = useState<User | null>("auth_user", () => null);
    const isAuthenticated = computed(() => !!authToken.value && !!user.value);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Login
    const login = async (email: string, password: string): Promise<boolean> => {
        isLoading.value = true;
        error.value = null; // Reset error
        try {
            const response = await post<LoginResponse>("/auth/login/", {
                email,
                password,
            });

            if (response.success && response.data) {
                authToken.value = response.data.token;
                refreshToken.value = response.data.refresh;
                user.value = response.data.user;
                toast.success("Login successful", {
                    description: `Welcome back, ${response.data.user.firstName}!`,
                });
                await router.push("/admin/dashboard");
                return true;
            }
            else {
                error.value = response.message || "Invalid credentials";
                return false;
            }
        }
        catch {
            error.value = "An unexpected error occurred. Please try again.";
            return false;
        }
        finally {
            isLoading.value = false;
        }
    };

    // Logout
    const logout = async (): Promise<void> => {
        isLoading.value = true;
        try {
            // Call logout endpoint to blacklist refresh token
            if (refreshToken.value) {
                await post("/auth/logout/", { refresh: refreshToken.value });
            }
        }
        catch {
            // Ignore logout API errors, still clear local state
        }
        finally {
            // Clear tokens and user state
            authToken.value = null;
            refreshToken.value = null;
            user.value = null;
            isLoading.value = false;
            toast.success("Logged out successfully");
            await router.push("/admin/login");
        }
    };

    // Verify token and get current user
    const verifyToken = async (): Promise<boolean> => {
        if (!authToken.value) {
            return false;
        }

        try {
            const response = await get<VerifyResponse>("/auth/verify/");
            if (response.success && response.data?.valid) {
                user.value = response.data.user;
                return true;
            }
            else {
                // Token invalid, clear state
                authToken.value = null;
                refreshToken.value = null;
                user.value = null;
                return false;
            }
        }
        catch {
            return false;
        }
    };

    // Initialize auth state (call on app mount)
    const initAuth = async (): Promise<void> => {
        if (authToken.value && !user.value) {
            await verifyToken();
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        verifyToken,
        initAuth,
    };
};
