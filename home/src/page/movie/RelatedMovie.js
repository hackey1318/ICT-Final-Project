import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';

export default function RelatedMovie({ movieId }) {
    const [relatedMovies, setRelatedMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!movieId) return;
        axios.get(`/movies/relate-movie?no=${movieId}`)
            .then(res => setRelatedMovies(res.data.content))
            .catch(err => console.error(err));
    }, [movieId]);

    if (!relatedMovies) return <p>Loading...</p>;

    return (
        <div className="my-4">
            <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                spaceBetween={16}
                autoplay={{ delay: 5000 }}
                loop
                className="w-100"
            >
                {relatedMovies.map(movie => (
                    <SwiperSlide key={movie.no}>
                        <Link to={`/movies/${movie.no}`} key={movie.no}>
                            <img
                                src={movie.postImage}
                                alt={movie.name}
                                className="img-fluid rounded"
                                style={{
                                    width: '100%',       // 🔹 이미지 너비 지정
                                    height: '300px',      // 🔹 이미지 높이 지정
                                    objectFit: 'cover',   // 🔹 이미지 잘림 방지 및 정렬
                                    cursor: 'pointer',
                                }}
                            />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}