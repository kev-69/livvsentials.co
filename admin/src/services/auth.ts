import apiClient from "@/lib/api"

export const loginAdmin = async (email: string, password: string) => {
    const response = await apiClient.post('/login',
        {
            email,
            password
        }
    )

    const data = response.data.data
    if (data && data.token) {
        localStorage.setItem('adminToken', data.token)
    }

    return response.data
}

export const logoutAdmin = async() => {
    localStorage.removeItem('adminToken')
}