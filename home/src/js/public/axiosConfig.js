import axios from "axios";

// const API_BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:9988";
const API_BASE_URL = "http://localhost:9988";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

//인터셉터
apiClient.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    console.log('Interceptor - Token:', accessToken); 
    console.log('Interceptor - Config before adding token:', config.headers); 

    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('Interceptor - Added Authorization Header:', config.headers.Authorization);
    }  else {
        console.log('Interceptor - No access token found.'); // ★ 디버깅 로그 추가
    }
    return config;
}, (error) => {
    console.error("apiClient 인터셉터 에러", error);
    return Promise.reject(error);
})

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
