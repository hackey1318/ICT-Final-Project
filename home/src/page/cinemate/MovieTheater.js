import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import MoviePagination from "../../js/public/Pagination";

function MovieTheater(){
    const [page, setPage] = useState(0); // Spring Data Pageable을 위해 페이지는 0부터 시작
    const [totalPages, setTotalPages] = useState(1); // 잠재적인 0으로 나누기 오류를 피하기 위해 1로 초기화

    const location = useLocation();

    // 첫 페이지 ("/cinemate") 접속 시, 영화목록 버튼을 활성화 상태로 만들기
    const isMoviesActive = location.pathname === "/cinemate" || location.pathname === "/cinemate/movies";
    const isTheatersActive = location.pathname === "/cinemate/theaters";

    return(
        <div className="container py-3">
            {/* 헤더 */}
            <div className="mb-4">
                <h1 className="h2 fw-bold">시네메이트</h1>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <NavLink 
                        to="/cinemate/movies"
                        className={({ isActive }) =>
                            `btn ${isMoviesActive ? "btn-primary" : "btn-outline-primary"} me-2`
                        }
                    >
                        영화 목록
                    </NavLink>
                    <NavLink
                        to="/cinemate/theaters"
                        className={({ isActive }) =>
                            `btn ${isTheatersActive ? "btn-primary" : "btn-outline-primary"}`
                        }
                    >
                        영화관 목록
                    </NavLink>
                </div>

                {/* 페이지네이션 */}
                <div className="d-flex justify-content-end ms-auto">
                    {totalPages > 1 && ( // 페이지가 1개 이상일 때만 페이지네이션 표시
                        <MoviePagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </div>

            {/* 영화 목록, 영화관 목록 보여줄 곳 */}
            <div>
                <Outlet context={{ page, setPage, totalPages, setTotalPages }}/> {/* 페이지 관련 변수들 사용가능하게 내보냄 */}
            </div>
        </div>
    )
}

export default MovieTheater;