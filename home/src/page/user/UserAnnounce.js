import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = 'http://localhost:9988'; // Spring 서버 주소
const accessToken = sessionStorage.getItem("accessToken");

export default function UserAnnounce() {

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0); // 페이지 수
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지

    useEffect(() => {
        const getAnnouncements = async () => {
            try {
                const config = accessToken
                ? {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
                : {};
                const res = await axios.get(`${BASE_URL}/announce`, {
                    params: { page: currentPage, size: 10 } // 페이지네이션
                }, config);
                setAnnouncements(Array.isArray(res.data.content) ? res.data.content : []);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Error fetching announcements:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
            
        }
        getAnnouncements();
    }, [currentPage]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handlePageChange = (page) => {
        setCurrentPage(page); // 페이지 변경 시 currentPage 업데이트
    };

    return (
        <div className="container mt-4">
            <h2>공지사항</h2>
            {totalPages > 0 && (
                <div className="pagination mt-4">
                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        이전
                    </button>
                    <span className="mx-2">{currentPage + 1} / {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        다음
                    </button>
                </div>
            )}
            <ul className="list-group">
                {announcements.length === 0 ? (
                    <li className="list-group-item">공지사항이 없습니다.</li>
                ) : (
                    announcements.map(announce => (
                        <li key={announce.id} className="list-group-item d-flex justify-content-between">
                            <Link to={`/announcements/${announce.id}`} className="text-decoration-none">
                                <strong>{announce.title}</strong>
                            </Link>
                            <span className="text-muted">{new Date(announce.createdAt).toLocaleDateString()}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}