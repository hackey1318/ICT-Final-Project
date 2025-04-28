// src/page/user/mypage/ReviewHistory.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../../js/public/axiosConfig';
import '../../../css/review/ReviewCardStyle1.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ReviewHistory() {
  const [filterType, setFilterType] = useState('movie');
  const [movieReviews, setMovieReviews] = useState([]);
  const [goodsReviews, setGoodsReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const currentUserNo = JSON.parse(sessionStorage.getItem('userInfo'))?.userNo;

  useEffect(() => {
    if (!currentUserNo) return;
    (async () => {
      try {
        const { data } = await apiClient.get(`/movies/users/${currentUserNo}/reviews`);
        setMovieReviews(data);
      } catch (err) {
        console.error('사용자 영화 리뷰 조회 실패:', err);
      }
      try {
        const { data } = await apiClient.get(`/goods/users/${currentUserNo}/reviews`);
        setGoodsReviews(data);
      } catch (err) {
        console.error('사용자 굿즈 리뷰 조회 실패:', err);
      }
    })();
  }, [currentUserNo]);

  const allReviews = filterType === 'movie' ? movieReviews : goodsReviews;
  const totalPages = Math.ceil(allReviews.length / itemsPerPage) || 1;
  const displayed = allReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 클릭 시 영화 상세 정보 API 호출 후 세션에 저장, 이후 리스트 페이지로 이동
  const handleClick = async (rev) => {
    if (filterType === 'movie') {
      try {
        const { data: movieData } = await apiClient.get(`/movies/detail/${rev.movieNo}`);
        sessionStorage.setItem('movieName', movieData.name || '(제목 없음)');
        sessionStorage.setItem('movieDescription', movieData.description || '');
        sessionStorage.setItem('reviewPageMoviePoster', movieData.postImage || '');
      } catch (err) {
        console.error('영화 정보 불러오기 실패:', err);
      }
      window.location.href = `/movies/${rev.movieNo}/reviews`;
    } else {
      window.location.href = `/mdshop/${rev.goodsId}`;
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      {/* 탭 */}
      <div className="tabs">
        <button
          className={filterType === 'movie' ? 'active' : ''}
          onClick={() => { setFilterType('movie'); setCurrentPage(1); }}
        >내 영화 후기</button>
        <button
          className={filterType === 'goods' ? 'active' : ''}
          onClick={() => { setFilterType('goods'); setCurrentPage(1); }}
        >내 굿즈 후기</button>
      </div>

      {/* 카드 그리드 */}
      <div className="MypageReview_card-grid">
        {displayed.map((rev) => (
          <div
            key={filterType === 'movie' ? rev.no : rev.id}
            className="MypageReview_card1"
            onClick={() => handleClick(rev)}
          >
            <img
              src={
                rev.imageIds?.[0]
                  ? `${apiClient.defaults.baseURL}/file-system/download/${rev.imageIds[0]}`
                  : 'https://via.placeholder.com/200x120'
              }
              alt=""
            />
            <div className="MypageReview_play-icon">
              <i className="bi bi-box-arrow-in-right"></i>
            </div>
            <div className="MypageReview_card-content">
              <h3 className="MypageReview_card-title">
                {rev.title || '(제목 없음)'}
              </h3>
              <p className="MypageReview_card-subtitle">
                {rev.content.substring(0, 40)}…
              </p>
            </div>
          </div>
        ))}
        {allReviews.length === 0 && (
          <p>작성된 {filterType === 'movie' ? '영화' : '굿즈'} 후기가 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={currentPage === idx + 1 ? 'active' : ''}
              onClick={() => goToPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>
      )}
    </div>
  );
}
