import { useEffect, useState } from "react";
import GenreFilter from "../../js/movie/Genre-filter"
import MoviePagination from "../../js/movie/MoviePagination";
import axios from "axios";
import TypeFilter from "../../js/movie/MovieType";

function GenreMovie() {

    const [genre, setGenre] = useState({ id: "All", name: "전체" });
    const [type, setType] = useState('ALL');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    function getAgeBadgeColor(grade) {
        switch (grade) {
            case "15": return "#f39c12"  // 주황
            case "12": return "#3498db"  // 파랑
            case "All": return "#2ecc71" // 초록
            case "18": return "#e74c3c" // 빨강
            default: return "#7f8c8d"     // 회색
        }
    }

    function getPageSize(width) {
        if (width < 576) return 4;     // 모바일
        if (width < 768) return 6;     // 태블릿
        if (width < 992) return 9;     // 작은 데스크탑
        return 12;                     // 일반 데스크탑, 큰 화면
    }

    useEffect(() => {
        setPage(0);
        setType('ALL');
        window.scrollTo(0, 0); // 페이지 최상단으로 이동
    }, [genre]);

    useEffect(() => {
        // 장르 선택 시 API 호출
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://192.168.1.252:9988/movies', {
                    params: {
                        genre: genre.name,
                        type: type,
                        page: page,
                        size: getPageSize(window.innerWidth),
                        sort: 'createdAt,desc',
                    },
                });
                setMovies(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('영화 데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchMovies();
    }, [genre, type, page]); // ✅ 장르가 변경될 때마다 호출됨

    return (
        <main className="bg-white min-vh-100">
            <div className="container py-3">
                {/* 장르 헤더 */}
                <div className="mb-3">
                    <h1 className="h2 fw-bold">Genre : {genre.id}</h1>
                </div>

                {/* 필터 영역 */}
                <div className="mb-2">
                    <GenreFilter selectedGenre={genre} onSelect={setGenre} />
                </div>
                <div className="filter-pagination-wrapper">
                    <TypeFilter type={type} setType={setType} />
                    <MoviePagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>

                {/* 영화 카드 영역 */}
                <div className="row g-4">
                    {movies.map((movie) => (
                        <div key={movie.no} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <a href={`/movies/${movie.no}`} className="text-decoration-none text-dark">
                                <div className="card h-100 shadow-sm position-relative">
                                    {/* 연령 뱃지 */}
                                    <span
                                        className="age-badge position-absolute top-0 start-0 m-2 px-2 py-1 text-white rounded"
                                        style={{ backgroundColor: getAgeBadgeColor(movie.ageGrade)}}
                                    >
                                        {movie.ageGrade === "18" ? "19" : movie.ageGrade}
                                    </span>

                                    {/* 포스터 */}
                                    <img
                                        src={movie.postImage}
                                        alt={movie.name}
                                        className="card-img-top"
                                        style={{ height: "300px", objectFit: "cover" }}
                                    />

                                    {/* 제목 */}
                                    <div className="card-body py-1">
                                        <p className="card-title fw-bold text-truncate mb-0">{movie.name}</p>
                                        <p className="card-text text-muted mb-0">{movie.openDate} 개봉</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default GenreMovie;