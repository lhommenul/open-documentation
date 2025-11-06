export const useAuth = () => {
    const isAuthenticated = useState<boolean>('auth:isAuthenticated', () => false);
    const isLoading = useState<boolean>('auth:isLoading', () => false);

    const checkAuth = async () => {
        isLoading.value = true;
        try {
            const response = await $fetch('/api/auth/check');
            isAuthenticated.value = response.authenticated;
            return response.authenticated;
        } catch (error) {
            isAuthenticated.value = false;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const login = () => {
        navigateTo('/api/auth/login', { external: true });
    };

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', { method: 'POST' });
            isAuthenticated.value = false;
            navigateTo('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        isAuthenticated: readonly(isAuthenticated),
        isLoading: readonly(isLoading),
        checkAuth,
        login,
        logout
    };
};
