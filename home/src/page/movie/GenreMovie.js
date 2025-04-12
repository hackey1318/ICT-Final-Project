import { useEffect, useState } from "react";
import GenreFilter from "../../js/movie/Genre-filter"
import axios from "axios";
import TypeFilter from "../../js/movie/MovieType";

function GenreMovie() {

    const [genre, setGenre] = useState({ id: "Romance", name: "로맨스" });
    const [type, setType] = useState('ALL');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // 장르 선택 시 API 호출
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:9988/movies', {
                    params: {
                        genre: genre.name,
                        type: type,
                        page: page,
                        size: 8,
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
        <main className="min-h-screen bg-white">

            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center mb-4">
                    <h1 className="text-2xl font-bold">Genre : {genre.id}</h1>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-wrap gap-2">
                        <GenreFilter selectedGenre={genre} onSelect={setGenre} />
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <TypeFilter type={type} setType={setType} />
                </div>

                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img src={movie.postImage} alt={movie.name} />
                            <div>{movie.name}</div>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={page === i ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default GenreMovie;