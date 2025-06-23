import { api } from "@/lib/api"

export const loginAdmin = async (email: string, password: string) => {
    try {
        // console.log('Attempting login with:', { email, password: '***' });
        const response = await api.post('/admin/login', { email, password });
        // console.log('Login response:', response.data);
        const data = response.data.data;
        if (data && data.token) {
            localStorage.setItem('adminToken', data.token);
        }
        return response.data;
    } catch (error: any) {
        console.error('Login error:', error);
        // Log more details if available
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        throw error;
    }
}

export const logoutAdmin = async() => {
    localStorage.removeItem('adminToken')
}

export const updateProfile = async (profileData: any) => {
    try {
        const response = await api.put(`/admin/profile`, profileData);
        return response.data.data;
    } catch (error: any) {
        console.error('Error updating profile:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        throw error;
    }
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
        const response = await api.post('/admin/reset-password', { currentPassword, newPassword})
        return response.data.message
    } catch (error: any) {
        console.error('Error updating profile:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        throw error;
    }
}