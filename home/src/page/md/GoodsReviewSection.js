import { useState } from 'react';
import { useParams } from 'react-router-dom';
import GoodsReviewList from './GoodsReviewList';
import GoodsReviewWriteModal from './GoodsReviewWriteModal';
import './../../css/md/GoodsReviewSection.css';

export default function GoodsReviewSection() {
  const { goodsNo } = useParams();
  const stored = sessionStorage.getItem('userInfo');
  const currentUser = stored ? JSON.parse(stored) : null;
  const userNo = currentUser?.userNo;

  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const handleSuccess = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="goods-review-section">
      <h2>굿즈 리뷰</h2>
      <button className="btn-review" onClick={openModal}>리뷰 작성</button>
      <GoodsReviewList key={refreshKey} goodsId={goodsNo} />
      <GoodsReviewWriteModal
        goodsId={goodsNo}
        userNo={userNo}
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmitSuccess={handleSuccess}
      />
    </div>
  );
}
