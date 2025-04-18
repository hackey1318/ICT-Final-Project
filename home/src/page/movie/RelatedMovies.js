import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";

export default function RelatedMovies({ movieNo }) {
    const [relatedMovies, setRelatedMovies] = useState([]);

    useEffect(() => {
        // 관련 영화 데이터를 API로 가져옵니다.
        fetch(`/relate-movie?no=${movieNo}`)
          .then(response => response.json())
          .then(data => setRelatedMovies(data.content))  // Page<MovieCardResponse>의 'content' 필드
          .catch(error => console.error("Error fetching related movies:", error));
      }, [movieNo]);
      return (
        <div>
          <h3>Related Movies</h3>
          <Swiper spaceBetween={10} slidesPerView={5} navigation>
            {relatedMovies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div className="movie-card">
                  <img 
                    src={`http://localhost:9988/file-system/download/${movie.imageUrls[0]}`} 
                    alt={movie.name} 
                    className="movie-image" 
                  />
                  <div className="movie-info">
                    <p className="movie-name">{movie.name}</p>
                    <Link to={`/related-movie/${movie.id}`} className="related-link">→</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
}