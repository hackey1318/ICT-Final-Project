import axios from "axios";
import { useEffect, useState } from "react";
import GoodsInfo from "./GoodsInfo";
import { useParams} from "react-router-dom"; // Outlet & Link import
import arrow from '../../img/arrow.png';
import RelatedMovie from "../movie/RelatedMovie";
import LikeType from "../../js/common/LikeType";
import { Heart, Share } from "lucide-react";
import GoodsReviewList from "./GoodsReviewList";
import GoodsReviewWriteModal from "./GoodsReviewWriteModal";

const accessToken = sessionStorage.getItem("accessToken");

const getUserNoFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const { userNo } = JSON.parse(atob(payload));
    return userNo;
  } catch {
    return null;
  }
};

const GoodsDetail = () => {
  const { goodsNo } = useParams();
  const userNo = getUserNoFromToken();
  const [product, setProduct] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  useEffect(() => {



    const fetchData = async () => {
      try {
        const goodsInfo = await axios.get(
          `http://localhost:9988/md-shop/lists/${goodsNo}`
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
        if (accessToken) {
          const response = await axios.get(
            `http://localhost:9988/likes/${LikeType.GOODS}?no=${goodsNo}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
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
  }, [goodsNo]);

  const toggleLike = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:9988/likes/${likeId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
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
          <div onClick={toggleLike} style={{ cursor: 'pointer' }}>
            <Heart
              className="movie_detail_icon"
              color={liked ? 'red' : 'gray'}
              fill={liked ? 'red' : 'none'}
            />
            <Share
              className="movie_detail_icon ms-2"
              onClick={handleCopyUrl}
            />
          </div>
        </div>

        {product && <GoodsInfo goods={product} />}

        {/* 제품 상세 정보 */}
        <div className="row mt-5">
          <div className="col-3">
            <h4 className="fw-bold mb-3 mt-5">Related Movie</h4>
            {movieId && <RelatedMovie movieId={movieId} />}
          </div>
        </div>

{/* 리뷰 토글 버튼 */}
       <div className="mt-4">
         <button
           className="btn btn-primary"
           onClick={() => setShowReviews(v => !v)}
         >
           {showReviews ? '리뷰 닫기' : '리뷰 보기'}
         </button>
       </div>

       {/* 리뷰 리스트 렌더링 */}
       {showReviews && (
         <>
           <div className="mt-3">
             <GoodsReviewList goodsId={goodsNo} />
           </div>

              {/* 리뷰 작성 모달 열기/닫기는 여기서 onSubmitSuccess 로 showReviews 조작해도 됩니다 */}

                 {/* 리뷰 작성 모달을 여는 버튼 */}
                <button
                  className="btn btn-outline-secondary mt-2"
                  onClick={() => setWriteModalOpen(true)}
                >
                  리뷰 작성
                </button>

           <GoodsReviewWriteModal
             goodsId={goodsNo}
             userNo={userNo}
             isOpen={writeModalOpen}
             onClose={() => setWriteModalOpen(false)}
             onSubmitSuccess={() => {
              setWriteModalOpen(false);
              // 리뷰 등록 성공 시 키를 바꿔서 리스트 useEffect를 재발동시킵니다
              setReviewRefreshKey(k => k + 1);
             }}
           />
         </>
       )}
      </div>
    </>
  );
};

export default GoodsDetail;
