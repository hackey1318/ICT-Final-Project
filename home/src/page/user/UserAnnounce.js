import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";

const BASE_URL = ''; // Spring 서버 주소
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
                const res = await apiNoAccessClient.get(`${BASE_URL}/announce`, {
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
                <div className="d-flex justify-content-end mb-3">
                    <div className="btn-group">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            이전
                        </button>
                        <span className="btn btn-light disabled">{currentPage + 1} / {totalPages}</span>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            다음
                        </button>
                    </div>
                </div>

            )}
            <ul className="list-group">
                {announcements.length === 0 ? (
                    <li className="list-group-item text-center">공지사항이 없습니다.</li>
                ) : (
                    announcements.map((announce, index) => (
                        <Link
                            key={announce.id}
                            to={`/announcements/${announce.id}`}
                            className="text-decoration-none"
                            style={{ color: "#000" }}
                        >
                            <li
                                className="list-group-item d-flex justify-content-between align-items-center mb-3"
                                style={{
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    padding: "15px",
                                    backgroundColor: "#f8f9fa",
                                    cursor: "pointer" // 클릭 가능하게 스타일링
                                }}
                            >
                                <div>
                                    <h5 className="mb-1" style={{ fontWeight: "600" }}>{announce.title}</h5>
                                    <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                                        <strong>No: </strong>{currentPage * 10 + index + 1} | <strong>작성일: </strong>{new Date(announce.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                                    {new Date(announce.createdAt).toLocaleDateString()}
                                </span>
                            </li>
                        </Link>
                    ))
                )}
            </ul>
        </div>
    );
}