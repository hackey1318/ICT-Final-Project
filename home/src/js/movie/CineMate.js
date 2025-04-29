import apiClient from "../public/axiosConfig";

const ensureFullDateTime = (dtStr) => {
    // "2025-04-22T15:30" → "2025-04-22T15:30:00"
    return dtStr.length === 16 ? `${dtStr}:00` : dtStr;
};

export const generateCineMate = async (movieNo, theaterNo, dateTime, maxMemberCount, content) => {
    try {
        const res = await apiClient.post("/cinemate", {
            movieNo: movieNo,
            theaterNo: theaterNo,
            maxMemberCount: maxMemberCount,
            meetingDate: ensureFullDateTime(dateTime),  // dateTime을 ISO 형식으로 변환
            content: content
        });
        return res.data;
    } catch (error) {
        console.error("시네메이트 등록 실패:", error);
        throw error;
    }
};