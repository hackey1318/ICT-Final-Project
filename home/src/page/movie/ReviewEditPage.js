import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../js/public/axiosConfig';
import { getReviews, updateReview } from '../../js/api/reviewApi';
import './../../css/movie/ReviewWritePage.css';
import apiClient from '../../js/public/axiosConfig';
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess';

function ReviewEditPage() {
  // 라우트에서 :id 로 선언된 파라미터를 movieNo로 사용
  const { id: movieNo, reviewNo } = useParams();
  const movieNoNum = Number(movieNo);
  const reviewId = Number(reviewNo);

  const stored = sessionStorage.getItem('userInfo');
  const currentUserNo = stored ? JSON.parse(stored).userNo : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageIds, setImageIds] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef();

  const navigate = useNavigate();

  // 1) Mount 시 기존 리뷰 불러와서 필드 채우기
  useEffect(() => {
    if (!movieNoNum) return;
    getReviews(movieNoNum)
      .then(res => {
        const rv = res.data.find(r => r.no === reviewId);
        if (!rv) return;
        setTitle(rv.title);
        setContent(rv.content);
        setImageIds(rv.imageIds || []);
        setPreviews((rv.imageIds || []).map(id =>
          `${apiNoAccessClient.defaults.baseURL}/file-system/showPreview/${id}`
        ));
      })
      .catch(err => console.error('리뷰 불러오기 실패:', err));
  }, [movieNoNum, reviewId]);

  // 2) 새 파일 선택 시 업로드 및 preview/imageIds 업데이트
  const handleFileChange = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const form = new FormData();
    files.forEach(f => form.append('files', f));

    try {
      const res = await apiClient.post('/file-system/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const ids = res.data.map(item => item.imageId);
      setImageIds(prev => [...prev, ...ids]);
      setPreviews(prev => [
        ...prev,
        ...ids.map(id => `${apiNoAccessClient.defaults.baseURL}/file-system/showPreview/${id}`)
      ]);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
    }
  };

  // 3) 개별 이미지 제거
  const handleRemoveImage = async idx => {
    const idToRemove = imageIds[idx];
    try {
      await apiClient.patch(
        `/file-system/delete-image/${idToRemove}`,
        null,
        { params: { type: 'MOVIEREVIEW' } }
      );
    } catch {
      console.warn('서버 이미지 삭제 실패');
    }
    setImageIds(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // 4) 저장(수정) 처리
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const payload = {
        userNo: currentUserNo,
        title,
        content,
        imageIds
     };
     updateReview(movieNoNum, reviewId, payload)
     .then(() => navigate(`/movies/${movieNo}/reviews`))
      .catch(err => console.error('리뷰 수정 실패:', err));
  };

  //모달창 바깥클릭하면 창닫기
  
  const handleOverlayClick = (e) => {
    // overlay 자신을 클릭했을 때만 닫히도록
    if (e.target === e.currentTarget) {
      navigate(-1);
    }
  };

  return (
    <div className="review-write-page">
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
          <h2 className="write-title">리뷰 수정</h2>

          {/* 이미지 업로드 + 미리보기 */}
          <div className="image-upload-wrapper">
            {previews.map((src, idx) => (
              <div key={idx} className="image-wrapper">
                <img src={src} alt={`미리보기${idx}`} className="preview-write-img" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveImage(idx)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-image-upload"
              onClick={() => fileInputRef.current.click()}
            >
              ＋
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {/* 제목 입력 */}
          <input
            type="text"
            className="title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="리뷰 제목을 입력하세요"
          />

          {/* 내용 입력 */}
          <textarea
            className="review-input"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="리뷰를 입력하세요"
          />

          {/* 버튼 */}
          <div className="modal-buttons">
            <button className="btn-submit" onClick={handleSubmit}>
              저장
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewEditPage;
