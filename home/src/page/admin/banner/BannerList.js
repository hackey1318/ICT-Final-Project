// BannerList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BannerFormModal from "./BannerFormModal"; // 모달 컴포넌트

export default function BannerList() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("ALL");
    const [showModal, setShowModal] = useState(false); // 모달 열기 상태
    const [mode, setMode] = useState("create"); // 모달 모드 (등록/수정)
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
    });

    const accessToken = sessionStorage.getItem("accessToken");
    const BASE_URL = "http://localhost:9988";
    const navigate = useNavigate();

    const fetchBanners = async (page = 0, type = "ALL", keyword = "") => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/banner/${type}`, {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                params: {
                    page,
                    size: 10,
                    sort: "createdAt,desc",
                    ...(keyword ? { type, keyword } : {}),
                },
            });

            const data = res.data;
            setBanners(data.content);
            setPageInfo({
                pageNumber: data.number,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
            });
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, [accessToken]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBanners(0, searchType, searchKeyword.trim());
    };

    const handlePageChange = (newPage) => {
        fetchBanners(newPage, searchType, searchKeyword.trim());
    };

    const handleRowClick = (no) => {
        navigate(`/manager/home/banner/${no}`);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="announce-container p-4 rounded shadow-sm bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-primary fw-bold">📢 배너 관리</h2>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => { setShowModal(true); setMode("create"); }} // 배너 등록 시 모달 열기
                >
                    + 배너 등록
                </button>
                <BannerFormModal
                    show={showModal} // 모달 상태
                    mode={mode} // 모달 모드 (등록/수정)
                    onClose={() => setShowModal(false)} // 모달 닫기
                    onSuccess={() => fetchBanners(pageInfo.pageNumber, searchType, searchKeyword.trim())} // 배너 등록 후 리스트 갱신
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
                    <option value="TYPE">타입</option>
                </select>
                <input
                    type="text"
                    className="form-control-search w-25 me-2"
                    placeholder="검색어 입력"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">검색</button>
            </form>

            {/* 📄 배너 리스트 테이블 */}
            <div className="table-responsive bg-white rounded shadow-sm p-3">
                <table className="table table-bordered table-hover mb-0">
                    <thead className="table-light text-center align-middle">
                        <tr>
                            <th style={{ width: "5%" }}>No</th>
                            <th style={{ width: "30%" }}>배너 제목</th>
                            <th style={{ width: "20%" }}>타입</th>
                            <th style={{ width: "20%" }}>기간</th>
                            <th style={{ width: "25%" }}>배경 색상</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners && banners.length > 0 ? (
                            banners.map((banner, idx) => {
                                const displayNo = pageInfo.totalElements - (pageInfo.pageNumber * pageInfo.size + idx);
                                return (
                                    <tr
                                        key={banner.id}
                                        className="text-center align-middle"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleRowClick(banner.id)}
                                    >
                                        <td>{displayNo}</td>
                                        <td className="text-start">{banner.title}</td>
                                        <td>{banner.type}</td>
                                        <td>{`${new Date(banner.startDate).toLocaleDateString()} ~ ${new Date(banner.endDate).toLocaleDateString()}`}</td>
                                        <td style={{ backgroundColor: banner.backgroundColor }}>
                                            {banner.backgroundColor}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">배너가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${pageInfo.pageNumber === 0 && "disabled"}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageInfo.pageNumber - 1)}>
                                이전
                            </button>
                        </li>
                        {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${pageInfo.pageNumber === i ? "active" : ""}`}>
                                <button className="page-link" onClick={() => handlePageChange(i)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${pageInfo.pageNumber + 1 === pageInfo.totalPages && "disabled"}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageInfo.pageNumber + 1)}>
                                다음
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
