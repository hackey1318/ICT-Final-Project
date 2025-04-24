import { useEffect, useState } from 'react';
import axios from '../../js/public/axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './../../css/md/GoodsReviewSection.css';

export default function GoodsReviewList({ goodsId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, [goodsId]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/goods/${goodsId}/reviews`);
      setReviews(data.map(r => ({
        ...r,
        imageUrls: r.imageIds.map(id => `/file-system/download/${id}`)
      })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="goods-review-list">
      {reviews.map(r => (
        <div key={r.id} className="review-item">
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
          <h3>{r.title} ({r.rating}점)</h3>
          <p>{r.content}</p>
          <small>{new Date(r.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}