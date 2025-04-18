import axios from "axios";
import { useEffect, useState } from "react"
import GoodsInfo from "./GoodsInfo";
import { useParams } from "react-router-dom";

import arrow from '../../img/arrow.png';
import RelatedMovie from "../movie/RelatedMovie";

const accessToken = sessionStorage.getItem("accessToken")

const GoodsDetail = () => {
    const { goodsNo } = useParams()
    const [product, setProduct] = useState(null)
    const [movieId, setMovieId] = useState(null)
    const [loading, setLoading] = useState(true)

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
        fetchData()
    }, [goodsNo])

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mt-4">
                {/* 뒤로가기 및 액션 버튼 */}
                <button onClick={() => window.history.back()} className="back-button">
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>상세 페이지</h2>
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