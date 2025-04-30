import React, { useState, useEffect, useRef } from 'react';
import axios from '../../js/public/axiosConfig';
import StarRating from './StarRating';
import './../../css/md/GoodsReviewSection.css';
import './../../css/md/GoodsReportModal.css';
import { createReport } from '../../js/api/reportApi';

const currentUserNo = JSON.parse(sessionStorage.getItem('userInfo'))?.userNo;

export default function GoodsReviewWriteModal({
  goodsId,
  userNo,
  isOpen,
  onClose,
  onSubmitSuccess,
  review // ★ 수정 모드 진입 시 전달되는 review 객체
}) {
  const isEditing = Boolean(review);
  const [formData, setFormData] = useState({
    id: review?.id || null,
    title: review?.title || '',
    content: review?.content || '',
    rating: review?.rating || 5,
    orderNo: review?.orderNo || null,
    imageIds: review?.imageIds || []
  });
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviewedOrderNos, setReviewedOrderNos] = useState(new Set());
  const fileInputRef = useRef();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ category: '', content: '' });
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const baseURL = axios.defaults.baseURL;

  useEffect(() => {
    if (!isOpen) return;
    if (isEditing) {
      setFormData({
        id: review.id,
        title: review.title,
        content: review.content,
        rating: review.rating,
        orderNo: review.orderNo,
        imageIds: review.imageIds,
      });
    } else {
      setFormData({ id: null, title: '', content: '', rating: 5, orderNo: null, imageIds: [] });
    }

    (async () => {
      try {
        const [listRes, doneRes] = await Promise.all([
          axios.get(`/goods/${goodsId}/orders-for-review`, { params: { userNo } }),
          axios.get(`/goods/${goodsId}/orders-reviewed`, { params: { userNo } })
        ]);
        const { ordersDtoList, orderItemDtoList } = listRes.data;
        const doneSet = new Set(doneRes.data);
        const grouped = ordersDtoList.map(o => ({
          ...o,
          items: orderItemDtoList.filter(item => item.orderNo === o.id)
        }));

        if (isEditing) {
          const firstId = Array.from(doneSet)[0];
          const current = grouped.filter(o => o.id === firstId);
          setOrders(current);
          if (current.length) setFormData(f => ({ ...f, orderNo: current[0].id }));
        } else {
          setOrders(grouped.filter(o => !doneSet.has(o.id)));
        }
        setReviewedOrderNos(doneSet);
      } catch (err) {
        console.error('주문 목록 조회 오류', err);
      }
    })();
  }, [isOpen, goodsId, userNo, review, isEditing]);

  const selectOrder = id => setFormData(f => ({ ...f, orderNo: id }));

  // 이미지 추가
  const handleFilesChange = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const uploaded = [];
      for (let file of files) {
        const data = new FormData(); data.append('files', file);
        const res = await axios.post('/file-system/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        const infos = res.data;
        if (Array.isArray(infos)) infos.forEach(i => uploaded.push(i.imageId));
        else if (infos.imageId) uploaded.push(infos.imageId);
      }
      setFormData(f => ({ ...f, imageIds: [...f.imageIds, ...uploaded] }));
    } catch (err) {
      console.error('이미지 업로드 오류', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally { e.target.value = ''; }
  };

  // 이미지 삭제
  const handleRemoveImage = async id => {
    try {
      await axios.patch(`/file-system/delete-image/${id}`, null, { params: { type: 'GOODSREVIEW' } });
      setFormData(f => ({ ...f, imageIds: f.imageIds.filter(x => x !== id) }));
    } catch (err) {
      console.error('이미지 삭제 오류', err);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  // 신고 기능
  const handleOpenReport = () => {
    setCurrentReviewId(formData.id);
    setShowReportModal(true);
  };
  const handleReportChange = e => {
    const { name, value } = e.target;
    if (name === 'category' && value !== 'ETC') {
      setReportData(d => ({ ...d, [name]: value, content: getDefaultReportContent(value) }));
    } else {
      setReportData(d => ({ ...d, [name]: value, content: value === 'ETC' ? '' : d.content }));
    }
  };
  const handleReportSubmit = async () => {
    if (!reportData.category || !reportData.content) return alert('사유와 내용을 입력해주세요.');
    try {
      await createReport({ boardNo: currentReviewId, category: reportData.category, content: reportData.content, type: 'GOODSREVIEW' });
      setShowReportModal(false);
      alert('신고 완료');
    } catch { alert('신고 실패'); }
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

  const handleSubmit = async e => {
    e.preventDefault(); if (!formData.orderNo) return alert('주문 선택 필요'); if (!formData.content.trim()) return alert('내용 입력 필요');
    setLoading(true);
    try {
      if (isEditing) await axios.put(`/goods/${goodsId}/reviews/${formData.id}`, { ...formData, userNo });
      else await axios.post(`/goods/${goodsId}/reviews`, { ...formData, userNo });
      onSubmitSuccess(); onClose();
    } catch (err) { alert(err.response?.data?.message || '오류 발생'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="GoodsReviewWriteModal_modal-overlay">
        <div className="GoodsReviewWriteModal_modal-content">
          <button className="GoodsReviewWriteModal_modal-close" onClick={onClose}>×</button>
          <h2>{isEditing ? '리뷰 수정' : '리뷰 작성'}</h2>

          <ul className="GoodsReviewWriteModal_order-list">
            {orders.map(o => {
              const disabled = !isEditing && reviewedOrderNos.has(o.id);
              return (
                <li key={o.id} className={`GoodsReviewWriteModal_order-item ${disabled?'disabled':''} ${formData.orderNo===o.id?'selected':''}`} onClick={() => !disabled && selectOrder(o.id)}>
                  <input type="radio" checked={formData.orderNo===o.id} disabled={disabled} readOnly />
                  <span>주문번호 {o.orderNumber} ({new Date(o.updatedAt).toLocaleDateString()})</span>
                  <ul className="GoodsReviewWriteModal_item-list">{o.items.map(i=><li key={i.id}>{i.name}×{i.quantity}</li>)}</ul>
                </li>
              );
            })}
          </ul>

          {formData.orderNo && (
            <form className="GoodsReviewWriteModal_review-form" onSubmit={handleSubmit}>
              <StarRating rating={formData.rating} onChange={r=>setFormData(f=>({...f,rating:r}))} />
              <input name="title" placeholder="제목" value={formData.title} onChange={e=>setFormData(f=>({...f,title:e.target.value}))} required />
              <textarea name="content" placeholder="내용" value={formData.content} onChange={e=>setFormData(f=>({...f,content:e.target.value}))} required />
              <div className="GoodsReviewWriteModal_image-upload-section">
                <button type="button" className="GoodsReviewWriteModal_btn-add-image" onClick={()=>fileInputRef.current.click()} disabled={loading}>＋</button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFilesChange} />
              </div>
              <div className="GoodsReviewWriteModal_image-preview-container">
                {formData.imageIds.map((id,idx)=>(<div key={`${id}-${idx}`} className="GoodsReviewWriteModal_image-preview-item"><img src={`${baseURL}/file-system/download/${id}`} alt="preview" className="GoodsReviewWriteModal_preview-img" /><button type="button" className="GoodsReviewWriteModal_btn-remove-image" onClick={()=>handleRemoveImage(id)}>×</button></div>))}
              </div>
              <div className="GoodsReviewWriteModal_modal-actions"><button type="button" onClick={onClose} disabled={loading}>취소</button><button type="submit" disabled={loading}>{loading?(isEditing?'수정 중…':'등록 중…'):(isEditing?'수정 완료':'작성 완료')}</button></div>
            </form>
          )}

        </div>
      </div>

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="modal GoodsReviewModal_goods-review-modal">
          <div className="GoodsReviewModal_report-modal-content">
            <h4>리뷰 신고</h4>
            <div className="GoodsReviewModal_review-details">
              <p><strong>제목:</strong> {formData.title}</p>
              <p><strong>내용:</strong></p>
              <div className="GoodsReviewModal_review-content">{formData.content}</div>
            </div>
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
            <label>내용:</label>
            <textarea name="content" value={reportData.category==='ETC'?reportData.content:getDefaultReportContent(reportData.category)} onChange={handleReportChange} disabled={reportData.category!=='ETC'} />
            <div className="GoodsReviewModal_report-button-group">
              <button className="btn btn-danger" onClick={handleReportSubmit}>신고하기</button>
              <button className="btn btn-secondary" onClick={()=>setShowReportModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
