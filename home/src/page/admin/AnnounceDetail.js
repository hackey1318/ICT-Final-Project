import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnnounceEditModal from "./AnnounceEditModal";
import apiClient from "../../js/public/axiosConfig";

export default function AnnounceDetail() {
    const { no } = useParams();
    const navigate = useNavigate();
    const [announce, setAnnounce] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false); // 수정 모달 상태
    const accessToken = sessionStorage.getItem("accessToken");
    const BASE_URL = '';

    const fetchAnnounce = async () => {
        try {
            const res = await apiClient.get(`${BASE_URL}/announce/${no}`);
            setAnnounce(res.data);
        } catch (err) {
            console.error("공지사항을 불러오는 데 실패했습니다.", err);
            alert("공지사항을 불러오는 데 실패했습니다.");
            navigate("/manager/home/announce");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/announce/${no}`);
                alert("공지사항이 삭제되었습니다.");
                navigate("/manager/home/announce"); // 삭제 후 목록 페이지로 이동
            } catch (error) {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const handleEdit = () => {
        setShowEditModal(true); // 수정 모달 열기
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false); // 수정 모달 닫기
    };

    const handleSave = () => {
        // 공지사항 수정 후 부모 컴포넌트에서 새로 고침
        fetchAnnounce();
    };

    useEffect(() => {
        fetchAnnounce();
    }, [no]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!announce) return null;

    const roleLabel = announce.role === 'ADMIN' ? '[관리자]' : announce.role === 'MANAGER' ? '[담당자]' : '';

    return (
        <div className="p-4">
            <h2 className="fw-bold text-primary mb-3">📄 공지 상세</h2>



            <div className="bg-white p-4 rounded shadow-sm mb-3">
                <h4 className="fw-bold mb-3">{announce.title}</h4>
                <div className="d-flex justify-content-between mb-2 text-muted small">
                    <span>{roleLabel} {announce.nickname}</span>
                    <div className="text-end">
                        <div>작성일: {new Date(announce.createdAt).toLocaleString()}</div>
                        <div>만료일: {announce.expiredAt ? new Date(announce.expiredAt).toLocaleString() : '-'}</div>
                    </div>
                </div>
                <hr />
                <div className="mt-3" style={{ whiteSpace: 'pre-line' }}>
                    {announce.content}
                </div>
            </div>

            <div className="mt-4 text-end">
                {
                    announce.status === 'ACTIVE' ? (
                        <>
                            <button className="btn my-custom-btn" onClick={handleEdit}>수정</button>
                            <button className="btn btn-danger ms-2" onClick={handleDelete}>삭제</button>
                        </>
                    ): null
                }
                
                <button className="btn btn-secondary ms-2" onClick={() => navigate("/manager/home/announce")}>목록</button>
            </div>


            <AnnounceEditModal
                show={showEditModal}
                onClose={handleCloseEditModal}
                announceData={announce} // 수정할 공지사항 데이터 전달
                onSave={handleSave} // 수정 후 호출할 함수 전달
            />
        </div>
    );
}
