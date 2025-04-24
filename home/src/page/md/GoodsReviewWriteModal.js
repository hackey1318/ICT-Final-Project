import React, { useState, useEffect, useRef } from 'react';
import axios from '../../js/public/axiosConfig';
import './../../css/md/GoodsReviewSection.css';

export default function GoodsReviewWriteModal({
  goodsId, userNo, isOpen, onClose, onSubmitSuccess
}) {
  const [formData, setFormData] = useState({
    title: '', content: '', rating: 5, orderNo: null, imageIds: []
  });
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviewedOrderNos, setReviewedOrderNos] = useState(new Set());
  const fileInputRef = useRef();

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [listRes, doneRes] = await Promise.all([
          axios.get(`/goods/${goodsId}/orders-for-review`, { params: { userNo } }),
          axios.get(`/goods/${goodsId}/orders-reviewed`,     { params: { userNo } })
        ]);
        const { ordersDtoList, orderItemDtoList } = listRes.data;

        // 주문별로 items 묶기
        const grouped = ordersDtoList.map(o => ({
          ...o,
          items: orderItemDtoList.filter(item => item.orderNo === o.id)
        }));
        setOrders(grouped);
        setReviewedOrderNos(new Set(doneRes.data));
      } catch (err) {
        console.error('주문 목록 조회 오류', err);
      }
    })();
  }, [isOpen, goodsId, userNo]);

  const selectOrder = id => {
    setFormData(f => ({ ...f, orderNo: id }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.orderNo) return alert('리뷰할 주문을 선택해주세요.');
    setLoading(true);
    try {
      await axios.post(`/goods/${goodsId}/reviews`, {
        ...formData, userNo
      });
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('리뷰 등록 오류', err);
      alert(err.response?.data?.message || '리뷰 등록에 실패했습니다.');
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

        <ul className="order-list">
          {orders.map(order => {
            const isDone = reviewedOrderNos.has(order.id);
            return (
              <li
                key={order.id}
                className={`order-item ${isDone ? 'disabled' : ''} ${formData.orderNo === order.id ? 'selected' : ''}`}
                onClick={() => !isDone && selectOrder(order.id)}
              >
                <input
                  type="radio"
                  checked={formData.orderNo === order.id}
                  disabled={isDone}
                  readOnly
                />
                <span>
                  주문번호 {order.orderNumber} ({new Date(order.updatedAt).toLocaleDateString()})
                </span>
                <ul className="item-list">
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        {formData.orderNo && (
          <form className="review-form" onSubmit={handleSubmit}>
            {/* 별점 */}
            <div className="star-rating">
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => setFormData(f => ({ ...f, rating: star }))}
                >★</span>
              ))}
            </div>

            <input
              name="title"
              placeholder="제목"
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              required
            />
            <textarea
              name="content"
              placeholder="내용"
              value={formData.content}
              onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
              required
            />

            <div className="modal-actions">
              <button type="button" onClick={onClose} disabled={loading}>취소</button>
              <button type="submit" disabled={loading}>
                {loading ? '등록 중…' : '작성 완료'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
