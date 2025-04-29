import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";

function MovieList(){
    //영화 목록, 현재 페이지, 총 페이지 수를 담을 변수
    const [movieList, setMovieList] = useState([]);
    const { page, setPage, totalPages, setTotalPages } = useOutletContext(); // 부모에서 전달된 상태들 가져오기

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

    // 페이지 번호가 변경될 때 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    useEffect(()=>{
        const currentPageSize = getPageSize(window.innerWidth);

        //영화정보 가져오기
        apiNoAccessClient.get(`/cinemate/movies?page=${page}`, {
            params: {
                page: page,
                size: currentPageSize,
                sort: 'createdAt,desc', // 정렬 유지 (원하는 경우), 필요시 조정
            },
        })
        .then((response)=>{
            console.log("받아온 데이터", response.data);

            setMovieList(response.data.content);
            setTotalPages(response.data.totalPages);

        }).catch((error)=>{
            console.log("무비리스트 에러", error);
        });
    },[page]);

    return(
        <div className="container py-3">

            {/* 영화 리스트 */}
            <div className="row g-4">
                {movieList.length > 0 ? (
                    movieList.map((movieList) => (
                        <div key={movieList.movieNo} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            {/* 영화 상세 페이지 링크 */}
                            <a href={`/cinemate/movies/${movieList.movieNo}`} className="text-decoration-none text-dark">
                                <div className="card h-100 shadow-sm position-relative overflow-hidden"> {/* overflow-hidden 추가 */}
                                    {/* 연령 등급 배지 */}
                                    <span
                                        className="age-badge position-absolute top-0 start-0 m-2 px-2 py-1 text-white rounded shadow-sm" // 작은 그림자 추가
                                        style={{
                                            backgroundColor: getAgeBadgeColor(movieList.ageGrade),
                                            zIndex: 1 // 배지가 이미지 위에 오도록 보장
                                        }}
                                    >
                                        {/* 18세 등급은 '청불' 또는 '19'로 표시, 나머지는 등급 그대로 표시 */}
                                        {String(movieList.ageGrade) === "18" ? "청불" : movieList.ageGrade}
                                    </span>

                                    {/* 영화 포스터 */}
                                    <img
                                        src={movieList.postImage || '/path/to/default/placeholder.png'} // 대체 이미지 경로 추가
                                        alt={`${movieList.name} 포스터`}
                                        className="card-img-top"
                                        style={{ height: "300px", objectFit: "cover" }}
                                        onError={(e) => { e.target.onerror = null; e.target.src='/path/to/default/placeholder.png'; }} // 이미지 로드 오류 처리
                                    />

                                    {/* 영화 정보 */}
                                    <div className="card-body py-2 px-3"> {/* 패딩 조정 */}
                                        <p className="card-title fw-bold text-truncate mb-1">{movieList.movieName || "제목 없음"}</p> {/* 폴백 텍스트 추가 및 마진 조정 */}
                                        <p className="card-text text-muted small mb-0">{movieList.openDate ? `${movieList.openDate} 개봉` : "개봉일 정보 없음"}</p> {/* 폴백 텍스트 추가 */}
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))
                ) : (
                    //보여줄 목록이 없을 경우 메시지 표시
                    <div className="col-12 text-center mt-5">
                        <p className="text-muted">현재 시네메이트 관련 영화가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MovieList;