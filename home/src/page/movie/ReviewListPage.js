// src/page/movie/ReviewListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewDetailModal from './ReviewDetailModal';
import { getReviews } from '../../js/api/reviewApi';
import axios from '../../js/public/axiosConfig';
import '../../css/movie/ReviewListPage.css';

function ReviewListPage({ movieNo, currentUserNo }) {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const baseUrl = axios.defaults.baseURL;

  useEffect(() => {
    getReviews(movieNo).then(res => setReviews(res.data));
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
    <div className="review-list-page">
      {accessToken && (
        <button
          className="btn-write"
          onClick={() => navigate(`/movies/${movieNo}/reviews/write`)}
        >
          리뷰 작성
        </button>
      )}

      <div className="review-cards">
        {paged.map(r => (
          <div
            key={r.no}
            className="review-card"
            onClick={() => setSelected(r)}
          >
            {r.imageIds && r.imageIds.length > 0 ? (
              <img
                src={`${baseUrl}/file-system/showPreview/${r.imageIds[0]}`}
                alt="review"
                className="review-card-image"
              />
            ) : (
              r.postImage && (
                <img
                  src={r.postImage}
                  alt="poster"
                  className="review-card-image"
                />
              )
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      )}

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
