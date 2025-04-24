import axios from "axios";
import { ArrowLeft, ArrowRight, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function MovieListDetail() {
	//URL에서 movieNo 파라미터 가져옴
	const { movieNo } = useParams();
	console.log(movieNo);

	//영화 상세 정보 담을 변수
	const [movies, setMovies] = useState([]); //리스트로 들어와서 배열로 받음.

	// 로딩 상태 추가
	const [loading, setLoading] = useState(true);

	const [liked, setLiked] = useState(false); // 현재 좋아요 여부
	const [likeId, setLikeId] = useState(null); // 좋아요 ID (DB에서 받은 값)

	useEffect(() => {
		axios.get(`http://localhost:9988/cinemate/movieDetail/${movieNo}`)
			.then((response) => {
				console.log("시네메이트 영화 정보로 들어옴", response.data);
				console.log("0번째", response.data[0]);

				setMovies(response.data);
				setLoading(false);  // 로딩 완료
			}).catch((error) => {
				console.log("영화상세정보 에러", error);
				setLoading(false);  // 로딩 완료
			});
	}, [movieNo]);

	// 로딩 중이면 로딩 메시지 출력
	if (loading) {
		return <div>Loading...</div>;
	}

	// movie가 null인 경우 처리
	if (!movies) {
		return <div>영화 정보를 불러올 수 없습니다.</div>;
	}

	const toggleLike = async () => {
		try {
			const res = await axios.patch(`http://192.168.1.252:9988/likes/${likeId}`);
			const likeData = res.data;
			// 예: 좋아요 상태가 ACTIVE인지 여부에 따라 아이콘을 채우거나 비우기
			if (likeData.status === "ACTIVE") {
				setLiked(true);
			} else {
				setLiked(false);
			}
		} catch (err) {
			console.error("좋아요 처리 중 오류:", err);
		}
	};

	const handleCopyUrl = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url)
			.then(() => {
				alert('링크가 클립보드에 복사되었습니다!');
			})
			.catch(err => {
				console.error('클립보드 복사 실패:', err);
			});
	};

	return (
		<div className="movie_detail_container container">
			{/* 헤더 섹션 */}
			<header className="movie_detail_header">
				<div className="movie_detail_top_nav row">
					<div className="movie_detail_logo col-4">시네메이트 영화 상세</div>
					<div className="movie_detail_menu col-8">
						{/* 필요한 메뉴 항목 추가 */}
					</div>
				</div>
				<div className="movie_detail_sub_header row align-items-center">
					<div className="col-1">
						{/* 뒤로가기 버튼 (시네메이트 목록 페이지로 이동한다고 가정) */}
						<Link to="/cinemate" className="movie_detail_back_btn">
							<ArrowLeft className="movie_detail_icon" />
						</Link>
					</div>
					<div className="col-9">
						{/* 백엔드에서 받은 영화 제목 표시 */}
						<h1 className="movie_detail_title">{movies[0].name}</h1>
					</div>
					<div className="movie_detail_actions col-2 d-flex justify-content-end">
						{/* 북마크 및 공유 아이콘 (기능 구현 필요) */}
						<div onClick={toggleLike} style={{ cursor: 'pointer' }}>
							<Heart
								className="movie_detail_icon"
								color={liked ? 'red' : 'black'}
								fill={liked ? 'red' : 'none'}
							/>
							<Share2 className="movie_detail_icon ms-2" onClick={handleCopyUrl} />
						</div>
					</div>
				</div>
			</header>

			{/* 영화 상세 정보 섹션 */}
			<div className="movie_detail_content row mt-4">
				<div className="movie_detail_poster col-md-4">
					{/* 백엔드에서 받은 포스터 이미지 표시 (없으면 기본 이미지) */}
					<img
						src={movies[0].postImage || "/placeholder.jpg"} // placeholder 이미지는 public 폴더 등에 위치해야 함
						alt={`${movies[0].name} 포스터`}
						className="movie_detail_poster_img img-fluid rounded" // 부트스트랩 클래스 추가
					/>
				</div>
				<div className="movie_detail_info col-md-8">
					<h2 className="movie_detail_section_title mb-3">줄거리</h2>
					{/* 백엔드에서 받은 영화 설명 표시 */}
					<p className="movie_detail_description">{movies[0].description}</p>
					<p>감독 : {movies[0].director}</p>
					<p>장르 : {movies[0].genre}</p>
					<p>개봉 : {movies[0].openDate}</p>
				</div>
			</div>

			{/* 해당 영화에 관련된 시네메이트 신청 정보 */}
			<div className="row">
				{
					movies.map((movie, index) => {
						return (
							<div key={index} className="col-md-4 mb-4">
								<Link to={`/cinemate/movies/${movie.movieNo}/room/${movie.no}`} state={{ movie }} style={{ textDecoration: "none", color: "inherit" }}>
									<div style={{ border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", height: "auto" }}>
										<div style={{ padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
											<div className="d-flex justify-content-between mb-2">
												<span className="fw-bold">작성자 : {movie.userName}</span>
												<span className="text-muted">작성일 : {movie.createdAt?.split('T')[0]}</span>
											</div>
											<div className="mb-2">
												<span className="badge bg-info text-dark p-2 rounded me-2">
													🎥 상영 극장 : {movie.theaterName}
												</span>
											</div>
											<div className="mb-2 d-flex justify-content-between">
											<span className="badge bg-light text-dark p-2 border border-secondary rounded">
													모집 시간 : {movie.meetingDate?.split("T")[0]}{" "}
													{movie.meetingDate?.split("T")[1]?.slice(0, 5)}
												</span>
												<span className="badge bg-warning text-dark p-2 rounded">
													총 인원 : {movie.currentMemberCount} / {movie.maxMemberCount}
												</span>
											</div>
											<div style={{ minHeight: "80px", padding: "8px", backgroundColor: "#fff", borderRadius: "5px", overflow: "hidden" }}>
												<strong>{movie.content}</strong>
											</div>
										</div>

									</div>
								</Link>
							</div>
						)
					})
				}
			</div >
		</div >
	)
}

export default MovieListDetail;