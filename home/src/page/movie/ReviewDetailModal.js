import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteReview } from "../../js/api/reviewApi";
import { createReport } from "../../js/api/reportApi";
import apiClient from "../../js/public/axiosConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "../../css/movie/ReviewDetailModal.css";

const reportCategory = {
  ABUSE: "욕설",
  CHEAT: "사기",
  ILLEGALAD: "불법광고",
  PORNOGRAPHY: "음란물게시",
  BADSPORT: "비매너행위",
  ETC: "기타",
};

function ReviewDetailModal({ review, onClose, onDelete, currentUserNo }) {
  const navigate = useNavigate();
  const [isReporting, setIsReporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [reportedContent, setReportedContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!review) resetReportState();
  }, [review]);

  const resetReportState = () => {
    setIsReporting(false);
    setSelectedCategory("");
    setReportedContent("");
    setErrorMessage("");
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    const ok = window.confirm("리뷰를 삭제하시겠습니까?");
    if (!ok) return;

    deleteReview(review.movieNo, review.no)
    .then(() => {
      onDelete(review.no);
      onClose();
    });
  };

  const handleEdit = () => {
    navigate(`/movies/${review.movieNo}/reviews/edit/${review.no}`);
  };

  const handleReportBtn = () => {
    if (!isReporting) {
      if (
        window.confirm(
          `${review.title || review.content.substring(0, 20)} 리뷰를 신고하시겠습니까?`
        )
      ) {
        setIsReporting(true);
      }
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value !== 'ETC') setErrorMessage('');
  };

  const handleContentChange = (e) => {
    setReportedContent(e.target.value);
    if (selectedCategory === 'ETC' && e.target.value.trim() && errorMessage.includes('기타')) {
      setErrorMessage('');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!selectedCategory) return setErrorMessage("신고 사유를 선택해주세요.");
    if (selectedCategory === 'ETC' && !reportedContent.trim()) return setErrorMessage("기타사유는 내용을 입력해야합니다.");

    setIsSubmitting(true);
    try {
      await createReport({
        type: "MOVIEREVIEW",
        boardNo: review.no,
        category: selectedCategory,
        content: reportedContent.trim(),
      });
      alert("신고가 접수되었습니다.");
      resetReportState();
    } catch {
      setErrorMessage("신고처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const baseUrl = apiClient.defaults.baseURL;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        id="review-modal-content"
        className={`modal-content ${isReporting ? 'reporting-active' : ''}`}
        onClick={stopPropagation}
      >
        <div className="modal-header">
          <button className="modal-back" onClick={onClose}>
            <span>&larr;</span> Movie Review
          </button>
          <button
            className="modal-options"
            onClick={handleReportBtn}
            title="신고하기"
          >🚨</button>
        </div>

        <div className="modal-body-container">
          <div className="review-modal-profile">
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
              {review.imageIds?.length > 0 ? (
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={10}
                  slidesPerView={1}
                  className="review-swiper"
                >
                  {review.imageIds.map((id) => (
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
                <img
                  src={review.postImage}
                  alt="poster"
                  className="modal-poster"
                />
              )}
            </div>
            <div className="modal-review-content">
              <div className="review-header">
                <h3 className="review-title">
                  {review.title || review.content.substring(0, 20)}
                </h3>
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
              <p className="review-text">{review.content}</p>

              {isReporting && (
                <div className="modal-report-form">
                  <h5>리뷰 신고하기</h5>
                  <form onSubmit={handleReportSubmit}>
                    <div className="form-group">
                      <label htmlFor="reportCategory">신고 사유:</label>
                      <select
                        id="reportCategory"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      >
                        <option value="" disabled>
                          -- 사유 선택 --
                        </option>
                        {Object.entries(reportCategory).map(([key, desc]) => (
                          <option key={key} value={key}>
                            {desc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="reportContent">상세 내용:</label>
                      <textarea
                        id="reportContent"
                        value={reportedContent}
                        onChange={handleContentChange}
                        placeholder={
                          selectedCategory === 'ETC'
                            ? "기타 사유를 자세히 입력해주세요."
                            : "상세 내용을 입력해주세요."
                        }
                      ></textarea>
                    </div>
                    {errorMessage && (
                      <p className="error-message">{errorMessage}</p>
                    )}
                    <div className="report-form-actions">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? '신고 중...' : '신고 제출'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsReporting(false)}
                        disabled={isSubmitting}
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewDetailModal;
