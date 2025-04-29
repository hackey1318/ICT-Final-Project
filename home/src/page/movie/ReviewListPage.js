// src/page/movie/ReviewListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewDetailModal from './ReviewDetailModal';
import { getReviews } from '../../js/api/reviewApi';
import axios from '../../js/public/axiosConfig';
import { ArrowLeft } from 'lucide-react';
import '../../css/movie/ReviewListPage.css';
import MoviePagination from '../../js/public/Pagination';
import noreviewig from '../../img/logout.png';

function ReviewListPage({ movieNo, currentUserNo }) {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const storedName = sessionStorage.getItem('movieName');
  const storedDesc = sessionStorage.getItem('movieDescription');
  const storedPoster = sessionStorage.getItem('reviewPageMoviePoster');
  

  // 뒤로가기 핸들러: movieNo 페이지로 이동
  const handleBack = () => {
    navigate(`/movies/${movieNo}`);
  };

  useEffect(() => {
    getReviews(movieNo)
      .then(res => {
        const sorted = res.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sorted);
      })
      .catch(err => console.error('리뷰 조회 실패:', err));
  }, [movieNo]);

  const handleDelete = no => setReviews(prev => {
    const filtered = prev.filter(r => r.no !== no);
    const maxPage = Math.ceil(filtered.length / pageSize) || 1;
    if (currentPage > maxPage) setCurrentPage(maxPage);
    return filtered;
  });

  const start = (currentPage - 1) * pageSize;
  const paged = reviews.slice(start, start + pageSize);
  const totalPages = Math.ceil(reviews.length / pageSize) || 1;

  return (
    <div className="review-list-page_container">

      {/* ── 헤더 섹션 ── */}
      <header className="review-list-header">
        <div className="review-list-top-nav row">
          <div className='review-list-logo col-4'>영화 리뷰페이지</div>
          <div className='review-list-menu col-8'>
            {/* 필요한 메뉴 항목추가가 */}
          </div>
        </div>
        <div className="review-list-sub-header row align-items-center">
          <div className='col-1'>
            <button className="review-back-btn" onClick={handleBack}>
              <ArrowLeft /> {/* ② 뒤로가기 아이콘 */}
            </button>
          </div>
          <div className='col-9'>
            <h1 className="review-movie-title">{storedName || '제목 없음'}</h1>
          </div>
        </div>
      </header>

        {/* -- 세션에서 꺼낸 영화 정보 섹션 -- */}
       {(storedPoster || storedName || storedDesc) && (
         <div className="review-movie-info">
           {storedPoster && (
             <img
               src={storedPoster}
               alt={`${storedName} 포스터`}
               className="review-movie-poster"
             />
           )}
           <div>
             {storedName && <h2 style={{ margin: 0 }}>줄거리</h2>}
             {storedDesc && (
              <p className="review-movie-desc">
                {storedDesc}
              </p>
             )}
           </div>
         </div>
       )}

    {/* -- 리뷰 리스트 섹션 -- */}
    <div className='review-list-section'>
      <div className="review-list-section-header mb-3">
        <h2 className='movie_detail_section_title'>Reviews</h2>
          {accessToken && (
          <button
            className="movie_detail_btn_primary btn btn-primary ms-2"
            onClick={() => navigate(`/movies/${movieNo}/reviews/write`)}
          >
            리뷰 작성
          </button>
        )}
      </div>
     {reviews.length === 0 ? (
       /* 리뷰가 없을 때 */
       <p className="no-reviews">작성된 리뷰가 없습니다.</p>
     ) : (
       /* 리뷰가 있을 때 */
       <>
      <div className='review-list-pagination-wrapper'>
     {totalPages > 1 && (
       <div className="d-flex justify-content-center mb-4">
         <MoviePagination
           page={currentPage - 1}           // 0-based index로 전달
           totalPages={totalPages}          
           onPageChange={newPageIndex => {  // 0-based로 받으니 +1
             setCurrentPage(newPageIndex + 1);
             window.scrollTo(0, 0);         // 필요시 스크롤도 올려주기
           }}
         />
       </div>
     )}
      </div>
      <div className="review-cards">
        {paged.map(r  => (
          <div
            key={r.no}
            className="review-card"
            onClick={() => setSelected(r)}
          >
            {r.imageIds && r.imageIds.length > 0 ? (
              <img
                src={`/file-system/showPreview/${r.imageIds[0]}`}
                alt="review"
                className="review-card-image"
              />
            ) : (
                <img
                  src={storedPoster}
                  className="review-card-no-image"
                />
            )}
            {r.title && (
              <h4 className="review-card-title">
                <strong>[ {r.title} ]</strong>
              </h4>
            )}
            <p className="review-card-content">
              {r.content.length > 100
                ? r.content.slice(0, 100) + '...'
                : r.content}
            </p>
          </div>
        ))}
      </div>
      </>
      )}
      </div>
      {selected && (
        <ReviewDetailModal
          review={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          currentUserNo={currentUserNo}
        />
      )}
    </div>
  );
}

export default ReviewListPage;
