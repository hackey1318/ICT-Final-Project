import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../css/md/GoodsInfo.css';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useParams } from "react-router-dom";
import Cart from "../../js/cart/Cart";
import CartApi, { addGoodsToCart } from "../../js/cart/CartApi";

import leftArrow from "./../../img/arrow.png";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";

const accessToken = sessionStorage.getItem("accessToken");


const GoodsInfo = ({ goods }) => {
    const [redirectModalOpen, setRedirectModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const imageRef = useRef(null);
    const { goodsNo } = useParams();

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        if (quantity < goods.count) setQuantity(quantity + 1);
    };

    const handleButton = (act) => {
        addGoodsToCart(goodsNo, quantity, act)
            .then(response => {
                console.log(response);
                if (response.data.stockResult) {
                    if (act === "Purchase") {
                        alert("구매를 위해 장바구니 페이지로 이동합니다.");
                        window.location.href = "/myPage/cart";
                    } else if (act === "Add") {
                        setRedirectModalOpen(true);
                    }
                } else {
                    alert("재고가 부족한 상품입니다.");
                }
            })
            .catch(error => {
                sessionStorage.setItem("redirectAfterLoginPath", window.location.href);
                window.location.href = "/login";
                console.log(error);
            });
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        spaceBetween={20}
                        slidesPerView={1}
                    >
                        {goods.imageUrls?.map((imgUrl, index) => (
                            <SwiperSlide key={index}>
                                <div className="zoom-container">
                                    <div
                                        className="main-image-container"
                                    >
                                        <img
                                            ref={imageRef}
                                            src={`${apiNoAccessClient.defaults.baseURL}/file-system/download/${imgUrl}`}
                                            alt={`굿즈 이미지 ${index + 1}`}
                                            className="main-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "placeholder.png";
                                            }}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="col-md-6">
                    <h2>{goods.name}</h2>
                    <div dangerouslySetInnerHTML={{ __html: goods.description }} />
                    <div>남은 수량: {goods.count}개</div>
                    <div className="d-flex align-items-center mb-3">
                        <span className="fs-4 fw-semibold text-danger me-3">
                            {goods.price.toLocaleString()}원
                        </span>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-outline-secondary me-2" onClick={decreaseQuantity}>-</button>
                            <span className="px-2">{quantity}</span>
                            <button className="btn btn-outline-secondary ms-2" onClick={increaseQuantity}>+</button>
                        </div>
                    </div>

                    <p className="fw-bold mb-4">
                        총 금액: {(goods.price * quantity).toLocaleString()}원
                    </p>

                    {
                        goods.count !== 0 ? (
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" onClick={() => handleButton("Purchase")}>구매하기</button>
                                <button className="btn btn-outline-dark" onClick={() => handleButton("Add")}>장바구니 담기</button>
                            </div>)
                            : (
                            <div>
                                <button className="btn btn-secondary" disabled>품절된 상품입니다.</button>
                            </div>)
                    }
                </div>
            </div>
            <div>
                {
                    (redirectModalOpen) &&
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="modal_overlay"></div>
                        <div className="goodsInfoModal_container">
                            <div style={{textAlign: 'center', marginTop: '10px'}}>상품이 추가되었습니다.</div>
                            <div className="goodsInfoModal_bg"></div>
                            <div className="goodsInfoModal_button_container">
                                <button onClick={() => window.location.href = "/myPage/cart"}>장바구니</button>
                                <button onClick={() => setRedirectModalOpen(false)}>쇼핑하기</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default GoodsInfo;
