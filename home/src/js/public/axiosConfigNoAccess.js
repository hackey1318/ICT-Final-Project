import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost'}/api`;

const apiNoAccessClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiNoAccessClient.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));


export default apiNoAccessClient;
