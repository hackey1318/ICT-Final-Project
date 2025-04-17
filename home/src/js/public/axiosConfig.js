import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:9988";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const uploadImage = async (files) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }

    try {
        const response = await apiClient.post('/file-system/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("이미지 업로드 실패:", error);
        throw error;
    }
};

export default apiClient;
