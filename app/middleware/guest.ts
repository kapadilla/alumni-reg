export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated, verifyToken } = useAuth();

    // Check if user is authenticated
    if (isAuthenticated.value) {
        return navigateTo("/admin/dashboard");
    }

    // Try to verify token (in case cookie exists but state not hydrated)
    const authToken = useCookie("auth_token");
    if (authToken.value) {
        const isValid = await verifyToken();
        if (isValid) {
            return navigateTo("/admin/dashboard");
        }
    }
});
