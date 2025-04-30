import axios from "axios";
import { useEffect, useState, useRef } from "react";
import GoodsInfo from "./GoodsInfo";
import { useParams } from "react-router-dom";
import arrow from '../../img/arrow.png';
import RelatedMovie from "../movie/RelatedMovie";
import LikeType from "../../js/common/LikeType";
import { Heart, Share } from "lucide-react";
import GoodsReviewList from "./GoodsReviewList";
import GoodsReviewWriteModal from "./GoodsReviewWriteModal";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";
import apiClient from "../../js/public/axiosConfig";

const getUserNoFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload)).userNo;
  } catch {
    return null;
  }
};

const GoodsDetail = () => {
  const { goodsNo } = useParams();
  const userNo = getUserNoFromToken();
  const token = sessionStorage.getItem("accessToken");
  const isLoggedIn = Boolean(token);
  const [product, setProduct] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const reviewsRef = useRef(null);

	const fetchReviews = async () => {
		try {
			const { data } = await apiNoAccessClient.get(`/goods/${goodsNo}/reviews`);
			setReviews(data);
		} catch (err) {
			console.error('리뷰 목록 조회 오류', err);
		}
	};

	 // 2) showReviews가 true가 될 때 스크롤
	 useEffect(() => {
		if (showReviews && reviewsRef.current) {
		  // 리뷰 영역의 화면 절대 위치 계산
		  const top =
			reviewsRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
		  // 부드럽게 100px 오프셋된 위치로 스크롤
		  window.scrollTo({
			top,
			behavior: "smooth",
		  });
		}
	  }, [showReviews]);
	 

	useEffect(() => {
		const fetchData = async () => {
			try {
				const goodsInfo = await apiNoAccessClient.get(
					`/md-shop/lists/${goodsNo}`
				);
				setProduct(goodsInfo.data);
				setMovieId(goodsInfo.data.movieNo);
			} catch (error) {
				console.error("Error fetching product data:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchLikeStatus = async () => {
			try {
				if (sessionStorage.getItem('accessToken')) {
					const response = await apiClient.get(
						`/likes/${LikeType.GOODS}?no=${goodsNo}`,
					);
					const likeData = response.data;
					setLikeId(likeData.no);
					setLiked(likeData.status === "ACTIVE");
				}
			} catch (err) {
				console.error("좋아요 상태 불러오기 실패:", err);
			}
		};

    fetchData();
    fetchLikeStatus();
    if (showReviews) fetchReviews();
  }, [goodsNo, showReviews]);

	const toggleLike = async () => {
		try {
			const res = await apiClient.patch(
				`/likes/${likeId}`,
				{},
			);
			const likeData = res.data;
			setLiked(likeData.status === "ACTIVE");
		} catch (err) {
			console.error("좋아요 처리 중 오류:", err);
		}
	};

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert('링크가 클립보드에 복사되었습니다!'))
      .catch(err => console.error('클립보드 복사 실패:', err));
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        {/* 뒤로가기 및 액션 버튼 */}
        <button onClick={() => window.history.back()} className="back-button">
          <img
            src={arrow}
            alt="Back Arrow"
            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
          />
        </button>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>상세 페이지</h2>
          <div style={{ cursor: 'pointer' }}>
          {isLoggedIn && (
            <Heart
              className="movie_detail_icon"
              color={liked ? 'red' : 'gray'}
              fill={liked ? 'red' : 'none'}
              onClick={toggleLike}
            />
            )}
            <Share
              className="movie_detail_icon ms-2"
              onClick={handleCopyUrl}
            />
          </div>
        </div>

        {product && <GoodsInfo goods={product} />}

        <div className="mt-4">
          <h4 className="fw-bold mb-3 mt-5">Related Movie</h4>
        </div>
        <div className="row mt-1">
          <div className="col-3">
            {movieId && <RelatedMovie movieId={movieId} />}
          </div>
        </div>

        {/* 리뷰 섹션 헤더 */}
        <div className="d-flex align-items-center justify-content-between mt-4 mb-3">
          <h4 className="fw-bold mb-0">Goods Reviews</h4>
          <div className="review-buttons d-flex">
            <button
              className="btn btn-primary me-2"
              onClick={() => setShowReviews(v => !v)}
              style={{ width: '100px' }}
            >
              {showReviews ? '리뷰 닫기' : '리뷰 보기'}
            </button>
            {isLoggedIn && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditingReview(null);
                setWriteModalOpen(true);
              }}
            >
              리뷰 작성
            </button>
            )}
          </div>
        </div>

        {/* 리뷰 리스트 (토글) */}
        {showReviews && (
          <div ref={reviewsRef} className="mt-3">
            <GoodsReviewList
              goodsId={goodsNo}
              refreshKey={reviewRefreshKey}
              onReviewsLoad={setReviews}
              onSelectReview={review => {
                setEditingReview(review);
                setWriteModalOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* 리뷰 작성 모달 (항상 렌더, 열림 여부만 isOpen으로 제어) */}
      <GoodsReviewWriteModal
        goodsId={goodsNo}
        userNo={userNo}
        review={editingReview}
        isOpen={writeModalOpen}
        onClose={() => {
          setWriteModalOpen(false);
          setEditingReview(null);
        }}
        onSubmitSuccess={() => {
          setWriteModalOpen(false);
          setEditingReview(null);
          setReviewRefreshKey(k => k + 1);
        }}
      />
    </>
  );
};

export default GoodsDetail;
