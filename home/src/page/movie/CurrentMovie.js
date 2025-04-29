import { useEffect, useState } from "react";
import MoviePagination from "../../js/public/Pagination"; // 경로가 올바른지 확인하세요
import axios from "axios";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";

function CurrentMovie() {
    // 영화 목록, 현재 페이지, 총 페이지 수를 위한 상태
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0); // Spring Data Pageable을 위해 페이지는 0부터 시작
    const [totalPages, setTotalPages] = useState(1); // 잠재적인 0으로 나누기 오류를 피하기 위해 1로 초기화

    // --- 도우미 함수 (GenreMovie에서 복사) ---

    // 연령 등급 배지의 색상을 결정합니다.
    function getAgeBadgeColor(grade) {
        switch (String(grade)) { // 등급이 문자열로 처리되도록 보장
            case "15": return "#f39c12";  // 주황
            case "12": return "#3498db";  // 파랑
            case "All": return "#2ecc71"; // 초록
            case "18": return "#e74c3c"; // 빨강
            default: return "#7f8c8d";     // 회색
        }
    }

    // 창 너비에 따라 페이지당 영화 수를 결정합니다.
    function getPageSize(width) {
        if (width < 576) return 4;     // 모바일
        if (width < 768) return 6;     // 태블릿
        if (width < 992) return 9;     // 작은 데스크탑
        return 12;                     // 기본 데스크탑, 큰 화면
    }

    // --- useEffect 훅 ---

    // 페이지 번호가 변경될 때 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    // 컴포넌트 마운트 시 또는 페이지 변경 시 현재 상영 중인 영화 가져오기
    useEffect(() => {
        const fetchCurrentMovies = async () => {
            // 이 컴포넌트에서는 항상 'PRESENT' 타입 영화를 가져옵니다.
            const movieType = 'PRESENT';
            const currentPageSize = getPageSize(window.innerWidth);

            try {
                console.log(`페이지 가져오는 중: ${page}, 크기: ${currentPageSize}, 타입: ${movieType}`); // 디버그 로그
                const response = await apiNoAccessClient.get(`/movies/${movieType}`, {
                    params: {
                        page: page,
                        size: currentPageSize,
                        sort: 'createdAt,desc', // 정렬 유지 (원하는 경우), 필요시 조정
                    },
                });

                console.log("API 응답:", response.data); // 디버그 로그

                setMovies(response.data.content || []); // movies가 항상 배열이 되도록 보장
                setTotalPages(response.data.totalPages || 1); // totalPages가 최소 1이 되도록 보장

            } catch (error) {
                console.error('현재 상영작 데이터를 불러오는 중 오류 발생:', error);
                // 선택 사항: 오류 발생 시 movies를 빈 배열로, totalPages를 1로 설정
                setMovies([]);
                setTotalPages(1);
            }
        };

        fetchCurrentMovies();
    }, [page]); // 페이지가 변경될 때만 이펙트 재실행

    // --- JSX 렌더링 ---

    return (
        <main className="bg-white min-vh-100">
            <div className="container py-3">
                {/* 헤더 */}
                <div className="mb-4"> {/* 하단 마진 증가 */}
                    <h1 className="h2 fw-bold">현재 상영작</h1> {/* 제목 변경 */}
                </div>

                {/* 페이지네이션 (일반적인 배치를 위해 영화 목록 위로 이동) */}
                <div className="d-flex justify-content-center mb-4"> {/* 페이지네이션 중앙 정렬 */}
                   { totalPages > 1 && ( // 페이지가 1개 이상일 때만 페이지네이션 표시
                     <MoviePagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                     />
                    )}
                </div>

                {/* 영화 카드 그리드 */}
                <div className="row g-4">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <div key={movie.no} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                {/* 영화 상세 페이지 링크 */}
                                <a href={`/movies/${movie.no}`} className="text-decoration-none text-dark">
                                    <div className="card h-100 shadow-sm position-relative overflow-hidden"> {/* overflow-hidden 추가 */}
                                        {/* 연령 등급 배지 */}
                                        <span
                                            className="age-badge position-absolute top-0 start-0 m-2 px-2 py-1 text-white rounded shadow-sm" // 작은 그림자 추가
                                            style={{
                                                backgroundColor: getAgeBadgeColor(movie.ageGrade),
                                                zIndex: 1 // 배지가 이미지 위에 오도록 보장
                                            }}
                                        >
                                            {/* 18세 등급은 '청불' 또는 '19'로 표시, 나머지는 등급 그대로 표시 */}
                                            {String(movie.ageGrade) === "18" ? "청불" : movie.ageGrade}
                                        </span>

                                        {/* 영화 포스터 */}
                                        <img
                                            src={movie.postImage || '/path/to/default/placeholder.png'} // 대체 이미지 경로 추가
                                            alt={`${movie.name} 포스터`}
                                            className="card-img-top"
                                            style={{ height: "300px", objectFit: "cover" }}
                                            onError={(e) => { e.target.onerror = null; e.target.src='/path/to/default/placeholder.png'; }} // 이미지 로드 오류 처리
                                        />

                                        {/* 영화 정보 */}
                                        <div className="card-body py-2 px-3"> {/* 패딩 조정 */}
                                            <p className="card-title fw-bold text-truncate mb-1">{movie.name || "제목 없음"}</p> {/* 폴백 텍스트 추가 및 마진 조정 */}
                                            <p className="card-text text-muted small mb-0">{movie.openDate ? `${movie.openDate} 개봉` : "개봉일 정보 없음"}</p> {/* 폴백 텍스트 추가 */}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : (
                        // 영화가 없을 경우 메시지 표시
                        <div className="col-12 text-center mt-5">
                            <p className="text-muted">현재 상영중인 영화가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default CurrentMovie;