import React, { useState, useEffect, useRef } from 'react';
import axios from '../../js/public/axiosConfig';
import './../../css/md/GoodsReviewSection.css';

export default function GoodsReviewWriteModal({ goodsId, userNo, isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({ title: '', content: '', rating: 5, orderNo: null, imageIds: [] });
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviewedOrderNos, setReviewedOrderNos] = useState(new Set());
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef();

  // 모달 오픈 시 주문 목록 조회
  useEffect(() => {
    if (!isOpen) return;
    async function fetchOrders() {
      try {
        const [orderListRes, reviewedRes] = await Promise.all([
          axios.get(`/goods/${goodsId}/orders-for-review`, { params: { userNo } }),
          axios.get(`/goods/${goodsId}/orders-reviewed`, { params: { userNo } })
        ]);
        const { ordersDtoList, orderItemDtoList } = orderListRes.data;
        const combined = ordersDtoList.map((dto, idx) => ({
          id: dto.id,
          orderNumber: dto.orderNumber,
          date: dto.updatedAt,
          items: orderItemDtoList[idx]
        }));
        setOrders(combined);
        setReviewedOrderNos(new Set(reviewedRes.data));
      } catch (err) {
        console.error('주문 목록 조회 오류', err);
      }
    }
    fetchOrders();
  }, [isOpen, goodsId, userNo]);

  // 이미지 업로드 핸들러
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    try {
      const res = await axios.post('/file-system/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const ids = res.data.map(item => item.imageId);
      setFormData(prev => ({ ...prev, imageIds: [...prev.imageIds, ...ids] }));
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setPreviews(prev => [...prev, ...newPreviews]);
    } catch (err) {
      console.error('이미지 업로드 오류', err);
    }
  };

  const handleRemoveImage = async (idx) => {
    const imageId = formData.imageIds[idx];
    try {
      await axios.patch(`/file-system/delete-image/${imageId}`);
      setFormData(prev => ({
        ...prev,
        imageIds: prev.imageIds.filter((_, i) => i !== idx)
      }));
      setPreviews(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error('이미지 삭제 오류', err);
    }
  };

  const handleStarClick = (star) => {
    setFormData(prev => ({ ...prev, rating: star }));
  };

  const selectOrder = (orderId) => {
    setFormData(prev => ({ ...prev, orderNo: orderId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/goods/${goodsId}/reviews`, { ...formData, userNo });
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('리뷰 등록 오류', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>리뷰 작성</h2>

        {/* 1) 주문 선택 리스트 */}
        <ul className="order-list">
          {orders.map(order => {
            const disabled = reviewedOrderNos.has(order.id);
            const selected = formData.orderNo === order.id;
            return (
              <li
                key={order.id}
                className={`order-item ${disabled ? 'disabled' : selected ? 'selected' : ''}`}
                onClick={() => !disabled && selectOrder(order.id)}
              >
                <input
                  type="radio"
                  name="order"
                  checked={selected}
                  disabled={disabled}
                  readOnly
                />
                <span>주문번호 {order.orderNumber} ({new Date(order.date).toLocaleDateString()})</span>
                  {/* 주문 상품 리스트 추가 */}
                <ul className="item-list">
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.goodsNo} - {item.name} ×{item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        {/* 2) 주문 선택 후에만 리뷰 폼 표시 */}
        {formData.orderNo && (
          <form className="review-form" onSubmit={handleSubmit}>
            {/* 이미지 업로드 & 미리보기 */}
            <div className="image-upload-wrapper">
              {previews.map((src, idx) => (
                <div key={idx} className="image-wrapper">
                  <img src={src} alt={`preview-${idx}`} className="preview-img" />
                  <button type="button" className="remove-btn" onClick={() => handleRemoveImage(idx)}>×</button>
                </div>
              ))}
              <button type="button" className="btn-image-upload" onClick={() => fileInputRef.current.click()}>
                이미지 추가
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
            </div>

            {/* 별점 입력 */}
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => handleStarClick(star)}
                >★</span>
              ))}
            </div>

            {/* 제목 & 내용 입력 */}
            <input
              name="title"
              placeholder="제목"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              name="content"
              placeholder="내용"
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
            />

            {/* 제출 버튼 */}
            <div className="modal-actions">
              <button type="button" onClick={onClose} disabled={loading}>취소</button>
              <button type="submit" disabled={loading}>
                {loading ? '등록 중...' : '작성 완료'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
