import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import '../../../css/admin/BannerFormModal.css';

export default function BannerFormModal({ show, onClose, onSuccess }) {
    const [title, setTitle] = useState('');
    const [targetId, setTargetId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageId, setImageId] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const accessToken = sessionStorage.getItem('accessToken');
    const BASE_URL = 'http://localhost:9988';

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [show]);

    const lastMovieElementRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/movies/search`, {
                    params: { title: searchTerm, page },
                });
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setSearchResults(prev => [...prev, ...data]);
                }
            } catch (err) {
                console.error('검색 실패:', err);
            }
        };

        if (show) fetchMovies();
    }, [searchTerm, page, show]);

    const handleSearchClick = () => {
        setSearchResults([]);
        setPage(0);
        setHasMore(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post(`${BASE_URL}/images/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setImageId(data.imageId);
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드 중 오류 발생');
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !targetId || !imageId) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/banners`, {
                title,
                imageId,
                backgroundColor,
                startDate,
                endDate,
                targetId,
                type: 'MOVIE', // 현재는 MOVIE로 한정, 추후 확장 가능
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('배너가 등록되었습니다!');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('등록 실패:', error);
            alert('배너 등록 중 오류 발생');
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="custom-modal-backdrop" />
            <div className="custom-modal-wrapper">
                <div className="custom-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">📢 배너 등록</h5>
                    </div>
                    <div className="modal-body">
                        <label className="form-label">제목</label>
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="배너 제목을 입력하세요"
                        />

                        <label className="form-label">영화 검색</label>
                        <div className="d-flex gap-2 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={handleSearchClick}
                                placeholder="영화 제목을 입력하세요"
                            />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="movie-scroll-list mb-3">
                                {searchResults.map((movie, index) => (
                                    <div
                                        key={movie.no}
                                        ref={index === searchResults.length - 1 ? lastMovieElementRef : null}
                                        className={`movie-item ${targetId == movie.no ? 'selected' : ''}`}
                                        onClick={() => setTargetId(movie.no)}
                                    >
                                        🎬 {movie.title}
                                    </div>
                                ))}
                            </div>
                        )}

                        <label className="form-label">배경 색상</label>
                        <input
                            type="color"
                            className="form-control form-control-color mb-3"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />

                        <label className="form-label">시작일</label>
                        <input
                            type="datetime-local"
                            className="form-control mb-3"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />

                        <label className="form-label">종료일</label>
                        <input
                            type="datetime-local"
                            className="form-control mb-3"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />

                        <label className="form-label">배너 이미지</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-3"
                            onChange={handleImageUpload}
                        />
                        {imageId && <p className="text-success">이미지 업로드 완료: ID {imageId}</p>}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={handleSubmit}>등록</button>
                        <button className="btn btn-secondary" onClick={onClose}>취소</button>
                    </div>
                </div>
            </div>
        </>
    );
}
