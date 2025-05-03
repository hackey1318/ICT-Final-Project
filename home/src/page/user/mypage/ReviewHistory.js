// src/page/user/mypage/ReviewHistory.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../../js/public/axiosConfig';
import '../../../css/review/ReviewCardStyle1.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReviewHistory() {
  const [filterType, setFilterType] = useState('movie');
  const [movieReviews, setMovieReviews] = useState([]);
  const [goodsReviews, setGoodsReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  // 최소 카드 너비(px) – CSS의 minmax(200px, 1fr) 와 맞춰줍니다.
  const MIN_CARD_WIDTH = 300;

  // 레이아웃이 렌더된 후, grid 컨테이너 너비 측정용 ref
  const gridRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(1);

  // 1) 한 줄당 카드 개수 계산 (윈도우 리사이즈 시에도 재계산)
  useEffect(() => {
    const calcColumns = () => {
      const width = gridRef.current?.clientWidth || window.innerWidth;
      // 여백(gap) 고려해서 실제 사용 가능한 너비를 구해야 하지만, 간단히 계산
      const cols = Math.floor(width / MIN_CARD_WIDTH) || 1;
      setCardsPerRow(cols);
    };
    calcColumns();
    window.addEventListener('resize', calcColumns);
    return () => window.removeEventListener('resize', calcColumns);
  }, []);

  // 2) 동적으로 페이지당 아이템 개수 지정 (두 줄)
  const itemsPerPage = cardsPerRow * 2;

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

  useEffect(() => {
    // location.state에서 값이 있다면 우선적으로 'goods'로 설정
    if (location.state?.from === 'goods') {
      setFilterType('goods');
    } else {
      // location.state가 없으면 sessionStorage에서 값을 가져옴
      const savedFilterType = sessionStorage.getItem('filterType');
      if (savedFilterType) {
        setFilterType(savedFilterType);
      } else {
        setFilterType('movie'); // 기본값 'movie'
      }
    }
  }, [location.state]);

  useEffect(() => {
    // filterType이 변경될 때마다 sessionStorage에 저장
    sessionStorage.setItem('filterType', filterType);
  }, [filterType]);

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
      navigate(`/movies/${rev.movieNo}/reviews`);
    } else {
      navigate(`/mdshop/${rev.goodsId}`, { state: { from: 'goods' } });
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const maxPerRow = 6; // 한 줄에 보여줄 카드 개수
  const columns = Math.min(displayed.length, maxPerRow); // 한 줄에 보여줄 카드 개수

  return (
    <div className='review-history-container">'>
      <h2 className="page-title">내 후기</h2>
      {/* 탭 */}
      <div className="tab-pagination-container">
        <div className="tab-buttons">
          <button
            className={filterType === 'movie' ? 'active' : ''}
            onClick={() => { setFilterType('movie'); setCurrentPage(1); }}
          >내 영화 후기</button>
          <button
            className={filterType === 'goods' ? 'active' : ''}
            onClick={() => { setFilterType('goods'); setCurrentPage(1); }}
          >내 굿즈 후기</button>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={currentPage === 1 ? 'disabled' : ''}
            >
              이전
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'disabled' : ''}
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 카드 그리드 */}
      <div className="MypageReview_card-grid"
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${MIN_CARD_WIDTH}px, 1fr))`,
          gap: '16px',
          justifyContent: 'center'
        }}
      >
        {displayed.map((rev) => (
          <div
            key={filterType === 'movie' ? rev.no : rev.id}
            className="MypageReview_card1"
            onClick={() => handleClick(rev)}
          >
            <img
              src={
                rev.imageIds && rev.imageIds.length > 0
                ? `${apiClient.defaults.baseURL}/file-system/download/${rev.imageIds[0]}`
                : filterType === 'movie'
                  ? rev.postImage || 'https://via.placeholder.com/300x450?text=No+Image'
                  : `${apiClient.defaults.baseURL}/file-system/download/${rev.postImage}`
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
          <p style={{ width: '200%', fontSize: '2rem', fontWeight: 'bold' }}>작성된 {filterType === 'movie' ? '영화' : '굿즈'} 후기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
