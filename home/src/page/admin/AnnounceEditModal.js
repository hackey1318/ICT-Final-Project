import { useState } from "react";
import '../../css/admin/AnnounceModal.css';
import apiClient from "../../js/public/axiosConfig";

export default function AnnounceEditModal({ show, onClose, announceData, onSave }) {
    const [title, setTitle] = useState(announceData.title);
    const [content, setContent] = useState(announceData.content);
    const [expiredAt, setExpiredAt] = useState(announceData.expiredAt || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedAnnounce = { title, content, expiredAt: expiredAt ? new Date(expiredAt).toISOString() : null };
            await apiClient.patch(`/announce/${announceData.id}`, updatedAnnounce,);
            alert("공지사항이 수정되었습니다.");
            onSave(); // 수정 후 부모 컴포넌트에서 새로 고침
            onClose(); // 모달 닫기
        } catch (err) {
            console.error("공지사항 수정 실패", err);
            alert("공지사항 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {show && (
                <>
                    <div className="custom-modal-backdrop" />
                    <div className="custom-modal-wrapper">
                        <div className="custom-modal">
                            <div className="modal-header">
                                <h5 className="modal-title">📢 공지사항 수정</h5>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">제목</label>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="공지 제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label className="form-label">만료일</label>
                                <input
                                    type="datetime-local"
                                    className="form-control mb-3"
                                    value={expiredAt}
                                    onChange={(e) => setExpiredAt(e.target.value)}
                                />
                                <label className="form-label">내용</label>
                                <textarea
                                    className="form-control"
                                    rows={6}
                                    placeholder="공지 내용을 입력하세요"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn my-custom-btn" onClick={handleSave} disabled={loading}>
                                    {loading ? "저장 중..." : "저장"}
                                </button>
                                <button className="btn btn-secondary" onClick={onClose}>취소</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
