// src/page/movie/ReviewDetailModal.js
import React from "react"
import { useNavigate } from "react-router-dom"
import { deleteReview } from "../../js/api/reviewApi"
import axios from "../../js/public/axiosConfig"

// Swiper core & required modules
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

// Swiper styles
import "swiper/swiper-bundle.css"

// your own styles
import "../../css/movie/ReviewDetailModal.css"

function ReviewDetailModal({ review, onClose, onDelete, currentUserNo }) {
  const navigate = useNavigate()
  const handleDelete = () => {
    deleteReview(review.movieNo, review.no).then(() => {
      onDelete(review.no)
      onClose()
    })
  }

  const handleEdit = () => {
    // 리뷰 수정 페이지로 이동
    navigate(`/movies/${review.movieNo}/reviews/edit/${review.no}`)
  }

  // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 차단
  const stopPropagation = e => e.stopPropagation()

  // 날짜 포맷팅 (한국어 기준)
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : ""

  const baseUrl = axios.defaults.baseURL

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <div className="modal-header">
          <button className="modal-back" onClick={onClose}>
            <span>&larr;</span> Movie Review
          </button>
          <button className="modal-options">⋮</button>
        </div>

        <div className="modal-body-container">
          <div className="modal-profile">
            {review.userProfileImage ? (
              <img
                src={review.userProfileImage}
                alt="profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                {review.userName?.charAt(0) || "U"}
              </div>
            )}
            <span className="profile-name">
              {review.userName || "사용자"}
              {formattedDate && (
                <span className="review-date"> · {formattedDate}</span>
              )}
            </span>
          </div>

          <div className="modal-content-wrapper">
            <div className="modal-image-container">
              {review.imageIds && review.imageIds.length > 0 ? (
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={10}
                  slidesPerView={1}
                  className="review-swiper"
                >
                  {review.imageIds.map(id => (
                    <SwiperSlide key={id}>
                      <img
                        src={`${baseUrl}/file-system/showPreview/${id}`}
                        alt="review"
                        className="modal-slide-image"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                review.postImage && (
                  <img
                    src={review.postImage}
                    alt="poster"
                    className="modal-poster"
                  />
                )
              )}
            </div>

            <div className="modal-review-content">
              <div className="review-header">
                <h3 className="review-title">
                  {review.title || review.content.substring(0, 20)}
                </h3>
              </div>
              <p className="review-text">{review.content}</p>
              {review.userNo === currentUserNo && (
                <div className="modal-action-buttons">
                  <button className="modal-edit" onClick={handleEdit}>
                    수정
                  </button>
                  <button className="modal-delete" onClick={handleDelete}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetailModal
