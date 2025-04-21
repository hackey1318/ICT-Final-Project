import axios from "axios";
import apiClient from "../../../js/public/axiosConfig";

export async function fetchNotificationCount() {
    try {
        const response = await apiClient.get("/noti/count");
        return await response.data
    } catch (error) {
        console.error("Failed to fetch notification count:", error)
        return 0
    }
}

export async function fetchNotifications(page, size) {
    try {
        const status = "READABLE"
        const response = await apiClient.get(`/noti/${status}`, {
            params: {
                page: page,  // 페이지 번호
                size: size   // 페이지 크기
            }
        })
        if (!response.data) {
            throw new Error("공지 목록을 불러오는데 실패했습니다.");
        }
        return response.data
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return []
    }
}

export async function markNotificationAsRead(notificationId) {
    try {
        const requestData = Array.isArray(notificationId) ? notificationId : [notificationId];

        const response = await apiClient.patch("/noti", requestData)
        return await response.data
    } catch (error) {
        console.error("Failed to mark notification as read:", error)
    }
}