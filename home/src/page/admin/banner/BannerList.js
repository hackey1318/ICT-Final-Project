// BannerList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BannerFormModal from "./BannerFormModal"; // 모달 컴포넌트
import BannerDetailModal from "./BannerDetailModal"; // 배너 상세 모달 컴포넌트
import Button from "../../../js/common/Buttons";

export default function BannerList() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("MOVIE");
    const [showFormModal, setShowFormModal] = useState(false); // 배너 등록/수정 모달
    const [showDetailModal, setShowDetailModal] = useState(false); // 배너 상세 모달
    const [mode, setMode] = useState("create"); // 모달 모드 (등록/수정)
    const [selectedBanner, setSelectedBanner] = useState(null); // 클릭된 배너 정보
    const [pageInfo, setPageInfo] = useState({
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
    });

    const accessToken = sessionStorage.getItem("accessToken");
    const BASE_URL = "http://localhost:9988";
    const navigate = useNavigate();

    const fetchBanners = async (page = 0, type = "MOVIE", keyword = "") => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/banner-manage/${type}`, {
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

    const handleRowClick = (banner) => {
        setSelectedBanner(banner); // 클릭된 배너 정보를 선택
        setShowDetailModal(true); // 배너 상세 모달 열기
    };

    const handleFormModalClose = () => setShowFormModal(false);
    const handleDetailModalClose = () => setShowDetailModal(false);

    const handleEdit = (banner) => {
        setMode("modify");
        setSelectedBanner(banner);
        setShowDetailModal(false);
        setShowFormModal(true);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="announce-container p-4 rounded shadow-sm bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-primary fw-bold">📢 배너 관리</h2>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => { setShowFormModal(true); setMode("create"); }} // 배너 등록 시 모달 열기
                >
                    + 배너 등록
                </button>
                <BannerFormModal
                    show={showFormModal}
                    onClose={handleFormModalClose}
                    onSuccess={() => {
                        console.log("배너 등록/수정 성공");
                        fetchBanners();
                    }}
                    mode={mode}
                    bannerData={mode === "modify" ? selectedBanner : null}
                />
                <BannerDetailModal
                    show={showDetailModal}
                    banner={selectedBanner}
                    onSuccess={() => {
                        console.log("배너 수정/삭제 성공");
                        fetchBanners();
                    }}
                    onClose={handleDetailModalClose}
                    onEdit={handleEdit}
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
                <Button variant='primary'type="submit">검색</Button>
            </form>

            {/* 📄 배너 리스트 테이블 */}
            <div className="table-responsive bg-white rounded shadow-sm p-3">
                <table className="table table-bordered table-hover mb-0">
                    <thead className="table-light text-center align-middle">
                        <tr>
                            <th style={{ width: "10%" }}>No</th>
                            <th style={{ width: "50%" }}>영화 제목</th>
                            {/* <th style={{ width: "10%" }}>타입</th> */}
                            <th style={{ width: "15%" }}>배경 색상</th>
                            <th style={{ width: "25%" }}>기간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners && banners.length > 0 ? (
                            banners.map((banner, idx) => {
                                const displayNo = pageInfo.totalElements - (pageInfo.pageNumber * pageInfo.size + idx);
                                const isDeleted = banner.status === "DELETE";

                                return (
                                    <tr
                                        key={banner.id}
                                        className={`text-center align-middle ${isDeleted ? "text-muted" : ""}`}
                                        style={{
                                            cursor: isDeleted ? "not-allowed" : "pointer",
                                            opacity: isDeleted ? 0.5 : 1,
                                            pointerEvents: isDeleted ? "none" : "auto", // 클릭 방지
                                        }}
                                        onClick={() => !isDeleted && handleRowClick(banner)} // 삭제된 항목은 클릭 무시
                                    >
                                        <td>{displayNo}</td>
                                        <td className="text-start">{banner.targetName}</td>
                                        {/* <td>{banner.type}</td> */}
                                        <td style={{ backgroundColor: banner.color }}>{banner.color}</td>
                                        <td>
                                            {`${new Date(banner.startDate).toLocaleDateString()} ~ ${new Date(banner.endDate).toLocaleDateString()}`}
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
