
import apiClient from './../public/axiosConfig';

export const searchTheaters = async (keyword, page, size) => {
    try {
        const res = await apiClient.get("/theaters/search", {
            params: { keyword, page, size }
        });
        return res.data; // Page 객체 반환 (content, totalPages 포함)
    } catch (error) {
        console.error("영화관 검색 실패:", error);
        throw error;
    }
};