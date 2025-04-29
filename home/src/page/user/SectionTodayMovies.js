import React, { useState, useEffect, useRef } from 'react';
import './../../css/user/TodayMovies.css';
import axios from 'axios';
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess';

// ⭐ MovieGridItem 수정: onClickItem prop 받도록 추가
const MovieGridItem = ({ movie, onClickItem }) => (
	// ⭐ 최상위 div에 onClick 이벤트 추가
	<div className="TodayMovies_item" onClick={() => onClickItem(movie)}>
		<div className="TodayMovies_poster-container">
			<img src={movie.postImage} alt={movie.name} className="TodayMovies_poster" />
		</div>
		<div className="TodayMovies_info">
			<div className="TodayMovies_rating">
				{movie.openStatus === 'PENDING'
					? <div>상영 예정작<br/>{movie.openDate}</div>
					: `예매율 ★ ${!isNaN(parseFloat(movie.reservationRate))
						? `${parseFloat(movie.reservationRate).toFixed(2)}%`
						: 'N/A'}`
				}
			</div>
			<div className="TodayMovies_title">{movie.name} | {movie.openStatus}</div>
			{/* shortDesc 대신 description을 사용하고 CSS로 말줄임 처리하는 것이 더 일반적 */}
			{/* CSS에서 .TodayMovies_shortDesc 스타일 유지 */}
			<div className="TodayMovies_shortDesc">{movie.description}</div>
		</div>
	</div>
);

// 하단 추천 영화 컴포넌트 (수정 없음)
const FeaturedMovie = ({ movie }) => (
	<div className="FeaturedMovie_container">

		{/* ⭐ 상세 보기 링크 추가 */}
		{movie.movieUrl && ( // movieUrl이 있을 때만 링크 표시
			<a href={movie.movieUrl} className="TodayMovies_info_detail" title={`${movie.name} 상세 보기`}>
				{'>'}
			</a>
		)}

		<div className="FeaturedMovie_poster-container">
			<img src={movie.postImage} alt={movie.name} className="FeaturedMovie_poster" />
		</div>
		<div className="FeaturedMovie_details">
			{/* 장르가 있을 때만 표시 (선택 사항) */}
			{movie.genre && (
				<>
					<h3>장르</h3>
					<p>{movie.genre}</p>
				</>
			)}
			<h3>스토리</h3>
			<p className="FeaturedMovie_story">{movie.description}</p>
		</div>
	</div>
);


function SectionTodayMovies() {
	const [gridMovies, setGridMovies] = useState([]);

	const [featuredMovie, setFeaturedMovie] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
	const [isFeaturedVisible, setIsFeaturedVisible] = useState(false);
	const movieLimitRef = useRef(getMovieLimit());

	// ✅ 영화 목록 불러오는 함수
	const fetchMovies = (limit) => {
		setIsLoading(true);
		apiNoAccessClient.get(`/movies/recommendation?count=${limit}`)
			.then(response => {
				const movies = response.data;
				setGridMovies(movies);
				setFeaturedMovie(movies[0]);
			})
			.catch(error => {
				console.error("추천 영화 로딩 실패:", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};


	useEffect(() => {
		// 첫 마운트 시 호출
		fetchMovies(movieLimitRef.current);

		// ✅ resize 이벤트 등록
		const handleResize = () => {
			const newLimit = getMovieLimit();
			if (newLimit !== movieLimitRef.current) {
				movieLimitRef.current = newLimit;
				fetchMovies(newLimit);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	function getMovieLimit() {
		const width = window.innerWidth;

		if (width >= 1200) return 10; // PC
		else if (width >= 768) return 6; // 태블릿
		else return 4; // 모바일
	}

	// ⭐ 그리드 아이템 클릭 시 호출될 핸들러
	const handleGridItemClick = (clickedMovie) => {
		setFeaturedMovie(clickedMovie); // featuredMovie 상태를 클릭된 영화로 업데이트
		setIsFeaturedVisible(true); // 클릭 시 무조건 보이도록 설정 (토글 상태와 연동)
	};

	// 토글 버튼 핸들러 (수정 없음)
	const handleToggleFeatured = () => {
		setIsFeaturedVisible(prev => !prev);
	};

	if (isLoading) {
		return <div className="TodayMovies_section">로딩 중...</div>;
	}

	return (
		<section className="Main_section TodayMovies_section">
			<div className="TodayMovies_top">
				<div className='TodayMovies_container'>
					<div className="TodayMovies_textbox">
						<h2 className="TodayMovies_title">오늘의 영화!</h2>
						<p className="TodayMovies_subtitle">회원님의 취향을 분석해,<br />추천 영화를 보여드립니다.</p>
					</div>
					<div className="TodayMovies_controls">
						<button
							className="TodayMovies_toggleButton"
							onClick={handleToggleFeatured}
						>
							{isFeaturedVisible ? '추천 영화 접기 ^' : '추천 영화 보기 v'}
						</button>
					</div>
				</div>

				<div className="TodayMovies_grid">
					{gridMovies.map((movie) => (
						<MovieGridItem
							key={movie.no}
							movie={movie}
							onClickItem={handleGridItemClick}
						/>
					))}
				</div>
			</div>
			{isFeaturedVisible && featuredMovie && (
				<div className="TodayMovies_bottom">
					<FeaturedMovie movie={featuredMovie} />
				</div>
			)}
		</section>
	);
}

export default SectionTodayMovies;