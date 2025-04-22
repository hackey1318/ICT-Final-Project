import axios from "axios"

const accessToken = sessionStorage.getItem("accessToken")
export const searchTheaters = async (keyword, page, size) => {
    try {
        const res = await axios.get("http://localhost:9988/theaters/search", {
            params: { keyword, page, size }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data; // Page 객체 반환 (content, totalPages 포함)
    } catch (error) {
        console.error("영화관 검색 실패:", error);
        throw error;
    }
};