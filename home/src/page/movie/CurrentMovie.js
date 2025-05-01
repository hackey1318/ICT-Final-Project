import { useEffect, useState } from "react";
import MoviePagination from "../../js/public/Pagination"; // 경로가 올바른지 확인하세요
import axios from "axios";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";

function CurrentMovie() {
    // 영화 목록, 현재 페이지, 총 페이지 수를 위한 상태
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0); // Spring Data Pageable을 위해 페이지는 0부터 시작
    const [totalPages, setTotalPages] = useState(1); // 잠재적인 0으로 나누기 오류를 피하기 위해 1로 초기화
    
    // 검색어 상태 추가
    const [searchTerm, setSearchTerm] = useState('');

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

    // 클라이언트 사이드 필터링된 영화 리스트
    const filteredMovies = movies.filter(movie =>
        movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- JSX 렌더링 ---

    return (
        <main className="bg-white min-vh-100">
            <div className="container py-3">

                {/* 헤더 */}
                <div className="mb-4"> {/* 하단 마진 증가 */}
                    <h1 className="h2 fw-bold">현재 상영작</h1> {/* 제목 변경 */}
                </div>

                {/* 페이지네이션 (영화 목록 위) */}
                <div className="d-flex justify-content-end mb-4">
                    {totalPages > 1 && (
                        <MoviePagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>
                {/* 검색창 추가 */}
                <input
                    type="text"
                    placeholder="영화 제목 검색"
                    className="form-control"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                {/* 영화 카드 그리드 */}
                <div className="row g-4">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
                            <div key={movie.no} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                <a href={`/movies/${movie.no}`} className="text-decoration-none text-dark">
                                    <div className="card h-100 shadow-sm position-relative overflow-hidden">
                                        <span
                                            className="age-badge position-absolute top-0 start-0 m-2 px-2 py-1 text-white rounded shadow-sm"
                                            style={{
                                                backgroundColor: getAgeBadgeColor(movie.ageGrade),
                                                zIndex: 1
                                            }}
                                        >
                                            {String(movie.ageGrade) === "18" ? "청불" : movie.ageGrade}
                                        </span>
                                        <img
                                            src={movie.postImage || '/path/to/default/placeholder.png'}
                                            alt={`${movie.name} 포스터`}
                                            className="card-img-top"
                                            style={{ height: "300px", objectFit: "cover" }}
                                            onError={e => { e.target.onerror = null; e.target.src = '/path/to/default/placeholder.png'; }}
                                        />
                                        <div className="card-body py-2 px-3">
                                            <p className="card-title fw-bold text-truncate mb-1">{movie.name || "제목 없음"}</p>
                                            <p className="card-text text-muted small mb-0">{movie.openDate ? `${movie.openDate} 개봉` : "개봉일 정보 없음"}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : (
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
