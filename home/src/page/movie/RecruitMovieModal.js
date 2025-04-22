import { useEffect, useState } from "react"
import "../../css/movie/RecruitMovie.css"
import { searchTheaters } from './../../js/movie/TheaterAPI';
import { generateCineMate } from './../../js/movie/CineMate';
import { max } from "lodash";

export default function RecruitMovieModal({ movie, closeModal }) {

    const [isSelecting, setIsSelecting] = useState(false);
    const [theaterInput, setTheaterInput] = useState(""); // 입력 필드용 상태
    const [theater, setTheater] = useState(null);
    const [theaterSuggestions, setTheaterSuggestions] = useState([])
    const [debouncedTheater, setDebouncedTheater] = useState("")
    const [maxMemberCount, setMaxMemberCount] = useState(2);
    const [date, setDate] = useState("")
    const [content, setContent] = useState("")
    const [hoveredIndex, setHoveredIndex] = useState(-1)  // hover된 인덱스

    const [currentPage, setCurrentPage] = useState(0)  // 현재 페이지
    const [totalPages, setTotalPages] = useState(0)  // 전체 페이지 수
    const [isLoading, setIsLoading] = useState(false)  // 데이터 로딩 상태
    const [hasMore, setHasMore] = useState(true)  // 더 가져올 데이터가 있는지 여부

    useEffect(() => {
        if (isSelecting) {
            setIsSelecting(false);
            return; // 선택으로 인해 바뀐 경우, 검색 방지
        }

        const handler = setTimeout(() => {
            setDebouncedTheater(theaterInput)
            setCurrentPage(0)
        }, 500)

        return () => {
            clearTimeout(handler) // 타이핑 중이면 이전 타이머 제거
        }
    }, [theaterInput])

    useEffect(() => {
        if (debouncedTheater?.trim()) {
            // 검색어가 바뀐 경우, 초기화
            setTheaterSuggestions([]);
            setCurrentPage(0);
            setHasMore(true);
        }
    }, [debouncedTheater]);

    useEffect(() => {
        if (debouncedTheater?.trim()) {
            setIsLoading(true);

            searchTheaters(debouncedTheater, currentPage, 10)
                .then((data) => {
                    if (currentPage === 0) {
                        setTheaterSuggestions(data.content);  // 새로 검색한 경우 덮어쓰기
                    } else {
                        // 중복 제거하면서 누적
                        setTheaterSuggestions((prev) => [
                            ...prev,
                            ...data.content.filter(
                                (newTheater) => !prev.some((t) => t.no === newTheater.no)
                            )
                        ]);
                    }

                    setTotalPages(data.totalPages);
                    setHasMore(data.content.length > 0 && currentPage < data.totalPages);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("영화관 검색 실패:", err);
                    setIsLoading(false);
                });
        }
    }, [debouncedTheater, currentPage]);

    const handleSubmit = () => {
        if (!theater || !date || !content || !maxMemberCount) {
            alert("모든 항목을 입력해주세요.")
            return
        }

        // 모집글 등록 처리
        generateCineMate(movie.no, theater.no, date, maxMemberCount, content)
            .then((response) => {
                console.log("모집글 등록 성공:", response.data)
                alert("모집글이 등록되었습니다.")
            })
            .catch((error) => {
                console.error("모집글 등록 실패:", error)
                alert("모집글 등록에 실패했습니다.")
            })
        closeModal()
    }

    // 스크롤 이벤트 핸들러
    const handleScroll = (e) => {
        const bottom =
            e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
        if (bottom && !isLoading && hasMore) {
            setIsLoading(true);  // 로딩 상태로 설정
            setCurrentPage((prevPage) => prevPage + 1);  // 다음 페이지로 증가
        }
    };

    const handleMouseEnter = (index) => {
        setHoveredIndex(index)  // hover된 항목 인덱스 설정
    }

    const handleSuggestionClick = (selectedTheater) => {
        setIsSelecting(true);
        setTheater(selectedTheater);
        setTheaterInput(selectedTheater.name);
        setDebouncedTheater(""); // 강제로 검색 중단
        setTheaterSuggestions([]);
    };

    const getMinDateTime = () => {
        const now = new Date();
        const openDate = new Date(movie.openDate);

        const baseDate = now > openDate ? now : openDate;
        baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset()); // timezone 보정
        return baseDate.toISOString().slice(0, 16);
    };

    return (
        <div className="md_modal-overlay">
            <div className="md_modal-wrapper" style={{ maxWidth: "800px" }}>
                <div className="md_modal-content">
                    <div className="md_modal-header">
                        <h2 className="md_modal-title">같이 볼 사람 구하기</h2>
                        <button className="md_close-btn" onClick={closeModal}>
                            &times;
                        </button>
                    </div>

                    <div className="md_modal-body md_flex-row">
                        {/* 왼쪽: 입력 폼 */}
                        <div className="md_modal-left" style={{ flex: 2, paddingRight: "1.5rem" }}>
                            <p><strong>영화명:</strong> {movie.name}</p>

                            <div className="md_form-group" style={{ position: "relative" }}>
                                <label>영화관</label>
                                <input
                                    type="text"
                                    className="md_form-input"
                                    value={theaterInput}
                                    placeholder="영화관 이름을 입력하세요"
                                    onChange={(e) => {
                                        setTheaterInput(e.target.value);  // 입력값 갱신
                                        setTheater(null);                 // 입력 중이면 선택된 영화관 초기화
                                    }}
                                />
                                {theaterSuggestions.length > 0 && (
                                    <div className="suggestions-container" onScroll={handleScroll}>
                                        {theaterSuggestions.map((theater, index) => (
                                            <div
                                                key={theater.no}
                                                className={`suggestion-item ${index === hoveredIndex ? "hovered" : ""}`}
                                                onMouseEnter={() => handleMouseEnter(index)}  // hover 이벤트
                                                onClick={() => handleSuggestionClick(theater)}   // 클릭 이벤트
                                            >
                                                {theater.name}
                                            </div>
                                        ))}
                                        {isLoading && <div>로딩 중...</div>} {/* 로딩 중 표시 */}
                                        {!hasMore && <div>더 이상 데이터가 없습니다.</div>} {/* 더 이상 데이터 없음 표시 */}
                                    </div>
                                )}
                            </div>

                            <div className="md_form-group">
                                <label>날짜</label>
                                <input
                                    type="datetime-local"
                                    className="md_form-input"
                                    value={date}
                                    min={getMinDateTime()}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="md_form-group">
                                <label>최대 모집 인원</label>
                                <input
                                    type="number"
                                    className="md_form-input"
                                    value={maxMemberCount}
                                    min={2}
                                    onChange={(e) => setMaxMemberCount(parseInt(e.target.value, 10))}
                                    placeholder="최소 2명 이상"
                                />
                            </div>

                            <div className="md_form-group">
                                <label>모집 내용</label>
                                <textarea
                                    className="md_form-input"
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 오른쪽: 영화 포스터 */}
                        <div className="md_modal-right" style={{ flex: 1 }}>
                            <img
                                src={movie.postImage}
                                alt={movie.name}
                                style={{ width: "100%", borderRadius: "8px" }}
                            />
                        </div>
                    </div>

                    <div className="md_modal-footer">
                        <button className="md_register-btn" onClick={handleSubmit}>등록</button>
                        <button className="md_cancel-btn" onClick={closeModal}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
