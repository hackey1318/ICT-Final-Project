import axios from "../../js/public/axiosConfig"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Share2, Heart } from "lucide-react"
import "./../../css/movie/MovieDetail.css" // CSS 파일 경로는 실제 프로젝트 구조에 맞게 조정하세요
import LikeType from "../../js/common/LikeType"
import RecruitMovieModal from "./RecruitMovieModal"
import RelatedMovie from './RelatedMovie';

const BASE_URL = '/file-system/download/';
const accessToken = sessionStorage.getItem("accessToken") // 세션 스토리지에서 accessToken을 가져옵니다.

function MovieDetail() {
	// URL 경로에서 영화 ID를 가져옵니다 (예: /movies/10 -> id는 "10")
	const { id } = useParams()
	// 영화 상세 정보를 저장할 상태
	const [movie, setMovie] = useState(null)
	// 데이터 로딩 상태
	const [loading, setLoading] = useState(true)
	// 에러 정보를 저장할 상태
	const [error, setError] = useState(null)

	const [liked, setLiked] = useState(false); // 현재 좋아요 여부
	const [likeId, setLikeId] = useState(null); // 좋아요 ID (DB에서 받은 값)
	const [relatedGoods, setRelatedGoods] = useState([]); // 관련 상품 목록
	const [relatedMovies, setRelatedMovies] = useState([]); // 관련 영화 목록
	const [showRecruitModal, setShowRecruitModal] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// 컴포넌트가 마운트되거나 URL의 id 값이 변경될 때 실행됩니다.
	useEffect(() => {

		const fetchLikeStatus = async () => {
			try {
				if (sessionStorage.getItem("accessToken") !== null) {
					const response = await axios.get(`/likes/${LikeType.MOVIE}?no=${id}`);
					const likeData = response.data;

					// 예: 좋아요 상태가 ACTIVE인지 여부에 따라 아이콘을 채우거나 비우기
					setLikeId(likeData.no); // likeId를 설정합니다.
					if (likeData.status === "ACTIVE") {
						setLiked(true);
					} else {
						setLiked(false);
					}
				}
			} catch (err) {
				console.error("좋아요 상태 불러오기 실패:", err);
			}
		};

		// 영화 상세 정보를 비동기적으로 가져오는 함수
		const fetchMovieDetail = async () => {
			try {
				setLoading(true) // 로딩 시작
				setError(null) // 이전 에러 상태 초기화
				const backendApiUrl = `/movies/detail/${id}` // '/detail' 추가!

				// fetch API를 사용하여 백엔드에 GET 요청을 보냅니다.
				const response = await fetch(backendApiUrl)

				// 응답 상태 확인
				if (!response.ok) {
					// 404 Not Found 에러 처리
					if (response.status === 404) {
						throw new Error("해당 영화 정보를 찾을 수 없습니다.")
					}
					// 그 외 서버 에러 처리
					throw new Error(`영화 정보를 불러오는데 실패했습니다 (상태 코드: ${response.status})`)
				}

				// 응답 데이터를 JSON 형태로 파싱합니다.
				const data = await response.json() // 백엔드에서 보낸 MovieDetailResponse DTO 데이터

				// 받아온 데이터를 movie 상태에 저장합니다.
				setMovie(data)

			} catch (err) {
				// 네트워크 오류 또는 위에서 발생시킨 에러를 처리합니다.
				setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
				setMovie(null) // 에러 발생 시 movie 데이터를 null로 설정합니다.

			} finally {
				// 요청 성공/실패 여부와 관계 없이 로딩 상태를 종료합니다.
				setLoading(false)
			}
		}

		const fetchMovieGoods = async () => {

			try {
				const movieGoodsList = await axios.get(`/md-shop/movies/${id}`)
				setRelatedGoods(movieGoodsList.data) // 관련 상품 목록을 상태에 저장합니다.;
			} catch (error) {
				console.error("Error fetching related goods:", error);
			}
		};

		const fetchRelateMovie = async () => {

			try {
				const movieList = await axios.get(`/movies/relate-movie?no=${id}`)
				setRelatedMovies(movieList.data.content);
			} catch (error) {
				console.error("Error fetching related goods:", error);
			}
		};

		setIsLoggedIn(!!accessToken);
		// URL 파라미터 'id' 값이 존재할 때만 API 호출 함수를 실행합니다.
		if (id) {
			fetchMovieDetail()
			fetchLikeStatus();
			fetchMovieGoods();
			fetchRelateMovie();
		} else {
			// id 값이 없는 경우 (예: URL이 잘못된 경우)
			setError("영화 ID가 유효하지 않습니다.")
			setLoading(false)
		}

		// useEffect의 dependency array에 id를 넣어주면, id 값이 바뀔 때마다 이 effect가 다시 실행됩니다.
	}, [id])

	// --- 로딩 상태 UI ---
	if (loading) {
		return <div className="movie_detail_loading">로딩 중...</div>
	}

	// --- 에러 상태 UI ---
	// 에러가 발생했고, movie 데이터가 없는 경우 에러 메시지를 표시합니다.
	if (error && !movie) {
		return <div className="movie_detail_error">오류: {error}</div>
	}

	// --- 데이터 없음 UI ---
	// 로딩이 끝났고 에러도 없는데 movie 데이터가 없는 경우 (예: 404 Not Found 후 에러 처리된 경우)
	if (!movie) {
		return <div className="movie_detail_not_found">영화 정보를 찾을 수 없습니다.</div>
	}

	const toggleLike = async () => {
		try {
			const res = await axios.patch(`/likes/${likeId}`);
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

	// --- 성공 상태 UI ---
	// 로딩이 끝나고 에러 없이 movie 데이터가 성공적으로 로드된 경우
	return (
		<div className="movie_detail_container container">
			{/* 헤더 섹션 */}
			<header className="movie_detail_header">
				<div className="movie_detail_top_nav row">
					<div className="movie_detail_logo col-4">영화 상세페이지</div>
					<div className="movie_detail_menu col-8">
						{/* 필요한 메뉴 항목 추가 */}
					</div>
				</div>
				<div className="movie_detail_sub_header row align-items-center">
					<div className="col-1">
						{/* 뒤로가기 버튼 (영화 목록 페이지로 이동한다고 가정) */}
						<Link to="/movies" className="movie_detail_back_btn">
							<ArrowLeft className="movie_detail_icon" />
						</Link>
					</div>
					<div className="col-9">
						{/* 백엔드에서 받은 영화 제목 표시 */}
						<h1 className="movie_detail_title">{movie.name}</h1>
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
						src={movie.postImage || "/placeholder.jpg"} // placeholder 이미지는 public 폴더 등에 위치해야 함
						alt={`${movie.name} 포스터`}
						className="movie_detail_poster_img img-fluid rounded" // 부트스트랩 클래스 추가
					/>
				</div>
				<div className="movie_detail_info col-md-8">
					<h2 className="movie_detail_section_title mb-3">줄거리</h2>
					{/* 백엔드에서 받은 영화 설명 표시 */}
					<p className="movie_detail_description">{movie.description}</p>
					<div className="movie_detail_buttons mt-4">
						{/* 백엔드에서 받은 영화 링크로 이동하는 버튼 */}
						<a
							// DTO 필드 이름을 externalLink로 변경했으므로 여기도 수정
							href={movie.externalLink}
							target="_blank" // 새 탭에서 열기
							rel="noopener noreferrer" // 보안 권장 사항
							className={`movie_detail_btn_secondary btn btn-outline-secondary ${!movie.externalLink ? 'disabled' : ''}`} // 링크 없으면 비활성화 (선택 사항)
							aria-disabled={!movie.externalLink} // 접근성
						>
							자세히 보기
						</a>
						{isLoggedIn && (
							<button
								className="movie_detail_btn_primary btn btn-primary ms-2"
								onClick={() => setShowRecruitModal(true)}
							>
								같이 볼 사람 구하기
							</button>
						)}
						<Link
							to={`/movies/${id}/reviews`}
							className="movie_detail_btn_secondary btn btn-outline-secondary"
							onClick={() => {
								//리뷰페이지에서 사용할 영화명, 줄거리 세션에 저장
								sessionStorage.setItem('movieName', movie.name);
								sessionStorage.setItem('movieDescription', movie.description);
								sessionStorage.setItem('reviewPageMoviePoster', movie.postImage);
							}}
						>
							리뷰보기
						</Link>

					</div>
				</div>
			</div>
			{showRecruitModal && (
				<RecruitMovieModal movie={movie} closeModal={() => setShowRecruitModal(false)} />
			)}
			{/* === 관련 상품 섹션 수정 === */}
			<div className="movie_detail_related_section mt-5">
				{/* --- 헤더 --- */}
				<div className="movie_detail_section_header mb-3 align-items-center">
					<h2 className="movie_detail_section_title">Relative Merchandise</h2>
					{/* --- "굿즈 보기" 버튼 --- */}
					<div className="text-end mt-3">
						<Link to="/mdshop" className="btn btn-outline-secondary">
							굿즈 보기
						</Link>
					</div>
				</div>


				{/* --- 상품 목록 or 메시지 --- */}
				{relatedGoods.length > 0 ? (
					<div className="movie_detail_items row">
						{relatedGoods.map((item) => (
							<div key={item.id} className="movie_detail_item col-6 col-sm-3 mb-3">
								<Link to={`/mdshop/${item.id}`} className="Goods_item_links">
									<img
										src={item.imageUrls ? `${BASE_URL}${item.imageUrls[0]}` : "/placeholder.svg"}
										alt={item.name}
										className="movie_detail_item_img img-fluid rounded mb-2"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = "/placeholder.svg";
										}}
									/>
								</Link>
								<span className="movie_detail_item_name d-block">{item.name}</span>
								<span className="movie_detail_item_price fw-bold">{item.price.toLocaleString()}원</span>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-muted mt-3">
						관련 상품이 존재하지 않습니다.
					</div>
				)}
			</div>


			{/* === 비슷한 영화 섹션 수정 === */}
			<div className="movie_detail_similar_section mt-5 mb-5">
				{/* --- 헤더: 오른쪽 링크 수정 --- */}
				<div className="movie_detail_section_header mb-3">
					<h2 className="movie_detail_section_title mb-0 d-inline">Similar Movies</h2>
					<Link to="/movies" className="movie_detail_see_more d-inline ms-3">
						<ArrowLeft className="movie_detail_icon movie_detail_icon_rotate" />
					</Link>
				</div>

				{/* --- 비슷한 영화 목록 --- */}
				<div className="movie_detail_items row">
					{relatedMovies.map((movieItem) => (
						<div key={movieItem.no} className="movie_detail_item col-6 col-sm-2 mb-3">
							<Link to={`/movies/${movieItem.no}`}>
								<img src={movieItem.postImage} alt={movieItem.name} className="movie_detail_item_img img-fluid rounded mb-2" />
								<span className="movie_detail_item_name d-block">{movieItem.name}</span>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default MovieDetail