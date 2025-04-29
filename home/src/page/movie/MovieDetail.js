import apiClient from '../../js/public/axiosConfig'; // apiClient import
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import "./../../css/movie/MovieDetail.css";
import LikeType from "../../js/common/LikeType";
import RecruitMovieModal from "./RecruitMovieModal";
import RelatedMovie from './RelatedMovie';

const BASE_URL = '/file-system/download/';
const accessToken = sessionStorage.getItem("accessToken");

function MovieDetail() {
	const { id } = useParams();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [liked, setLiked] = useState(false);
	const [likeId, setLikeId] = useState(null);
	const [relatedGoods, setRelatedGoods] = useState([]);
	const [relatedMovies, setRelatedMovies] = useState([]);
	const [showRecruitModal, setShowRecruitModal] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const fetchLikeStatus = async () => {
			try {
				if (accessToken) {
					const response = await apiClient.get(`/likes/${LikeType.MOVIE}?no=${id}`);
					const likeData = response.data;

					setLikeId(likeData.no);
					setLiked(likeData.status === "ACTIVE");
				}
			} catch (err) {
				console.error("좋아요 상태 불러오기 실패:", err);
			}
		};

		const fetchMovieDetail = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiClient.get(`/movies/detail/${id}`);

				setMovie(response.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
				setMovie(null);
			} finally {
				setLoading(false);
			}
		};

		const fetchMovieGoods = async () => {
			try {
				const response = await apiClient.get(`/md-shop/movies/${id}`);
				setRelatedGoods(response.data);
			} catch (error) {
				console.error("Error fetching related goods:", error);
			}
		};

		const fetchRelateMovie = async () => {
			try {
				const response = await apiClient.get(`/movies/relate-movie?no=${id}`);
				setRelatedMovies(response.data.content);
			} catch (error) {
				console.error("Error fetching related movies:", error);
			}
		};

		setIsLoggedIn(!!accessToken);

		if (id) {
			fetchMovieDetail();
			fetchLikeStatus();
			fetchMovieGoods();
			fetchRelateMovie();
		} else {
			setError("영화 ID가 유효하지 않습니다.");
			setLoading(false);
		}

	}, [id]);

	if (loading) {
		return <div className="movie_detail_loading">로딩 중...</div>;
	}

	if (error && !movie) {
		return <div className="movie_detail_error">오류: {error}</div>;
	}

	if (!movie) {
		return <div className="movie_detail_not_found">영화 정보를 찾을 수 없습니다.</div>;
	}

	const toggleLike = async () => {
		try {
			const response = await apiClient.patch(`/likes/${likeId}`);
			const likeData = response.data;

			setLiked(likeData.status === "ACTIVE");
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
			<header className="movie_detail_header">
				<div className="movie_detail_top_nav row">
					<div className="movie_detail_logo col-4">영화 상세페이지</div>
					<div className="movie_detail_menu col-8"></div>
				</div>
				<div className="movie_detail_sub_header row align-items-center">
					<div className="col-1">
						<Link to="/movies" className="movie_detail_back_btn">
							<ArrowLeft className="movie_detail_icon" />
						</Link>
					</div>
					<div className="col-9">
						<h1 className="movie_detail_title">{movie.name}</h1>
					</div>
					<div className="movie_detail_actions col-2 d-flex justify-content-end">
						<div onClick={toggleLike} style={{ cursor: 'pointer' }}>
							<Heart className="movie_detail_icon" color={liked ? 'red' : 'black'} fill={liked ? 'red' : 'none'} />
							<Share2 className="movie_detail_icon ms-2" onClick={handleCopyUrl} />
						</div>
					</div>
				</div>
			</header>

			<div className="movie_detail_content row mt-4">
				<div className="movie_detail_poster col-md-4">
					<img
						src={movie.postImage || "/placeholder.jpg"}
						alt={`${movie.name} 포스터`}
						className="movie_detail_poster_img img-fluid rounded"
					/>
				</div>
				<div className="movie_detail_info col-md-8">
					<h2 className="movie_detail_section_title mb-3">줄거리</h2>
					<p className="movie_detail_description">{movie.description}</p>
					<div className="movie_detail_buttons mt-4">
						<a
							href={movie.externalLink}
							target="_blank"
							rel="noopener noreferrer"
							className={`movie_detail_btn_secondary btn btn-outline-secondary ${!movie.externalLink ? 'disabled' : ''}`}
							aria-disabled={!movie.externalLink}
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

			<div className="movie_detail_related_section mt-5">
				<div className="movie_detail_section_header mb-3 align-items-center">
					<h2 className="movie_detail_section_title">Relative Merchandise</h2>
					<div className="text-end mt-3">
						<Link to="/mdshop" className="btn btn-outline-secondary">
							굿즈 보기
						</Link>
					</div>
				</div>

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

			<div className="movie_detail_similar_section mt-5 mb-5">
				<div className="movie_detail_section_header mb-3">
					<h2 className="movie_detail_section_title mb-0 d-inline">Similar Movies</h2>
					<Link to="/movies" className="movie_detail_see_more d-inline ms-3">
						<ArrowLeft className="movie_detail_icon movie_detail_icon_rotate" />
					</Link>
				</div>

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
	);
}

export default MovieDetail;
