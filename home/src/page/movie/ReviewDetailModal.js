// src/page/movie/ReviewDetailModal.js
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteReview } from "../../js/api/reviewApi"
import { createReport } from "../../js/api/reportApi";

// Swiper core & required modules
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

// Swiper styles
import "swiper/swiper-bundle.css"

// your own styles
import "../../css/movie/ReviewDetailModal.css";
import apiClient from "../../js/public/axiosConfig";

const reportCategory = {
  ABUSE: "욕설",
  CHEAT: "사기",
  ILLEGALAD: "불법광고",
  PORNOGRAPHY: "음란물게시",
  BADSPORT: "비매너행위",
  ETC: "기타"
};

function ReviewDetailModal({ review, onClose, onDelete, currentUserNo }) {
  const navigate = useNavigate()
  const [isReporting, setIsReporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [reportedContent, setReportedContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!review) {
      resetReportState();
    }
  }, [review]);

  const resetReportState = () => {
    setIsReporting(false);
    setSelectedCategory("");
    setReportedContent(""); 
    setErrorMessage("");
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    deleteReview(review.movieNo, review.no).then(() => {
      onDelete(review.no);
      onClose();
    })
  }

  const handleEdit = () => {
    // 리뷰 수정 페이지로 이동
    navigate(`/movies/${review.movieNo}/reviews/edit/${review.no}`)
  }

  const handleReportBnt = () => {
    const reportTitle = review.title || review.content.substring(0, 20);
    if (!isReporting) {
      if (window.confirm(`"${review.title || review.content.substring(0, 20)}" 리뷰를 신고하시겠습니까?`)) {
        setIsReporting(true);
      }
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value !== 'ETC') {
      setErrorMessage('');
    }
  };

  const handleContentChange = (e) => {
    setReportedContent(e.target.value);
    if (selectedCategory === 'ETC' && e.target.value.trim() !== '' && errorMessage.includes('기타')) {
      setErrorMessage('');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedCategory) {
      setErrorMessage("신고 사유를 선택해주세요.");
      return;
    }

    if (selectedCategory === 'ETC' && reportedContent.trim() === '') {
      setErrorMessage("기타사유는 내용을 입력해야합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reportData = {
        type: "MOVIEREVIEW",
        boardNo: review.no,
        category: selectedCategory,
        content: reportedContent.trim()
      };
      await createReport(reportData);
      alert("신고가 접수되었습니다.");
      resetReportState();
    } catch (error) {
      setErrorMessage("신고처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const baseUrl = apiClient.defaults.baseURL

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isReporting ? 'reporting-active' : ''}`} onClick={stopPropagation}>
        <div className="modal-header">
          <button className="modal-back" onClick={onClose}>
            <span>&larr;</span> Movie Review
          </button>
          <button className="modal-options report-button" onClick={handleReportBnt} title="신고하기">🚨</button>
        </div>

        <div className="modal-body-container">
          <div style={{ width: '400px' }}>
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

          {isReporting && (
            <div className="modal-report-form">
              <h5 style={{marginBottom: '30px'}}>리뷰 신고하기</h5>
              <form onSubmit={handleReportSubmit}>
                <div className="form-group">
                  <label htmlFor="reportCategory">신고 사유:</label>
                  <select
                    id="reportCategory"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    required
                    style={{borderRadius: '5px', marginBottom: '15px'}}
                  >
                    <option value="" disabled>-- 사유 선택 --</option>
                    {Object.entries(reportCategory).map(([key, desc]) => (
                      <option key={key} value={key}>{desc}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="reportContent">상세 내용:</label>
                  <textarea
                    id="reportContent"
                    value={reportedContent}
                    onChange={handleContentChange}
                    rows="6"
                    placeholder={selectedCategory === 'ETC' ? "기타 사유를 자세히 입력해주세요." : "상세 내용을 입력해주세요."}
                    required={selectedCategory === 'ETC'}
                    style={{borderRadius: '5px'}}
                  />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="report-form-actions">
                  <button type="submit" disabled={isSubmitting} style={{borderRadius: '5px'}}>
                    {isSubmitting ? '신고 중...' : '신고 제출'}
                  </button>
                  <button type="button" onClick={() => setIsReporting(false)} disabled={isSubmitting} style={{borderRadius: '5px'}}>
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ReviewDetailModal
