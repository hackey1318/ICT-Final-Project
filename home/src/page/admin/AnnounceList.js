import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnnounceCreateModal from "./AnnounceCreatedModal";
import Button from "../../js/common/Buttons";

export default function AnnounceList() {
    const [announces, setAnnounces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("ALL");
    const [showModal, setShowModal] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
    });

    const accessToken = sessionStorage.getItem("accessToken");
    const BASE_URL = '';
    const navigate = useNavigate();

    const fetchAnnounces = async (page = 0, type = "ALL", keyword = "") => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/announce`, {
                headers: accessToken
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {},
                params: {
                    page,
                    size: 10,
                    sort: 'createdAt,desc',
                    ...(keyword ? { type, keyword } : {})
                }
            });

            const data = res.data;
            setAnnounces(data.content);
            setPageInfo({
                pageNumber: data.number,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size
            });
        } catch (error) {
            console.error("Error fetching announces:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnounces();
    }, [accessToken]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAnnounces(0, searchType, searchKeyword.trim());
    };

    const handlePageChange = (newPage) => {
        fetchAnnounces(newPage, searchType, searchKeyword.trim());
    };

    const handleRowClick = (no) => {
        navigate(`/manager/home/announce/${no}`);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="announce-container p-4 rounded shadow-sm bg-light">
            {/* 제목 & 공지 작성 버튼 */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-primary fw-bold">📢 공지사항</h2>
                <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
                    + 공지 작성
                </button>
                <AnnounceCreateModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => fetchAnnounces(pageInfo.pageNumber, searchType, searchKeyword.trim())}
                />
            </div>

            {/* 🔍 검색창 */}
            <form className="d-flex justify-content-end mb-3" onSubmit={handleSearch}>
                <select
                    className="form-select w-auto me-2"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="ALL">전체</option>
                    <option value="TITLE">제목</option>
                    <option value="CONTENT">본문</option>
                </select>
                <input
                    type="text"
                    className="form-control-search w-25 me-2"
                    placeholder="검색어 입력"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button variant='primary'type="submit">검색</Button>
            </form>

            {/* 📄 테이블 */}
            <div className="table-responsive bg-white rounded shadow-sm p-3">
                <table className="table table-bordered table-hover mb-0">
                    <thead className="table-light text-center align-middle">
                        <tr>
                            <th style={{ width: '5%' }}>no</th>
                            <th style={{ width: '50%' }}>제목</th>
                            <th style={{ width: '15%' }}>작성자</th>
                            <th style={{ width: '15%' }}>공지 상태</th>
                            <th style={{ width: '15%' }}>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announces.length > 0 ? (
                            announces.map((announce, idx) => {
                                const roleLabel = announce.role === 'ADMIN'
                                    ? '[관리자] '
                                    : announce.role === 'MANAGER'
                                        ? '[담당자] '
                                        : '';
                                const displayNo = pageInfo.totalElements - (pageInfo.pageNumber * pageInfo.size + idx);
                                return (
                                    <tr
                                        key={announce.id}
                                        className="text-center align-middle"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRowClick(announce.id)}
                                    >
                                        <td>{displayNo}</td>
                                        <td className="text-start">{announce.title}</td>
                                        <td>{roleLabel + announce.nickname}</td>
                                        <td>{announce.status === 'ACTIVE' ? '공지중' : '공지 종료'}</td>
                                        <td>{new Date(announce.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">공지사항이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             {/* 페이지네이션 */}
             <div className="paging-container">
                {pageInfo.pageNumber > 0 && (
                    <button className="page-buttons" onClick={() => handlePageChange(pageInfo.pageNumber - 1)}>
                    이전
                    </button>
                )}

                <div className="page-buttons">
                    {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={pageInfo.pageNumber === i ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                    ))}
                </div>

                {pageInfo.pageNumber < pageInfo.totalPages - 1 && (
                    <button className="page-buttons" onClick={() => handlePageChange(pageInfo.pageNumber + 1)}>
                    다음
                    </button>
                )}
            </div>
        </div>
    );
}
