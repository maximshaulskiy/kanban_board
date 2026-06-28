import axios from "axios";


const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error)
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (originalRequest.url.includes("/auth/jwt/create/")) {
                return Promise.reject(error)
            }
            originalRequest._retry = true;
            const refresh_token = localStorage.getItem("refresh_token")

            if (refresh_token) {
                try {
                    const res = await axios.post("http://127.0.0.1:8000/auth/jwt/refresh/", {
                        refresh: refresh_token
                    });
                    const newAccess = res.data.access;
                    localStorage.setItem("access_token", newAccess);

                    originalRequest.headers["Authorization"] = `Bearer ${newAccess}`

                    return api(originalRequest)
                }  catch(refreshError) {
                    console.log("Refresh token истек")
                    localStorage.clear()
                    window.location.href = '/'
                }
            }
        }
        return Promise.reject(error)
    }
)

export default api;

