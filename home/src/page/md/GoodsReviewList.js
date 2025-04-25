import { useEffect, useState } from 'react';
import axios from '../../js/public/axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './../../css/md/GoodsReviewSection.css';

export default function GoodsReviewList({
    goodsId,
    refreshKey,
    onReviewsLoad,  // 리뷰 목록 로드 콜백
    onSelectReview  // 리뷰 선택 콜백 추가
}) {
  const [reviews, setReviews] = useState([]);
  const API = axios.defaults.baseURL;

  useEffect(() => {
    fetchReviews();
  }, [goodsId, refreshKey]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/goods/${goodsId}/reviews`);
      console.log("리뷰 데이터 상세:", {
        전체_데이터: data,
        첫번째_리뷰_상세: data[0],
        리뷰_필드목록: data[0] ? Object.keys(data[0]) : []
      });

      const reviewsWithUrls = data.map(r => ({
        ...r,
        imageUrls: r.imageIds.map(id => `${API}/file-system/download/${id}`)
      }));
      
      setReviews(reviewsWithUrls);
      if (onReviewsLoad) {
        onReviewsLoad(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="goods-review-list">
      {reviews.map(r => (
        <div key={r.id} className="review-item">
          <div className="review-header">
            <h3>{r.title} ({r.rating}점)</h3>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onSelectReview && onSelectReview(r)}
            >
              이 리뷰 수정
            </button>
          </div>
          {r.imageUrls.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="review-swiper"
            >
              {r.imageUrls.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <img src={url} alt={`리뷰 이미지 ${idx + 1}`} className="review-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <p>{r.content}</p>
          <small>{new Date(r.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}