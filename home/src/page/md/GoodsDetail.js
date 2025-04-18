import axios from "axios";
import { useEffect, useState } from "react"
import GoodsInfo from "./GoodsInfo";
import { useParams } from "react-router-dom";

import arrow from '../../img/arrow.png';
import RelatedMovie from "../movie/RelatedMovie";
import LikeType from "../../js/common/LikeType";
import { Heart, Share } from "lucide-react";

const accessToken = sessionStorage.getItem("accessToken")

const GoodsDetail = () => {
    const { goodsNo } = useParams()
    const [product, setProduct] = useState(null)
    const [movieId, setMovieId] = useState(null)
    const [loading, setLoading] = useState(true)

    const [liked, setLiked] = useState(false); // 현재 좋아요 여부
	const [likeId, setLikeId] = useState(null); // 좋아요 ID (DB에서 받은 값)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const goodsInfo = await axios.get(`http://localhost:9988/md-shop/lists/${goodsNo}`)
                setProduct(goodsInfo.data)
                setMovieId(goodsInfo.data.movieNo) // 상품 정보에서 movieId를 가져옴
            } catch (error) {
                console.error("Error fetching product data:", error)
            } finally {
                setLoading(false)
            }
        }

        const fetchLikeStatus = async () => {
			try {
				if (sessionStorage.getItem("accessToken") !== null) {
					const response = await axios.get(`http://localhost:9988/likes/${LikeType.GOODS}?no=${goodsNo}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
					const likeData = response.data;

					// 예: 좋아요 상태가 ACTIVE인지 여부에 따라 아이콘을 채우거나 비우기
					setLikeId(likeData.no); // likeId를 설정합니다.
					if (likeData.status === "ACTIVE") {
						setLiked(true);
					} else {
						setLiked(false);
					}
				}
			} catch (err) {
				console.error("좋아요 상태 불러오기 실패:", err);
			}
		};
        fetchData();
        fetchLikeStatus();
    }, [goodsNo])

    const toggleLike = async () => {
		try {
			const res = await axios.patch(`http://localhost:9988/likes/${likeId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
			const likeData = res.data;
			// 예: 좋아요 상태가 ACTIVE인지 여부에 따라 아이콘을 채우거나 비우기
			if (likeData.status === "ACTIVE") {
				setLiked(true);
			} else {
				setLiked(false);
			}
		} catch (err) {
			console.error("좋아요 처리 중 오류:", err);
		}
	};

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    
    const handleCopyUrl = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url)
			.then(() => {
				alert('링크가 클립보드에 복사되었습니다!');
			})
			.catch(err => {
				console.error('클립보드 복사 실패:', err);
			});
	};

    return (
        <>
            <div className="container mt-4">
                {/* 뒤로가기 및 액션 버튼 */}
                <button onClick={() => window.history.back()} className="back-button">
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>상세 페이지</h2>
                    <div onClick={toggleLike} style={{ cursor: 'pointer' }}>
						<Heart
							className="movie_detail_icon"
							color={liked ? 'red' : 'gray'}
							fill={liked ? 'red' : 'none'}
						/>
							<Share className="movie_detail_icon ms-2" onClick={handleCopyUrl} />
                            </div>
                </div>

                {product && <GoodsInfo goods={product} />}

                {/* 제품 상세 정보 */}
                <div className="row mt-5">
                    <div className="col-3">

                        {/* 관련 영화 정보 */}
                        <h4 className="fw-bold mb-3 mt-5">Relative Movie</h4>
                        {movieId && <RelatedMovie movieId={movieId} />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GoodsDetail;