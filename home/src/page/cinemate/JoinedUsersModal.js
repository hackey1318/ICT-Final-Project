import React, { useEffect, useRef } from "react";
import "../../css/cinemate/JoinedUsersBadgeModal.css";

export default function JoinedUsersBadgeModal({ show, onClose, users, onLike }) {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="badge-modal-overlay">
            <div className="badge-modal-content" ref={modalRef}>
                <div className="badge-modal-header">
                    <span className="badge-modal-title">참여자</span>
                    <button className="badge-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="badge-modal-body">
                    {users.length === 0 ? (
                        <p className="empty-text">참여자가 없습니다.</p>
                    ) : (
                        <div className="badge-user-list">
                            {users.map(user => (
                                <div key={user.userNo} className="badge-user-item">
                                    <img
                                        src={user.profile || "/default-profile.png"}
                                        alt="profile"
                                        className="badge-user-profile"
                                    />
                                    <span className="badge-user-nickname">
                                        {user.nickName} {user.me && "(나)"}
                                    </span>
                                    {/* {!user.me && (
                                        <button
                                            className="like-btn"
                                            onClick={() => onLike(user.userNo)}
                                        >
                                            {user.isLiked ? "❤️" : "🤍"}
                                        </button>
                                    )} */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
