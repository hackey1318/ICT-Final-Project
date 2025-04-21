import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/admin/AnnounceModal.css';

export default function AnnounceCreateModal({ show, onClose, onSuccess }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [expiredAt, setExpiredAt] = useState('');
    const accessToken = sessionStorage.getItem('accessToken');
    const BASE_URL = 'http://localhost:9988';

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden'; // 스크롤 막기
        } else {
            document.body.style.overflow = '';
        }
    }, [show]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/announce`, {
                title,
                content,
                expiredAt: expiredAt ? new Date(expiredAt).toISOString() : null,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            alert('공지사항이 등록되었습니다!');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('작성 실패:', err);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="custom-modal-backdrop" />
            <div className="custom-modal-wrapper">
                <div className="custom-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">📢 공지사항 작성</h5>
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
                        <button className="btn btn-primary" onClick={handleSubmit}>작성</button>
                        <button className="btn btn-secondary" onClick={onClose}>취소</button>
                    </div>
                </div>
            </div>
        </>
    );
}
