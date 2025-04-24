import axios from 'axios';

export const unlikeItem = async (itemId) => {

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
        console.error("토큰이 없습니다.");
        throw new Error("인증되지 않은 사용자입니다.");
    }

    try {
        await axios.patch(`http://localhost:9988/likes/${itemId}`, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
    } catch (error) {
        console.error("좋아요 해제 실패:", error);
        throw error;
    }
};