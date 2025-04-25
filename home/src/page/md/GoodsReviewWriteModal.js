import React, { useState, useEffect, useRef } from 'react';
import axios from '../../js/public/axiosConfig';
import StarRating from './StarRating'; 
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
  const baseURL = axios.defaults.baseURL;


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

  // --- 이미지 추가, 미리보기, 삭제 기능 ---
  const handleFilesChange = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const uploadedIds = [];
      for (let file of files) {
        const data = new FormData();
        data.append('files', file);
        const res = await axios.post('/file-system/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // 서버가 [{ imageId, … }, …] 형태로 배열을 반환하므로 전체를 순회합니다.
        const infos = res.data;
        if (Array.isArray(infos)) {
          infos.forEach(info => {
            uploadedIds.push(info.imageId);
          });
        } else if (infos.imageId) {
          // 혹시 단일 객체로 올 경우를 대비
          uploadedIds.push(infos.imageId);
        }
      }
      setFormData(f => ({ ...f, imageIds: [...f.imageIds, ...uploadedIds] }));
    } catch (err) {
      console.error('이미지 업로드 오류', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveImage = async id => {
    try {
      // 1) 서버에 DELETE 요청 (PENDING → DELETE)
      await axios.patch(
        `/file-system/delete-image/${id}`,
        null,
        { params: { type: 'GOODSREVIEW' } }
      );
      // 2) 로컬 상태에서 이미지 ID 제거
      setFormData(f => ({
        ...f,
        imageIds: f.imageIds.filter(x => x !== id)
      }));
    } catch (err) {
      console.error('이미지 삭제 오류', err);
      alert('이미지 삭제에 실패했습니다.');
    }
  };
  // --------------------------------------

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.orderNo) {return alert('리뷰할 주문을 선택해주세요.')};
    if (!formData.content || formData.content.trim() === '') {return alert('리뷰 내용을 입력해주세요.');}
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
              <StarRating
                rating={formData.rating}
                onChange={newRating =>
                  setFormData(f => ({ ...f, rating: newRating }))
                }
              />
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

            {/* 이미지 추가 버튼 */}
            <div className="image-upload-section">
              <button
                type="button"
                className="btn-add-image"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                ＋
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFilesChange}
              />
            </div>

            {/* 이미지 미리보기 */}
            <div className="image-preview-container">
              {formData.imageIds.map((id, idx) => (
                <div key={`${id}-${idx}`} className="image-preview-item">
                  <img
                    src={`${baseURL}/file-system/download/${id}`}
                    alt="preview"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => handleRemoveImage(id)}
                  >×</button>
                </div>
              ))}
            </div>
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
