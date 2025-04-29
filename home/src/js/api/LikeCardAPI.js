import apiClient from "../public/axiosConfig";

export const unlikeItem = async (itemId) => {
    try {
        await apiClient.patch(`/likes/${itemId}`);
    } catch (error) {
        console.error("좋아요 해제 실패:", error);
        throw error;
    }
};