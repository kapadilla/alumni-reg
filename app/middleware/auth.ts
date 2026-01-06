export default defineNuxtRouteMiddleware(async (to) => {
    // Only protect admin routes (except login)
    if (!to.path.startsWith("/admin") || to.path === "/admin/login") {
        return;
    }

    const { isAuthenticated, verifyToken } = useAuth();

    // Check if user is authenticated
    if (!isAuthenticated.value) {
        // Try to verify the token (in case page was refreshed)
        const isValid = await verifyToken();
        if (!isValid) {
            return navigateTo("/admin/login");
        }
    }
});
