import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

//Add request interceptor to attach the token to every request

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`  // Note: space between Bearer and token
    }   
    return config;
});

export default api;