import apiClient from "@/lib/api"

export const loginAdmin = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/admin/login', { email, password })
        console.log('Login response:', response.data);
        const data = response.data.data
        if (data && data.token) {
            localStorage.setItem('adminToken', data.token)
        }

        return response.data
    } catch (error) {
        console.error('Login error:', error);
        throw error
    }
    
}

export const logoutAdmin = async() => {
    localStorage.removeItem('adminToken')
}