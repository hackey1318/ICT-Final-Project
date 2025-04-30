import React, { useEffect, useState } from 'react';
import axios from '../../js/public/axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './../../css/md/GoodsReviewSection.css';  // namespaced CSS including modal styles
import { createReport } from '../../js/api/reportApi';

const currentUserNo = JSON.parse(sessionStorage.getItem('userInfo'))?.userNo;

export default function GoodsReviewList({ goodsId, refreshKey, onReviewsLoad, onSelectReview }) {
  const [reviews, setReviews] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ category: '', content: '' });
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API = axios.defaults.baseURL;

  useEffect(() => { fetchReviews(); }, [goodsId, refreshKey]);

  useEffect(() => {
    document.body.style.overflow = showReportModal ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [showReportModal]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/goods/${goodsId}/reviews`);
      const withUrls = data.map(r => ({
        ...r,
        imageUrls: r.imageIds.map(id => `${API}/file-system/download/${id}`)
      }));
      setReviews(withUrls);
      setCurrentPage(1);
      onReviewsLoad?.(data);
    } catch (err) {
      console.error('리뷰 불러오기 오류', err);
    }
  };

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const paginated = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteReview = async id => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try { await axios.delete(`/goods/${goodsId}/reviews/${id}`); fetchReviews(); }
    catch (err) { console.error(err); alert('삭제 실패'); }
  };

  const handleOpenReport = id => {
    setCurrentReviewId(id);
    setCurrentReview(reviews.find(r => r.id === id));
    setReportData({ category: '', content: '' });
    setShowReportModal(true);
  };

  const handleReportChange = e => {
    const { name, value } = e.target;
    setReportData(d => ({
      ...d,
      [name]: value,
      content: name === 'category' && value !== 'ETC'
        ? getDefaultReportContent(value)
        : (name === 'category' ? '' : d.content)
    }));
  };

  const handleReportSubmit = async () => {
    if (!reportData.category || !reportData.content) {
      return alert('내용을 모두 입력해주세요.');
    }
    try {
      await createReport({ boardNo: currentReviewId, category: reportData.category, content: reportData.content, type: 'GOODSREVIEW' });
      setShowReportModal(false);
      alert('신고 완료');
    } catch (err) {
      console.error(err);
      alert('신고 실패');
    }
  };

  const getDefaultReportContent = cat => {
    switch (cat) {
      case 'ABUSE': return '욕설이 포함되어 있습니다.';
      case 'CHEAT': return '사기성 내용입니다.';
      case 'ILLEGALAD': return '불법광고를 포함하고 있습니다.';
      case 'PORNOGRAPHY': return '음란물을 포함하고 있습니다.';
      case 'BADSPORT': return '비매너적인 내용을 포함하고 있습니다.';
      default: return '';
    }
  };

  return (
    <>
      <div className="GoodsReviewList_review-header-top">
        <div className="GoodsReviewList_page-controls">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>이전</button>
          <span>{currentPage} / {totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>다음</button>
        </div>
      </div>

      <div className="GoodsReviewList_goods-review-list">
        {paginated.map(r => (
          <div key={r.id} className="GoodsReviewList_review-card">
            {r.imageUrls.length > 0 && (
              <Swiper modules={[Navigation, SwiperPagination]} navigation pagination={{ clickable: true }} className="GoodsReviewList_card-swiper">
                {r.imageUrls.map((url, i) => <SwiperSlide key={i}><img src={url} alt="" className="GoodsReviewList_card-img"/></SwiperSlide>)}
              </Swiper>
            )}
            <div className="GoodsReviewList_card-body">
              <h4 className="GoodsReviewList_card-title">{r.title} ({r.rating}점)</h4>
              <p className="GoodsReviewList_card-text">{r.content.length > 60 ? r.content.slice(0, 60) + '…' : r.content}</p>
            </div>
            <div className="GoodsReviewList_card-actions">
              {currentUserNo === r.userNo && <button className="GoodsReviewList_btn-edit" onClick={() => onSelectReview(r)}>수정</button>}
              {currentUserNo === r.userNo && <button className="GoodsReviewList_btn-delete" onClick={() => handleDeleteReview(r.id)}>삭제</button>}
              {currentUserNo && <button className="GoodsReviewList_btn-menu" onClick={() => handleOpenReport(r.id)}>⋮</button>}
            </div>
          </div>
        ))}
      </div>

      {showReportModal && (
        <div className="GoodsReviewList_modal-overlay">
          <div className="GoodsReviewList_modal-content">
            <h4>리뷰 신고</h4>
            <div className="GoodsReviewList_review-details">
              <p><strong>제목:</strong> {currentReview?.title}</p>
              <p><strong>내용:</strong></p>
              <div className="GoodsReviewList_review-content">{currentReview?.content}</div>
            </div>

            <div className="form-row">
              <div>
                <label>사유:</label>
                <select name="category" value={reportData.category} onChange={handleReportChange}>
                  <option value="">선택</option>
                  <option value="ABUSE">욕설</option>
                  <option value="CHEAT">사기</option>
                  <option value="ILLEGALAD">불법광고</option>
                  <option value="PORNOGRAPHY">음란물</option>
                  <option value="BADSPORT">비매너</option>
                  <option value="ETC">기타</option>
                </select>
              </div>
              <div>
                <label>내용:</label>
                <textarea
                  name="content"
                  value={reportData.category === 'ETC' ? reportData.content : getDefaultReportContent(reportData.category)}
                  onChange={handleReportChange}
                  disabled={reportData.category !== 'ETC'}
                />
              </div>
            </div>

            <div className="GoodsReviewList_modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>취소</button>
              <button className="btn btn-danger" onClick={handleReportSubmit}>신고하기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
