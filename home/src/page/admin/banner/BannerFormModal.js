"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "../../../css/admin/BannerFormModal.css";
import apiNoAccessClient from "../../../js/public/axiosConfigNoAccess";
import apiClient from "../../../js/public/axiosConfig";

export default function BannerFormModal({ show, onClose, onSuccess, mode = "create", bannerData = null }) {
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 영화나 굿즈 객체 저장
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isSelecting, setIsSelecting] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageId, setImageId] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [type, setType] = useState("MOVIE");
    const observer = useRef();
    const fileInputRef = useRef(null);
    const [originalFileName, setOriginalFileName] = useState("");

    const accessToken = sessionStorage.getItem("accessToken");
    const BASE_URL = `${apiNoAccessClient.defaults.baseURL}`;

    useEffect(() => {
        const fetchOriginalFileName = async (fileId) => {
            if (!fileId) return;

            try {
                const response = await apiNoAccessClient.get(`${BASE_URL}/file-system/download/${fileId}`, {
                    responseType: "blob", // 파일 다운로드 받을 땐 blob
                });

                // Content-Disposition에서 파일 이름 추출
                const disposition = response.headers["content-disposition"];
                const match = disposition?.match(/filename="?([^"]+)"?/);
                const fileName = match ? decodeURIComponent(match[1]) : "파일명 없음";

                setOriginalFileName(fileName);
            } catch (error) {
                console.error("파일명 불러오기 실패:", error);
            }
        };

        if (show && mode === "modify" && bannerData) {
            setSelectedItem({ no: bannerData.targetNo, name: bannerData.targetName });
            setSearchTerm(bannerData.targetName);
            setBackgroundColor(bannerData.color || "#ffffff");
            setStartDate(bannerData.startDate?.slice(0, 16));
            setEndDate(bannerData.endDate?.slice(0, 16));
            setImageId(bannerData.fileId);
            setType(bannerData.type || "MOVIE");
            fetchOriginalFileName(bannerData.fileId);
        }
    }, [show, mode, bannerData]);

    // IntersectionObserver 수정
    const lastItemElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && page > 0) {  // 페이지가 0보다 클 때만 페이지 증가
                    setPage((prev) => prev + 1);  // 페이지가 증가하는 조건
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore, page],  // page와 hasMore가 변경될 때만 Observer 작동
    );

    // 글자 수정 시 다시 조회하도록 설정
    useEffect(() => {
        if (isSelecting) {
            setIsSelecting(false);
            return;
        }

        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(0);  // 검색어 수정 시 페이지 초기화
            setSearchResults([]);  // 기존 검색 결과 초기화
            setHasMore(true);  // hasMore 초기화
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchItems = async () => {
            if (!debouncedSearchTerm) return;  // 검색어가 비어 있으면 요청하지 않음

            try {
                const params = {
                    page,
                    size: 10,
                    name: debouncedSearchTerm,
                };

                const { data } = await apiClient.get(`${BASE_URL}/movies/search`, {
                    params,
                });

                if (data.content.length === 0) {
                    setHasMore(false);  // 더 이상 결과가 없으면 hasMore를 false로 설정
                } else {
                    setSearchResults((prev) => [...prev, ...data.content]);
                }
            } catch (err) {
                console.error("검색 실패:", err);
            }
        };

        if (show && debouncedSearchTerm) fetchItems();
    }, [debouncedSearchTerm, page, show]);

    const handleSearchClick = () => {
        setIsSelecting(true);
    };

    const handleFormModalClose = () => {
        // 모달 닫을 때 상태 초기화
        setImageId(null);
        setStartDate(null);
        setEndDate(null);
        setSelectedItem(null);
        setSearchTerm(""); // 검색어 초기화
        setDebouncedSearchTerm(""); // 검색어 디바운스 상태 초기화
        setBackgroundColor("#ffffff"); // 배경 색상 초기화
        setIsSelecting(false); // 항목 선택 상태 초기화
        setPage(0); // 페이지 초기화
        setSearchResults([]); // 검색 결과 초기화
        setHasMore(true); // 더 이상 결과 없음을 초기화
        setOriginalFileName(""); // 파일 이름 초기화
        if (fileInputRef.current) fileInputRef.current.value = ""; // 파일 입력 초기화
    
        onClose(); // 부모 컴포넌트에서 받은 onClose 함수 호출
    };
    

    const handleSubmit = async () => {
        if (!selectedItem || !startDate || !endDate) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }
        let uploadedImageId = imageId;
        // 이미지 업로드가 필요한 경우만 수행
        if (fileInputRef.current?.files?.length) {
            try {
                const formData = new FormData();
                Array.from(fileInputRef.current.files).forEach((file) => {
                    formData.append("files", file); // 서버에서는 files로 받음
                });

                const { data } = await apiNoAccessClient.post(`${BASE_URL}/file-system/upload`, formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                uploadedImageId = data[0]?.imageId;
                if (!uploadedImageId) throw new Error("imageId가 없습니다.");

                setImageId(uploadedImageId);
            } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드 중 오류 발생");
                return;
            }
        } else if (!imageId) {
            // 파일도 없고 기존 imageId도 없으면 경고
            alert("이미지를 업로드해주세요.");
            return;
        }

        const payload = {
            type,
            targetNo: selectedItem.no,
            startDate,
            endDate,
            color: backgroundColor,
            fileId: uploadedImageId,
        };

        try {
            let response;

            if (mode === "create") {
                response = await apiClient.post(`${BASE_URL}/banner-manage`, payload, );
            } else {
                response = await apiClient.patch(`${BASE_URL}/banner-manage/${bannerData.no}`, payload,);
            }

            if (response.data?.result === true) {
                alert(mode === "create" ? "배너가 등록되었습니다!" : "배너가 수정되었습니다!");
                onSuccess?.();
                handleFormModalClose();
            } else {
                console.error("응답 실패:", response.data);
                alert("배너 등록 중 오류 발생");
            }
        } catch (error) {
            console.error(mode === "create" ? "등록 실패:" : "수정 실패:", error);
            alert("배너 등록 중 오류 발생");
        }

    };

    const handleItemSelection = (item) => {
        setSelectedItem(item); // 영화나 굿즈 객체 전체를 선택 상태로 저장
        setSearchResults([]); // 검색 결과 초기화
        setPage(0);  // 페이지 초기화
        setSearchTerm(item.name);  // 선택된 항목의 이름을 검색창에 표시
    };

    const handleDelete = async () => {
        if (!bannerData?.no) return;
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await apiClient.delete(`${BASE_URL}/banner-manage/${bannerData.no}`,);
            alert("배너가 삭제되었습니다!");
            onSuccess?.();
            handleFormModalClose();
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("배너 삭제 중 오류 발생");
        }
    };


    if (!show) return null;

    return (
        <>
            <div className="custom-modal-backdrop" />
            <div className="custom-modal-wrapper">
                <div className="custom-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">{mode === "create" ? "📢 배너 등록" : "✏️ 배너 수정"}</h5>
                    </div>
                    <div className="modal-body">

                        <label className="form-label">영화 검색</label>
                        <div style={{ position: "relative", marginBottom: "20px" }}>
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={handleSearchClick}
                                    placeholder="영화 제목을 입력하세요"
                                    style={{ marginBottom: "0" }}
                                />
                            </div>

                            {searchResults.length > 0 && searchTerm && (
                                <div className="movie-scroll-list">
                                    {searchResults.map((item, index) => (
                                        <div
                                            key={item.no}
                                            ref={index === searchResults.length - 1 ? lastItemElementRef : null}
                                            className={`movie-item ${selectedItem?.no === item.no ? "selected" : ""}`}
                                            onClick={() => handleItemSelection(item)}
                                        >
                                            {`${type === "MOVIE" ? "🎬" : "🛍️"} ${item.name}`}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <label className="form-label">배경 색상</label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "1rem",
                                width: "100%",
                                maxWidth: "100%"
                            }}
                        >
                            {/* 컬러 피커 */}
                            <input
                                type="color"
                                value={/^#([0-9A-Fa-f]{6})$/.test(backgroundColor) ? backgroundColor : "#ffffff"}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                style={{
                                    width: "300px",
                                    height: "60px",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            />

                            {/* HEX 코드 입력 */}
                            <input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                placeholder="#ffffff"
                                maxLength={7}
                                style={{
                                    width: "80px",
                                    padding: "6px 8px",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    fontSize: "12px"
                                }}
                            />
                        </div>

                        <label className="form-label">시작일</label>
                        <input
                            type="date"
                            className="form-control mb-3"
                            value={startDate?.slice(0, 10) || ''}
                            onChange={(e) => setStartDate(e.target.value + 'T00:00:00')}
                            />

                        <label className="form-label">종료일</label>
                        <input
                            type="date"
                            className="form-control mb-3"
                            value={endDate?.slice(0, 10) || ''}
                            onChange={(e) => setEndDate(e.target.value + 'T00:00:00')}
                        />

                        <label className="form-label">배너 이미지</label>
                        <div>
                            <label htmlFor="file-upload" className="btn btn-outline-secondary btn-sm">
                                {originalFileName ? "파일 변경" : "파일 업로드"}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={(e) => {
                                    if (e.target.files?.length) {
                                        setOriginalFileName(e.target.files[0].name);
                                        // 여기서 파일도 실제 업로드 처리 가능
                                    }
                                }}
                            />
                            {originalFileName && (
                                <p className="text-muted mt-2" style={{ fontSize: "13px" }}>
                                    선택된 파일: {originalFileName}
                                </p>
                            )}
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {mode === "create" ? "등록" : "수정"}
                        </button>
                        {mode === "modify" && (
                            <button className="btn btn-danger me-auto" onClick={handleDelete}>
                                삭제
                            </button>
                        )}
                        <button className="btn btn-secondary" onClick={onClose}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
