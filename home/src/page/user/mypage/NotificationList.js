import { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from '../notification/NotificationService';
import { X } from "lucide-react";
import moment from "moment";
import '../../../css/user/notification/NotificationPage.css';

export default function NotificationList () {

    const [notificationCount, setNotificationCount] = useState(0);
    const [allNotifications, setAllNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(10);

    useEffect(() => {
        if (!!sessionStorage.getItem('accessToken')) {
            loadNotifications(page, size);
        }
    }, [page, size]);

    const loadNotifications = async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            const data = await fetchNotifications(pageNumber, pageSize);
            setAllNotifications(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const updatedNotifications = allNotifications.filter((notification) => notification.id !== notificationId);
            setAllNotifications(updatedNotifications);
            setNotificationCount((prev) => Math.max(0, prev - 1));
            await markNotificationAsRead(notificationId);

            if (updatedNotifications.length === 0 && page + 1 < totalPages) {
                setPage(page + 1);
                loadNotifications(page + 1, size);
            } else if (updatedNotifications.length === 0 && page > 0) {
                setPage(page - 1);
                loadNotifications(page - 1, size);
            } else {
                loadNotifications(page, size);
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const notificationIds = allNotifications.map((notification) => notification.id);
            await markNotificationAsRead(notificationIds);
            setAllNotifications([]);
            setNotificationCount(0);
            setPage(0);
            setTotalPages(0);
            loadNotifications(0, size);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const prevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const nextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    return (
        <div className="notification-page-container">
            <div className="notification-page-header">
                <h2>알림 목록</h2>
                {allNotifications.length > 0 && (
                    <button className="notification-page-readall-btn" onClick={handleMarkAllAsRead}>
                        전체 읽음
                    </button>
                )}
            </div>
    
            {loading && allNotifications.length === 0 ? (
                <div className="notification-page-loading">로딩 중...</div>
            ) : allNotifications.length > 0 ? (
                <>
                    <ul className="notification-page-list">
                        {allNotifications.map((notification) => (
                            <li key={notification.id} className="notification-page-item">
                                <div className="notification-page-content">
                                    <p className="notification-page-message">{notification.content}</p>
                                    <div className="notification-page-time-actions">
                                        <span className="notification-page-time">{moment(notification.createdAt).fromNow()}</span>
                                        <button
                                            className="notification-page-delete-btn"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            aria-label="읽음 표시"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
    
                    {totalPages > 1 && (
                        <div className="notification-page-pagination">
                            <button onClick={prevPage} disabled={page === 0}>
                                ←
                            </button>
                            <span>{page + 1} / {totalPages}</span>
                            <button onClick={nextPage} disabled={page === totalPages - 1}>
                                →
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="notification-page-empty">알림이 없습니다</div>
            )}
        </div>
    );
    
}
