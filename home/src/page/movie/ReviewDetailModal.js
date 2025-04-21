"use client"
import { deleteReview } from "../../js/api/reviewApi"
import "./../../css/movie/ReviewDetailModal.css"

function ReviewDetailModal({ review, onClose, onDelete, currentUserNo }) {
  const handleDelete = () => {
    deleteReview(review.no).then(() => {
      onDelete(review.no)
      onClose()
    })
  }

  // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 차단
  const stopPropagation = (e) => e.stopPropagation()

    // Date 포맷팅 (한국어 기준)
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : ''

  return (
    // overlay 클릭 시 onClose 호출
    <div className="modal-overlay" onClick={onClose}>
      {/* 내부 콘텐츠 클릭은 전파 차단 */}
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
              <img src={review.userProfileImage || "/placeholder.svg"} alt="profile" className="profile-image" />
            ) : (
              <div className="profile-placeholder">{review.userName?.charAt(0) || "U"}</div>
            )}
            <span className="profile-name">{review.userName || "사용자"}

            {formattedDate && (
              <span className="review-date"> · {formattedDate}</span>
             )}
            </span>
          </div>

          

          <div className="modal-content-wrapper">
            <div className="modal-image-container">
              {review.postImage && (
                <img src={review.postImage || "/placeholder.svg"} alt="poster" className="modal-poster" />
              )}

            </div>

            <div className="modal-review-content">
              <div className="review-header">
                <h3 className="review-title">{review.title || review.content.substring(0, 20)}</h3>
              </div>
              <p className="review-text">{review.content}</p>

              {review.userNo === currentUserNo && (
                <button className="modal-delete" onClick={handleDelete}>
                  삭제
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetailModal
